export interface IImage {
  id: number;
  repository: string[];
  size: string;
}

export interface IContainer {
  id: number;
  name: string;
  status: 'exited' | 'running';
  isProcessing: boolean;
}
