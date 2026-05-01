import { BabyProfile, BabyAgeRange } from '../types';
import { differenceInMonths } from 'date-fns';

export function calculateDiaperSize(weight: number): string {
  if (weight < 5) return 'NB';
  if (weight >= 5 && weight < 8) return 'S';
  if (weight >= 6 && weight < 11) return 'M';
  if (weight >= 9 && weight < 14) return 'L';
  if (weight >= 12 && weight < 17) return 'XL';
  return 'XXL';
}

export function getBabyAgeRange(dob: string): BabyAgeRange {
  const months = differenceInMonths(new Date(), new Date(dob));
  if (months <= 3) return '0-3m';
  if (months <= 6) return '3-6m';
  if (months <= 12) return '6-12m';
  if (months <= 24) return '1-2t';
  return '2-3t';
}

export function getBabyAgeText(dob: string): string {
  const months = differenceInMonths(new Date(), new Date(dob));
  if (months < 1) return 'Dưới 1 tháng';
  if (months < 12) return `${months} tháng`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} tuổi`;
  return `${years} tuổi ${remainingMonths} tháng`;
}
