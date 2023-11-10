export interface VoiceModel {
  model_token: string;
  tts_model_type: string;
  creator_user_token: string;
  creator_username: string;
  creator_display_name: string;
  creator_gravatar_hash: string;
  title: string;
  ietf_language_tag: string;
  ietf_primary_language_subtag: string;
  is_front_page_featured: boolean;
  is_twitch_featured: boolean;
  maybe_suggested_unique_bot_command: null;
  creator_set_visibility: string;
  user_ratings: {
    positive_count: number;
    negative_count: number;
    total_count: number;
  };
  category_tokens: string[];
  created_at: string;
  updated_at: string;
}
