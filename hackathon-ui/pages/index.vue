<template>
  <div
    class="bg-gradient-to-r from-pink-500 to-orange-500 min-h-screen flex flex-col justify-center items-center"
  >
    <div class="bg-black rounded-xl p-6 text-white">
      <div class="text-center">
        <h1
          class="text-5xl font-extrabold mb-4 bg-gradient-to-l from-purple-700 to-cyan-400 inline-block text-transparent bg-clip-text"
        >
          FrEAKyVoICe.io
        </h1>
      </div>
      <p class="text-xl">
        Fill in the form to generate some sick voicelines by your favourite
        famous person/character
      </p>
      <form class="mt-4" @submit.prevent="onFetchAudio">
        <label class="block mb-2 font-bold">Voice</label>

        <select
          v-model="selectedModel"
          class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        >
          <option :value="null" disabled selected>Select a voice</option>
          <option
            v-for="(model, index) in voiceModels"
            :key="index"
            :value="model"
          >
            {{ model.title }}
          </option>
        </select>

        <div v-if="voiceRating">Voice rating: {{ voiceRating }}/10</div>

        <label class="block mb-2 font-bold" for="name"> Name </label>
        <input
          class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Write some text"
          v-model="textToVoice"
        />
        <button
          class="px-4 py-2 font-bold text-white bg-cyan-500 rounded hover:bg-pink-500 focus:outline-none focus:shadow-outline-blue cursor-pointer"
          type="submit"
          :disabled="!isValidForm"
        >
          Submit
        </button>
      </form>

      <div v-if="!isValidForm" class="mt-2 font-bold text-red-600">
        Form has errors
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VoiceModel } from "~/models/VoiceModel";
import type { TTSRequest } from "~/models/request/TTSRequest";

const voiceModels = ref<VoiceModel[]>([]);
const selectedModel = ref<VoiceModel | null>(null);
const textToVoice = ref<string>("");

const request = ref<TTSRequest | null>(null);

const isValidForm = computed(
  () =>
    !!selectedModel.value &&
    textToVoice.value.length > 10 &&
    textToVoice.value.length < 100
);

const voiceRating = computed<number | null>(() => {
  if (!selectedModel.value) return null;

  const userRatings = selectedModel.value.user_ratings;
  return userRatings
    ? (userRatings.total_count - userRatings.negative_count) % 10
    : null;
});

// function onSubmit(): void {
//   if (!isValidForm) return;

//   // TODO: send text and voice model to API and save uuid
//   const request: TTSRequest = {
//     tts_model_token: selectedModel.value!.model_token,
//     uuid_idempotency_token: uuidGenerator(),
//     inference_text: textToVoice.value,
//   };
//   alert("Submitted!");
// }

let is_running = false;
const audio_path = ref<string>("");
let poller: any = null;
async function onFetchAudio() {
  if (!isValidForm) return;
  if (is_running) {
    return;
  }
  is_running = true;

  request.value = {
    tts_model_token: selectedModel.value!.model_token,
    uuid_idempotency_token: uuidGenerator(),
    inference_text: textToVoice.value,
  };
  poller = setInterval(() => poller_func(request.value!.tts_model_token), 3000);
}

async function poller_func(token: string) {
  await fetch(`/api/voicy_poll?token=${token}`).then(async (response) => {
    var result = await response.json();
    if (result.success === "true") {
      clearInterval(poller);
      audio_path.value = result.path;
    }
  });
}

const { data } = await useFetch("/api/voices");
voiceModels.value = data.value!;
</script>
