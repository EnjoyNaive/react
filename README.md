## 数据结构
![alt struct](https://github.com/uploy/react/blob/annotation/16.10.0/images/struct.jpg?raw=true)

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
                  -> Scheduler_scheduleCallback:unstable_scheduleCallback()@Scheduler.js:295
                    -> getCurrentTime()@SchedulerHostConfig.js:27/55/111/114
                    -> requestHostCallback(flushWork)@SchedulerHostConfig.js:58/343
                    -> requestAnimationFrame(onAnimationFrame)
<---@ return
@requestAnimationFrame onAnimationFrame()@SchedulerHostConfig.js:272
  -> setTimeout(performWorkUntilDeadline)
@setTimeout performWorkUntilDeadline()@SchedulerHostConfig.js:208
  -> scheduledHostCallback:flushWork()@Scheduler.js:122
    -> workLoop()@Scheduler.js:164
