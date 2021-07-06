import React from 'react';
import { Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { Block } from '../../elements';

interface Props {
  visible: boolean;
}

const LoadingScreen: React.FC<Props> = ({ visible }) => (
  <Modal animationType="none" visible={visible}>
    <Block color="white" center middle>
      <LottieView
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />
    </Block>
  </Modal>
);

export default LoadingScreen;
