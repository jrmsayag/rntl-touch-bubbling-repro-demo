import {fireEvent, render, screen} from '@testing-library/react-native';
import {View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';

// On a device, a raw touch event reaches every ancestor's onTouchStart, whether or not a view
// below accepts the touch responder. Each test expects that.

describe('a raw touchStart reaches the parent', () => {
  it('when no view declines the responder', async () => {
    const onTouchStart = jest.fn();
    await render(
      <View onTouchStart={onTouchStart}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart');

    expect(onTouchStart).toHaveBeenCalledTimes(1); // passes
  });

  it('when the child declines the responder', async () => {
    const onTouchStart = jest.fn();
    await render(
      <View onTouchStart={onTouchStart}>
        <View testID="child" onStartShouldSetResponder={() => false} />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart');

    expect(onTouchStart).toHaveBeenCalledTimes(1); // fails: 0 calls
  });
});

describe('a raw touchStart under a gesture detector reaches the parent', () => {
  it('with a builder-API gesture (Gesture.Pan())', async () => {
    const onTouchStart = jest.fn();
    const gesture = Gesture.Pan();
    await render(
      <GestureHandlerRootView>
        <View onTouchStart={onTouchStart}>
          <GestureDetector gesture={gesture}>
            <View testID="child" />
          </GestureDetector>
        </View>
      </GestureHandlerRootView>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart');

    expect(onTouchStart).toHaveBeenCalledTimes(1); // passes
  });

  it('with a hook-API gesture (usePanGesture())', async () => {
    const onTouchStart = jest.fn();
    function Pannable() {
      const gesture = usePanGesture({});
      return (
        <GestureDetector gesture={gesture}>
          <View testID="child" />
        </GestureDetector>
      );
    }
    await render(
      <GestureHandlerRootView>
        <View onTouchStart={onTouchStart}>
          <Pannable />
        </View>
      </GestureHandlerRootView>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart');

    expect(onTouchStart).toHaveBeenCalledTimes(1); // fails: 0 calls
  });
});
