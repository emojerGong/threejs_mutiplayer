<template>
  <div
    id="colyseus-container"
    class="absolute left-0 top-0 w-80 font-mono text-white flex flex-col bg-gray-500/50"
  >
    <div class="w-full p-2 flex justify-between items-center">
      <input
        placeholder="Colyseus_link"
        :disabled="shouldConnetRoom"
        ref="inputValue"
        type="text"
        class="bg-transparent border-white border-2 rounded-xl px-2 focus:border-0 outline-none focus:pl-3 focus:border-transparent disabled:cursor-not-allowed"
      />
      <button
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
import { init, joinOrCreate } from '@/utils/colyseus/main';
import StatusDisplay from './StatusDisplay.vue';

const buttonInfo = ['Connet', 'ing...', 'Conneted'];
const buttonInfoNum = ref(0);

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
    isBtnDisabled.value = true;
    buttonInfoNum.value = 1;
    client = init(inputValue.value.value.trim());

    connetHandler(client);
  }
}
</script>
<script>
export default {
  name: 'ColyseusMain',
};
</script>
