<script setup>
import { onMounted, ref } from "vue";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const message = ref("");

const storeUserMessagesInLocalStorage = ref([]);

const getMessage = async () => {
  // if (!message.value) {
  //   console.error("Message is empty.");
  //   return;
  //}
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
              content: [
                {
                  type: "text",
                  text: message.value || "Hello, Gemini!",
                },
                // {
                //   type: "image_url",
                //   image_url: {
                //     url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                //   },
                // },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("API Response:", data.choices[0].message.content);
    const responseMessage = data.choices[0].message.content;
    storeUserMessagesInLocalStorage.value.push(
      {
        sender: "gemini",
        text: responseMessage,
      },
      {
        sender: "me",
        text: message.value,
      }
      );
  } catch (error) {
    console.error("Error fetching from OpenRouter:", error);
  }
};

onMounted(() => {
  getMessage();
});
</script>

<template>
  <div class="flex justify-center items-center">
    <div>
      <div class="text-red-500 text-7xl text-center">Gemini 2 Flash</div>
      <div class="my-10">
        <div class="flex-1 overflow-y-auto space-y-4 p-2 bg-gray-50 rounded-lg">
          <div
            v-for="(msg, index) in storeUserMessagesInLocalStorage"
            :key="index"
            :class="msg.sender === 'me' ? 'text-right' : 'text-left'"
          >
            <div
              :class="[
                'inline-block px-4 py-2 rounded-xl max-w-xs break-words',
                msg.sender === 'me'
                  ? 'bg-blue-500 text-white rounded-br-none ml-auto'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none mr-auto',
              ]"
            >
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>
      <div class="my-10">
        <form action="" @submit.prevent="getMessage">
          <input
            v-model="message"
            type="text"
            class="border-2 border-gray-300 rounded p-2 w-full max-w-md mx-auto"
            placeholder="Type your message here..."
          />
          <button
            @click="getMessage"
            type="submit"
            class="bg-blue-500 text-white rounded p-2 mt-2 w-full max-w-md mx-auto"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
