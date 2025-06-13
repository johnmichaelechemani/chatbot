<script>
export default {
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      class="text-red-500 border rounded-full bg-red-100/50 border-red-200 py-2 px-4 my-2 text-sm text-center"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
