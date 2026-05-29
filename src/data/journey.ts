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
    id: 'msc-wur',
    kind: 'education',
    title: {
      en: 'MSc, Urban Environmental Management',
      zh: '城市环境管理硕士',
      'zh-Hant': '都市環境管理碩士',
      nl: 'MSc, Stedelijk Milieubeheer',
      de: 'MSc, Urbanes Umweltmanagement',
      fi: 'MSc, kaupunkiympäristön hallinta',
      ja: '修士、都市環境管理学',
      ko: '석사, 도시환경관리',
      fr: "MSc, Gestion de l'environnement urbain"
    },
    org: {
      en: 'Wageningen University & Research',
      zh: '瓦赫宁根大学',
      'zh-Hant': '瓦赫寧根大學',
      nl: 'Wageningen University & Research',
      de: 'Wageningen University & Research',
      fi: 'Wageningen University & Research',
      ja: 'ワーヘニンゲン大学',
      ko: '바흐닝언 대학교',
      fr: 'Wageningen University & Research'
    },
    location: {
      en: 'Wageningen, Netherlands',
      zh: '瓦赫宁根，荷兰',
      'zh-Hant': '瓦赫寧根，荷蘭',
      nl: 'Wageningen, Nederland',
      de: 'Wageningen, Niederlande',
      fi: 'Wageningen, Alankomaat',
      ja: 'ワーヘニンゲン、オランダ',
      ko: '바흐닝언, 네덜란드',
      fr: 'Wageningen, Pays-Bas'
    },
    coords: [5.6645, 51.9692],
    start: '2024-09',
    end: '2026-05',
    ongoing: false,
    summary: {
      en: 'Specialization: Water Systems and Global Change. WIMEK Honours research programme 2025-2026. Focus on water quality, microplastic fate, and scenario analysis at catchment scale. Graduated end of May 2026.',
      zh: '专业方向：水系统与全球变化。2025-2026 年 WIMEK 荣誉研究项目。聚焦水质、微塑料归趋以及流域尺度的情景分析。2026 年 5 月底毕业。',
      'zh-Hant': '專業方向：水系統與全球變遷。2025-2026 年 WIMEK 榮譽研究計畫。聚焦水質、微塑膠歸趨以及流域尺度的情境分析。2026 年 5 月底畢業。',
      nl: 'Specialisatie: Watersystemen en Mondiale Verandering. WIMEK Honours-onderzoeksprogramma 2025-2026. Focus op waterkwaliteit, het lot van microplastic en scenarioanalyse op stroomgebiedsschaal. Afgestudeerd eind mei 2026.',
      de: 'Schwerpunkt: Wassersysteme und globaler Wandel. WIMEK-Honours-Forschungsprogramm 2025-2026. Fokus auf Wasserqualität, den Verbleib von Mikroplastik und Szenarioanalysen auf Einzugsgebietsebene. Abschluss Ende Mai 2026.',
      fi: 'Erikoistuminen: vesijärjestelmät ja globaali muutos. WIMEK Honours -tutkimusohjelma 2025-2026. Painopiste vedenlaadussa, mikromuovin kohtalossa ja skenaarioanalyysissä valuma-alueen mittakaavassa. Valmistuminen toukokuun 2026 lopussa.',
      ja: '専攻：水システムと地球規模の変化。WIMEK Honours 研究プログラム 2025-2026。水質、マイクロプラスチックの動態、流域スケールのシナリオ分析が中心。2026年5月末に修了。',
      ko: '전공: 물 시스템과 지구적 변화. WIMEK Honours 연구 프로그램 2025-2026. 수질, 미세플라스틱의 거동, 유역 규모의 시나리오 분석에 집중. 2026년 5월 말 졸업.',
      fr: "Spécialisation : systèmes hydriques et changement planétaire. Programme de recherche WIMEK Honours 2025-2026. Axé sur la qualité de l'eau, le devenir des microplastiques et l'analyse de scénarios à l'échelle des bassins versants. Diplômé fin mai 2026."
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
      zh: '硕士论文：构建一个估算全球次流域河流微塑料截留的混合框架',
      'zh-Hant': '碩士論文：建構一個估算全球次流域河流微塑膠截留的混合框架',
      nl: 'MSc-scriptie: naar een hybride raamwerk om de retentie van microplastic in rivieren in deelstroomgebieden wereldwijd te schatten',
      de: 'Masterarbeit: Auf dem Weg zu einem hybriden Framework zur Schätzung des Mikroplastik-Rückhalts in Flüssen in Teileinzugsgebieten weltweit',
      fi: 'Pro gradu: kohti hybridimallia mikromuovin pidättymisen arvioimiseksi joissa osavaluma-alueilla maailmanlaajuisesti',
      ja: '修士論文：世界のサブ流域における河川のマイクロプラスチック保持量を推定するハイブリッド枠組みの構築に向けて',
      ko: '석사 논문: 전 세계 소유역의 하천 미세플라스틱 저류량을 추정하기 위한 하이브리드 프레임워크 개발을 향하여',
      fr: "Mémoire de MSc : vers un cadre hybride pour estimer la rétention de microplastique dans les rivières des sous-bassins à l'échelle mondiale"
    },
    org: {
      en: 'Wageningen University & Research',
      zh: '瓦赫宁根大学',
      'zh-Hant': '瓦赫寧根大學',
      nl: 'Wageningen University & Research',
      de: 'Wageningen University & Research',
      fi: 'Wageningen University & Research',
      ja: 'ワーヘニンゲン大学',
      ko: '바흐닝언 대학교',
      fr: 'Wageningen University & Research'
    },
    location: {
      en: 'Wageningen, Netherlands',
      zh: '瓦赫宁根，荷兰',
      'zh-Hant': '瓦赫寧根，荷蘭',
      nl: 'Wageningen, Nederland',
      de: 'Wageningen, Niederlande',
      fi: 'Wageningen, Alankomaat',
      ja: 'ワーヘニンゲン、オランダ',
      ko: '바흐닝언, 네덜란드',
      fr: 'Wageningen, Pays-Bas'
    },
    coords: [5.6645, 51.9692],
    start: '2025-11',
    end: '2026-05',
    ongoing: false,
    summary: {
      en: 'Developed a hybrid framework to estimate spatially explicit microplastic river retention at the sub-basin scale worldwide, combining large-language-model (LLM) data extraction with machine learning (LightGBM) and benchmarking against the MARINA-Multi model. Graded 9.0/10, in the Water Systems and Global Change Group.',
      zh: '构建了一套混合框架，用于在全球次流域尺度上估算具有空间分辨率的河流微塑料截留，将大语言模型（LLM）数据抽取与机器学习（LightGBM）相结合，并以 MARINA-Multi 模型作为对照基准。成绩 9.0/10，于水系统与全球变化研究组完成。',
      'zh-Hant': '建構了一套混合框架，用於在全球次流域尺度上估算具空間分辨率的河流微塑膠截留，將大型語言模型（LLM）資料抽取與機器學習（LightGBM）相結合，並以 MARINA-Multi 模型作為對照基準。成績 9.0/10，於水系統與全球變遷研究組完成。',
      nl: 'Een hybride raamwerk ontwikkeld om ruimtelijk expliciete retentie van microplastic in rivieren op deelstroomgebiedsschaal wereldwijd te schatten, waarbij data-extractie met een large language model (LLM) wordt gecombineerd met machine learning (LightGBM) en wordt vergeleken met het MARINA-Multi-model. Beoordeeld met 9,0/10, bij de groep Watersystemen en Mondiale Verandering.',
      de: 'Ein hybrides Framework entwickelt, um den räumlich expliziten Mikroplastik-Rückhalt in Flüssen auf Teileinzugsgebietsebene weltweit zu schätzen, das die Datenextraktion mit einem großen Sprachmodell (LLM) mit maschinellem Lernen (LightGBM) verbindet und mit dem MARINA-Multi-Modell verglichen wird. Bewertet mit 9,0/10, in der Gruppe Wassersysteme und globaler Wandel.',
      fi: 'Kehitin hybridimallin, joka arvioi spatiaalisesti eksplisiittistä mikromuovin pidättymistä joissa osavaluma-alueiden mittakaavassa maailmanlaajuisesti, yhdistäen suuren kielimallin (LLM) tiedonpoiminnan koneoppimiseen (LightGBM) ja vertaillen sitä MARINA-Multi-malliin. Arvosana 9,0/10, vesijärjestelmät ja globaali muutos -ryhmässä.',
      ja: '世界のサブ流域スケールで空間的に明示的な河川のマイクロプラスチック保持量を推定するハイブリッド枠組みを開発。大規模言語モデル（LLM）によるデータ抽出と機械学習（LightGBM）を組み合わせ、MARINA-Multi モデルと比較。評価 9.0/10、水システムと地球規模の変化グループにて。',
      ko: '전 세계 소유역 규모에서 공간적으로 명시적인 하천 미세플라스틱 저류량을 추정하는 하이브리드 프레임워크를 개발. 대규모 언어 모델(LLM) 데이터 추출과 기계학습(LightGBM)을 결합하고 MARINA-Multi 모델과 비교. 평가 9.0/10, 물 시스템과 지구적 변화 그룹에서.',
      fr: "Développement d'un cadre hybride pour estimer la rétention spatialement explicite de microplastique dans les rivières à l'échelle des sous-bassins dans le monde, en combinant l'extraction de données par grand modèle de langage (LLM) et l'apprentissage automatique (LightGBM), avec une comparaison au modèle MARINA-Multi. Noté 9,0/10, au sein du groupe Systèmes hydriques et changement planétaire."
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
      zh: '助教，AI4Science 暑期学校',
      'zh-Hant': '助教，AI4Science 暑期學校',
      nl: 'Studentassistent, AI4Science Summer School',
      de: 'Tutor, AI4Science Summer School',
      fi: 'Opetusassistentti, AI4Science-kesäkoulu',
      ja: 'ティーチングアシスタント、AI4Science サマースクール',
      ko: '조교, AI4Science 여름학교',
      fr: "Assistant d'enseignement, AI4Science Summer School"
    },
    org: {
      en: 'University of Eastern Finland', zh: '东芬兰大学', 'zh-Hant': '東芬蘭大學', nl: 'University of Eastern Finland', de: 'University of Eastern Finland', fi: 'Itä-Suomen yliopisto', ja: '東フィンランド大学', ko: '동핀란드 대학교', fr: 'Université de Finlande orientale'
    },
    location: {
      en: 'Joensuu, Finland', zh: '约恩苏，芬兰', 'zh-Hant': '約恩蘇，芬蘭', nl: 'Joensuu, Finland', de: 'Joensuu, Finnland', fi: 'Joensuu, Suomi', ja: 'ヨエンスー、フィンランド', ko: '요엔수, 핀란드', fr: 'Joensuu, Finlande'
    },
    coords: [29.7636, 62.601],
    start: '2025-08',
    end: '2025-08',
    summary: {
      en: 'Co-taught an AI4Science lecture and supported students through the international summer school programme.',
      zh: '共同讲授 AI4Science 课程，并在国际暑期学校项目中为学生提供支持。',
      'zh-Hant': '共同講授 AI4Science 課程，並在國際暑期學校計畫中為學生提供支援。',
      nl: 'Mede een AI4Science-college gegeven en studenten begeleid tijdens het internationale zomerschoolprogramma.',
      de: 'Eine AI4Science-Vorlesung mitgehalten und Studierende im internationalen Summer-School-Programm betreut.',
      fi: 'Opetin osaltani AI4Science-luennon ja tuin opiskelijoita kansainvälisessä kesäkouluohjelmassa.',
      ja: 'AI4Science の講義を共同で担当し、国際サマースクールプログラムで学生をサポート。',
      ko: 'AI4Science 강의를 공동으로 진행하고 국제 여름학교 프로그램에서 학생들을 지원했습니다.',
      fr: "Co-animation d'un cours AI4Science et accompagnement des étudiants dans le cadre du programme international de summer school."
    },
    tags: ['Teaching', 'AI4Science', 'Summer School'],
    status: 'complete'
  },
  {
    id: 'ra-uef',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Internship)', zh: '研究助理（实习）', 'zh-Hant': '研究助理（實習）', nl: 'Onderzoeksassistent (stage)', de: 'Wissenschaftliche Hilfskraft (Praktikum)', fi: 'Tutkimusapulainen (harjoittelu)', ja: '研究助手（インターンシップ）', ko: '연구 조교 (인턴십)', fr: 'Assistant de recherche (stage)'
    },
    org: {
      en: 'University of Eastern Finland', zh: '东芬兰大学', 'zh-Hant': '東芬蘭大學', nl: 'University of Eastern Finland', de: 'University of Eastern Finland', fi: 'Itä-Suomen yliopisto', ja: '東フィンランド大学', ko: '동핀란드 대학교', fr: 'Université de Finlande orientale'
    },
    location: {
      en: 'Joensuu & Lapland, Finland', zh: '约恩苏与拉普兰，芬兰', 'zh-Hant': '約恩蘇與拉普蘭，芬蘭', nl: 'Joensuu & Lapland, Finland', de: 'Joensuu & Lappland, Finnland', fi: 'Joensuu ja Lappi, Suomi', ja: 'ヨエンスー＆ラップランド、フィンランド', ko: '요엔수 & 라플란드, 핀란드', fr: 'Joensuu et Laponie, Finlande'
    },
    coords: [29.7636, 62.601],
    start: '2025-05',
    end: '2025-09',
    summary: {
      en: 'Boreal-forest fieldwork in Lapland focused on dissolved organic carbon (DOC) in subarctic catchments, plus lab work and GIS watershed analysis.',
      zh: '在拉普兰开展北方针叶林野外工作，聚焦亚北极流域中的溶解有机碳（DOC），并进行实验室分析与 GIS 流域分析。',
      'zh-Hant': '在拉普蘭開展北方針葉林野外工作，聚焦亞北極流域中的溶解有機碳（DOC），並進行實驗室分析與 GIS 流域分析。',
      nl: 'Veldwerk in het boreale bos in Lapland, gericht op opgeloste organische koolstof (DOC) in subarctische stroomgebieden, plus labwerk en GIS-stroomgebiedsanalyse.',
      de: 'Feldarbeit im borealen Wald in Lappland mit Fokus auf gelösten organischen Kohlenstoff (DOC) in subarktischen Einzugsgebieten, dazu Laborarbeit und GIS-Einzugsgebietsanalyse.',
      fi: 'Maastotyötä boreaalisessa metsässä Lapissa, keskittyen liuenneeseen orgaaniseen hiileen (DOC) subarktisilla valuma-alueilla, sekä laboratoriotyötä ja GIS-valuma-alueanalyysiä.',
      ja: 'ラップランドでの北方林の野外調査で、亜寒帯流域の溶存有機炭素（DOC）に注目。実験室作業と GIS 流域解析も実施。',
      ko: '라플란드의 북방림 현장 조사로, 아북극 유역의 용존 유기탄소(DOC)에 집중. 실험실 작업과 GIS 유역 분석도 수행.',
      fr: "Travail de terrain en forêt boréale en Laponie, centré sur le carbone organique dissous (DOC) dans les bassins versants subarctiques, avec travail en laboratoire et analyse de bassin versant par GIS."
    },
    supervisor: 'Prof. Frank Berninger',
    bullets: [
      {
        en: 'Field sampling in Lapland: water samples for DOC measurement',
        zh: '在拉普兰进行野外采样：采集水样以测定 DOC',
        'zh-Hant': '在拉普蘭進行野外採樣：採集水樣以測定 DOC',
        nl: 'Veldbemonstering in Lapland: watermonsters voor DOC-meting',
        de: 'Probenahme im Feld in Lappland: Wasserproben für die DOC-Messung',
        fi: 'Maastonäytteenotto Lapissa: vesinäytteet DOC-mittausta varten',
        ja: 'ラップランドでの野外採取：DOC 測定用の水サンプル',
        ko: '라플란드 현장 채취: DOC 측정용 물 시료',
        fr: "Échantillonnage de terrain en Laponie : prélèvements d'eau pour la mesure du DOC"
      },
      {
        en: 'Lab preparation and instrument work for DOC analysis',
        zh: '为 DOC 分析进行实验室制备与仪器操作',
        'zh-Hant': '為 DOC 分析進行實驗室製備與儀器操作',
        nl: 'Labvoorbereiding en instrumentwerk voor DOC-analyse',
        de: 'Laborvorbereitung und Gerätearbeit für die DOC-Analyse',
        fi: 'Laboratoriovalmistelut ja laitetyö DOC-analyysiä varten',
        ja: 'DOC 分析のための実験室準備と機器操作',
        ko: 'DOC 분석을 위한 실험실 준비 및 기기 작업',
        fr: "Préparation en laboratoire et travail instrumental pour l'analyse du DOC"
      },
      {
        en: 'Manuscript in preparation: "Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        zh: '撰写中的论文：“Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments”',
        'zh-Hant': '撰寫中的論文：「Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments」',
        nl: 'Manuscript in voorbereiding: "Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        de: 'Manuskript in Vorbereitung: „Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        fi: 'Käsikirjoitus valmisteilla: "Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        ja: '準備中の論文：「Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments」',
        ko: '준비 중인 논문: "Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments"',
        fr: 'Article en préparation : « Hydraulic Shunting and the Mobilization of Terrestrial Dissolved Organic Carbon in Subarctic Boreal Catchments »'
      }
    ],
    tags: ['Field Research', 'Boreal Forest', 'DOC', 'GIS'],
    status: 'complete'
  },
  {
    id: 'bsc-ubc',
    kind: 'education',
    title: {
      en: 'BSc, Urban Forestry (Green Space Management)', zh: '城市林业学士（绿地管理）', 'zh-Hant': '都市林業學士（綠地管理）', nl: 'BSc Urban Forestry (Beheer van Groene Ruimte)', de: 'BSc Urban Forestry (Grünflächenmanagement)', fi: 'Kandidaatti, kaupunkimetsätalous (viheralueiden hallinta)', ja: '学士、都市林業（緑地管理）', ko: '학사, 도시임학 (녹지 관리)', fr: 'Licence, foresterie urbaine (gestion des espaces verts)'
    },
    org: {
      en: 'University of British Columbia', zh: '不列颠哥伦比亚大学', 'zh-Hant': '英屬哥倫比亞大學', nl: 'University of British Columbia', de: 'University of British Columbia', fi: 'University of British Columbia', ja: 'ブリティッシュコロンビア大学', ko: '브리티시컬럼비아 대학교', fr: 'Université de la Colombie-Britannique'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大', 'zh-Hant': '溫哥華，加拿大', nl: 'Vancouver, Canada', de: 'Vancouver, Kanada', fi: 'Vancouver, Kanada', ja: 'バンクーバー、カナダ', ko: '밴쿠버, 캐나다', fr: 'Vancouver, Canada'
    },
    coords: [-123.246, 49.2606],
    start: '2021-09',
    end: '2024-05',
    summary: {
      en: "GPA 83.7 / 100. Graduated with honors and named to the Dean's Honor List. Supervisor: Dr. Andrew Almas.",
      zh: 'GPA 83.7 / 100。以荣誉毕业，并入选院长荣誉榜。导师：Dr. Andrew Almas。',
      'zh-Hant': 'GPA 83.7 / 100。以榮譽畢業，並入選院長榮譽榜。指導教授：Dr. Andrew Almas。',
      nl: "GPA 83,7 / 100. Cum laude afgestudeerd en op de Dean's Honour List geplaatst. Begeleider: Dr. Andrew Almas.",
      de: "GPA 83,7 / 100. Mit Auszeichnung abgeschlossen und auf der Dean's Honor List geführt. Betreuer: Dr. Andrew Almas.",
      fi: "GPA 83,7 / 100. Valmistuin kunniamaininnoin ja pääsin dekaanin kunnialistalle (Dean's Honor List). Ohjaaja: Dr. Andrew Almas.",
      ja: 'GPA 83.7 / 100。優等で卒業し、ディーンズ・オナー・リストに選出。指導教員：Dr. Andrew Almas。',
      ko: "GPA 83.7 / 100. 우등으로 졸업하고 학장 우등 명단(Dean's Honor List)에 올랐습니다. 지도교수: Dr. Andrew Almas.",
      fr: "GPA 83,7 / 100. Diplômé avec mention et inscrit sur la Dean's Honor List. Encadrant : Dr. Andrew Almas."
    },
    tags: ['Urban Forestry', 'Green Space', 'GIS'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-tree',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Volunteer)', zh: '研究助理（志愿）', 'zh-Hant': '研究助理（志工）', nl: 'Onderzoeksassistent (vrijwilliger)', de: 'Wissenschaftliche Hilfskraft (ehrenamtlich)', fi: 'Tutkimusapulainen (vapaaehtoinen)', ja: '研究助手（ボランティア）', ko: '연구 조교 (자원봉사)', fr: 'Assistant de recherche (bénévole)'
    },
    org: {
      en: 'UBC, Faculty of Forestry', zh: 'UBC 林学院', 'zh-Hant': 'UBC 林學院', nl: 'UBC, faculteit Bosbouw', de: 'UBC, Fakultät für Forstwissenschaft', fi: 'UBC, metsätieteen tiedekunta', ja: 'UBC 林学部', ko: 'UBC 임학부', fr: 'UBC, faculté de foresterie'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大', 'zh-Hant': '溫哥華，加拿大', nl: 'Vancouver, Canada', de: 'Vancouver, Kanada', fi: 'Vancouver, Kanada', ja: 'バンクーバー、カナダ', ko: '밴쿠버, 캐나다', fr: 'Vancouver, Canada'
    },
    coords: [-123.246, 49.2606],
    start: '2024-02',
    end: '2024-04',
    summary: {
      en: '130,000+ tree inventory analysis for the City of Surrey: mortality, species, life-span patterns.',
      zh: '为萨里市（City of Surrey）分析逾 13 万棵树木的清查数据：死亡率、树种与寿命格局。',
      'zh-Hant': '為薩里市（City of Surrey）分析逾 13 萬棵樹木的清查資料：死亡率、樹種與壽命格局。',
      nl: 'Analyse van een boominventaris van 130.000+ bomen voor de gemeente Surrey: sterfte, soorten, levensduurpatronen.',
      de: 'Analyse eines Baumkatasters von über 130.000 Bäumen für die Stadt Surrey: Mortalität, Arten, Lebensdauermuster.',
      fi: 'Yli 130 000 puun inventaarioanalyysi Surreyn kaupungille: kuolleisuus, lajit, elinikäkuviot.',
      ja: 'サレー市向けに 13 万本以上の樹木インベントリを分析：枯死率、樹種、寿命のパターン。',
      ko: '서리시를 위해 13만 그루 이상의 수목 인벤토리를 분석: 고사율, 수종, 수명 패턴.',
      fr: "Analyse d'un inventaire de plus de 130 000 arbres pour la ville de Surrey : mortalité, espèces, profils de longévité."
    },
    supervisor: 'Dr. Andrew Adams',
    tags: ['Tree Inventory', 'Data Analysis', 'GIS'],
    status: 'complete'
  },
  {
    id: 'project-urban-heat',
    kind: 'project',
    title: {
      en: 'Urban Structure & Surface Temperature', zh: '城市结构与地表温度', 'zh-Hant': '都市結構與地表溫度', nl: 'Stedelijke structuur & oppervlaktetemperatuur', de: 'Städtische Struktur & Oberflächentemperatur', fi: 'Kaupunkirakenne & pintalämpötila', ja: '都市構造と地表面温度', ko: '도시 구조와 지표면 온도', fr: 'Structure urbaine & température de surface'
    },
    org: {
      en: 'University of British Columbia', zh: '不列颠哥伦比亚大学', 'zh-Hant': '英屬哥倫比亞大學', nl: 'University of British Columbia', de: 'University of British Columbia', fi: 'University of British Columbia', ja: 'ブリティッシュコロンビア大学', ko: '브리티시컬럼비아 대학교', fr: 'Université de la Colombie-Britannique'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大', 'zh-Hant': '溫哥華，加拿大', nl: 'Vancouver, Canada', de: 'Vancouver, Kanada', fi: 'Vancouver, Kanada', ja: 'バンクーバー、カナダ', ko: '밴쿠버, 캐나다', fr: 'Vancouver, Canada'
    },
    coords: [-123.246, 49.2606],
    start: '2024-01',
    end: '2024-04',
    summary: {
      en: 'Mapped UBC campus urban structure at 30 m resolution and analyzed land-use change impact on surface temperature 2014-2022. Group project applied a random-forest model to predict future LST in Wesbrook Village.',
      zh: '以 30 米分辨率绘制 UBC 校园的城市结构，分析 2014-2022 年土地利用变化对地表温度的影响。小组项目运用随机森林模型预测 Wesbrook Village 未来的地表温度（LST）。',
      'zh-Hant': '以 30 公尺分辨率繪製 UBC 校園的都市結構，分析 2014-2022 年土地利用變化對地表溫度的影響。小組計畫運用隨機森林模型預測 Wesbrook Village 未來的地表溫度（LST）。',
      nl: 'De stedelijke structuur van de UBC-campus in kaart gebracht op 30 m resolutie en de invloed van landgebruiksverandering op de oppervlaktetemperatuur (2014-2022) geanalyseerd. In dit groepsproject voorspelde een random-forestmodel de toekomstige LST in Wesbrook Village.',
      de: 'Die städtische Struktur des UBC-Campus mit 30 m Auflösung kartiert und den Einfluss von Landnutzungsänderungen auf die Oberflächentemperatur (2014-2022) analysiert. Im Gruppenprojekt sagte ein Random-Forest-Modell die künftige LST in Wesbrook Village voraus.',
      fi: 'Kartoitin UBC:n kampuksen kaupunkirakenteen 30 m:n resoluutiolla ja analysoin maankäytön muutoksen vaikutusta pintalämpötilaan vuosina 2014-2022. Ryhmäprojektissa satunnaismetsämalli ennusti tulevaa pintalämpötilaa (LST) Wesbrook Villagessa.',
      ja: 'UBC キャンパスの都市構造を 30m 解像度でマッピングし、2014-2022 年の土地利用変化が地表面温度に与える影響を分析。グループプロジェクトでは、ランダムフォレストモデルで Wesbrook Village の将来の地表面温度（LST）を予測。',
      ko: 'UBC 캠퍼스의 도시 구조를 30m 해상도로 매핑하고 2014-2022년 토지 이용 변화가 지표면 온도에 미치는 영향을 분석. 그룹 프로젝트에서 랜덤 포레스트 모델로 Wesbrook Village의 미래 지표면 온도(LST)를 예측.',
      fr: "Cartographie de la structure urbaine du campus UBC à 30 m de résolution et analyse de l'impact du changement d'usage des sols sur la température de surface (2014-2022). Dans ce projet de groupe, un modèle de forêt aléatoire a prédit la future LST à Wesbrook Village."
    },
    supervisor: 'Prof. Melissa McHale & Cody Bingham (MSc)',
    tags: ['Urban Forestry', 'Climate', 'Remote Sensing', 'Random Forest'],
    status: 'complete'
  },
  {
    id: 'ra-ubc-pollinator',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Full-time)', zh: '研究助理（全职）', 'zh-Hant': '研究助理（全職）', nl: 'Onderzoeksassistent (voltijd)', de: 'Wissenschaftliche Hilfskraft (Vollzeit)', fi: 'Tutkimusapulainen (kokoaikainen)', ja: '研究助手（フルタイム）', ko: '연구 조교 (정규직)', fr: 'Assistant de recherche (temps plein)'
    },
    org: {
      en: 'UBC, Pollinators and Climate Change Lab', zh: 'UBC 传粉者与气候变化实验室', 'zh-Hant': 'UBC 授粉者與氣候變遷實驗室', nl: 'UBC, Lab voor Bestuivers en Klimaatverandering', de: 'UBC, Labor für Bestäuber und Klimawandel', fi: 'UBC, pölyttäjien ja ilmastonmuutoksen laboratorio', ja: 'UBC 花粉媒介者・気候変動ラボ', ko: 'UBC 수분매개자·기후변화 연구실', fr: 'UBC, laboratoire Pollinisateurs et changement climatique'
    },
    location: {
      en: 'Vancouver, Canada', zh: '温哥华，加拿大', 'zh-Hant': '溫哥華，加拿大', nl: 'Vancouver, Canada', de: 'Vancouver, Kanada', fi: 'Vancouver, Kanada', ja: 'バンクーバー、カナダ', ko: '밴쿠버, 캐나다', fr: 'Vancouver, Canada'
    },
    coords: [-123.246, 49.2606],
    start: '2023-05',
    end: '2023-08',
    summary: {
      en: 'Field survey of insect and bumble-bee interactions with plants across 18 urban parks in Vancouver, with the Faculty of Land and Food Systems.',
      zh: '在温哥华 18 个城市公园开展野外调查，研究昆虫与熊蜂同植物的相互作用，与土地与食品系统学院合作。',
      'zh-Hant': '在溫哥華 18 個都市公園開展野外調查，研究昆蟲與熊蜂同植物的相互作用，與土地與食品系統學院合作。',
      nl: 'Veldonderzoek naar interacties van insecten en hommels met planten in 18 stadsparken in Vancouver, met de Faculty of Land and Food Systems.',
      de: 'Felduntersuchung der Interaktionen von Insekten und Hummeln mit Pflanzen in 18 städtischen Parks in Vancouver, mit der Faculty of Land and Food Systems.',
      fi: 'Maastotutkimus hyönteisten ja kimalaisten vuorovaikutuksesta kasvien kanssa 18 kaupunkipuistossa Vancouverissa, yhteistyössä Faculty of Land and Food Systems -tiedekunnan kanssa.',
      ja: 'バンクーバーの 18 の都市公園で、昆虫やマルハナバチと植物の相互作用を野外調査。Faculty of Land and Food Systems と共同。',
      ko: '밴쿠버의 18개 도시 공원에서 곤충 및 호박벌과 식물의 상호작용을 현장 조사. Faculty of Land and Food Systems와 협력.',
      fr: "Étude de terrain sur les interactions des insectes et des bourdons avec les plantes dans 18 parcs urbains de Vancouver, avec la Faculty of Land and Food Systems."
    },
    supervisor: 'Prof. Risa Sargant & Dr. Jens Ulrich',
    tags: ['Pollinators', 'Bumble Bees', 'Urban Ecology', 'Climate'],
    status: 'complete'
  },
  {
    id: 'bsc-zafu',
    kind: 'education',
    title: {
      en: 'BSc, Forestry', zh: '林学学士', 'zh-Hant': '林學學士', nl: 'BSc Bosbouw', de: 'BSc Forstwissenschaft', fi: 'Kandidaatti, metsätiede', ja: '学士、林学', ko: '학사, 임학', fr: 'Licence, foresterie'
    },
    org: {
      en: 'Zhejiang Agriculture and Forestry University', zh: '浙江农林大学', 'zh-Hant': '浙江農林大學', nl: 'Zhejiang Agriculture and Forestry University', de: 'Zhejiang Agriculture and Forestry University', fi: 'Zhejiang Agriculture and Forestry University', ja: '浙江農林大学', ko: '저장농림대학교', fr: 'Zhejiang Agriculture and Forestry University'
    },
    location: {
      en: 'Hangzhou, China', zh: '杭州，中国', 'zh-Hant': '杭州，中國', nl: 'Hangzhou, China', de: 'Hangzhou, China', fi: 'Hangzhou, Kiina', ja: '杭州、中国', ko: '항저우, 중국', fr: 'Hangzhou, Chine'
    },
    coords: [119.7249, 30.2588],
    start: '2019-09',
    end: '2024-06',
    summary: {
      en: 'GPA 87.7 / 100. Multiple national, provincial and institutional scholarships and life-science competition awards. Supervisors: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      zh: 'GPA 87.7 / 100。获得多项国家级、省级与校级奖学金及生命科学竞赛奖项。导师：Prof. Yeqing Ying 与 Prof. Wenhui Shi。',
      'zh-Hant': 'GPA 87.7 / 100。獲得多項國家級、省級與校級獎學金及生命科學競賽獎項。指導教授：Prof. Yeqing Ying 與 Prof. Wenhui Shi。',
      nl: 'GPA 87,7 / 100. Meerdere nationale, provinciale en universitaire beurzen en prijzen bij life-sciencewedstrijden. Begeleiders: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      de: 'GPA 87,7 / 100. Mehrere nationale, regionale und universitäre Stipendien sowie Auszeichnungen bei Life-Science-Wettbewerben. Betreuer: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      fi: 'GPA 87,7 / 100. Useita kansallisia, maakunnallisia ja yliopiston stipendejä sekä palkintoja biotieteiden kilpailuissa. Ohjaajat: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      ja: 'GPA 87.7 / 100。国家級・省級・学内の奨学金を多数、生命科学コンペでの受賞も。指導教員：Prof. Yeqing Ying、Prof. Wenhui Shi。',
      ko: 'GPA 87.7 / 100. 국가급·성급·교내 장학금 다수와 생명과학 경진대회 수상. 지도교수: Prof. Yeqing Ying & Prof. Wenhui Shi.',
      fr: "GPA 87,7 / 100. Plusieurs bourses nationales, provinciales et universitaires, ainsi que des prix de concours en sciences du vivant. Encadrants : Prof. Yeqing Ying & Prof. Wenhui Shi."
    },
    tags: ['Forestry', 'Biology', 'Scholarships'],
    status: 'complete'
  },
  {
    id: 'ra-zafu-psm',
    kind: 'experience',
    title: {
      en: 'Research Assistant (Part-time)', zh: '研究助理（兼职）', 'zh-Hant': '研究助理（兼職）', nl: 'Onderzoeksassistent (deeltijd)', de: 'Wissenschaftliche Hilfskraft (Teilzeit)', fi: 'Tutkimusapulainen (osa-aikainen)', ja: '研究助手（パートタイム）', ko: '연구 조교 (시간제)', fr: 'Assistant de recherche (temps partiel)'
    },
    org: {
      en: 'State Key Laboratory of Subtropical Silviculture', zh: '亚热带森林培育国家重点实验室', 'zh-Hant': '亞熱帶森林培育國家重點實驗室', nl: 'State Key Laboratory of Subtropical Silviculture', de: 'State Key Laboratory of Subtropical Silviculture', fi: 'State Key Laboratory of Subtropical Silviculture', ja: '亜熱帯造林国家重点実験室', ko: '아열대 조림 국가중점실험실', fr: 'State Key Laboratory of Subtropical Silviculture'
    },
    location: {
      en: 'Hangzhou, China', zh: '杭州，中国', 'zh-Hant': '杭州，中國', nl: 'Hangzhou, China', de: 'Hangzhou, China', fi: 'Hangzhou, Kiina', ja: '杭州、中国', ko: '항저우, 중국', fr: 'Hangzhou, Chine'
    },
    coords: [119.7249, 30.2588],
    start: '2019-10',
    end: '2021-08',
    summary: {
      en: 'Two consecutive projects in the State Key Laboratory of Subtropical Silviculture, on phosphorus-solubilizing microorganism (PSM) ecology in moso bamboo (Phyllostachys edulis) systems.',
      zh: '在亚热带森林培育国家重点实验室参与两个连续项目，研究毛竹（Phyllostachys edulis）系统中解磷微生物（PSM）的生态。',
      'zh-Hant': '在亞熱帶森林培育國家重點實驗室參與兩個連續計畫，研究毛竹（Phyllostachys edulis）系統中解磷微生物（PSM）的生態。',
      nl: 'Twee opeenvolgende projecten in het State Key Laboratory of Subtropical Silviculture, over de ecologie van fosfaatoplossende micro-organismen (PSM) in moso-bamboe (Phyllostachys edulis).',
      de: 'Zwei aufeinanderfolgende Projekte im State Key Laboratory of Subtropical Silviculture zur Ökologie phosphatlösender Mikroorganismen (PSM) in Moso-Bambus (Phyllostachys edulis).',
      fi: 'Kaksi peräkkäistä projektia State Key Laboratory of Subtropical Silviculture -laboratoriossa, aiheena fosforia liuottavien mikro-organismien (PSM) ekologia mosobambun (Phyllostachys edulis) järjestelmissä.',
      ja: '亜熱帯造林国家重点実験室での連続する 2 つのプロジェクト。モウソウチク（Phyllostachys edulis）系におけるリン溶解菌（PSM）の生態を研究。',
      ko: '아열대 조림 국가중점실험실에서 연속된 두 개의 프로젝트. 왕대(Phyllostachys edulis) 시스템에서 인 가용화 미생물(PSM)의 생태를 연구.',
      fr: "Deux projets consécutifs au State Key Laboratory of Subtropical Silviculture, sur l'écologie des micro-organismes solubilisant le phosphore (PSM) dans les systèmes de bambou moso (Phyllostachys edulis)."
    },
    supervisor: 'Prof. Yeqing Ying & Prof. Wenhui Shi',
    bullets: [
      {
        en: '2019-10 → 2020-11, PSM × Phyllostachys edulis: field work and data analysis',
        zh: '2019-10 → 2020-11，PSM × Phyllostachys edulis：野外工作与数据分析',
        'zh-Hant': '2019-10 → 2020-11，PSM × Phyllostachys edulis：野外工作與資料分析',
        nl: '2019-10 → 2020-11, PSM × Phyllostachys edulis: veldwerk en data-analyse',
        de: '2019-10 → 2020-11, PSM × Phyllostachys edulis: Feldarbeit und Datenanalyse',
        fi: '2019-10 → 2020-11, PSM × Phyllostachys edulis: maastotyö ja data-analyysi',
        ja: '2019-10 → 2020-11、PSM × Phyllostachys edulis：野外調査とデータ分析',
        ko: '2019-10 → 2020-11, PSM × Phyllostachys edulis: 현장 작업과 데이터 분석',
        fr: "2019-10 → 2020-11, PSM × Phyllostachys edulis : travail de terrain et analyse de données"
      },
      {
        en: '2020-10 → 2021-08, PSM strain interactions: team leader, proposal writing, leading the team to completion',
        zh: '2020-10 → 2021-08，PSM 菌株相互作用：担任组长、撰写项目申请，带领团队完成项目',
        'zh-Hant': '2020-10 → 2021-08，PSM 菌株相互作用：擔任組長、撰寫計畫申請，帶領團隊完成計畫',
        nl: '2020-10 → 2021-08, interacties tussen PSM-stammen: teamleider, voorstel schrijven, het team naar voltooiing geleid',
        de: '2020-10 → 2021-08, Interaktionen von PSM-Stämmen: Teamleitung, Antragstellung, Team bis zum Abschluss geführt',
        fi: '2020-10 → 2021-08, PSM-kantojen vuorovaikutus: tiiminvetäjä, hankehakemuksen kirjoittaminen, tiimin johtaminen valmiiksi',
        ja: '2020-10 → 2021-08、PSM 株間相互作用：チームリーダー、提案書作成、チームを完遂まで牽引',
        ko: '2020-10 → 2021-08, PSM 균주 간 상호작용: 팀장, 제안서 작성, 팀을 완수까지 이끔',
        fr: "2020-10 → 2021-08, interactions entre souches de PSM : chef d'équipe, rédaction de la proposition, conduite de l'équipe jusqu'à l'achèvement"
      }
    ],
    tags: ['Microbiology', 'Plant-Microbe', 'Forestry', 'Team Lead'],
    status: 'complete'
  }
];

