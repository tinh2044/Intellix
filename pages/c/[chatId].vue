<template>
  <div class="h-screen">
    <ChatWindow :id="chatId" />
  </div>
</template>
 
<script setup lang="ts">
// Get chat ID from route params
const route = useRoute()
const chatId = computed(() => route.params.chatId as string)
</script> 