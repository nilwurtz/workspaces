export interface ConceptNetAPI {
  "@context": string[];
  "@id": string;
  edges: Edge[];
  view: View;
}

export interface Edge {
  "@id": string;
  "@type": EdgeType;
  dataset: Dataset;
  end: End;
  license: License;
  rel: Rel;
  sources: Source[];
  start: End;
  surfaceText: null | string;
  weight: number;
}

export enum EdgeType {
  Edge = "Edge",
}

export enum Dataset {
  DConceptnet4Ja = "/d/conceptnet/4/ja",
  DJmdict = "/d/jmdict",
  DKyotoYahoo = "/d/kyoto_yahoo",
}

export interface End {
  "@id": string;
  "@type": EndType;
  label: string;
  language: Language;
  term: string;
  sense_label?: string;
}

export enum EndType {
  Node = "Node",
}

export enum Language {
  De = "de",
  En = "en",
  Fr = "fr",
  Ja = "ja",
  Nl = "nl",
}

export enum License {
  CcBy40 = "cc:by/4.0",
  CcBySa40 = "cc:by-sa/4.0",
}

export interface Rel {
  "@id": string;
  "@type": RelType;
  label: string;
}

export enum RelType {
  Relation = "Relation",
}

export interface Source {
  "@id": string;
  "@type": SourceType;
  activity?: Activity;
  contributor?: string;
  process?: string;
}

export enum SourceType {
  Source = "Source",
}

export enum Activity {
  SActivityKyotoYahoo = "/s/activity/kyoto_yahoo",
  SActivityOmcsNadyaJp = "/s/activity/omcs/nadya.jp",
}

export interface View {
  "@id": string;
  "@type": string;
  comment: string;
  firstPage: string;
  nextPage: string;
  paginatedProperty: string;
}
