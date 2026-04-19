export type JourneyKind = 'education' | 'experience' | 'project';

export interface JourneyItem {
  id: string;
  kind: JourneyKind;
  title: string;
  org: string;
  location: string;
  coords: [number, number];
  start: string;
  end: string;
  ongoing?: boolean;
  summary: string;
  bullets?: string[];
  tags: string[];
  supervisor?: string;
  status?: 'active' | 'upcoming' | 'complete';
}

export const journey: JourneyItem[] = [
  {
    id: 'msc-wur',
    kind: 'education',
    title: 'MSc, Urban Environmental Management',
    org: 'Wageningen University & Research',
    location: 'Wageningen, Netherlands',
    coords: [5.6645, 51.9692],
    start: '2024-09',
    end: '2026-06',
    ongoing: true,
    summary:
      'Specialization: Water System and Global Change. Focus on water quality, microplastic fate, and scenario analysis at catchment scale.',
    supervisor: 'Prof. Maryna Strokal',
    tags: ['Water Systems', 'Global Change', 'Microplastics'],
    status: 'active'
  },
  {
    id: 'thesis-marina',
    kind: 'project',
    title: 'MSc Thesis — MARINA-Plastic Model Enhancement',
    org: 'Wageningen University & Research',
    location: 'Wageningen, Netherlands',
    coords: [5.6645, 51.9692],
    start: '2025-10',
    end: '2026-03',
    ongoing: true,
    summary:
      'Using machine learning to refine sub-basin microplastic river retention rates within the MARINA-Plastic framework.',
    supervisor: 'Prof. Maryna Strokal',
    tags: ['Machine Learning', 'MARINA-Plastic', 'Microplastics', 'Water Systems'],
    status: 'active'
  },
  {
    id: 'ra-uef',
    kind: 'experience',
    title: 'Research Assistant (Internship)',
    org: 'University of Eastern Finland',
    location: 'Joensuu & Lapland, Finland',
    coords: [29.7636, 62.6010],
    start: '2025-05',
    end: '2025-09',
    summary:
      'Boreal-forest fieldwork: soil-water collection in Lapland, spectral measurements, GIS watershed analysis, summer-school support.',
    supervisor: 'Prof. Frank Berninger',
    bullets: [
      'Field sampling in Lapland — soil water & spectral measurements',
      'GIS analysis of watershed land use',
      'Assisted in international summer school'
    ],
    tags: ['Field Research', 'Boreal Forest', 'Spectral', 'GIS'],
    status: 'complete'
  },
  {
    id: 'bsc-ubc',
    kind: 'education',
    title: 'BSc, Urban Forestry (Green Space Management)',
    org: 'University of British Columbia',
    location: 'Vancouver, Canada',
    coords: [-123.2460, 49.2606],
    start: '2021-09',
    end: '2024-05',
    summary: 'GPA 83.7 / 100. Graduated with honors. Supervisor: Prof. Andrew Almas.',
    tags: ['Urban Forestry', 'Green Space', 'GIS'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-tree',
    kind: 'experience',
    title: 'Research Assistant (Volunteer)',
    org: 'UBC — Faculty of Forestry',
    location: 'Vancouver, Canada',
    coords: [-123.2460, 49.2606],
    start: '2024-02',
    end: '2024-04',
    summary:
      '130,000+ tree inventory analysis for the City of Surrey — mortality, species, life-span patterns.',
    supervisor: 'Prof. Andrew Adams',
    tags: ['Tree Inventory', 'Data Analysis', 'GIS'],
    status: 'complete'
  },
  {
    id: 'project-urban-heat',
    kind: 'project',
    title: 'Urban Structure & Surface Temperature',
    org: 'University of British Columbia',
    location: 'Vancouver, Canada',
    coords: [-123.2460, 49.2606],
    start: '2024-01',
    end: '2024-04',
    summary:
      'Mapped UBC campus urban structure at 30 m resolution; analyzed land-use change impact on surface temperature 2014-2022.',
    tags: ['Urban Forestry', 'Climate', 'Remote Sensing'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-pollinator',
    kind: 'experience',
    title: 'Research Assistant (Full-time)',
    org: 'UBC — Pollinators and Climate Change Lab',
    location: 'Vancouver, Canada',
    coords: [-123.2460, 49.2606],
    start: '2023-05',
    end: '2023-08',
    summary:
      'Surveyed insect–plant interactions across 18 urban parks in Vancouver.',
    supervisor: 'Prof. Risa Sargant & Dr. Jens Ulrich',
    tags: ['Pollinators', 'Urban Ecology', 'Climate'],
    status: 'complete'
  },
  {
    id: 'bsc-zafu',
    kind: 'education',
    title: 'BSc, Forestry',
    org: 'Zhejiang Agriculture and Forestry University',
    location: 'Hangzhou, China',
    coords: [119.7249, 30.2588],
    start: '2019-09',
    end: '2024-06',
    summary: 'GPA 87.7 / 100. Supervisors: Prof. Yeqing Ying & Prof. Wenhui Shi.',
    tags: ['Forestry', 'Biology'],
    status: 'complete'
  },
  {
    id: 'ra-zafu-psm',
    kind: 'experience',
    title: 'Research Assistant (Part-time)',
    org: 'State Key Laboratory of Subtropical Silviculture',
    location: 'Hangzhou, China',
    coords: [119.7249, 30.2588],
    start: '2019-10',
    end: '2021-08',
    summary:
      'Phosphorus-solubilizing microorganisms — strain interactions and their role in Phyllostachys edulis growth. Team lead.',
    supervisor: 'Prof. Yeqing Ying & Prof. Wenhui Shi',
    tags: ['Microbiology', 'Plant-Microbe', 'Forestry'],
    status: 'complete'
  }
];

export const researchCities = [
  { id: 'wageningen', name: 'Wageningen', country: 'Netherlands', coords: [5.6645, 51.9692] as [number, number], role: 'Current — MSc & thesis' },
  { id: 'lapland', name: 'Joensuu / Lapland', country: 'Finland', coords: [29.7636, 62.6010] as [number, number], role: 'Boreal forest fieldwork' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', coords: [-123.2460, 49.2606] as [number, number], role: 'BSc, urban forestry research' },
  { id: 'hangzhou', name: 'Hangzhou', country: 'China', coords: [119.7249, 30.2588] as [number, number], role: 'Forestry BSc & microbiology RA' }
];
