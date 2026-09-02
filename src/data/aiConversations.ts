export interface AiConversationTopic {
  id: string;
  icon: string;
  labelZh: string;
  labelEn: string;
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  questionAudioZh: number;
  questionAudioEn: number;
  answerAudioZh: number;
  answerAudioEn: number;
}

const q01 = require('../../assets/audio/ai-conversations/01_weather_ZH_question.mp3');
const a01 = require('../../assets/audio/ai-conversations/01_weather_ZH_answer.mp3');
const q01en = require('../../assets/audio/ai-conversations/01_weather_EN_question.mp3');
const a01en = require('../../assets/audio/ai-conversations/01_weather_EN_answer.mp3');

const q02 = require('../../assets/audio/ai-conversations/02_medicine_time_ZH_question.mp3');
const a02 = require('../../assets/audio/ai-conversations/02_medicine_time_ZH_answer.mp3');
const q02en = require('../../assets/audio/ai-conversations/02_medicine_time_EN_question.mp3');
const a02en = require('../../assets/audio/ai-conversations/02_medicine_time_EN_answer.mp3');

const q03 = require('../../assets/audio/ai-conversations/03_call_family_ZH_question.mp3');
const a03 = require('../../assets/audio/ai-conversations/03_call_family_ZH_answer.mp3');
const q03en = require('../../assets/audio/ai-conversations/03_call_family_EN_question.mp3');
const a03en = require('../../assets/audio/ai-conversations/03_call_family_EN_answer.mp3');

const q04 = require('../../assets/audio/ai-conversations/04_today_schedule_ZH_question.mp3');
const a04 = require('../../assets/audio/ai-conversations/04_today_schedule_ZH_answer.mp3');
const q04en = require('../../assets/audio/ai-conversations/04_today_schedule_EN_question.mp3');
const a04en = require('../../assets/audio/ai-conversations/04_today_schedule_EN_answer.mp3');

const q05 = require('../../assets/audio/ai-conversations/05_translation_ZH_question.mp3');
const a05 = require('../../assets/audio/ai-conversations/05_translation_ZH_answer.mp3');
const q05en = require('../../assets/audio/ai-conversations/05_translation_EN_question.mp3');
const a05en = require('../../assets/audio/ai-conversations/05_translation_EN_answer.mp3');

const q06 = require('../../assets/audio/ai-conversations/06_scam_warning_ZH_question.mp3');
const a06 = require('../../assets/audio/ai-conversations/06_scam_warning_ZH_answer.mp3');
const q06en = require('../../assets/audio/ai-conversations/06_scam_warning_EN_question.mp3');
const a06en = require('../../assets/audio/ai-conversations/06_scam_warning_EN_answer.mp3');

export const AI_CONVERSATION_TOPICS: AiConversationTopic[] = [
  {
    id: 'weather',
    icon: 'cloud-sun',
    labelZh: '天气',
    labelEn: 'Weather',
    questionZh: '今天天气怎么样？',
    questionEn: 'How is the weather today?',
    answerZh: '今天阳光不错，天气比较温和。出门记得带一件薄外套。',
    answerEn: 'It is sunny and mild today. Please bring a light jacket when you go out.',
    questionAudioZh: q01,
    questionAudioEn: q01en,
    answerAudioZh: a01,
    answerAudioEn: a01en,
  },
  {
    id: 'medicine',
    icon: 'pills',
    labelZh: '吃药提醒',
    labelEn: 'Medicine',
    questionZh: '我这个口服药几点吃？',
    questionEn: 'What time should I take this medicine?',
    answerZh: '您的提醒时间是上午十点。请按照医生或药品标签的说明服用。',
    answerEn: 'Your reminder is set for ten A.M. Please follow your doctor\'s or medication label\'s instructions.',
    questionAudioZh: q02,
    questionAudioEn: q02en,
    answerAudioZh: a02,
    answerAudioEn: a02en,
  },
  {
    id: 'call-family',
    icon: 'phone',
    labelZh: '打电话',
    labelEn: 'Call Family',
    questionZh: '帮我给女儿打电话。',
    questionEn: 'Please call my daughter.',
    answerZh: '好的。我现在帮您打开女儿的联系电话。',
    answerEn: 'Okay. I will open your daughter\'s contact now.',
    questionAudioZh: q03,
    questionAudioEn: q03en,
    answerAudioZh: a03,
    answerAudioEn: a03en,
  },
  {
    id: 'schedule',
    icon: 'calendar-day',
    labelZh: '今日安排',
    labelEn: 'Schedule',
    questionZh: '我今天有什么安排？',
    questionEn: 'What do I have planned today?',
    answerZh: '您今天下午两点有一个预约。我会提前提醒您。',
    answerEn: 'You have an appointment at two P.M. today. I will remind you before it starts.',
    questionAudioZh: q04,
    questionAudioEn: q04en,
    answerAudioZh: a04,
    answerAudioEn: a04en,
  },
  {
    id: 'translation',
    icon: 'language',
    labelZh: '翻译',
    labelEn: 'Translate',
    questionZh: '帮我问一下这个多少钱。',
    questionEn: 'Please help me ask how much this is.',
    answerZh: '可以。英文可以说：How much is this?',
    answerEn: 'Of course. You can ask: How much is this?',
    questionAudioZh: q05,
    questionAudioEn: q05en,
    answerAudioZh: a05,
    answerAudioEn: a05en,
  },
  {
    id: 'scam',
    icon: 'shield-halved',
    labelZh: '防骗提醒',
    labelEn: 'Scam Alert',
    questionZh: '这个陌生人让我把验证码告诉他，可以吗？',
    questionEn: 'A stranger asked me to give them my verification code. Is that okay?',
    answerZh: '不要提供验证码。请先停止操作，并联系家人或官方客服核实。',
    answerEn: 'Do not share your verification code. Stop and check with a family member or the official customer service first.',
    questionAudioZh: q06,
    questionAudioEn: q06en,
    answerAudioZh: a06,
    answerAudioEn: a06en,
  },
];
