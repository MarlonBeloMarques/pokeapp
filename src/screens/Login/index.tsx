import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { theme } from '../../constants';
import { Block, Button, Photo, Text } from '../../elements';

const Login: React.FC = () => (
  <Block color="black" padding={theme.sizes.padding}>
    <Block flex={false} padding={[theme.sizes.padding * 2, 0]}>
      <Text h1 stylized>
        PokeApp
      </Text>
    </Block>
    <Block middle center>
      <Photo
        source="https://pokeres.bastionbot.org/images/pokemon/1.png"
        width={180}
        height={180}
      />
    </Block>
    <Button color="apple">
      <Block row center space="evenly">
        <Icon name="apple1" color={theme.colors.white} size={22} />
        <Text center bold>
          Sign in with Apple
        </Text>
      </Block>
    </Button>
    <Button color="google">
      <Block row center space="evenly">
        <Icon name="google" color={theme.colors.gray} size={22} />
        <Text center gray bold>
          Sign in with Google
        </Text>
      </Block>
    </Button>
    <Button color="facebook">
      <Block row center space="evenly">
        <Icon name="facebook-square" color={theme.colors.white} size={22} />
        <Text center bold>
          Sign in with Facebook
        </Text>
      </Block>
    </Button>
  </Block>
);

export default Login;
