/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {ReactNodeList} from 'shared/ReactTypes';
import type {Container} from './ReactDOMHostConfig';

import '../shared/checkReact';
import './ReactDOMClientInjection';
import {
  findDOMNode,
  render,
  hydrate,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
} from './ReactDOMLegacy';
import {createRoot, createBlockingRoot, isValidContainer} from './ReactDOMRoot';
import {useEvent} from './ReactDOMUseEvent';

import {
  batchedEventUpdates,
  batchedUpdates,
  discreteUpdates,
  flushDiscreteUpdates,
  flushSync,
  flushControlled,
  injectIntoDevTools,
  flushPassiveEffects,
  IsThisRendererActing,
  attemptSynchronousHydration,
  attemptUserBlockingHydration,
  attemptContinuousHydration,
  attemptHydrationAtCurrentPriority,
} from 'react-reconciler/src/ReactFiberReconciler';
import {createPortal as createPortalImpl} from 'react-reconciler/src/ReactPortal';
import {canUseDOM} from 'shared/ExecutionEnvironment';
import {setBatchingImplementation} from 'legacy-events/ReactGenericBatching';
import {
  setRestoreImplementation,
  enqueueStateRestore,
  restoreStateIfNeeded,
} from 'legacy-events/ReactControlledComponent';
import {runEventsInBatch} from 'legacy-events/EventBatching';
import {
  eventNameDispatchConfigs,
  injectEventPluginsByName,
} from 'legacy-events/EventPluginRegistry';
import ReactVersion from 'shared/ReactVersion';
import invariant from 'shared/invariant';
import {warnUnstableRenderSubtreeIntoContainer} from 'shared/ReactFeatureFlags';

import {
  getInstanceFromNode,
  getNodeFromInstance,
  getFiberCurrentPropsFromNode,
  getClosestInstanceFromNode,
} from './ReactDOMComponentTree';
import {restoreControlledState} from './ReactDOMComponent';
import {dispatchEvent} from '../events/ReactDOMEventListener';
import {
  setAttemptSynchronousHydration,
  setAttemptUserBlockingHydration,
  setAttemptContinuousHydration,
  setAttemptHydrationAtCurrentPriority,
  queueExplicitHydrationTarget,
} from '../events/ReactDOMEventReplaying';

setAttemptSynchronousHydration(attemptSynchronousHydration);
setAttemptUserBlockingHydration(attemptUserBlockingHydration);
setAttemptContinuousHydration(attemptContinuousHydration);
setAttemptHydrationAtCurrentPriority(attemptHydrationAtCurrentPriority);

let didWarnAboutUnstableCreatePortal = false;
let didWarnAboutUnstableRenderSubtreeIntoContainer = false;

if (__DEV__) {
  if (
    typeof Map !== 'function' ||
    // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null ||
    typeof Map.prototype.forEach !== 'function' ||
    typeof Set !== 'function' ||
    // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null ||
    typeof Set.prototype.clear !== 'function' ||
    typeof Set.prototype.forEach !== 'function'
  ) {
    console.error(
      'React depends on Map and Set built-in types. Make sure that you load a ' +
        'polyfill in older browsers. https://fb.me/react-polyfills',
    );
  }
}

setRestoreImplementation(restoreControlledState);
<<<<<<< HEAD
=======

export type DOMContainer =
  | (Element & {
      _reactRootContainer: ?(_ReactRoot | _ReactSyncRoot),
      _reactHasBeenPassedToCreateRootDEV: ?boolean,
    })
  | (Document & {
      _reactRootContainer: ?(_ReactRoot | _ReactSyncRoot),
      _reactHasBeenPassedToCreateRootDEV: ?boolean,
    });

type Batch = FiberRootBatch & {
  render(children: ReactNodeList): Work,
  then(onComplete: () => mixed): void,
  commit(): void,

  // The ReactRoot constructor is hoisted but the prototype methods are not. If
  // we move ReactRoot to be above ReactBatch, the inverse error occurs.
  // $FlowFixMe Hoisting issue.
  _root: _ReactRoot | _ReactSyncRoot,
  _hasChildren: boolean,
  _children: ReactNodeList,

  _callbacks: Array<() => mixed> | null,
  _didComplete: boolean,
};

type _ReactSyncRoot = {
  render(children: ReactNodeList, callback: ?() => mixed): Work,
  unmount(callback: ?() => mixed): Work,

  _internalRoot: FiberRoot,
};

type _ReactRoot = _ReactSyncRoot & {
  createBatch(): Batch,
};

