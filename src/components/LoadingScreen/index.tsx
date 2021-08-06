import * as React from 'react';
import { Appearance, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { Block } from '../../elements';
import styles from './styles';
import Title from '../Title';

interface Props {
  visible: boolean;
}

const LoadingScreen: React.FC<Props> = ({ visible }) => {
  const colorScheme = Appearance.getColorScheme();

  return (
    <Modal animationType="none" visible={visible}>
      <Block color={colorScheme === 'dark' ? 'black' : 'white'} middle center>
        <Block middle style={styles.wrapperLoading}>
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 180, height: 180 }}
          />
        </Block>
      </Block>
      <Block absolute style={styles.titleBottom}>
        <Title />
      </Block>
    </Modal>
  );
};

export default LoadingScreen;
