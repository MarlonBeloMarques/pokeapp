import * as React from 'react';
import { Text } from 'react-native';
import { colors, styles } from './styles';

interface Props {
  h1?: boolean | undefined;
  h2?: boolean | undefined;
  h3?: boolean | undefined;
  title?: boolean | undefined;
  body?: boolean | undefined;
  caption?: boolean | undefined;
  size?: number | undefined;
  align?: string | undefined;
  // styles
  stylized?: boolean | undefined;
  regular?: boolean | undefined;
  bold?: boolean | undefined;
  medium?: boolean | undefined;
  weight?: string | undefined;
  light?: boolean | undefined;
  center?: boolean | undefined;
  right?: boolean | undefined;
  spacing?: number | undefined; // letter-spacing
  height?: number | undefined; // line-height
  // colors
  color?: keyof typeof colors;
  black?: boolean | undefined;
  gray?: boolean | undefined;
  white?: boolean | undefined;
  primary?: boolean | undefined;
  secondary?: boolean | undefined;
  apple?: boolean | undefined;
  google?: boolean | undefined;
  guest?: boolean | undefined;
  style?: any | undefined;
  children?: any | undefined;
}

const Typography: React.FC<Props> = ({
  h1,
  h2,
  h3,
  title,
  body,
  caption,
  size,
  align,
  stylized,
  regular,
  bold,
  medium,
  weight,
  light,
  center,
  right,
  spacing,
  height,
  color,
  black,
  gray,
  white,
  primary,
  secondary,
  google,
  guest,
  apple,
  style,
  children,
}) => {
  const textStyles = [
    styles.text,
    h1 && styles.h1,
    h2 && styles.h2,
    h3 && styles.h3,
    title && styles.title,
    body && styles.body,
    caption && styles.caption,
    size && { fontSize: size },
    align && { textAlign: align },
    height && { lineHeight: height },
    spacing && { letterSpacing: spacing },
    weight && { fontWeight: weight },
    stylized && styles.stylized,
    regular && styles.regular,
    bold && styles.bold,
    medium && styles.medium,
    light && styles.light,
    center && styles.center,
    right && styles.right,
    color && colors[color],
    color && !colors[color] && { color },
    // color shortcuts
    black && colors.black,
    gray && colors.gray,
    white && colors.white,
    primary && colors.primary,
    secondary && colors.secondary,
    apple && colors.apple,
    guest && colors.guest,
    google && colors.google,
    style,
  ];

  return <Text style={textStyles}>{children}</Text>;
};

export default Typography;