function ReactBatch(root: _ReactRoot | _ReactSyncRoot) {
  const expirationTime = computeUniqueAsyncExpiration();
  this._expirationTime = expirationTime;
  this._root = root;
  this._next = null;
  this._callbacks = null;
  this._didComplete = false;
  this._hasChildren = false;
  this._children = null;
  this._defer = true;
}
ReactBatch.prototype.render = function(children: ReactNodeList) {
  invariant(
    this._defer,
    'batch.render: Cannot render a batch that already committed.',
  );
  this._hasChildren = true;
  this._children = children;
  const internalRoot = this._root._internalRoot;
  const expirationTime = this._expirationTime;
  const work = new ReactWork();
  updateContainerAtExpirationTime(
    children,
    internalRoot,
    null,
    expirationTime,
    null,
    work._onCommit,
  );
  return work;
};
ReactBatch.prototype.then = function(onComplete: () => mixed) {
  if (this._didComplete) {
    onComplete();
    return;
  }
  let callbacks = this._callbacks;
  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }
  callbacks.push(onComplete);
};
ReactBatch.prototype.commit = function() {
  const internalRoot = this._root._internalRoot;
  let firstBatch = internalRoot.firstBatch;
  invariant(
    this._defer && firstBatch !== null,
    'batch.commit: Cannot commit a batch multiple times.',
  );

  if (!this._hasChildren) {
    // This batch is empty. Return.
    this._next = null;
    this._defer = false;
    return;
  }

  let expirationTime = this._expirationTime;

  // Ensure this is the first batch in the list.
  if (firstBatch !== this) {
    // This batch is not the earliest batch. We need to move it to the front.
    // Update its expiration time to be the expiration time of the earliest
    // batch, so that we can flush it without flushing the other batches.
    if (this._hasChildren) {
      expirationTime = this._expirationTime = firstBatch._expirationTime;
      // Rendering this batch again ensures its children will be the final state
      // when we flush (updates are processed in insertion order: last
      // update wins).
      // TODO: This forces a restart. Should we print a warning?
      this.render(this._children);
    }

    // Remove the batch from the list.
    let previous = null;
    let batch = firstBatch;
    while (batch !== this) {
      previous = batch;
      batch = batch._next;
    }
    invariant(
      previous !== null,
      'batch.commit: Cannot commit a batch multiple times.',
    );
    previous._next = batch._next;

    // Add it to the front.
    this._next = firstBatch;
    firstBatch = internalRoot.firstBatch = this;
  }

  // Synchronously flush all the work up to this batch's expiration time.
  this._defer = false;
  flushRoot(internalRoot, expirationTime);

  // Pop the batch from the list.
  const next = this._next;
  this._next = null;
  firstBatch = internalRoot.firstBatch = next;

  // Append the next earliest batch's children to the update queue.
  if (firstBatch !== null && firstBatch._hasChildren) {
    firstBatch.render(firstBatch._children);
  }
};
ReactBatch.prototype._onComplete = function() {
  if (this._didComplete) {
    return;
  }
  this._didComplete = true;
  const callbacks = this._callbacks;
  if (callbacks === null) {
    return;
  }
  // TODO: Error handling.
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    callback();
  }
};

type Work = {
  then(onCommit: () => mixed): void,
  _onCommit: () => void,
  _callbacks: Array<() => mixed> | null,
  _didCommit: boolean,
};

function ReactWork() {
  this._callbacks = null;
  this._didCommit = false;
  // TODO: Avoid need to bind by replacing callbacks in the update queue with
  // list of Work objects.
  this._onCommit = this._onCommit.bind(this);
}
ReactWork.prototype.then = function(onCommit: () => mixed): void {
  if (this._didCommit) {
    onCommit();
    return;
  }
  let callbacks = this._callbacks;
  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }
  callbacks.push(onCommit);
};
ReactWork.prototype._onCommit = function(): void {
  if (this._didCommit) {
    return;
  }
  this._didCommit = true;
  const callbacks = this._callbacks;
  if (callbacks === null) {
    return;
  }
  // TODO: Error handling.
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    invariant(
      typeof callback === 'function',
      'Invalid argument passed as callback. Expected a function. Instead ' +
        'received: %s',
      callback,
    );
    callback();
  }
};

