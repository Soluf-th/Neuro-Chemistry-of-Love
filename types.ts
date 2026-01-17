
export interface ChemicalInfo {
  name: string;
  nameThai: string;
  description: string;
  role: string;
  color: string;
}

export interface LoveStage {
  id: string;
  title: string;
  titleThai: string;
  description: string;
  chemicals: string[];
  brainRegions: string[];
  keyFacts: string[];
  levels: {
    dopamine: number;
    oxytocin: number;
    serotonin: number;
    testosterone: number;
    cortisol: number;
  };
}

export interface GenderDifference {
  gender: 'male' | 'female';
  title: string;
  focus: string;
  brainActivity: string;
  evolutionaryReasoning: string;
}
