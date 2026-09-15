import type { Lang } from './i18n';

// A localized string: one value per real UI language.
export type Loc = Record<Lang, string>;

export type JourneyKind = 'education' | 'experience' | 'project';

export interface JourneyItem {
  id: string;
  kind: JourneyKind;
  title: Loc;
  org: Loc;
  location: Loc;
  coords: [number, number];
  start: string;
  end: string;
  ongoing?: boolean;
  summary: Loc;
  bullets?: Loc[];
  tags: string[];
  supervisor?: string; // person names are kept as-is across languages
  status?: 'active' | 'upcoming' | 'complete';
}

export const journey: JourneyItem[] = [
  {
    id: 'next-phd',
    kind: 'education',
    title: {
      en: 'Next: a PhD in environmental modelling',
      zh: '下一步：环境建模方向的博士'
    },
    org: {
      en: 'Looking for a position',
      zh: '正在寻找机会'
    },
    location: {
      en: 'Europe',
      zh: '欧洲'
    },
    coords: [5.6645, 51.9692],
    start: '2026-06',
    end: '2026-06',
    ongoing: false,
    summary: {
      en: 'Large-scale modelling of how land use shapes the environment: the effect of agricultural practices on soil health and soil ecosystem services, and the non-CO₂ greenhouse gas emissions (N₂O, CH₄) of farming systems, building on my catchment-scale water and microplastic modelling.',
      zh: '用大尺度模型研究土地利用如何塑造环境：农业管理方式对土壤健康与土壤生态系统服务的影响，以及农业系统的非二氧化碳温室气体（N₂O、CH₄）排放。这延续了我在流域尺度上做水与微塑料建模的经验。'
    },
    tags: ['Soil Ecosystem Services', 'Agricultural Practices', 'Non-CO₂ GHGs', 'Large-scale Modelling'],
    status: 'upcoming'
  },
  {
    id: 'msc-wur',
    kind: 'education',
    title: {
      en: 'MSc, Urban Environmental Management',
      zh: '城市环境管理硕士'
    },
    org: {
      en: 'Wageningen University & Research',
      zh: '瓦赫宁根大学'
    },
    location: {
      en: 'Wageningen, Netherlands',
      zh: '瓦赫宁根，荷兰'
    },
    coords: [5.6645, 51.9692],
    start: '2024-09',
    end: '2026-05',
    ongoing: false,
    summary: {
      en: 'Specialization: Water Systems and Global Change. WIMEK Honours research programme 2025-2026. Focus on water quality, microplastic fate, and scenario analysis at catchment scale. Graduated end of May 2026.',
      zh: '专业方向：水系统与全球变化。2025-2026 年 WIMEK 荣誉研究项目。聚焦水质、微塑料归趋以及流域尺度的情景分析。2026 年 5 月底毕业。'
    },
    supervisor: 'Dr. Maryna Strokal & Dr. Ilaria Micella',
    tags: ['Water Systems', 'Global Change', 'Microplastics', 'WIMEK Honours'],
    status: 'complete'
  },
  {
    id: 'thesis-marina',
    kind: 'project',
    title: {
      en: 'MSc Thesis: Towards Developing a Hybrid Framework to Estimate Microplastic River Retention in Sub-basins Worldwide',
      zh: '硕士论文：构建一个估算全球次流域河流微塑料截留的混合框架'
    },
    org: {
      en: 'Wageningen University & Research',
      zh: '瓦赫宁根大学'
    },
    location: {
      en: 'Wageningen, Netherlands',
      zh: '瓦赫宁根，荷兰'
    },
    coords: [5.6645, 51.9692],
    start: '2025-11',
    end: '2026-05',
    ongoing: false,
    summary: {
      en: 'Developed a hybrid framework to estimate spatially explicit microplastic river retention at the sub-basin scale worldwide, combining large-language-model (LLM) data extraction with machine learning (LightGBM) and benchmarking against the MARINA-Multi model. Graded 9.0/10, in the Water Systems and Global Change Group.',
      zh: '构建了一套混合框架，用于在全球次流域尺度上估算具有空间分辨率的河流微塑料截留，将大语言模型（LLM）数据抽取与机器学习（LightGBM）相结合，并以 MARINA-Multi 模型作为对照基准。成绩 9.0/10，于水系统与全球变化研究组完成。'
    },
    supervisor: 'Dr. Maryna Strokal & Dr. Ilaria Micella',
    tags: ['Machine Learning', 'LLM', 'MARINA-Multi', 'Microplastics', 'River Retention'],
    status: 'complete'
  },
  {
    id: 'ta-uef',
    kind: 'experience',
    title: {
      en: 'Teaching Assistant, AI4Science Summer School',
      zh: '助教，AI4Science 暑期学校'
    },
    org: {
      en: 'University of Eastern Finland', zh: '东芬兰大学'
    },
    location: {
      en: 'Joensuu, Finland', zh: '约恩苏，芬兰'
    },
    coords: [29.7636, 62.601],
    start: '2025-08',
    end: '2025-08',
    summary: {
      en: 'Co-taught an AI4Science lecture and supported students through the international summer school programme.',
      zh: '共同讲授 AI4Science 课程，并在国际暑期学校项目中为学生提供支持。'
    },
    tags: ['Teaching', 'AI4Science', 'Summer School'],
    status: 'complete'
  },
  {
    id: 'ra-uef',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Internship)', zh: '研究助理（实习）'
    },
    org: {
      en: 'University of Eastern Finland', zh: '东芬兰大学'
    },
    location: {
      en: 'Joensuu & Lapland, Finland', zh: '约恩苏与拉普兰，芬兰'
    },
    coords: [29.7636, 62.601],
    start: '2025-05',
    end: '2025-09',
    summary: {
      en: 'Boreal-forest fieldwork in Lapland focused on dissolved organic carbon (DOC) in subarctic catchments, plus lab work and GIS watershed analysis.',
      zh: '在拉普兰开展北方针叶林野外工作，聚焦亚北极流域中的溶解有机碳（DOC），并进行实验室分析与 GIS 流域分析。'
    },
    supervisor: 'Prof. Frank Berninger',
    bullets: [
      {
        en: 'Field sampling in Lapland: water samples for DOC measurement',
        zh: '在拉普兰进行野外采样：采集水样以测定 DOC'
      },
      {
        en: 'Lab preparation and instrument work for DOC analysis',
        zh: '为 DOC 分析进行实验室制备与仪器操作'
      },
      {
        en: 'Manuscript in preparation: "Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        zh: '撰写中的论文：“Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments”'
      }
    ],
    tags: ['Field Research', 'Boreal Forest', 'DOC', 'GIS'],
    status: 'complete'
  },
  {
    id: 'bsc-ubc',
    kind: 'education',
    title: {
      en: 'BSc, Urban Forestry (Green Space Management)', zh: '城市林业学士（绿地管理）'
    },
    org: {
      en: 'University of British Columbia', zh: '不列颠哥伦比亚大学'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大'
    },
    coords: [-123.246, 49.2606],
    start: '2021-09',
    end: '2024-05',
    summary: {
      en: "GPA 83.7 / 100. Graduated with honors and named to the Dean's Honor List. Supervisor: Dr. Andrew Almas.",
      zh: 'GPA 83.7 / 100。以荣誉毕业，并入选院长荣誉榜。导师：Dr. Andrew Almas。'
    },
    tags: ['Urban Forestry', 'Green Space', 'GIS'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-tree',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Volunteer)', zh: '研究助理（志愿）'
    },
    org: {
      en: 'UBC, Faculty of Forestry', zh: 'UBC 林学院'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大'
    },
    coords: [-123.246, 49.2606],
    start: '2024-02',
    end: '2024-04',
    summary: {
      en: '130,000+ tree inventory analysis for the City of Surrey: mortality, species, life-span patterns.',
      zh: '为萨里市（City of Surrey）分析逾 13 万棵树木的清查数据：死亡率、树种与寿命格局。'
    },
    supervisor: 'Dr. Andrew Adams',
    tags: ['Tree Inventory', 'Data Analysis', 'GIS'],
    status: 'complete'
  },
  {
    id: 'project-urban-heat',
    kind: 'project',
    title: {
      en: 'Urban Structure & Surface Temperature', zh: '城市结构与地表温度'
    },
    org: {
      en: 'University of British Columbia', zh: '不列颠哥伦比亚大学'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大'
    },
    coords: [-123.246, 49.2606],
    start: '2024-01',
    end: '2024-04',
    summary: {
      en: 'Mapped UBC campus urban structure at 30 m resolution and analyzed land-use change impact on surface temperature 2014-2022. Group project applied a random-forest model to predict future LST in Wesbrook Village.',
      zh: '以 30 米分辨率绘制 UBC 校园的城市结构，分析 2014-2022 年土地利用变化对地表温度的影响。小组项目运用随机森林模型预测 Wesbrook Village 未来的地表温度（LST）。'
    },
    supervisor: 'Prof. Melissa McHale & Cody Bingham (MSc)',
    tags: ['Urban Forestry', 'Climate', 'Remote Sensing', 'Random Forest'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-pollinator',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Full-time)', zh: '研究助理（全职）'
    },
    org: {
      en: 'UBC, Pollinators and Climate Change Lab', zh: 'UBC 传粉者与气候变化实验室'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大'
    },
    coords: [-123.246, 49.2606],
    start: '2023-05',
    end: '2023-08',
    summary: {
      en: 'Field survey of insect and bumble-bee interactions with plants across 18 urban parks in Vancouver, with the Faculty of Land and Food Systems.',
      zh: '在温哥华 18 个城市公园开展野外调查，研究昆虫与熊蜂同植物的相互作用，与土地与食品系统学院合作。'
    },
    supervisor: 'Prof. Risa Sargant & Dr. Jens Ulrich',
    tags: ['Pollinators', 'Bumble Bees', 'Urban Ecology', 'Climate'],
    status: 'complete'
  },
  {
    id: 'bsc-zafu',
    kind: 'education',
    title: {
      en: 'BSc, Forestry', zh: '林学学士'
    },
    org: {
      en: 'Zhejiang Agriculture and Forestry University', zh: '浙江农林大学'
    },
    location: {
      en: 'Hangzhou, China', zh: '杭州，中国'
    },
    coords: [119.7249, 30.2588],
    start: '2019-09',
    end: '2024-06',
    summary: {
      en: 'GPA 87.7 / 100. Multiple national, provincial and institutional scholarships and life-science competition awards. Supervisors: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      zh: 'GPA 87.7 / 100。获得多项国家级、省级与校级奖学金及生命科学竞赛奖项。导师：Prof. Yeqing Ying 与 Prof. Wenhui Shi。'
    },
    tags: ['Forestry', 'Biology', 'Scholarships'],
    status: 'complete'
  },
  {
    id: 'ra-zafu-psm',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Part-time)', zh: '研究助理（兼职）'
    },
    org: {
      en: 'State Key Laboratory of Subtropical Silviculture', zh: '亚热带森林培育国家重点实验室'
    },
    location: {
      en: 'Hangzhou, China', zh: '杭州，中国'
    },
    coords: [119.7249, 30.2588],
    start: '2019-10',
    end: '2021-08',
    summary: {
      en: 'Two consecutive projects in the State Key Laboratory of Subtropical Silviculture, on phosphorus-solubilizing microorganism (PSM) ecology in moso bamboo (Phyllostachys edulis) systems.',
      zh: '在亚热带森林培育国家重点实验室参与两个连续项目，研究毛竹（Phyllostachys edulis）系统中解磷微生物（PSM）的生态。'
    },
    supervisor: 'Prof. Yeqing Ying & Prof. Wenhui Shi',
    bullets: [
      {
        en: '2019-10 → 2020-11, PSM × Phyllostachys edulis: field work and data analysis',
        zh: '2019-10 → 2020-11，PSM × Phyllostachys edulis：野外工作与数据分析'
      },
      {
        en: '2020-10 → 2021-08, PSM strain interactions: team leader, proposal writing, leading the team to completion',
        zh: '2020-10 → 2021-08，PSM 菌株相互作用：担任组长、撰写项目申请，带领团队完成项目'
      }
    ],
    tags: ['Microbiology', 'Plant-Microbe', 'Forestry', 'Team Lead'],
    status: 'complete'
  }
];