//! 返回值是 FiberRoot
function createRootImpl(
  container: DOMContainer,
  tag: RootTag, //! 首次渲染时值为 `LegacyRoot = 0`
  options: void | RootOptions,
) {
  // Tag is either LegacyRoot or Concurrent Root
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;

    //! `createContainer` from  file://.../react-reconciler/ReactFiberReconciler:299
    //! root: FiberRootNode as FiberRoot
    //! root.current = HostRoot: FiberNode
    //! HostRoot.stateNode = root: FiberRootNode
    //! root.current.stateNode === root
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);

  //! container['__reactContainer$' + randomKey] = root.current
  //! #root上有一个以 `__reactContainer$` 开头后加随机字符的属性连接到 HostRoot, HostRoot可以认为是<App />的直接父节点
  markContainerAsRoot(root.current, container);
  if (hydrate && tag !== LegacyRoot) {
    const doc =
      container.nodeType === DOCUMENT_NODE
        ? container
        : container.ownerDocument;
    eagerlyTrapReplayableEvents(doc); //! 事件监听入口
  }
  return root;
}

function ReactSyncRoot(
  container: DOMContainer, //! #root
  tag: RootTag, //! 首次渲染时值为 `LegacyRoot = 0`
  options: void | RootOptions, //! { hydrate: true }
) {
  this._internalRoot = createRootImpl(container, tag, options); //! FiberRootNode as FiberRoot
}

function ReactRoot(container: DOMContainer, options: void | RootOptions) {
  this._internalRoot = createRootImpl(container, ConcurrentRoot, options);
}

ReactRoot.prototype.render = ReactSyncRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render');
  }
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, null, work._onCommit);
  return work;
};

ReactRoot.prototype.unmount = ReactSyncRoot.prototype.unmount = function(
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render');
  }
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(null, root, null, work._onCommit);
  return work;
};

// Sync roots cannot create batches. Only concurrent ones.
ReactRoot.prototype.createBatch = function(): Batch {
  const batch = new ReactBatch(this);
  const expirationTime = batch._expirationTime;

  const internalRoot = this._internalRoot;
  const firstBatch = internalRoot.firstBatch;
  if (firstBatch === null) {
    internalRoot.firstBatch = batch;
    batch._next = null;
  } else {
    // Insert sorted by expiration time then insertion order
    let insertAfter = null;
    let insertBefore = firstBatch;
    while (
      insertBefore !== null &&
      insertBefore._expirationTime >= expirationTime
    ) {
      insertAfter = insertBefore;
      insertBefore = insertBefore._next;
    }
    batch._next = insertBefore;
    if (insertAfter !== null) {
      insertAfter._next = batch;
    }
  }

  return batch;
};

/**
 * True if the supplied DOM node is a valid node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid DOM node.
 * @internal
 */
function isValidContainer(node) {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        node.nodeValue === ' react-mount-point-unstable '))
  );
}

function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

//! 用来验证#root是否具备hydrate的条件
function shouldHydrateDueToLegacyHeuristic(container) {
  const rootElement = getReactRootElementInContainer(container);
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&  //! 这儿要求#root是一个 elementNode `ELEMENT_NODE = 1`
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME) //! ROOT_ATTRIBUTE_NAME = `data-reactroot` 服务端渲染时会在 #root元素上添加这个属性
  );
}

>>>>>>> view ReactDom to 633
setBatchingImplementation(
  batchedUpdates,
  discreteUpdates,
  flushDiscreteUpdates,
  batchedEventUpdates,
);

<<<<<<< HEAD
=======
let warnedAboutHydrateAPI = false;

//! 首次挂载时调用过, 用于创建 #root._reactRootContainer 的值
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): _ReactSyncRoot {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  //! 首次渲染时如果不需要调和，则会移除所有子节点
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    //! 为什么不一次性直接滞空 #root， 而要遍历所有子节点，然后一个一个的删？
    while ((rootSibling = container.lastChild)) {
      if (__DEV__) {
        if (
          !warned &&
          rootSibling.nodeType === ELEMENT_NODE &&
          (rootSibling: any).hasAttribute(ROOT_ATTRIBUTE_NAME)
        ) {
          warned = true;
          warningWithoutStack(
            false,
            'render(): Target node has markup rendered by React, but there ' +
              'are unrelated nodes as well. This is most commonly caused by ' +
              'white-space inserted around server-rendered markup.',
          );
        }
      }
      container.removeChild(rootSibling);
    }
  }
  if (__DEV__) {
    if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
      warnedAboutHydrateAPI = true;
      lowPriorityWarningWithoutStack(
        false,
        'render(): Calling ReactDOM.render() to hydrate server-rendered markup ' +
          'will stop working in React v17. Replace the ReactDOM.render() call ' +
          'with ReactDOM.hydrate() if you want React to attach to the server HTML.',
      );
    }
  }

  // Legacy roots are not batched.
  //! { _internalRoot: FiberRoot}
  return new ReactSyncRoot(
    container,
    LegacyRoot, //! LegacyRoot = 0 from file://.../share/ReactRootTags
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}

