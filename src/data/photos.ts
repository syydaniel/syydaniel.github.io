export interface Photo {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  takenAt: string;
  location: {
    name: string;
    country: string;
    coords: [number, number];
  };
  caption?: string;
  camera?: string;
  exposure?: string;
  tags?: string[];
}

/**
 * Photos seed. Build script (scripts/build-photo-manifest.mjs)
 * will merge EXIF-extracted entries from `/photos/` into
 * `src/data/photos.generated.json` at build time. Until the user
 * drops photos in, this seed provides demo pins so the map is alive.
 */
export const seedPhotos: Photo[] = [
  {
    id: 'seed-wageningen-campus',
    src: '',
    thumb: '',
    width: 1600,
    height: 1067,
    takenAt: '2024-10-15T16:20:00Z',
    location: { name: 'Wageningen campus', country: 'Netherlands', coords: [5.6645, 51.9692] },
    caption: 'Placeholder — drop real photos in /photos/ to replace.'
  },
  {
    id: 'seed-lapland',
    src: '',
    thumb: '',
    width: 1600,
    height: 1067,
    takenAt: '2025-07-08T21:10:00Z',
    location: { name: 'Finnish Lapland', country: 'Finland', coords: [26.9000, 67.5000] },
    caption: 'Placeholder — boreal forest midnight light.'
  },
  {
    id: 'seed-vancouver-stanley',
    src: '',
    thumb: '',
    width: 1600,
    height: 1067,
    takenAt: '2023-08-12T18:45:00Z',
    location: { name: 'Stanley Park, Vancouver', country: 'Canada', coords: [-123.1414, 49.3017] },
    caption: 'Placeholder — coastal douglas-fir.'
  },
  {
    id: 'seed-zhejiang',
    src: '',
    thumb: '',
    width: 1600,
    height: 1067,
    takenAt: '2022-04-03T09:30:00Z',
    location: { name: 'Zhejiang bamboo forest', country: 'China', coords: [119.7249, 30.2588] },
    caption: 'Placeholder — Phyllostachys edulis at dawn.'
  }
];
