/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    needsStateRestore,
    restoreStateIfNeeded,
} from './ReactControlledComponent';

import { enableFlareAPI } from 'shared/ReactFeatureFlags';
import { invokeGuardedCallbackAndCatchFirstError } from 'shared/ReactErrorUtils';

// Used as a way to call batchedUpdates when we don't have a reference to
// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.

// Defaults
let batchedUpdatesImpl = function (fn, bookkeeping) {
    return fn(bookkeeping);
};
let discreteUpdatesImpl = function (fn, a, b, c) {
    return fn(a, b, c);
};
let flushDiscreteUpdatesImpl = function () { };
let batchedEventUpdatesImpl = batchedUpdatesImpl;

let isInsideEventHandler = false;
let isBatchingEventUpdates = false;

function finishEventHandler() {
    // Here we wait until all updates have propagated, which is important
    // when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    // Then we restore state of any controlled component.
    const controlledComponentsHavePendingUpdates = needsStateRestore();
    if (controlledComponentsHavePendingUpdates) {
        // If a controlled event was fired, we may need to restore the state of the DOM node back to the controlled value. This is necessary when React bails out of the update without touching the DOM.
        flushDiscreteUpdatesImpl();
        restoreStateIfNeeded();
    }
}

export function batchedUpdates(fn, bookkeeping) {
    if (isInsideEventHandler) {
        // If we are currently inside another batch, we need to wait until it
        // fully completes before restoring state.
        return fn(bookkeeping);
    }
    isInsideEventHandler = true;
    try {
        return batchedUpdatesImpl(fn, bookkeeping);
    } finally {
        isInsideEventHandler = false;
        finishEventHandler();
    }
}

export function batchedEventUpdates(fn, a, b) {
    if (isBatchingEventUpdates) {
        // If we are currently inside another batch, we need to wait until it
        // fully completes before restoring state.
        return fn(a, b);
    }
    isBatchingEventUpdates = true;
    try {
        return batchedEventUpdatesImpl(fn, a, b);
    } finally {
        isBatchingEventUpdates = false;
        finishEventHandler();
    }
}

// This is for the React Flare event system
export function executeUserEventHandler(fn: any => void, value: any): void {
    const previouslyInEventHandler = isInsideEventHandler;
    try {
        isInsideEventHandler = true;
        const type = typeof value === 'object' && value !== null ? value.type : '';
        invokeGuardedCallbackAndCatchFirstError(type, fn, undefined, value);
    } finally {
        isInsideEventHandler = previouslyInEventHandler;
    }
}

//! fn: dispatchEvent, a: topLevelType, b: eventSystemFlags (0), c: nativeEvent
export function discreteUpdates(fn, a, b, c) {
    const prevIsInsideEventHandler = isInsideEventHandler;
    isInsideEventHandler = true;
    try {
        return discreteUpdatesImpl(fn, a, b, c); //?! discreteUpdatesImpl = fn(a,b,c)
    } finally {
        isInsideEventHandler = prevIsInsideEventHandler;
        if (!isInsideEventHandler) {
            finishEventHandler();
        }
    }
}

let lastFlushedEventTimeStamp = 0;
export function flushDiscreteUpdatesIfNeeded(timeStamp: number) {
    // event.timeStamp isn't overly reliable due to inconsistencies in
    // how different browsers have historically provided the time stamp.
    // Some browsers provide high-resolution time stamps for all events,
    // some provide low-resolution time stamps for all events. FF < 52
    // even mixes both time stamps together. Some browsers even report
    // negative time stamps or time stamps that are 0 (iOS9) in some cases.
    // Given we are only comparing two time stamps with equality (!==),
    // we are safe from the resolution differences. If the time stamp is 0
    // we bail-out of preventing the flush, which can affect semantics,
    // such as if an earlier flush removes or adds event listeners that
    // are fired in the subsequent flush. However, this is the same
    // behaviour as we had before this change, so the risks are low.
    //! event.timeStamp 不太可靠，因为不同的浏览器在历史上如何提供时间戳。某些浏览器为所有事件提供高精度时间戳，一些为所有事件提供低精度时间戳。FF <= 52 甚至将两个时间戳混合一起。有些浏览器甚至报告负的时间戳，在某些情况下为 0 （iOS9）。鉴于我们仅将两个时间戳与相等性进行比较(!==)，我们不受决议分歧的担心。如果时间戳为 0 我们防止刷新，这可能会影响语义，例如，如果较早的刷新删除或添加事件侦听器，在后续刷新中触发。但是，这与我们在此更改之前的行为相同，因此风险较低。
    //! 为了兼容不同的浏览器的 `event.timeStemp`
    if (
        !isInsideEventHandler && //! isInsideEventHandler = false
        (!enableFlareAPI ||  //! enableFlareAPI = false
            (timeStamp === 0 || lastFlushedEventTimeStamp !== timeStamp))
    ) {
        lastFlushedEventTimeStamp = timeStamp;
        flushDiscreteUpdatesImpl(); //? 这是个空函数
    }
}

export function setBatchingImplementation(
    _batchedUpdatesImpl,
    _discreteUpdatesImpl,
    _flushDiscreteUpdatesImpl,
    _batchedEventUpdatesImpl,
) {
    batchedUpdatesImpl = _batchedUpdatesImpl;
    discreteUpdatesImpl = _discreteUpdatesImpl;
    flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl;
    batchedEventUpdatesImpl = _batchedEventUpdatesImpl;
}
