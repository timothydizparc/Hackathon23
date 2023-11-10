import { VoiceModel } from "~/models/VoiceModel";
import voiceModels from "../../assets/voice-models.json";

export default defineEventHandler((event): VoiceModel[] => {
  return voiceModels.models as VoiceModel[];
});
