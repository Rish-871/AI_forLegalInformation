export interface IPCSection {
  section: string;
  offense: string;
  punishment: string;
  description: string;
  reason?: string;
}

export interface IPCMatch {
  section: IPCSection;
  relevance: number;
}