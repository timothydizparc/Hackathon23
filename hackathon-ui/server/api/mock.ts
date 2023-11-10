export default defineEventHandler(async (event) => {
    const s = getQuery(event).s === 'true';
    console.log(s);

    return {
        success: s,
        state: {
            status: s != true ? "pending" : "complete_success",
            maybe_public_bucket_wav_audio_path: s != true ? null : "blabla.wav"
        }
    };
  });
  