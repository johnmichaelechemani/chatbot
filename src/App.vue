<script setup>
import { onMounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import ErrorMessage from "./components/ErrorMessage.vue";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const message = ref("Hello, Gemini!");
const imageURL = ref("");
const fileInput = ref(null);

const isLoading = ref(false);
const storeConversations = ref([]);
const typingMessage = ref("");
const textarea = ref(null);
const errorMessage = ref("");

const autoResize = () => {
  const el = textarea.value;
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
};

const content = [
  {
    type: "text",
    text: message.value,
  },
];

if (imageURL.value) {
  content.push({
    type: "image_url",
    image_url: {
      url: imageURL.value,
    },
  });
}

const getMessage = async () => {
  if (!message.value.trim()) return;

  storeConversations.value.push({
    sender: "me",
    text: message.value,
    image: imageURL.value,
  });
  message.value = "";
  isLoading.value = true;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("No response from model");
    }

    const responseMessage = data.choices[0].message.content;
    typingMessage.value = "";

    let i = 0;
    const typeNextChar = () => {
      if (i < responseMessage.length) {
        typingMessage.value += responseMessage[i];
        i++;
        setTimeout(typeNextChar, 15);
      } else {
        storeConversations.value.push({
          sender: "gemini",
          text: typingMessage.value,
        });
        typingMessage.value = "";
      }
    };

    typeNextChar();
  } catch (error) {
    errorMessage.value = `Error:  ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const triggerImageInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageURL.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  imageURL.value = "";
};

onMounted(() => {
  getMessage();
  autoResize;
});
watch(message, autoResize);
</script>

<template>
  <div class="flex justify-center items-center">
    <div>
      <div class="flex justify-center items-center">
        <div
          class="text-gray-800 font-semibold border rounded-full border-gray-200 py-2 px-4 mt-10 text-sm text-center"
        >
          John Michael D. Echemani
        </div>
      </div>
      <ErrorMessage v-if="errorMessage" :errorMessage="errorMessage" />
      <div class="my-10 w-screen">
        <div class="md:px-20 flex justify-center items-center">
          <div class="flex flex-col w-full max-w-4xl">
            <div class="text-gray-800 text-xs mb-1.5 font-semibold">
              <span class="border p-1 rounded-r-full border-gray-200 italic"
                >Model: Gemini 2.0 Flash</span
              >
            </div>
            <div class="max-h-[60vh] overflow-y-auto">
              <div
                class="flex-1 px-2 py-6 bg-gray-50/20 border-x border-gray-200"
              >
                <div
                  v-for="(msg, index) in storeConversations"
                  :key="index"
                  :class="msg.sender === 'me' ? 'text-right' : 'text-left'"
                >
                  <div
                    :class="[
                      'inline-block px-4 py-2 my-1 rounded-xl max-w-xs break-words text-sm',
                      msg.sender === 'me'
                        ? 'bg-gray-800 text-white rounded-br-none text-left ml-auto'
                        : 'bg-gray-100 border border-gray-200/50 text-gray-800 rounded-bl-none mr-auto',
                    ]"
                  >
                    {{ msg.text }}
                  </div>
                </div>
                <div v-if="typingMessage" class="text-left">
                  <div
                    class="inline-block px-4 py-2 my-1 rounded-xl max-w-xs break-words text-sm bg-gray-100 border border-gray-200/50 text-gray-800 rounded-bl-none"
                  >
                    {{ typingMessage }}
                    <span class="animate-pulse">|</span>
                  </div>
                </div>

                <div v-if="isLoading" class="w-full flex">
                  <span class="border px-1 rounded-full border-gray-200">
                    <Icon
                      icon="eos-icons:three-dots-loading"
                      width="20"
                      height="20"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-5 md:px-20 flex justify-center items-center">
          <form
            action=""
            @submit.prevent="getMessage"
            class="border w-4xl rounded-4xl border-gray-200"
          >
            <div
              v-if="imageURL"
              class="m-4 size-18 border border-gray-200 rounded-2xl relative"
            >
              <button
                type="button"
                @click="removeImage"
                class="absolute top-1 right-1 bg-white border border-gray-200 rounded-full"
              >
                <Icon icon="ic:round-close" width="18" height="18" />
              </button>
              <img :src="imageURL" alt="image attachment" class="rounded-2xl" />
            </div>
            <div class="mt-4 mx-4 flex justify-center gap-2 items-center">
              <textarea
                v-model="message"
                name="message"
                type="text"
                ref="textarea"
                @keydown.enter.exact.prevent="getMessage"
                @input="autoResize"
                class="rounded w-full placeholder:text-sm resize-none outline-none text-sm"
                placeholder="Ask me something..."
              />
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-500 p-4">
                <div
                  class="border border-gray-200 py-1 px-2 rounded-xl lg:rounded-full"
                >
                  This model can't remember past conversations, so each time you
                  ask a question, it will be treated as a new conversation.
                </div>
              </div>
              <div class="flex justify-end items-center px-2 pb-2 gap-1">
                <button
                  type="button"
                  @click="triggerImageInput"
                  class="p-1 hover:transition-colors hover:bg-gray-800 hover:text-white rounded-full duration-200 bg-white text-gray-700"
                >
                  <Icon
                    icon="stash:image-arrow-up-duotone"
                    width="30"
                    height="30"
                  />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref="fileInput"
                  class="hidden"
                  @change="handleImageUpload"
                />
                <button
                  type="submit"
                  :class="[
                    'rounded-full border p-1 transition-colors duration-200',
                    message.trim() || imageURL
                      ? 'bg-gray-800 text-white border-black'
                      : 'bg-white text-gray-800 border-gray-200',
                  ]"
                  :disabled="!message.trim() && !imageURL"
                  class="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="lets-icons:send-duotone" width="30" height="30" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1s steps(2, start) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
