import { useToast } from 'vue-toast-notification';

const messageList = new Map([
  // （約束）message_type, key_word
  ['joined', 'player-joined'],
  ['move', 'player-move'],
  ['left', 'player-left'],
  ['action', 'player-action'],
]);

function messageInit(room, messageType, callback) {
  try {
    if (!room) {
      throw Error('cant get the room');
    }
    if (!messageList.get(messageType)) {
      throw Error('cant get the messageType');
    }
    room.onMessage(messageList.get(messageType), (message) => {
      if (typeof callback === 'function') {
        callback(message);
      } else {
        throw Error('callback is not a function');
      }
    });
  } catch (error) {
    useToast().error('JOININIT ERROR! SEE CONSOLE!', {
      duration: 2000,
    });
    console.error(error);
  }
}

export { messageInit };
