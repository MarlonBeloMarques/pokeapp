import { MessageType, showMessage } from 'react-native-flash-message';

const showMessageToast = (message: string, type: MessageType) =>
  showMessage({
    message,
    type,
  });

export default showMessageToast;
