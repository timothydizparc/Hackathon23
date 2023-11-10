export default defineEventHandler(async (event) => {
  const token = getQuery(event).token;
  console.log(token);

  const url = `https://api.fakeyou.com/tts/job/${token}`;
  // const url = "http://localhost:3000/api/mock?s=false";
  const response = await (await fetch(url)).json();

  console.log(response);

  if (response.success && response.state.status == "complete_success") {
    return {
      success: true,
      path: `https://api.fakeyou.com/${response.state.maybe_public_bucket_wav_audio_path}`,
    };
  } else {
    return {
      success: false,
    };
  }
});
