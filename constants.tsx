
import { ChemicalInfo, LoveStage, GenderDifference } from './types';

export const CHEMICALS: Record<string, ChemicalInfo> = {
  testosterone: {
    name: 'Testosterone',
    nameThai: 'เทสโทสเตอโรน',
    description: 'Male sex hormone that stimulates sexual desire and attraction.',
    role: 'Lust / Sexual Drive',
    color: 'bg-blue-500',
  },
  estrogen: {
    name: 'Estrogen',
    nameThai: 'เอสโตรเจน',
    description: 'Female sex hormone primarily responsible for the development and regulation of the female reproductive system.',
    role: 'Lust / Sexual Drive',
    color: 'bg-pink-500',
  },
  dopamine: {
    name: 'Dopamine',
    nameThai: 'โดปามีน',
    description: 'The "feel-good" hormone that mediates the reward system in the brain.',
    role: 'Attraction / Reward',
    color: 'bg-yellow-500',
  },
  adrenaline: {
    name: 'Adrenaline',
    nameThai: 'อะดรีนาลีน',
    description: 'Triggers the "fight or flight" response, causing sweaty palms and racing heart.',
    role: 'Attraction / Excitement',
    color: 'bg-orange-500',
  },
  serotonin: {
    name: 'Serotonin',
    nameThai: 'เซโรโทนิน',
    description: 'Levels drop during early attraction, leading to obsessive thoughts about the partner.',
    role: 'Attraction / Obsession',
    color: 'bg-green-500',
  },
  oxytocin: {
    name: 'Oxytocin',
    nameThai: 'ออกซิโตซิน',
    description: 'The "cuddle hormone" released during physical touch and intimacy.',
    role: 'Attachment / Trust',
    color: 'bg-purple-500',
  },
  vasopressin: {
    name: 'Vasopressin',
    nameThai: 'วาโสเปรสซิน',
    description: 'Linked to long-term commitment and monogamous behavior, especially in males.',
    role: 'Attachment / Bonding',
    color: 'bg-indigo-500',
  },
  cortisol: {
    name: 'Cortisol',
    nameThai: 'คอร์ติซอล',
    description: 'The stress hormone that spikes during the uncertainty of early attraction.',
    role: 'Stress / Alertness',
    color: 'bg-red-400',
  }
};

export const STAGES: LoveStage[] = [
  {
    id: 'baseline',
    title: 'Baseline',
    titleThai: 'สภาวะปกติ',
    description: 'The resting state before emotional involvement.',
    chemicals: ['serotonin'],
    brainRegions: ['Frontal Cortex'],
    keyFacts: [
      'Emotional regulation is stable.',
      'Decision making is logical and balanced.',
      'Normal levels of neurotransmitters.'
    ],
    levels: { dopamine: 20, oxytocin: 30, serotonin: 80, testosterone: 40, cortisol: 10 }
  },
  {
    id: 'lust',
    title: 'Lust',
    titleThai: 'แรงขับทางเพศและความใคร่',
    description: 'The initial stage driven by basic instincts for reproduction.',
    chemicals: ['testosterone', 'estrogen'],
    brainRegions: ['Hypothalamus'],
    keyFacts: [
      'Driven by sex hormones controlled by the Hypothalamus.',
      'Focuses on physical indicators of health and genetic strength.',
      'Evolutionary goal: Ensure species survival.'
    ],
    levels: { dopamine: 40, oxytocin: 35, serotonin: 75, testosterone: 90, cortisol: 20 }
  },
  {
    id: 'attraction',
    title: 'Attraction',
    titleThai: 'การตกหลุมรักและความหลงใหล',
    description: 'The "honey-moon" phase where we feel euphoric and obsessed.',
    chemicals: ['dopamine', 'adrenaline', 'serotonin', 'cortisol'],
    brainRegions: ['Ventral Tegmental Area', 'Nucleus Accumbens', 'Frontal Cortex'],
    keyFacts: [
      'Reward system activation via Dopamine makes us feel high.',
      'Serotonin levels drop, leading to obsessive-compulsive behaviors.',
      'Cortisol spikes as the body perceives the new romance as a high-stakes event.'
    ],
    levels: { dopamine: 95, oxytocin: 60, serotonin: 30, testosterone: 60, cortisol: 80 }
  },
  {
    id: 'attachment',
    title: 'Attachment',
    titleThai: 'การสร้างความผูกพันระยะยาว',
    description: 'The factor that keeps couples together long enough to raise children.',
    chemicals: ['oxytocin', 'vasopressin'],
    brainRegions: ['Hypothalamus', 'Pituitary Gland'],
    keyFacts: [
      'Oxytocin builds trust and safety through physical touch.',
      'Vasopressin encourages pair-bonding and protective behaviors.',
      'Essential for long-term stability and cooperative child-rearing.'
    ],
    levels: { dopamine: 50, oxytocin: 95, serotonin: 85, testosterone: 45, cortisol: 15 }
  }
];

export const GENDER_DIFFS: GenderDifference[] = [
  {
    gender: 'male',
    title: 'Male Biology',
    focus: 'Visual & Physical Indicators',
    brainActivity: 'Higher activation in visual processing areas.',
    evolutionaryReasoning: 'Prioritizes youth and health cues (waist-to-hip ratio, symmetry).'
  },
  {
    gender: 'female',
    title: 'Female Biology',
    focus: 'Memory & Emotional Stability',
    brainActivity: 'Higher activation in memory and emotion processing regions.',
    evolutionaryReasoning: 'Prioritizes social status and stability to ensure resource security for offspring.'
  }
];