// English tag -> localized label. Acronyms / proper nouns map to themselves.
export const tagT: Record<string, Loc> = {
  'Water Systems': { en: 'Water Systems', zh: '水系统' },
  'Global Change': { en: 'Global Change', zh: '全球变化' },
  'Microplastics': { en: 'Microplastics', zh: '微塑料' },
  'WIMEK Honours': { en: 'WIMEK Honours', zh: 'WIMEK Honours' },
  'Machine Learning': { en: 'Machine Learning', zh: '机器学习' },
  'LLM': { en: 'LLM', zh: 'LLM' },
  'MARINA-Multi': { en: 'MARINA-Multi', zh: 'MARINA-Multi' },
  'River Retention': { en: 'River Retention', zh: '河流截留' },
  'Teaching': { en: 'Teaching', zh: '教学' },
  'AI4Science': { en: 'AI4Science', zh: 'AI4Science' },
  'Summer School': { en: 'Summer School', zh: '暑期学校' },
  'Field Research': { en: 'Field Research', zh: '野外研究' },
  'Boreal Forest': { en: 'Boreal Forest', zh: '北方针叶林' },
  'DOC': { en: 'DOC', zh: 'DOC' },
  'GIS': { en: 'GIS', zh: 'GIS' },
  'Urban Forestry': { en: 'Urban Forestry', zh: '城市林业' },
  'Green Space': { en: 'Green Space', zh: '绿地' },
  'Tree Inventory': { en: 'Tree Inventory', zh: '树木清查' },
  'Data Analysis': { en: 'Data Analysis', zh: '数据分析' },
  'Climate': { en: 'Climate', zh: '气候' },
  'Remote Sensing': { en: 'Remote Sensing', zh: '遥感' },
  'Random Forest': { en: 'Random Forest', zh: '随机森林' },
  'Pollinators': { en: 'Pollinators', zh: '传粉者' },
  'Bumble Bees': { en: 'Bumble Bees', zh: '熊蜂' },
  'Urban Ecology': { en: 'Urban Ecology', zh: '城市生态' },
  'Forestry': { en: 'Forestry', zh: '林学' },
  'Biology': { en: 'Biology', zh: '生物学' },
  'Scholarships': { en: 'Scholarships', zh: '奖学金' },
  'Microbiology': { en: 'Microbiology', zh: '微生物学' },
  'Plant-Microbe': { en: 'Plant-Microbe', zh: '植物-微生物' },
  'Team Lead': { en: 'Team Lead', zh: '团队负责人' },
  'Soil Ecosystem Services': { en: 'Soil Ecosystem Services', zh: '土壤生态系统服务' },
  'Agricultural Practices': { en: 'Agricultural Practices', zh: '农业管理方式' },
  'Non-CO₂ GHGs': { en: 'Non-CO₂ GHGs', zh: '非 CO₂ 温室气体' },
  'Large-scale Modelling': { en: 'Large-scale Modelling', zh: '大尺度建模' }
};