//! render 函数直接调用的函数
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>, //! null
  children: ReactNodeList, //! <App />
  container: DOMContainer, //! #root
  forceHydrate: boolean, //! false 虽然 `forceHydrate` 为 false，但react还是会检查是否符合hydrate的条件
  callback: ?Function,
) {
  if (__DEV__) {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  }

  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  let root: _ReactSyncRoot = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    /**
     *! 可以预见挂载点元素的dom对象 (#root) 总包含一个 `_reactRootContainer` 属性
     *! 它的值是 `ReactRoot` 类型是 ReactSyncRoot{ _internalRoot: FiberRoot{ current: HostRoot } }
     *! HostRoot 是 <App /> 的父节点
     *! #root.      _reactRootContainer.      _internalRoot.             current      .child === <App />
     *! (container  |     ReactRoot           | FiberRoot                | HostRoot)
     *!                                ^------------------------------------------.stateNode
     *!   ^----------------------------------------------.containerInfo
     *! #root['__reactContainer$' + randomKey] -----------------------------^
     */
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );

    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        //! getPublicRootInstance file://.../react-reconciler/src/ReactFiberReconciler:355
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance); //! ReactDom.render 函数的call被重新包装， 调用时传入的是 FiberRoot.current.child.stateNode
      };
    }
    // Initial mount should not be batched. (初始装载不应批处理)
    //! unbatchedUpdates file://.../react-reconciler/src/ReactFiberWorkLoop:1235
    //! 可以认为直接调用了回调
    unbatchedUpdates(() => {

      //! updateContainer file://.../react-reconciler/src/ReactFiberReconciler:308
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}

>>>>>>> view ReactDom to 633
function createPortal(
  children: ReactNodeList,
  container: Container,
  key: ?string = null,
): React$Portal {
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  // TODO: pass ReactDOM portal implementation as third argument
  // $FlowFixMe The Flow type is opaque but there's no way to actually create it.
  return createPortalImpl(children, container, null, key);
}

<<<<<<< HEAD
function scheduleHydration(target: Node) {
  if (target) {
    queueExplicitHydrationTarget(target);
  }
}
=======
const ReactDOM: Object = {
  createPortal,

  findDOMNode(
    componentOrElement: Element | ?React$Component<any, any>,
  ): null | Element | Text {
    if (__DEV__) {
      let owner = (ReactCurrentOwner.current: any);
      if (owner !== null && owner.stateNode !== null) {
        const warnedAboutRefsInRender =
          owner.stateNode._warnedAboutRefsInRender;
        warningWithoutStack(
          warnedAboutRefsInRender,
          '%s is accessing findDOMNode inside its render(). ' +
            'render() should be a pure function of props and state. It should ' +
            'never access something that requires stale data from the previous ' +
            'render, such as refs. Move this logic to componentDidMount and ' +
            'componentDidUpdate instead.',
          getComponentName(owner.type) || 'A component',
        );
        owner.stateNode._warnedAboutRefsInRender = true;
      }
    }
    if (componentOrElement == null) {
      return null;
    }
    if ((componentOrElement: any).nodeType === ELEMENT_NODE) {
      return (componentOrElement: any);
    }
    if (__DEV__) {
      return findHostInstanceWithWarning(componentOrElement, 'findDOMNode');
    }
    return findHostInstance(componentOrElement);
  },

  hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    if (__DEV__) {
      warningWithoutStack(
        !container._reactHasBeenPassedToCreateRootDEV,
        'You are calling ReactDOM.hydrate() on a container that was previously ' +
          'passed to ReactDOM.%s(). This is not supported. ' +
          'Did you mean to call createRoot(container, {hydrate: true}).render(element)?',
        enableStableConcurrentModeAPIs ? 'createRoot' : 'unstable_createRoot',
      );
    }
    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback,
    );
  },

  //! ReactDom.render 函数入口位置
  render(
    element: React$Element<any>, //! <App />
    container: DOMContainer, //! #root
    callback: ?Function,
  ) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    if (__DEV__) {
      warningWithoutStack(
        !container._reactHasBeenPassedToCreateRootDEV,
        'You are calling ReactDOM.render() on a container that was previously ' +
          'passed to ReactDOM.%s(). This is not supported. ' +
          'Did you mean to call root.render(element)?',
        enableStableConcurrentModeAPIs ? 'createRoot' : 'unstable_createRoot',
      );
    }
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },

  unstable_renderSubtreeIntoContainer(
    parentComponent: React$Component<any, any>,
    element: React$Element<any>,
    containerNode: DOMContainer,
    callback: ?Function,
  ) {
    invariant(
      isValidContainer(containerNode),
      'Target container is not a DOM element.',
    );
    invariant(
      parentComponent != null && hasInstance(parentComponent),
      'parentComponent must be a valid React Component',
    );
    return legacyRenderSubtreeIntoContainer(
      parentComponent,
      element,
      containerNode,
      false,
      callback,
    );
  },

  unmountComponentAtNode(container: DOMContainer) {
    invariant(
      isValidContainer(container),
      'unmountComponentAtNode(...): Target container is not a DOM element.',
    );
>>>>>>> view ReactDom to 633

function renderSubtreeIntoContainer(
  parentComponent: React$Component<any, any>,
  element: React$Element<any>,
  containerNode: Container,
  callback: ?Function,
) {
  if (__DEV__) {
    if (
      warnUnstableRenderSubtreeIntoContainer &&
      !didWarnAboutUnstableRenderSubtreeIntoContainer
    ) {
      didWarnAboutUnstableRenderSubtreeIntoContainer = true;
      console.warn(
        'ReactDOM.unstable_renderSubtreeIntoContainer() is deprecated ' +
          'and will be removed in a future major release. Consider using ' +
          'React Portals instead.',
      );
    }
  }
  return unstable_renderSubtreeIntoContainer(
    parentComponent,
    element,
    containerNode,
    callback,
  );
}

function unstable_createPortal(
  children: ReactNodeList,
  container: Container,
  key: ?string = null,
) {
  if (__DEV__) {
    if (!didWarnAboutUnstableCreatePortal) {
      didWarnAboutUnstableCreatePortal = true;
      console.warn(
        'The ReactDOM.unstable_createPortal() alias has been deprecated, ' +
          'and will be removed in React 17+. Update your code to use ' +
          'ReactDOM.createPortal() instead. It has the exact same API, ' +
          'but without the "unstable_" prefix.',
      );
    }
  }
  return createPortal(children, container, key);
}

const Internals = {
  // Keep in sync with ReactDOMUnstableNativeDependencies.js
  // ReactTestUtils.js, and ReactTestUtilsAct.js. This is an array for better minification.
  Events: [
    getInstanceFromNode,
    getNodeFromInstance,
    getFiberCurrentPropsFromNode,
    injectEventPluginsByName,
    eventNameDispatchConfigs,
    enqueueStateRestore,
    restoreStateIfNeeded,
    dispatchEvent,
    runEventsInBatch,
    flushPassiveEffects,
    IsThisRendererActing,
  ],
};

export {
  createPortal,
  batchedUpdates as unstable_batchedUpdates,
  flushSync,
  Internals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ReactVersion as version,
  // Disabled behind disableLegacyReactDOMAPIs
  findDOMNode,
  hydrate,
  render,
  unmountComponentAtNode,
  // exposeConcurrentModeAPIs
  createRoot,
  createBlockingRoot,
  discreteUpdates as unstable_discreteUpdates,
  flushDiscreteUpdates as unstable_flushDiscreteUpdates,
  flushControlled as unstable_flushControlled,
  scheduleHydration as unstable_scheduleHydration,
  // Disabled behind disableUnstableRenderSubtreeIntoContainer
  renderSubtreeIntoContainer as unstable_renderSubtreeIntoContainer,
  // Disabled behind disableUnstableCreatePortal
  // Temporary alias since we already shipped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal,
  // enableUseEventAPI
  useEvent as unstable_useEvent,
};

const foundDevTools = injectIntoDevTools({
  findFiberByHostInstance: getClosestInstanceFromNode,
  bundleType: __DEV__ ? 1 : 0,
  version: ReactVersion,
  rendererPackageName: 'react-dom',
});

if (__DEV__) {
  if (!foundDevTools && canUseDOM && window.top === window.self) {
    // If we're in Chrome or Firefox, provide a download link if not installed.
    if (
      (navigator.userAgent.indexOf('Chrome') > -1 &&
        navigator.userAgent.indexOf('Edge') === -1) ||
      navigator.userAgent.indexOf('Firefox') > -1
    ) {
      const protocol = window.location.protocol;
      // Don't warn in exotic cases like chrome-extension://.
      if (/^(https?|file):$/.test(protocol)) {
        // eslint-disable-next-line react-internal/no-production-logging
        console.info(
          '%cDownload the React DevTools ' +
            'for a better development experience: ' +
            'https://fb.me/react-devtools' +
            (protocol === 'file:'
              ? '\nYou might need to use a local HTTP server (instead of file://): ' +
                'https://fb.me/react-devtools-faq'
              : ''),
          'font-weight:bold',
        );
      }
    }
  }
}
