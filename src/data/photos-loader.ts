import { seedPhotos, type Photo } from './photos';

let generated: Photo[] = [];
try {
  const mod = await import('./photos.generated.json');
  generated = (mod.default ?? mod) as Photo[];
} catch {
  generated = [];
}

export const photos: Photo[] = generated.length > 0 ? generated : seedPhotos;
export const isUsingSeedPhotos = generated.length === 0;
