export interface IVolume {
  driver: string;
  name: string;
  isProcessing: boolean;
}

export interface INetwork {
  id: string;
  name: string;
  isProcessing: boolean;
}

export interface IImage {
  id: string;
  repository: string[];
  size: string;
  isProcessing: boolean;
}

export interface IContainer {
  id: string;
  name: string;
  status: 'exited' | 'running';
  isProcessing: boolean;
}
