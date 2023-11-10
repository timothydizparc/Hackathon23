export default defineEventHandler(async (event) => {
  const voicesResponse = await fetch("https://api.fakeyou.com/tts/list");
  const voices = await voicesResponse.json();
  console.log(voices);

  return {
    voices: voices.models.slice(0, 2),
  };
});
