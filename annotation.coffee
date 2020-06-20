type ReactSyncRoot
  _internalRoot: FiberRootNode

type FiberRootNode
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

type FiberNode
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
type Update
  expirationTime,
  suspenseConfig,
  tag,
  payload,
  callback,
  next,
  nextEffect
  // __DEV__
  priority

type task
  id,
  callback,
  priorityLevel,
  startTime,
  expirationTime,
  sortIndex

ReactDOM.render()@ReactDOM.js
  legacyRenderSubtreeIntoContainer()@ReactDOM.js
    legacyCreateRootFromDOMContainer()@ReactDOM.js
      shouldHydrateDueToLegacyHeuristic()@ReactDOM.js
        getReactRootElementInContainer()@ReactDOM.js
      new ReactSyncRoot()@ReactDOM.js
        createRootImpl()@ReactDOM.js
          createContainer()@ReactFiberReconciler.js
            createFiberRoot()@ReactFiberRoot.js
              new FiberRootNode()@ReactFiberRoot.js
              createHostRootFiber()@ReactFiber.js
                createFiber()@ReactFiber.js
                  new FiberNode()@ReactFiber.js
          markContainerAsRoot()@ReactDOM.js
    unbatchedUpdates(fn)@ReactFiberWorkLoop.js
      fn()@ReactDOM.js
        updateContainer()@ReactFiberReconciler.js
          requestCurrentTime()@ReactFiberWorkLoop.js
          requestCurrentSuspenseConfig()@ReactFiberSuspenseConfig.js
          computeExpirationForFiber()@ReactFiberWorkLoop.js
          updateContainerAtExpirationTime()ReactFiberReconciler.js
            getContextForSubtree()@ReactFiberReconciler.js
              getInstance:get()@ReactInstanceMap.js
              findCurrentUnmaskedContext()@ReactFiberContext.js
            scheduleRootUpdate()@ReactFiberReconciler.js
              createUpdate()@ReactUpdateQueue.js
              enqueueUpdate()@ReactUpdateQueue.js
              scheduleWork:scheduleUpdateOnFiber()@ReactFiberWorkLoop.js
                checkForNestedUpdates()@ReactFiberWorkLoop.js
                warnAboutInvalidUpdatesOnClassComponentsInDEV()@ReactFiberWorkLoop.js
                markUpdateTimeFormFiberToRoot()@ReactFiberWorkLoop.js
                checkForInterruption()@ReactFiberWorkLoop.js
                recordScheduleUpdate()@ReactDebugFiberPerf.js
                getCurrentPriorityLevel()@SchedulerWithReactIntegration.js
                  Scheduler_getCurrentPriorityLevel:unstable_getCurrentPriorityLevel()@Scheduler.js
                ensureRootIsScheduled()@ReactFiberWorkLoop.js
                  getNextRootExpirationTimeTOWorkOn()@ReactFiberWorkLoop.js
                  requestCurrentTime()@ReactFiberWorkLoop.js
                  inferPriorityFromExpirationTime()@ReactFiberExpirationTime.js
                  scheduleSyncCallback(performSyncWorkOnRoot)@SchedulerWithReactIntegration.js
                    Scheduler_scheduleCallback:unstable_scheduleCallback(,callback:flushSyncCallbackQueueImpl,)@Scheduler.js
                      getCurrentTime()@SchedulerHostConfig.js
                      requestHostCallback(flushWork)@SchedulerHostConfig.js
                        requestAnimationFrame(onAnimationFrame)
                schedulePendingInteractions()@ReactFiberWorkLoop.js
                  scheduleInteractions()@ReactFiberWorkLoop.js
                flushSyncCallbackQueue()@SchedulerWithReactIntegration.js
                  Scheduler_cancelCallback:unstable_cancelCallback()@Scheduler.js
                  flushSyncCallbackQueueImpl()@SchedulerWithReactIntegration.js
                    runWithPriority(, fn)@SchedulerWithReactIntegration.js
                      reactPriorityToSchedulerPriority()@SchedulerWithReactIntegration.js
                        Scheduler_runWithPriority:unstable_runWithPriority(, fn)@Scheduler.js
                          eventHandler:fn()@SchedulerWithReactIntegration.js
                            # for @SchedulerWithReactIntegration.js
                              # do ...while #SchedulerWithIntegration.js
                                callback:performSyncWorkOnRoot()@ReactFiberWorkLoop.js
                                  prepareFreshStack()@ReactFiberWorkLoop.js
                                    createWorkInProgress()@ReactFiber.js
                                      createFiber()@ReactFiber.js
                                  startWorkOnPendingInteractions()@ReactFiberWorkLoop.js
                                  startWorkLoopTimer()@ReactDebugFiberPerf.js
                                  #do ...while @ReactFiberWorkLoop.js
                                    workLoopSync()@ReactFiberWorkLoop.js
                                      #while @ReactFiberWorkLoop.js
                                        performUnitOfWork()@ReactFiberWorkLoop.js
                                          startWorkTimer()@ReactDebugFiberPerf.js
                                          beginWork()@ReactFiberBeginWork.js
                                            #switch @ReactFiberBeginWork.js
                                              case HostRoot
                                              case HostComponent
                                              case ClassComponent
                                              case HostPortal
                                              case ContextProvider
                                              case Profiler
                                              case SuspenseComponent
                                              case SuspenseListComponent
                                            #switch @ReactFiberBeginWork.js
                                              case IndeterminateComponent
                                              case LazyComponent
                                              case FunctionComponent
                                              case ClassComponent
                                                updateClassComponent()@ReactFiberBeginWork.js
                                                  isLegacyContextProvider()@ReactFiberContext.js
                                                  prepareToReadContext()@ReactFiberBeginWork.js
                                                  constructClassInstance()@ReactFiberClassComponent.js
                                                    adoptClassInstance()@ReactFiberClassComponent.js
                                                  mountClassInstance()@ReactFiberClassComponent.js
                                                  finishClassComponent()@ReactFiberBeginWork.js
                                                    instance.render()
                                                    forUnmountCurrentAndReconcile()@ReactFiberBeginWork.js
                                                      reconcileChildFibers()@ReactChildFiber.js
                                                        reconcilerSingleElement()@ReactChildFiber.js
                                                          #while @ReactChildFiber.js
                                                            useFiber()@ReactChildFiber.js
                                                              createWorkInProgress()@ReactFiber.js
                                                                createFiber()@ReactFiber.js
                                                                  new FiberNode()@ReactFiber.js
                                                          createFiberFromElement()@ReactFiber.js
                                                            createFiberFromTypeAndProps()@ReactFiber.js
                                                              createFiber()@ReactFiber.js
                                                                new FiberNode()@ReactFiber.js
                                                        placeSingleElement()@ReactChildFiber.js
                                              case HostRoot
                                              case HostComponent
                                                updateHostComponent()@ReactFiberBeginWork.js
                                                  reconcileChildren()@ReactFiberBeginWork.js
                                                    #if mountChildFibers()@ReactChildFiber.js
                                                    #else reconcileChildFibers()@ReactChildFiber.js
                                              case HostText
                                              case SuspenseComponent
                                              case HostPortal
                                              case ForwardRef
                                              case Fragment
                                              case Mode
                                              case Profiler
                                              case ContextProvider
                                              case ContextConsumer
                                              case MemoComponent
                                              case SimpleMemoComponent
                                              case IncompleteClassComponent
                                              case SuspenseListComponent
                                              case FundamentalComponent
                                              case ScopeComponent
                                  resetContextDependencies()@ReactFiberNewContext.js
                                  popDispatcher()@ReactFiberWorkLoop.js
                                  resolveLocksOnRoot()@ReactFiberWorkLoop.js
                                  finishSyncRender()@ReactFiberWorkLoop.js
                                    commitRoot()@ReactFiberWorkLoop.js
                                      runWithPriority(, fn)@SchedulerWIthReactIntegration.js
                                        Scheduler_runWithPriority()@Scheduler.js
                                          eventHandler:fn:commitRootImpl()@ReactFiberWorkLoop.js
                                            startCommitTimer()@ReactDebugFiberPerf.js
                                            getRemainingExpirationTime()@ReactFiberWorkLoop.js
                                            prepareForCommit()@ReactDOMHostConfig.js
                                  ensureRootIsScheduled()@ReactFiberWorkLoop.js
