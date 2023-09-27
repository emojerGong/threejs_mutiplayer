<template>
  <div
    id="colyseus-container"
    class="absolute left-0 bottom-0 w-80 font-mono text-white flex flex-col bg-gray-500/50 lg:bottom-auto lg:top-0"
  >
    <div class="w-full p-2 flex justify-between items-center">
      <input
        :placeholder="placeholderInfo"
        :disabled="shouldConnetRoom"
        ref="inputValue"
        type="text"
        class="bg-transparent border-white border-2 rounded-xl px-2 focus:border-0 outline-none focus:pl-3 focus:border-transparent disabled:cursor-not-allowed"
      />
      <button
        ref="buttonRef"
        :disabled="shouldConnetRoom"
        @click="buttonHandler"
        class="font-bold px-4 py-2 w-28 inline-flex justify-center items-center rounded-xl hover:bg-gray-500/40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        {{ buttonInfo[buttonInfoNum] }}
      </button>
    </div>
    <StatusDisplay ref="statusRef" />
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';
import { onMounted } from 'vue';
import { init, joinOrCreate } from '@/utils/colyseus/main';
import StatusDisplay from './StatusDisplay.vue';
import { useToast } from 'vue-toast-notification';

let defaultLink = '';
const env_d = import.meta.env;
if (env_d?.VITE_WB_SERVER_URL) {
  defaultLink = env_d.VITE_WB_SERVER_URL + ':' + env_d.VITE_WB_SERVER_PORT;
}
const placeholderInfo = defaultLink ? defaultLink : 'Colyseus_link';

const buttonInfo = ['Connet', 'ing...', 'Conneted'];
const buttonInfoNum = ref(0);

const buttonRef = ref(); // 測試用
const statusRef = ref();
const inputValue = ref();
const emits = defineEmits();

let client;
const room = ref(null);
const isBtnDisabled = ref(false);
const shouldConnetRoom = computed(() => {
  return !(!isBtnDisabled.value && !room.value);
});

async function connetHandler(client) {
  room.value = await joinOrCreate(client);
  if (room.value) {
    emits('room-updated', room.value);
    buttonInfoNum.value = 2;
  } else {
    buttonInfoNum.value = 0;
  }
  isBtnDisabled.value = false;
}

function buttonHandler() {
  if (!isBtnDisabled.value) {
    const value = inputValue.value.value.trim();
    if (value) {
      isBtnDisabled.value = true;
      buttonInfoNum.value = 1;
      client = init(value);
      connetHandler(client);
    } else {
      if (defaultLink.trim()) {
        client = init(defaultLink);
        connetHandler(client);
      } else {
        useToast().info('COLYSEUS LINK NULL! ', {
          duration: 2000,
        });
      }
    }
  }
}

// mounted 測試用
// onMounted(() => {
//   buttonRef.value.click();
// });
</script>
<script>
export default {
  name: 'ColyseusMain',
};
</script>
