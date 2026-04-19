export const profile = {
  name: {
    en: 'Yiyang Shen',
    cn: '沈亦旸',
    nickname: 'Daniel'
  },
  title: 'Environmental Researcher · Photographer',
  tagline: 'Water systems, global change, and the quiet choreography of light on landscapes.',
  subtitle:
    "MSc student in Urban Environmental Management at Wageningen University & Research. I study water and plastic, and I photograph the places I study.",
  location: 'Wageningen, Netherlands',
  email: {
    personal: 'syydaniel@gmail.com',
    academic: 'yiyang.shen@wur.nl'
  },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yiyang-shen-%E6%B2%88%E4%BA%A6%E6%97%B8-05502821b/', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com/syydaniel', icon: 'github' },
    { label: 'Email', href: 'mailto:syydaniel@gmail.com', icon: 'mail' }
  ],
  stats: [
    { value: '4', label: 'Countries' },
    { value: '4', label: 'Universities' },
    { value: '8+', label: 'Research projects' },
    { value: '∞', label: 'Photographs' }
  ]
} as const;
