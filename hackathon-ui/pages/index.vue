<template>
  <div
    class="bg-gray-100 min-h-screen flex flex-col justify-center items-center"
  >
    <h1 class="text-4xl font-bold mb-4">Welcome to my Nuxt app!</h1>
    <p class="text-lg">Here's some content for the page.</p>
    <form class="mt-4" @submit.prevent="onSubmit">
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
    </form>

    <div class="mt-4">
      <h2 class="text-lg font-bold mb-2">Models:</h2>
      <ul class="list-disc pl-4">
        <li v-for="model in models" :key="model.id" class="mb-2">
          {{ model.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const models = ref<any[]>([]);

async function onSubmit() {
  const { data } = await useFetch("/api/voices");
  console.log(data.value?.voices);
  models.value = data.value?.voices;
}
</script>
