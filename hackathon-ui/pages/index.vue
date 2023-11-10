<template>
  <audio ref="audioRef" src="elevator-mood.mp3"></audio>
  <div
    class="bg-gray-100 min-h-screen flex flex-col justify-center items-center"
  >
  <div>
  </div>
  <div id="form-content" class="flex flex-col justify-center items-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to my Nuxt app!</h1>
    <p class="text-lg">Here's some content for the page.</p>
    <form class="mt-4" @submit.prevent="onSubmit" id="form">
      <label class="block mb-2 font-bold text-gray-700" for="name">
        Name
      </label>
      <input
        class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="name"
        type="text"
        placeholder="Write some text"
      />
      <button
        class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        type="submit"
      >
        Submit
      </button>
      <button class="bg-purple-500 rounded font-bold text-white px-4 py-2 hover:bg-purple-700 ml-2" @click.prevent="getJokes">Sköj</button>
    </form>
  </div>
    <div class="mt-4">
      <h2 class="text-lg font-bold mb-2">Models:</h2>
      <ul class="list-disc pl-4">
        <li v-for="model in models" :key="model.id" class="mb-2 random">
          {{ model.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true
});

const models = ref<any[]>([]);
const audioRef = ref<any>(null);

const jokes = ref<string[] | undefined>([]);

async function onSubmit() {
  const { data } = await useFetch("/api/voices");
  console.log(data.value?.voices);
  models.value = data.value?.voices;
}

async function getJokes() {
  const jokeDivs: HTMLElement[] = [];
  if (!jokes.value) return;

  audioRef.value.play();

  for (const joke of jokes.value) {
    console.log(joke);
    const div = document.createElement("div");
    div.innerText = joke;
    div.classList.add("bg-purple-500");
    div.classList.add("text-white");
    div.classList.add("font-bold");
    div.classList.add("rounded");
    div.classList.add("absolute");
    div.classList.add("p-4");
    div.classList.add("max-w-md");
    div.classList.add("joke");
    div.style.opacity = "0";
    div.style.transition = "opacity 0.8s ease-in-out";
    jokeDivs.push(div);
  }

  jokeDivs.forEach(div => {
    document.body.appendChild(div);
  });

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const formElement = document.getElementById('form'); // Get the form element
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