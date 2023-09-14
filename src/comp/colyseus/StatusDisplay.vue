<template>
  <div ref="statusRef" class="w-full max-h-10 overflow-y-auto"></div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const statusRef = ref();

defineExpose({
  dom: ref,
});
</script>
