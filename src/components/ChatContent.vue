<script>
export default {
  props: {
    storeConversations: {
      type: Object,
      required: true,
    },
    formatText: {
      type: Function,
      required: true,
    },
  },
};
</script>

<template>
  <div
    v-for="(msg, index) in storeConversations"
    :key="index"
    :class="msg.sender === 'me' ? 'text-right' : 'text-left'"
  >
    <div
      v-if="msg.text && !msg.image"
      :class="[
        'inline-block px-4 py-2 my-1 rounded-xl max-w-xs break-words text-sm',
        msg.sender === 'me'
          ? 'bg-gray-800 text-white rounded-br-none text-left ml-auto'
          : 'bg-gray-100 border border-gray-200/50 text-gray-800 rounded-bl-none mr-auto',
      ]"
    >
      <div
        v-if="msg.sender === 'gemini'"
        v-html="formatText(msg.text)"
        class="formatted-content"
      ></div>
      <span v-else>{{ msg.text }}</span>
    </div>
    <div
      v-else
      class="inline-block my-1 rounded-xl max-w-xs break-words text-sm"
    >
      <div
        class="p-0 size-14 border overflow-hidden border-gray-200 rounded-2xl"
      >
        <img
          :src="msg.image"
          alt="image attachment"
          class="rounded-2xl content-center object-cover w-full h-full"
        />
      </div>
      <div
        v-if="msg.text"
        :class="[
          'inline-block px-4 py-2 my-1 rounded-xl max-w-xs break-words text-sm',
          msg.sender === 'me'
            ? 'bg-gray-800 text-white rounded-br-none text-left ml-auto'
            : 'bg-gray-100 border border-gray-200/50 text-gray-800 rounded-bl-none mr-auto',
        ]"
      >
        <div
          v-if="msg.sender === 'gemini'"
          v-html="formatText(msg.text)"
          class="formatted-content"
        ></div>
        <span v-else>{{ msg.text }}</span>
      </div>
    </div>
  </div>
</template>
