import type { FamilyPhoto } from '@/models';

const p1 = require('../../../assets/photos/photo1.jpg');
const p2 = require('../../../assets/photos/photo2.jpg');
const p3 = require('../../../assets/photos/photo3.jpg');
const p4 = require('../../../assets/photos/photo4.jpg');
const p5 = require('../../../assets/photos/photo5.jpg');
const p6 = require('../../../assets/photos/photo6.jpg');
const p7 = require('../../../assets/photos/photo7.jpg');

export const SEED_PHOTOS: FamilyPhoto[] = [
  {
    id: 'photo-1',
    uri: p1,
    senderName: 'Amy',
    caption: 'A lovely moment captured recently!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    comments: [
      {
        id: 'c-photo1-1',
        authorName: 'Margaret',
        text: 'This is beautiful! Love it.',
        kind: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      },
    ],
  },
  {
    id: 'photo-2',
    uri: p2,
    senderName: 'Brendon',
    caption: 'Great times together this weekend.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    comments: [
      {
        id: 'c-photo2-1',
        authorName: 'Margaret',
        text: 'So happy to see this!',
        kind: 'voice',
        durationSec: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
      },
    ],
  },
  {
    id: 'photo-3',
    uri: p3,
    senderName: 'Amy',
    caption: 'We miss you! See you soon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    comments: [],
  },
  {
    id: 'photo-4',
    uri: p4,
    senderName: 'Anne',
    caption: 'Beautiful day out and about!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    comments: [
      {
        id: 'c-photo4-1',
        authorName: 'Margaret',
        text: 'Gorgeous photo! Wish I was there.',
        kind: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
      },
    ],
  },
  {
    id: 'photo-5',
    uri: p5,
    senderName: 'Joe',
    caption: 'Enjoying the little things in life.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    comments: [],
  },
  {
    id: 'photo-6',
    uri: p6,
    senderName: 'Jack',
    caption: 'Summer memories from August!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    comments: [
      {
        id: 'c-photo6-1',
        authorName: 'Margaret',
        text: 'This brings back such warm memories.',
        kind: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 94).toISOString(),
      },
    ],
  },
  {
    id: 'photo-7',
    uri: p7,
    senderName: 'Brendon',
    caption: 'A wonderful day to remember.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    comments: [],
  },
];
