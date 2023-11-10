<template>
  <audio ref="audioRef" src="elevator-mood.mp3"></audio>
  <audio ref="voiceRef" :src="voiceSrc"></audio>
  <div
    class="bg-gradient-to-r from-pink-500 to-orange-500 min-h-screen flex flex-col justify-center items-center"
  >
    <div class="bg-black rounded-xl p-6 text-white" id="form-content">
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
      <form class="mt-4" @submit.prevent="">
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
          @click.prevent="getJokes()"
        >
          Submit
        </button>
      </form>

      <div v-if="!isValidForm" class="mt-2 font-bold text-red-600">
        Form has errors
      </div>
    </div>
  </div>
  <div>
  </div>
</template>

<script setup lang="ts">
import type { VoiceModel } from "~/models/VoiceModel";
import type { TTSRequest } from "~/models/request/TTSRequest";

const voiceModels = ref<VoiceModel[]>([]);
const selectedModel = ref<VoiceModel | null>(null);
const textToVoice = ref<string>("");

const request = ref<TTSRequest | null>(null);

const voiceRef= ref<any>(null);
const voiceSrc = ref<any>(null);

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
  getJokes();
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
import { ref, onMounted } from 'vue';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true
});

const models = ref<any[]>([]);
const audioRef = ref<any>(null);

const jokes = ref<string[] | undefined>([]);

const { data } = await useFetch("/api/voices");
voiceModels.value = data.value!;

async function getJokes() {
  const jokeDivs: HTMLElement[] = [];
  if (!jokes.value) return;
  
  audioRef.value.play();

  for (const joke of jokes.value) {
    const div = document.createElement("div");
    div.innerText = joke;
    div.classList.add("bg-purple-500", "text-white", "font-bold", "rounded", "absolute", "p-4", "max-w-md", "joke");
    div.classList.add("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
    div.style.opacity = "0";
    div.style.transition = "opacity 0.8s ease-in-out";
    jokeDivs.push(div);
  }

  jokeDivs.forEach(div => {
    document.body.appendChild(div);
  });

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const formElement = document.getElementById('form-content'); // Get the form element
  const formRect = formElement!.getBoundingClientRect(); // Get the bounding rectangle of the form
  let opacityDelay = 800;

  jokeDivs.forEach(el => {
    if (el instanceof HTMLElement) {
      let randomX: number, randomY: number, overlap;
      do {
        overlap = false;
        // Calculate random positions
        randomX = Math.floor(Math.random() * (viewportWidth - el.offsetWidth));
        randomY = Math.floor(Math.random() * (viewportHeight - el.offsetHeight));
        const elRect = { left: randomX, top: randomY, right: randomX + el.offsetWidth, bottom: randomY + el.offsetHeight };

        // Check for overlap with other elements
        jokeDivs.forEach(otherEl => {
          if (el !== otherEl && otherEl instanceof HTMLElement) {
            const otherRect = otherEl.getBoundingClientRect();
            if (isOverlapping(elRect, otherRect)) {
              overlap = true;
            }
          }
        });

        // Check for overlap with form div
        if (isOverlapping(elRect, formRect)) {
          overlap = true;
        }
      } while (overlap);

      el.style.left = `${randomX}px`;
      el.style.top = `${randomY}px`;

      setTimeout(() => {
        el.style.opacity = "1";
      }, opacityDelay);

      opacityDelay += 800;
      const delay = Math.random() * 5; // Random delay between 0 and 5 seconds
      el.style.animationDelay = `${delay}s`;
    }
  });
}

function isOverlapping(rect1: any, rect2: any) {
  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

async function openAiRequest() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Generera fem korta skämt som börjar med det var en gång' }],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion;
}

onMounted(async() => {
  const res = await openAiRequest();
  jokes.value = res.choices[0].message.content?.split("\n").filter((joke: string) => joke.length > 0);
  console.log(jokes.value)
})

</script>
<style scoped lang="css">
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.joke {
  animation: bounce 2s ease-in-out infinite;
}
</style>