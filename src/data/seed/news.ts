import type { AudioItem } from '@/models';

const audio01 = require('../../../assets/audio/01_综合新闻.mp3');
const audio02 = require('../../../assets/audio/02_社会民生.mp3');
const audio03 = require('../../../assets/audio/03_健康养老.mp3');
const audio04 = require('../../../assets/audio/04_财经生活.mp3');
const audio05 = require('../../../assets/audio/05_天气出行.mp3');

export const SEED_AUDIO_ITEMS: AudioItem[] = [
  {
    id: 'audio-daily-1',
    category: 'dailyNews',
    title: '综合新闻',
    durationSec: 37,
    audioSource: audio01,
    summary:
      '这里是今日综合新闻。为您简要播报国内外重要消息、公共服务信息和社会动态。本节目语速较慢，重点信息会重复提示，方便您在散步、吃饭或休息时收听。',
  },
  {
    id: 'audio-local-1',
    category: 'localNews',
    title: '社会民生',
    durationSec: 35,
    audioSource: audio02,
    summary:
      '社会民生频道。关注社区服务、交通出行、消费提醒、养老政策和身边的新变化。如遇陌生电话要求转账或提供验证码，请先停止操作并向家人核实。',
  },
  {
    id: 'audio-health-1',
    category: 'health',
    title: '健康养老',
    durationSec: 36,
    audioSource: audio03,
    summary:
      '健康养老频道。为您整理日常健康、饮食、运动和老年生活相关资讯。健康信息仅用于一般科普，不能替代医生诊断。',
  },
  {
    id: 'audio-finance-1',
    category: 'finance',
    title: '财经生活',
    durationSec: 36,
    audioSource: audio04,
    summary:
      '财经生活频道。用简单易懂的方式介绍物价、银行服务、退休生活和常见消费信息。正规机构不会通过电话要求您提供密码或验证码。',
  },
  {
    id: 'audio-weather-1',
    category: 'weather',
    title: '天气出行',
    durationSec: 33,
    audioSource: audio05,
    summary:
      '天气与出行频道。出门前请查看当地天气、气温、降雨和空气质量变化。天气炎热注意补水，低温注意保暖，雨天小心湿滑路面。',
  },
];
