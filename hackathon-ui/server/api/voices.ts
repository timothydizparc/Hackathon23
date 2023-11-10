import { VoiceModel } from "~/models/VoiceModel";
import voiceModels from "../../assets/voice-models.json";

export default defineEventHandler((event): { voiceModels: VoiceModel[] } => {
  return {
    voiceModels: voiceModels.models as VoiceModel[],
  };
});
