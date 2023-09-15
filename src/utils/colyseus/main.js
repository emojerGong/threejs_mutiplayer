import * as Colyseus from 'colyseus.js';
import { useToast } from 'vue-toast-notification';

function init(link = '') {
  if (!link.trim()) {
    return null;
  }

  return new Colyseus.Client(link);
}

async function joinOrCreate(client) {
  try {
    const responce = await client.joinOrCreate('my_room', {
      name: 'Guest',
    }); // set死

    useToast().success('joined', {
      duration: 2000,
    });
    return responce;
  } catch (error) {
    useToast().error('JOIN ERROR! SEE CONSOLE!', {
      duration: 3000,
    });
    console.log('JOIN ERROR', error);
  }
}

async function leave(room) {
  try {
    await room.onLeave((code) => {
      useToast().success('left', {
        duration: 2000,
      });
      console.log('left', room.name);
    });
  } catch (error) {
    useToast().error('LEAVE ERROR! SEE CONSOLE!', {
      duration: 3000,
    });
    console.log('LEAVE ERROR', error);
  }
}

export { init, joinOrCreate, leave };
