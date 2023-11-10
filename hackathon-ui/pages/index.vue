<template>
  <div
    class="bg-gray-100 min-h-screen flex flex-col justify-center items-center"
  >
    <h1 class="text-4xl font-bold mb-4">FrEAKyVoICe.io</h1>
    <p class="text-lg">
      Fill in the form to generate some sick voicelines by your favourite famous
      person/character
    </p>
    <form class="mt-4" @submit.prevent="onSubmit">
      <label class="block mb-2 font-bold text-gray-700">Voice</label>

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

      <label class="block mb-2 font-bold text-gray-700" for="name">
        Name
      </label>
      <input
        class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="name"
        type="text"
        placeholder="Write some text"
        v-model="textToVoice"
      />
      <button
        class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        type="submit"
        :disabled="!isValidForm"
      >
        Submit
      </button>
    </form>

    <div v-if="!isValidForm">Form has errors</div>
  </div>
</template>

<script setup lang="ts">
import type { VoiceModel } from "~/models/VoiceModel";
import type { TTSRequest } from "~/models/TTSRequest";

const voiceModels = ref<VoiceModel[]>([]);
const selectedModel = ref<VoiceModel | null>(null);
const textToVoice = ref<string>("");

onBeforeMount(async () => {
  const { data } = await useFetch("/api/voices");
  voiceModels.value = data.value!.voiceModels;
});

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

function onSubmit(): void {
  if (!isValidForm) return;

  // TODO: send text and voice model to API and save uuid
  const request: TTSRequest = {
    tts_model_token: selectedModel.value!.model_token,
    uuid_idempotency_token: uuidGenerator(),
    inference_text: textToVoice.value,
  };
  alert("Submitted!");
}
</script>
