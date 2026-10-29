# rntl-touch-bubbling-repro-demo

A minimal demo repository for two upstream issues, on [React Native Testing Library](https://github.com/callstack/react-native-testing-library) and [React Native Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler).

On a device, a raw touch event (`touchStart`, `touchMove`, `touchEnd`) reaches every ancestor's `onTouchStart`/`onTouchMove`/`onTouchEnd`, whether or not a view below accepts the touch responder. Under Testing Library 14, `fireEvent(child, 'touchStart')` skips the parent's `onTouchStart` when the nearest responder below it declines (`onStartShouldSetResponder` returns `false`).

Gesture Handler 3's hook gestures bring this out in tests: their Jest stand-in for the detector is a `View` that receives the detector's `onStartShouldSetResponder`, so a raw touch fired under a hook gesture's `GestureDetector` never reaches the ancestors. With a builder-API gesture, no such view is rendered and the touch gets through.

`touchBubbling.test.tsx` fires a `touchStart` on a child and expects the parent's `onTouchStart` to be called, as it is on a device, in four setups.

## Reproduce

```sh
npm ci
npx jest
```

gives 2 passed, 2 failed:

| Test | Result |
|---|---|
| a raw touchStart reaches the parent › when no view declines the responder | passes |
| a raw touchStart reaches the parent › when the child declines the responder | **fails**: 0 calls |
| a raw touchStart under a gesture detector reaches the parent › with a builder-API gesture (`Gesture.Pan()`) | passes |
| a raw touchStart under a gesture detector reaches the parent › with a hook-API gesture (`usePanGesture()`) | **fails**: 0 calls |

## Versions

- @testing-library/react-native 14.1.0
- test-renderer 1.3.1
- react-native-gesture-handler 3.3.0
- react-native 0.88.1
- react 19.3.0
- jest 30.5.2, with `@react-native/jest-preset` and Gesture Handler's `jestSetup.js`
