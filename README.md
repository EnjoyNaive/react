## 数据结构
![alt struct](https://github.com/uploy/react/blob/annotation/16.10.0/images/struct.jpg?raw=true)
```js
ReactSyncRoot {
  _internalRoot: FiberRootNode
}
```

## 调用栈
```js
ReactDom.render()@ReactDOM.js:724
  -> legacyRenderSubtreeIntoContainer()@ReactDOM.js:586
    -> legacyCreateRootFromDOMContainer()@ReactDOM.js:529
      -> shouldHydrateDueToLegacyHeuristic()@ReactDOM.js:510
        -> getReactRootElementInContainer()@ReactDOM.js:497
      -> new ReactSyncRoot()@ReactDOM.js:404
        -> createRootImpl()@ReactDOM.js:374
          -> createContainer()@ReactFiberReconciler.js:299
            -> createFiberRoot()@ReactFiberRoot.js:148
              -> new FiberRootNode()@ReactFiberRoot.js:116
              -> createHostRootFiber()@ReactFiber.js:573
                -> createFiber()@ReactFiber.js:354
                  -> new FiberNode()@ReactFiber.js:255
          -> markContainerAsRoot()@ReactDOM.js:393
    -> unbatchedUpdates(fn)@ReactFiberWorkLoop.js:1238
      -> fn()@ReactDOM.js:631
        -> updateContainer()@ReactFiberReconciler.js:308
          -> requestCurrentTime()@ReactFiberWorkLoop.js:292
          -> requestCurrentSuspenseConfig()@ReactFiberSuspenseConfig.js:20
          -> computeExpirationForFiber()@ReactFiberReconciler.js:324
          -> updateContainerAtExpirationTime()ReactFiberReconciler.js:181
            -> getContextForSubtree()@ReactFiberReconciler.js:114
              -> getInstance:get()@ReactInstanceMap.js:27
              -> findCurrentUnmaskedContext()@ReactFiberContext.js:318
            -> scheduleRootUpdate()@ReactFiberReconciler.js:134
              -> createUpdate()@ReactUpdateQueue.js:204
              -> enqueueUpdate()@ReactUpdateQueue.js:239
              -> scheduleWork:scheduleUpdateOnFiber()@ReactFiberWorkLoop.js:388
                -> checkForNestedUpdates()@ReactFiberWorkLoop.js:2550
                -> warnAboutInvalidUpdatesOnClassComponentsInDEV()@ReactFiberWorkLoop.js:2721
                -> markUpdateTimeFormFiberToRoot()@ReactFiberWorkLoop.js:464
                -> checkForInterruption()@ReactFiberWorkLoop.js:2600
                -> recordScheduleUpdate()@ReactDebugFiberPerf.js:226
                -> getCurrentPriorityLevel()@SchedulerWithReactIntegration.js:86
                  -> Scheduler_getCurrentPriorityLevel:unstable_getCurrentPriorityLevel()@Scheduler.js:394
                -> ensureRootIsScheduled()@ReactFiberWorkLoop.js:566
                  -> getNextRootExpirationTimeTOWorkOn()@ReactFiberWorkLoop.js:533
                  -> requestCurrentTime()@ReactFiberWorkLoop.js:292
                  -> inferPriorityFromExpirationTime()@ReactFiberExpirationTime.js:118
                  -> scheduleSyncCallback(performSyncWorkOnRoot)@SchedulerWithReactIntegration.js:137
                    -> Scheduler_scheduleCallback:unstable_scheduleCallback(,callback:flushSyncCallbackQueueImpl,)@Scheduler.js:295
                      -> getCurrentTime()@SchedulerHostConfig.js:27/55/111/114
                      -> requestHostCallback(flushWork)@SchedulerHostConfig.js:58/343
                      -> requestAnimationFrame(onAnimationFrame)
                -> schedulePendingInteractions()@ReactFiberWorkLoop.js:3046
                  -> scheduleInteractions()@ReactFiberWorkLoop.js:3012
                -> flushSyncCallbackQueue()@SchedulerWithReactIntegration.js:161
                  -> Scheduler_cancelCallback:unstable_cancelCallback()@Scheduler.js:379
                  -> flushSyncCallbackQueueImpl()@SchedulerWithReactIntegration.js:170
                    -> runWithPriority(, fn)@SchedulerWithReactIntegration.js:120
                      -> reactPriorityToSchedulerPriority()@SchedulerWithReactIntegration.js:103
                      -> Scheduler_runWithPriority:unstable_runWithPriority(, fn)@Scheduler.js:217
                        -> eventHandler:fn()@SchedulerWithReactIntegration.js:178
                          -> @ for
                            -> do ...while
                              -> callback:performSyncWorkOnRoot()@ReactFiberWorkLoop.js:997
                                -> prepareFreshStack()@ReactFiberWorkLoop.js:1288
                                  -> createWorkInProgress()@ReactFiber.js:393
                                    -> createFiber()@ReactFiber.js:354
                                -> startWorkOnPendingInteractions()@ReactFiberWorkLoop.js:3057
                                -> startWorkLoopTimer()@ReactDebugFiberPerf.js:356
                                -> do ...while
                                  -> workLoopSync()@ReactFiberWorkLoop.js:1505
                                    -> while
                                      -> performUnitOfWork()@ReactFiberWorkLoop.js:1520
                                        -> startWorkTimer()@ReactDebugFiberPerf.js:266
                                        -> beginWork()@ReactFiberBeginWork.js:2796
                                          -> switch
                                            -> case HostRoot
                                            -> case HostComponent
                                            -> case ClassComponent
                                            -> case HostPortal
                                            -> case ContextProvider
                                            -> case Profiler
                                            -> case SuspenseComponent
                                            -> case SuspenseListComponent
                                          -> switch
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
                                                -> if readContext()@ReactFiberNewContext.js:332
                                                -> if
                                                  -> getUnmaskedContext()@ReactFiberContext.js:45
                                                  -> getMaskedContext()@ReactFiberContext.js:78
                                                    -> cacheContext()@ReactFiberContext.js:64
                                                -> if processUpdateQueue()@ReactUpdateQueue.js:435
                                                  -> ensureWorkInProgressQueueIsAClone()@ReactUpdateQueue.js:345
                                                    -> if cloneUpdateQueue()@ReactUpdateQueue.js:182
                                                  -> while
                                                    -> markRenderEventTimeAndConfig()@ReactFiberWorkLoop.js:1407
                                                    -> getStateFromUpdate()@ReactUpdateQueue.js:360
                                                      -> switch
                                                        -> case ReplaceState
                                                        -> case CaptureUpdate
                                                        -> case UpdateState
                                                        -> case ForceUpdate
                                                -> if applyDerivedStateFromProps(,,getDerivedStateFromProps)@ReactFiberClassComponent.js:143
                                                  -> getDerivedStateFromProps()@ReactFiberClassComponent.js:143
                                                -> if callComponentWillMount()@ReactFiberClassComponent.js:717
                                                  -> startPhaseTimer()@RectDebugFiberPerf.js:326
                                                    -> clearPendingPhaseMeasurement()@ReactDebugFiberPerf.js:183
                                                  -> stopPhaseTimer()@ReactDebugFiberPerf.js:340
                                            -> case HostRoot
                                            -> case HostComponent
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
                                -> finishSyncRender()@ReactFiberWorkLoop.js:1084
                                  -> commitRoot()@ReactFiberWorkLoop.js:1757
                                    -> runWithPriority(, fn)@SchedulerWIthReactIntegration.js:120
                                      -> Scheduler_runWithPriority()@Scheduler.js:217
                                        -> eventHandler:fn:commitRootImpl()@ReactFiberWorkLoop.js:1766
                                          -> startCommitTimer()@ReactDebugFiberPerf.js:400
                                          -> getRemainingExpirationTime()@ReactFiberWorkLoop.js:1683
                                          -> prepareForCommit()@ReactDOMHostConfig.js:191
                                -> ensureRootIsScheduled()@ReactFiberWorkLoop.js:566



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
