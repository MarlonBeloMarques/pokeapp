import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View, Animated } from 'react-native';

import { backgroundColors, styles } from './styles';

interface Props {
  margin?: number | Array<number> | undefined;
  padding?: number | Array<number> | undefined;
  flex?: number | boolean | undefined;
  z?: number | undefined;
  row?: boolean | undefined;
  column?: boolean | undefined;
  center?: boolean | undefined;
  middle?: boolean | undefined;
  left?: boolean | undefined;
  right?: boolean | undefined;
  top?: boolean | undefined;
  bottom?: boolean | undefined;
  width?: number | undefined;
  height?: number | undefined;
  shadow?: boolean | undefined;
  color?: keyof typeof backgroundColors | undefined;
  space?: string | undefined;
  style?: any | undefined;
  border?: boolean | undefined;
  absolute?: boolean | undefined;
  fullBorder?: boolean | undefined;
  children?: any | undefined;
  animated?: boolean | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}

const Block: React.FC<Props> = ({
  margin,
  padding,
  flex,
  z,
  row,
  column,
  center,
  middle,
  left,
  top,
  right,
  bottom,
  width,
  height,
  shadow,
  color,
  space,
  style,
  border,
  absolute,
  fullBorder,
  children,
  animated,
  onLayout,
  ...props
}) => {
  function handleMargins() {
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }

    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }

    return null;
  }

  function handlePaddings() {
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            paddingTop: padding[0],
            paddingRight: padding[0],
            paddingBottom: padding[0],
            paddingLeft: padding[0],
          };
        case 2:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[0],
            paddingLeft: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }

    return null;
  }

  const blockStyles = [
    !style && styles.block,
    width && { width },
    height && { height },
    absolute && { position: 'absolute' },
    z && { zIndex: z },
    border && styles.border,
    fullBorder && styles.fullBorder,
    flex && { flex },
    flex === false && { flex: null },
    row && styles.row,
    column && styles.column,
    center && styles.center,
    middle && styles.middle,
    left && styles.left,
    right && styles.right,
    top && styles.top,
    bottom && styles.bottom,
    margin && { ...handleMargins() },
    padding && { ...handlePaddings() },
    shadow && styles.shadow,
    space && { justifyContent: `space-${space}` },
    color && backgroundColors[color],
    color && !backgroundColors[color] && { backgroundColor: color },
    style,
  ];

  if (animated) {
    return (
      <Animated.View
        {...props}
        style={[absolute === true ? StyleSheet.absoluteFill : null, blockStyles]}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View {...props} style={blockStyles} onLayout={onLayout}>
      {children}
    </View>
  );
};

export default Block;
