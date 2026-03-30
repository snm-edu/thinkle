import type { Area } from '../types'

export const areas: Area[] = [
  {
    id: 1,
    name: '暗号の書架',
    emoji: '🔐',
    description: '暗号・法則・パターンを見抜く問題',
    questionIds: [1, 6, 9, 26, 29],
    color: '#7c3aed',
  },
  {
    id: 2,
    name: '推理の書架',
    emoji: '🔍',
    description: '論理推理・条件から真実を導く問題',
    questionIds: [2, 7, 12, 17, 19],
    color: '#2563eb',
  },
  {
    id: 3,
    name: '配置の書架',
    emoji: '🪑',
    description: '座席・配置・部屋割りパズル',
    questionIds: [3, 8, 11, 14, 15],
    color: '#059669',
  },
  {
    id: 4,
    name: '数理の書架',
    emoji: '🔢',
    description: '数的処理・確率・集合の問題',
    questionIds: [4, 5, 18, 25, 27],
    color: '#d97706',
  },
  {
    id: 5,
    name: '図形の書架',
    emoji: '📐',
    description: '空間認識・幾何・展開図の問題',
    questionIds: [13, 20, 24, 28, 30],
    color: '#dc2626',
  },
  {
    id: 6,
    name: '計算の書架',
    emoji: '🧮',
    description: '計算・速度・最大公約数の問題',
    questionIds: [10, 16, 21, 22, 23],
    color: '#0891b2',
  },
]
