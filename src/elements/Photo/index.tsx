import * as React from 'react';
import { Image, Animated, LayoutChangeEvent, ImageURISource } from 'react-native';
import { styles } from './styles';

interface Props {
  width?: number;
  height?: number;
  style?: any | undefined;
  avatar?: boolean | undefined;
  animated?: boolean | undefined;
  absolute?: boolean | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  reference?: any | undefined;
  source: string | ImageURISource;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center' | undefined;
}

const Photo: React.FC<Props> = ({
  width,
  height,
  style,
  avatar,
  animated,
  absolute,
  onLayout,
  reference,
  source,
  resizeMode,
}) => {
  const blockStyles = [
    absolute && { position: 'absolute' },
    width && height && { width, height },
    avatar && styles.avatar,
    style,
  ];

  if (animated) {
    return (
      <Animated.Image
        style={blockStyles}
        ref={reference}
        source={typeof source === 'string' ? { uri: source } : source}
        onLayout={onLayout}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <Image
      style={blockStyles}
      ref={reference}
      source={typeof source === 'string' ? { uri: source } : source}
      onLayout={onLayout}
      resizeMode={resizeMode}
    />
  );
};

export default Photo;
