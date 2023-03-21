CHANGELOG
=========


2.0.4
------
2023-03-21

- Maintenance release.
- Uses Emcee 1.2.

Release notes
~~~~~~~~~~~~~
- Deferring upgrade to arcgis/core@4.26.0 due to apparent incompatibilities,
  regressions and/or improper use of API or incorrect implementation [1].


1. Observed bug can be triggered by navigating to a lake detail page and then
   navigating back to the map where the focused map should centered on the map.
   Instead of the expected behavior, tt appears that the attempt to use goTo
   fails and the loading state is not cleared. The following traceback is
   present in the console:

Uncaught (in promise) TypeError: t is null
    _cancellableGoTo MapView.js:5
    _gotoImmediate MapView.js:5
    goTo MapView.js:5
    promise callback*goTo MapView.js:5
    initBounds AolMap.vue:116
    init AolMap.vue:402
    promise callback*init/</< AolMap.vue:376
    promise callback*init/< AolMap.vue:373
    promise callback*init AolMap.vue:370
    mounted AolMap.vue:469
    promise callback*nextTick vue.runtime.esm-bundler.js:1818
    mounted AolMap.vue:467
    createHook vue.runtime.esm-bundler.js:4885
    callWithErrorHandling vue.runtime.esm-bundler.js:1731
    callWithAsyncErrorHandling vue.runtime.esm-bundler.js:1740
    __weh vue.runtime.esm-bundler.js:4859
    flushPostFlushCbs vue.runtime.esm-bundler.js:1917
    flushJobs vue.runtime.esm-bundler.js:1971
    promise callback*queueFlush vue.runtime.esm-bundler.js:1856
    queueJob vue.runtime.esm-bundler.js:1850
    effect vue.runtime.esm-bundler.js:9067
    triggerEffect vue.runtime.esm-bundler.js:760
    triggerEffects vue.runtime.esm-bundler.js:750
    triggerRefValue vue.runtime.esm-bundler.js:1381
    effect vue.runtime.esm-bundler.js:1518
    triggerEffect vue.runtime.esm-bundler.js:760
    triggerEffects vue.runtime.esm-bundler.js:745
    triggerRefValue vue.runtime.esm-bundler.js:1381
    effect vue.runtime.esm-bundler.js:1518
    triggerEffect vue.runtime.esm-bundler.js:760
    triggerEffects vue.runtime.esm-bundler.js:745
    triggerRefValue vue.runtime.esm-bundler.js:1381
    effect vue.runtime.esm-bundler.js:1518
    triggerEffect vue.runtime.esm-bundler.js:760
    triggerEffects vue.runtime.esm-bundler.js:745
    triggerRefValue vue.runtime.esm-bundler.js:1381
    effect vue.runtime.esm-bundler.js:1518
    triggerEffect vue.runtime.esm-bundler.js:760
    triggerEffects vue.runtime.esm-bundler.js:745
    triggerRefValue vue.runtime.esm-bundler.js:1381
    set value vue.runtime.esm-bundler.js:1426
    finalizeNavigation vue-router.mjs:3334
    pushWithRedirect vue-router.mjs:3207
    promise callback*pushWithRedirect vue-router.mjs:3174
    push vue-router.mjs:3099
    navigate vue-router.mjs:2189
    callWithErrorHandling vue.runtime.esm-bundler.js:1731
    callWithAsyncErrorHandling vue.runtime.esm-bundler.js:1740
MapView.js:5
