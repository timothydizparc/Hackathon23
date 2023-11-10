export interface TTSRequest {
  tts_model_token: string;
  uuid_idempotency_token: string;
  inference_text: string;
}