// English tag -> localized label. Acronyms / proper nouns map to themselves.
export const tagT: Record<string, Loc> = {
  'Water Systems': { en: 'Water Systems', zh: '水系统', 'zh-Hant': '水系統', nl: 'Watersystemen', de: 'Wassersysteme', fi: 'Vesijärjestelmät', ja: '水システム', ko: '물 시스템', fr: 'Systèmes hydriques' },
  'Global Change': { en: 'Global Change', zh: '全球变化', 'zh-Hant': '全球變遷', nl: 'Mondiale verandering', de: 'Globaler Wandel', fi: 'Globaali muutos', ja: '地球規模の変化', ko: '지구적 변화', fr: 'Changement planétaire' },
  'Microplastics': { en: 'Microplastics', zh: '微塑料', 'zh-Hant': '微塑膠', nl: 'Microplastics', de: 'Mikroplastik', fi: 'Mikromuovi', ja: 'マイクロプラスチック', ko: '미세플라스틱', fr: 'Microplastiques' },
  'WIMEK Honours': { en: 'WIMEK Honours', zh: 'WIMEK Honours', 'zh-Hant': 'WIMEK Honours', nl: 'WIMEK Honours', de: 'WIMEK Honours', fi: 'WIMEK Honours', ja: 'WIMEK Honours', ko: 'WIMEK Honours', fr: 'WIMEK Honours' },
  'Machine Learning': { en: 'Machine Learning', zh: '机器学习', 'zh-Hant': '機器學習', nl: 'Machine learning', de: 'Maschinelles Lernen', fi: 'Koneoppiminen', ja: '機械学習', ko: '기계학습', fr: 'Apprentissage automatique' },
  'LLM': { en: 'LLM', zh: 'LLM', 'zh-Hant': 'LLM', nl: 'LLM', de: 'LLM', fi: 'LLM', ja: 'LLM', ko: 'LLM', fr: 'LLM' },
  'MARINA-Multi': { en: 'MARINA-Multi', zh: 'MARINA-Multi', 'zh-Hant': 'MARINA-Multi', nl: 'MARINA-Multi', de: 'MARINA-Multi', fi: 'MARINA-Multi', ja: 'MARINA-Multi', ko: 'MARINA-Multi', fr: 'MARINA-Multi' },
  'River Retention': { en: 'River Retention', zh: '河流截留', 'zh-Hant': '河流截留', nl: 'Rivierretentie', de: 'Fluss-Rückhalt', fi: 'Joen pidättymä', ja: '河川保持', ko: '하천 저류', fr: 'Rétention fluviale' },
  'Teaching': { en: 'Teaching', zh: '教学', 'zh-Hant': '教學', nl: 'Onderwijs', de: 'Lehre', fi: 'Opetus', ja: '教育', ko: '교육', fr: 'Enseignement' },
  'AI4Science': { en: 'AI4Science', zh: 'AI4Science', 'zh-Hant': 'AI4Science', nl: 'AI4Science', de: 'AI4Science', fi: 'AI4Science', ja: 'AI4Science', ko: 'AI4Science', fr: 'AI4Science' },
  'Summer School': { en: 'Summer School', zh: '暑期学校', 'zh-Hant': '暑期學校', nl: 'Zomerschool', de: 'Summer School', fi: 'Kesäkoulu', ja: 'サマースクール', ko: '여름학교', fr: 'Summer school' },
  'Field Research': { en: 'Field Research', zh: '野外研究', 'zh-Hant': '野外研究', nl: 'Veldonderzoek', de: 'Feldforschung', fi: 'Maastotutkimus', ja: '野外調査', ko: '현장 연구', fr: 'Recherche de terrain' },
  'Boreal Forest': { en: 'Boreal Forest', zh: '北方针叶林', 'zh-Hant': '北方針葉林', nl: 'Boreaal bos', de: 'Borealer Wald', fi: 'Boreaalinen metsä', ja: '北方林', ko: '북방림', fr: 'Forêt boréale' },
  'DOC': { en: 'DOC', zh: 'DOC', 'zh-Hant': 'DOC', nl: 'DOC', de: 'DOC', fi: 'DOC', ja: 'DOC', ko: 'DOC', fr: 'DOC' },
  'GIS': { en: 'GIS', zh: 'GIS', 'zh-Hant': 'GIS', nl: 'GIS', de: 'GIS', fi: 'GIS', ja: 'GIS', ko: 'GIS', fr: 'GIS' },
  'Urban Forestry': { en: 'Urban Forestry', zh: '城市林业', 'zh-Hant': '都市林業', nl: 'Stadsbosbouw', de: 'Stadtforstwirtschaft', fi: 'Kaupunkimetsätalous', ja: '都市林業', ko: '도시임학', fr: 'Foresterie urbaine' },
  'Green Space': { en: 'Green Space', zh: '绿地', 'zh-Hant': '綠地', nl: 'Groene ruimte', de: 'Grünflächen', fi: 'Viheralueet', ja: '緑地', ko: '녹지', fr: 'Espaces verts' },
  'Tree Inventory': { en: 'Tree Inventory', zh: '树木清查', 'zh-Hant': '樹木清查', nl: 'Boominventaris', de: 'Baumkataster', fi: 'Puuinventaario', ja: '樹木インベントリ', ko: '수목 인벤토리', fr: 'Inventaire forestier' },
  'Data Analysis': { en: 'Data Analysis', zh: '数据分析', 'zh-Hant': '資料分析', nl: 'Data-analyse', de: 'Datenanalyse', fi: 'Data-analyysi', ja: 'データ分析', ko: '데이터 분석', fr: 'Analyse de données' },
  'Climate': { en: 'Climate', zh: '气候', 'zh-Hant': '氣候', nl: 'Klimaat', de: 'Klima', fi: 'Ilmasto', ja: '気候', ko: '기후', fr: 'Climat' },
  'Remote Sensing': { en: 'Remote Sensing', zh: '遥感', 'zh-Hant': '遙感', nl: 'Remote sensing', de: 'Fernerkundung', fi: 'Kaukokartoitus', ja: 'リモートセンシング', ko: '원격 탐사', fr: 'Télédétection' },
  'Random Forest': { en: 'Random Forest', zh: '随机森林', 'zh-Hant': '隨機森林', nl: 'Random forest', de: 'Random Forest', fi: 'Satunnaismetsä', ja: 'ランダムフォレスト', ko: '랜덤 포레스트', fr: 'Forêt aléatoire' },
  'Pollinators': { en: 'Pollinators', zh: '传粉者', 'zh-Hant': '授粉者', nl: 'Bestuivers', de: 'Bestäuber', fi: 'Pölyttäjät', ja: '花粉媒介者', ko: '수분매개자', fr: 'Pollinisateurs' },
  'Bumble Bees': { en: 'Bumble Bees', zh: '熊蜂', 'zh-Hant': '熊蜂', nl: 'Hommels', de: 'Hummeln', fi: 'Kimalaiset', ja: 'マルハナバチ', ko: '호박벌', fr: 'Bourdons' },
  'Urban Ecology': { en: 'Urban Ecology', zh: '城市生态', 'zh-Hant': '都市生態', nl: 'Stadsecologie', de: 'Stadtökologie', fi: 'Kaupunkiekologia', ja: '都市生態学', ko: '도시 생태', fr: 'Écologie urbaine' },
  'Forestry': { en: 'Forestry', zh: '林学', 'zh-Hant': '林學', nl: 'Bosbouw', de: 'Forstwissenschaft', fi: 'Metsätiede', ja: '林学', ko: '임학', fr: 'Foresterie' },
  'Biology': { en: 'Biology', zh: '生物学', 'zh-Hant': '生物學', nl: 'Biologie', de: 'Biologie', fi: 'Biologia', ja: '生物学', ko: '생물학', fr: 'Biologie' },
  'Scholarships': { en: 'Scholarships', zh: '奖学金', 'zh-Hant': '獎學金', nl: 'Beurzen', de: 'Stipendien', fi: 'Stipendit', ja: '奨学金', ko: '장학금', fr: 'Bourses' },
  'Microbiology': { en: 'Microbiology', zh: '微生物学', 'zh-Hant': '微生物學', nl: 'Microbiologie', de: 'Mikrobiologie', fi: 'Mikrobiologia', ja: '微生物学', ko: '미생물학', fr: 'Microbiologie' },
  'Plant-Microbe': { en: 'Plant-Microbe', zh: '植物-微生物', 'zh-Hant': '植物-微生物', nl: 'Plant-microbe', de: 'Pflanze-Mikrobe', fi: 'Kasvi-mikrobi', ja: '植物-微生物', ko: '식물-미생물', fr: 'Plante-microbe' },
  'Team Lead': { en: 'Team Lead', zh: '团队负责人', 'zh-Hant': '團隊負責人', nl: 'Teamleider', de: 'Teamleitung', fi: 'Tiiminvetäjä', ja: 'チームリーダー', ko: '팀 리더', fr: "Chef d'équipe" }
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
    name: { en: 'Wageningen', zh: '瓦赫宁根', 'zh-Hant': '瓦赫寧根', nl: 'Wageningen', de: 'Wageningen', fi: 'Wageningen', ja: 'ワーヘニンゲン', ko: '바흐닝언', fr: 'Wageningen' },
    country: { en: 'Netherlands', zh: '荷兰', 'zh-Hant': '荷蘭', nl: 'Nederland', de: 'Niederlande', fi: 'Alankomaat', ja: 'オランダ', ko: '네덜란드', fr: 'Pays-Bas' },
    coords: [5.6645, 51.9692],
    role: {
      en: 'MSc & thesis, graduated May 2026', zh: '硕士与论文，2026 年 5 月毕业', 'zh-Hant': '碩士與論文，2026 年 5 月畢業', nl: 'MSc & scriptie, afgestudeerd mei 2026', de: 'MSc & Masterarbeit, Abschluss Mai 2026', fi: 'MSc & pro gradu, valmistui toukokuussa 2026', ja: '修士・修士論文、2026年5月修了', ko: '석사 및 논문, 2026년 5월 졸업', fr: 'MSc & mémoire, diplômé en mai 2026'
    }
  },
  {
    id: 'lapland',
    name: { en: 'Joensuu / Lapland', zh: '约恩苏 / 拉普兰', 'zh-Hant': '約恩蘇 / 拉普蘭', nl: 'Joensuu / Lapland', de: 'Joensuu / Lappland', fi: 'Joensuu / Lappi', ja: 'ヨエンスー / ラップランド', ko: '요엔수 / 라플란드', fr: 'Joensuu / Laponie' },
    country: { en: 'Finland', zh: '芬兰', 'zh-Hant': '芬蘭', nl: 'Finland', de: 'Finnland', fi: 'Suomi', ja: 'フィンランド', ko: '핀란드', fr: 'Finlande' },
    coords: [29.7636, 62.601],
    role: {
      en: 'Boreal forest fieldwork', zh: '北方针叶林野外工作', 'zh-Hant': '北方針葉林野外工作', nl: 'Veldwerk in boreaal bos', de: 'Feldarbeit im borealen Wald', fi: 'Maastotyö boreaalisessa metsässä', ja: '北方林の野外調査', ko: '북방림 현장 조사', fr: 'Travail de terrain en forêt boréale'
    }
  },
  {
    id: 'vancouver',
    name: { en: 'Vancouver', zh: '温哥华', 'zh-Hant': '溫哥華', nl: 'Vancouver', de: 'Vancouver', fi: 'Vancouver', ja: 'バンクーバー', ko: '밴쿠버', fr: 'Vancouver' },
    country: { en: 'Canada', zh: '加拿大', 'zh-Hant': '加拿大', nl: 'Canada', de: 'Kanada', fi: 'Kanada', ja: 'カナダ', ko: '캐나다', fr: 'Canada' },
    coords: [-123.246, 49.2606],
    role: {
      en: 'BSc, urban forestry research', zh: '学士，城市林业研究', 'zh-Hant': '學士，都市林業研究', nl: 'BSc, onderzoek stadsbosbouw', de: 'BSc, Forschung zur Stadtforstwirtschaft', fi: 'Kandidaatti, kaupunkimetsätalouden tutkimus', ja: '学士、都市林業の研究', ko: '학사, 도시임학 연구', fr: 'Licence, recherche en foresterie urbaine'
    }
  },
  {
    id: 'hangzhou',
    name: { en: 'Hangzhou', zh: '杭州', 'zh-Hant': '杭州', nl: 'Hangzhou', de: 'Hangzhou', fi: 'Hangzhou', ja: '杭州', ko: '항저우', fr: 'Hangzhou' },
    country: { en: 'China', zh: '中国', 'zh-Hant': '中國', nl: 'China', de: 'China', fi: 'Kiina', ja: '中国', ko: '중국', fr: 'Chine' },
    coords: [119.7249, 30.2588],
    role: {
      en: 'Forestry BSc & microbiology RA', zh: '林学学士与微生物学研究助理', 'zh-Hant': '林學學士與微生物學研究助理', nl: 'BSc Bosbouw & onderzoeksassistent microbiologie', de: 'BSc Forstwissenschaft & Hilfskraft Mikrobiologie', fi: 'Metsätieteen kandidaatti & mikrobiologian tutkimusapulainen', ja: '林学の学士・微生物学の研究助手', ko: '임학 학사 및 미생물학 연구 조교', fr: 'Licence en foresterie & assistant de recherche en microbiologie'
    }
  }
];
