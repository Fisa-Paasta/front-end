// src/types/ec2.ts
export type EC2InstanceType = 't3.medium' | 't3.large' | 'm5.large';

export const ec2Pricing: Record<EC2InstanceType, number> = {
  't3.medium': 0.0416,
  't3.large': 0.0832,
  'm5.large': 0.096,
};
