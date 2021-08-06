import * as React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

import { theme } from '../../constants';
import { backgroundColors, styles } from './styles';

interface Props {
  style?: any | undefined;
  opacity?: number | undefined;
  color?: keyof typeof backgroundColors;
  shadow?: boolean | undefined;
  children?: any;
  radius?: number | undefined;
  disableRadiusDefault?: boolean | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined | undefined;
}

const Button: React.FC<Props> = ({
  style,
  opacity,
  color,
  shadow,
  children,
  radius,
  disableRadiusDefault,
  onPress,
}) => {
  const buttonStyles = [
    disableRadiusDefault ? { borderRadius: radius } : { borderRadius: theme.sizes.radius },
    !style && styles.button,
    shadow && styles.shadow,
    color && backgroundColors[color],
    color && !backgroundColors[color] && { backgroundColor: color },
    style,
  ];

  return (
    <TouchableOpacity style={buttonStyles} activeOpacity={opacity || 0.8} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

Button.defaultProps = {
  opacity: 0.8,
  color: 'white',
};
