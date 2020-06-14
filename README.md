## 数据结构
![React Fiber Graph](https://raw.githubusercontent.com/EnjoyNaive/react/version/16.10.0/images/React Fiber Graph.svg)
```js
ReactSyncRoot {
  _internalRoot: FiberRootNode
}
```
```js
FiberRootNode {
  tag,
  current,
  containerInfo,
  pendingChildren,
  pingCache,
  finishedExpirationTime,
  finishedWork,
  timeoutHandle,
  context,
  pendingContext,
  hydrate,
  firstBatch,
  callbackNode,
  callbackPriority,
  firstPendingTime,
  firstSuspendedTime,
  lastSuspendedTime,
  nextKnowPendingLevel,
  lastPingedTime,
  lastExpireTime,
  //enableSchedulerTracing === true
  interactionThreadID,
  memoizedInteractions,
  pendingInteractionMap,
  // enableSuspenseCallback === true
  hydrationCallbacks
}
```
```js
FiberNode{
  tag,
  key,
  elementType,
  type,
  stateNode,
  return,
  child,
  sibling,
  index,
  ref,
  pendingProps,
  memoizedProps,
  updateQueue,
  memoizedState,
  dependencies,
  mode,
  effectTag,
  nextEffect,
  firstEffect,
  lastEffect,
  expirationTime,
  childExpirationTime,
  alternate,
  // enableProfilerTimer === true
  actualDuration,
  actualStartTime,
  selfBaseDuration,
  treeBaseDuration,
  // enableUserTimingAPI === true
  _debugID,
  _debugIsCurrentlyTiming,
  // __DEV__
  _debugSource,
  _debugOwner,
  _debugNeedRemount,
  _debugHookTypes,
}
```
```js
Update{
  expirationTime,
  suspenseConfig,
  tag,
  payload,
  callback,
  next,
  nextEffect
  // __DEV__
  priority
}
```
```js
task{
  id,
  callback,
  priorityLevel,
  startTime,
  expirationTime,
  sortIndex
}
```

## 调用栈
```js
ReactDom.render()@ReactDOM.js:707
  -> legacyRenderSubtreeIntoContainer()@ReactDOM.js:570
    -> legacyCreateRootFromDOMContainer()@ReactDOM.js:517
      -> shouldHydrateDueToLegacyHeuristic()@ReactDOM.js:499
        -> getReactRootElementInContainer()@ReactDOM.js:500  //是否具备合成条件
      -> new ReactSyncRoot()@ReactDOM.js:394
        -> createRootImpl()@ReactDOM.js:373
          -> createContainer()@ReactFiberReconciler.js:299
            -> createFiberRoot()@ReactFiberRoot.js:148
              -> new FiberRootNode()@ReactFiberRoot.js:116
              -> createHostRootFiber()@ReactFiber.js:573
                -> createFiber()@ReactFiber.js:354
                  -> new FiberNode()@ReactFiber.js:255
          -> markContainerAsRoot()@ReactDOM.js:393
    -> unbatchedUpdates(fn)@ReactFiberWorkLoop.js:1235
      -> fn()@ReactDOM.js:616
        -> updateContainer()@ReactFiberReconciler.js:308
          -> requestCurrentTime()@ReactFiberWorkLoop.js:292
          -> requestCurrentSuspenseConfig()@ReactFiberSuspenseConfig.js:20
          -> computeExpirationForFiber()@ReactFiberWorkLoop.js:307
          -> updateContainerAtExpirationTime()ReactFiberReconciler.js:181
            -> getContextForSubtree()@ReactFiberReconciler.js:114
              -> getInstance:get()@ReactInstanceMap.js:27
              -> findCurrentUnmaskedContext()@ReactFiberContext.js:318
            -> scheduleRootUpdate()@ReactFiberReconciler.js:134
              -> createUpdate()@ReactUpdateQueue.js:204
              -> enqueueUpdate()@ReactUpdateQueue.js:239
              -> scheduleWork:scheduleUpdateOnFiber()@ReactFiberWorkLoop.js:385
                -> checkForNestedUpdates()@ReactFiberWorkLoop.js:2547
                -> warnAboutInvalidUpdatesOnClassComponentsInDEV()@ReactFiberWorkLoop.js:2718
                -> markUpdateTimeFormFiberToRoot()@ReactFiberWorkLoop.js:464
                -> checkForInterruption()@ReactFiberWorkLoop.js:2597
                -> recordScheduleUpdate()@ReactDebugFiberPerf.js:226
                -> getCurrentPriorityLevel()@SchedulerWithReactIntegration.js:86
                  -> Scheduler_getCurrentPriorityLevel:unstable_getCurrentPriorityLevel()@Scheduler.js:394
                -> ensureRootIsScheduled()@ReactFiberWorkLoop.js:563
                  -> getNextRootExpirationTimeTOWorkOn()@ReactFiberWorkLoop.js:530
                  -> requestCurrentTime()@ReactFiberWorkLoop.js:292
                  -> inferPriorityFromExpirationTime()@ReactFiberExpirationTime.js:118
                  -> scheduleSyncCallback(performSyncWorkOnRoot)@SchedulerWithReactIntegration.js:137
                    -> Scheduler_scheduleCallback:unstable_scheduleCallback(,callback:flushSyncCallbackQueueImpl,)@Scheduler.js:295
                      -> getCurrentTime()@SchedulerHostConfig.js:27/55/111/114
                      -> requestHostCallback(flushWork)@SchedulerHostConfig.js:58/343
                        -> requestAnimationFrame(onAnimationFrame)
                -> schedulePendingInteractions()@ReactFiberWorkLoop.js:3043
                  -> scheduleInteractions()@ReactFiberWorkLoop.js:3009
                -> flushSyncCallbackQueue()@SchedulerWithReactIntegration.js:161
                  -> Scheduler_cancelCallback:unstable_cancelCallback()@Scheduler.js:379
                  -> flushSyncCallbackQueueImpl()@SchedulerWithReactIntegration.js:170
                    -> runWithPriority(, fn)@SchedulerWithReactIntegration.js:120
                      -> reactPriorityToSchedulerPriority()@SchedulerWithReactIntegration.js:103
                      -> Scheduler_runWithPriority:unstable_runWithPriority(, fn)@Scheduler.js:217
                        -> eventHandler:fn()@SchedulerWithReactIntegration.js:178
                          -> # for @SchedulerWithReactIntegration.js:179
                            -> # do ...while #SchedulerWithIntegration.js:181
                              -> callback:performSyncWorkOnRoot()@ReactFiberWorkLoop.js:994
                                -> prepareFreshStack()@ReactFiberWorkLoop.js:1285
                                  -> createWorkInProgress()@ReactFiber.js:393
                                    -> createFiber()@ReactFiber.js:354
                                -> startWorkOnPendingInteractions()@ReactFiberWorkLoop.js:3057
                                -> startWorkLoopTimer()@ReactDebugFiberPerf.js:356
                                -> #do ...while @ReactFiberWorkLoop.js:1030
                                  -> workLoopSync()@ReactFiberWorkLoop.js:1502
                                    -> #while @ReactFiberWorkLoop.js:1504
                                      -> performUnitOfWork()@ReactFiberWorkLoop.js:1517
                                        -> startWorkTimer()@ReactDebugFiberPerf.js:266
                                        -> beginWork()@ReactFiberBeginWork.js:2796
                                          -> #switch @ReactFiberBeginWork.js:2839
                                            -> case HostRoot
                                            -> case HostComponent
                                            -> case ClassComponent
                                            -> case HostPortal
                                            -> case ContextProvider
                                            -> case Profiler
                                            -> case SuspenseComponent
                                            -> case SuspenseListComponent
                                          -> #switch @ReactFiberBeginWork.js:3012
                                            -> case IndeterminateComponent
                                            -> case LazyComponent
                                            -> case FunctionComponent
                                            -> case ClassComponent
                                              -> updateClassComponent()@ReactFiberBeginWork.js:693
                                                -> isLegacyContextProvider()@ReactFiberContext.js:136
                                                -> prepareToReadContext()@ReactFiberBeginWork.js:310
                                                -> constructClassInstance()@ReactFiberClassComponent.js:539
                                                  -> adoptClassInstance()@ReactFiberClassComponent.js:529
                                                -> mountClassInstance()@ReactFiberClassComponent.js:780
                                                -> finishClassComponent()@ReactFiberBeginWork.js:796
                                                  -> instance.render()
                                                  -> forUnmountCurrentAndReconcile()@ReactFiberBeginWork.js:244
                                                    -> reconcileChildFibers()@ReactChildFiber.js:1246
                                                      -> reconcilerSingleElement()@ReactChildFiber.js:1132
                                                        -> #while @ReactChildFiber.js:1140
                                                          -> useFiber()@ReactChildFiber.js:320
                                                            -> createWorkInProgress()@ReactFiber.js:393
                                                              -> createFiber()@ReactFiber.js:354
                                                                -> new FiberNode()@ReactFiber.js:255
                                                        -> createFiberFromElement()@ReactFiber.js:731
                                                          -> createFiberFromTypeAndProps()@ReactFiber.js:593
                                                            -> createFiber()@ReactFiber.js:354
                                                              -> new FiberNode()@ReactFiber.js:255
                                                      -> placeSingleElement()@ReactChildFiber.js:361
                                            -> case HostRoot
                                            -> case HostComponent
                                              -> updateHostComponent()@ReactFiberBeginWork.js:980
                                                -> reconcileChildren()@ReactFiberBeginWork.js:211
                                                  -> #if mountChildFibers()@ReactChildFiber.js:1246
                                                  -> #else reconcileChildFibers()@ReactChildFiber.js:1246
                                            -> case HostText
                                            -> case SuspenseComponent
                                            -> case HostPortal
                                            -> case ForwardRef
                                            -> case Fragment
                                            -> case Mode
                                            -> case Profiler
                                            -> case ContextProvider
                                            -> case ContextConsumer
                                            -> case MemoComponent
                                            -> case SimpleMemoComponent
                                            -> case IncompleteClassComponent
                                            -> case SuspenseListComponent
                                            -> case FundamentalComponent
                                            -> case ScopeComponent
                                -> resetContextDependencies()@ReactFiberNewContext.js:57
                                -> popDispatcher()@ReactFiberWorkLoop.js:1384
                                -> resolveLocksOnRoot()@ReactFiberWorkLoop.js:1146
                                -> finishSyncRender()@ReactFiberWorkLoop.js:1081
                                  -> commitRoot()@ReactFiberWorkLoop.js:1754
                                    -> runWithPriority(, fn)@SchedulerWIthReactIntegration.js:120
                                      -> Scheduler_runWithPriority()@Scheduler.js:217
                                        -> eventHandler:fn:commitRootImpl()@ReactFiberWorkLoop.js:1766
                                          -> startCommitTimer()@ReactDebugFiberPerf.js:400
                                          -> getRemainingExpirationTime()@ReactFiberWorkLoop.js:1683
                                          -> prepareForCommit()@ReactDOMHostConfig.js:191
                                -> ensureRootIsScheduled()@ReactFiberWorkLoop.js:566


=======>>>>>>>第二帧<<<<<<<==========
<---@ return
@requestAnimationFrame onAnimationFrame()@SchedulerHostConfig.js:272
  -> setTimeout(performWorkUntilDeadline)
@setTimeout performWorkUntilDeadline()@SchedulerHostConfig.js:208
  -> scheduledHostCallback:flushWork()@Scheduler.js:122
    -> workLoop()@Scheduler.js:164
      -> advanceTimers()@Scheduler.js:81
      -> @ while
        -> callback:flushSyncCallbackQueueImpl()@SchedulerWithReactIntegration.js:170
          -> runWithPriority(, fn)@SchedulerWithReactIntegration.js:120
            -> reactPriorityToSchedulerPriority()@SchedulerWithReactIntegration.js:103
            -> Scheduler_runWithPriority:unstable_runWithPriority(, fn)@Scheduler.js:217
              -> eventHandler:fn()@SchedulerWithReactIntegration.js:178
                -> @ for
                  -> do ...while
                    -> callback()
