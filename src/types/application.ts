export interface Application {
  id: string | number;
  env: string;
  os: {
    name: string;
    version: string;
  };
  resources: {
    cpu: string;
    ram: string;
    disk: string;
  };
  createdAt: string;
  status?: string;
}
