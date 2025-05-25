// src/types/ec2.ts
export type EC2InstanceType = 't2.small' | 't3.medium' | 't3.large' | 't4g.xlarge' | 'm5.large';

export const ec2Pricing: Record<EC2InstanceType, number> = {
  't2.small': 0.023,
  't3.medium': 0.0416,
  't3.large': 0.0832,
  't4g.xlarge': 0.1344,
  'm5.large': 0.096,
};