export interface ResearchCity {
  id: string;
  name: Loc;
  country: Loc;
  coords: [number, number];
  role: Loc;
}

export const researchCities: ResearchCity[] = [
  {
    id: 'wageningen',
    name: { en: 'Wageningen', zh: '瓦赫宁根' },
    country: { en: 'Netherlands', zh: '荷兰' },
    coords: [5.6645, 51.9692],
    role: {
      en: 'MSc & thesis, graduated May 2026', zh: '硕士与论文，2026 年 5 月毕业'
    }
  },
  {
    id: 'lapland',
    name: { en: 'Joensuu / Lapland', zh: '约恩苏 / 拉普兰' },
    country: { en: 'Finland', zh: '芬兰' },
    coords: [29.7636, 62.601],
    role: {
      en: 'Boreal forest fieldwork', zh: '北方针叶林野外工作'
    }
  },
  {
    id: 'vancouver',
    name: { en: 'Vancouver', zh: '温哥华' },
    country: { en: 'Canada', zh: '加拿大' },
    coords: [-123.246, 49.2606],
    role: {
      en: 'BSc, urban forestry research', zh: '学士，城市林业研究'
    }
  },
  {
    id: 'hangzhou',
    name: { en: 'Hangzhou', zh: '杭州' },
    country: { en: 'China', zh: '中国' },
    coords: [119.7249, 30.2588],
    role: {
      en: 'Forestry BSc & microbiology RA', zh: '林学学士与微生物学研究助理'
    }
  }
];
