// A curated selection of Yiyang's LinkedIn posts, newest first. Text is the
// post's own wording (hashtags trimmed). Dates are month-level because LinkedIn
// only shows relative times. `film` links a post to its film on the site;
// `photo` borrows a frame from the photo archive; `href` is the post itself
// when known, otherwise the card links to the LinkedIn activity feed.
import type { Loc } from './journey';

export const LINKEDIN_ACTIVITY = 'https://www.linkedin.com/in/yiyang-shen-%E6%B2%88%E4%BA%A6%E6%97%B8-05502821b/recent-activity/all/';
// A single post, by the number in its urn:li:activity id.
const post = (id: string) => `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;

export interface Note {
  date: string; // YYYY-MM, or YYYY when only the year is certain
  kind: Loc;
  text: string;
  tags?: string[];
  film?: string;
  photo?: string;
  link?: { label: string; href: string };
  href?: string;
}

export const notes: Note[] = [
  {
    date: '2026-10',
    kind: { en: 'Music', zh: '音乐' },
    text:
      "I just made a four-minute orchestral piece with an AI. It started with a piece of music I couldn't stop replaying: the curtain call of 大染坊 (The Dye House), a dance drama by the Shandong Song and Dance Theatre. That became 《青出于蓝》, Bluer Than Indigo: a boy at a dye vat, a master who leaves, a storm, a thousand blue cloths in the wind, and in the end the boy's own cloth comes out bluer than his master's. Claude wrote every note in code, and a shadow-puppet film goes with it. The strange part for me: the most important thing I did wasn't technical at all. I listened carefully and said honestly what I felt.",
    tags: ['GenerativeAI', 'AIMusic', 'ChineseCulture'],
    href: post('7518005460109725697')
  },
  {
    date: '2026-10',
    kind: { en: 'Explainer', zh: '讲解视频' },
    text:
      "I wanted to see how far Claude Code with Opus 5.5 could go on an educational video. It went further than I expected. The video explains how a 33-second opening for my master's montage was made: 200+ cuts of my own face, with the eyes pinned to the same spot the whole time. Claude Code drove DaVinci Resolve through MCP, local models did the music and the sound design, and face landmarks kept the eyes within 12 to 18 pixels in 4K. My part was directing: what the story is, which cut looks right, where to pause.",
    link: {
      label: 'face-aligned-montage: code, data, tutorial and prompts, plus a Claude Code skill and agent',
      href: 'https://github.com/syydaniel/face-aligned-montage'
    },
    tags: ['ClaudeCode', 'DaVinciResolve', 'OpenSource'],
    href: post('7514990930186149888')
  },
  {
    date: '2026-09',
    kind: { en: 'Animation', zh: '动画' },
    text:
      'For the Mid-Autumn Festival, I made a 30-second ink-wash animation without drawing a single stroke by hand. No footage. No image assets. No text. Every frame is calculated by one GLSL shader: rice paper, ink blooming into mountains, a full moon rising over a misty lake, geese crossing the moon, a lantern boat drifting past, osmanthus flowers falling. The music was generated locally with ACE-Step 1.5, and the moon clears the peaks exactly as the music swells. Happy Mid-Autumn Festival! 中秋快乐',
    link: {
      label: 'midautumn-shanshui: the whole project, with docs in English and Chinese',
      href: 'https://github.com/syydaniel/midautumn-shanshui'
    },
    tags: ['MidAutumnFestival', 'GLSL', 'CreativeCoding'],
    href: post('7509562213708365825')
  },
  {
    date: '2026-09',
    kind: { en: 'Climate', zh: '气候' },
    text: 'Does this mean our future climate scenarios need a fundamental recalibration?',
    link: {
      label: 'UNEP: World set to cross 1.5°C global warming, but can still limit, adapt to and return from higher temperatures',
      href: 'https://www.unep.org/news-and-stories/press-release/unep-world-set-cross-15degc-global-warming-can-still-limit-adapt-and'
    },
    href: post('7501290114346770432')
  },
  {
    date: '2026-08',
    kind: { en: 'Graduation', zh: '毕业' },
    text:
      'For the final stop of my graduation trip, I visited the Faroe Islands at the end of August, and I brought my Wageningen diploma along! Maybe this is the first Wageningen University & Research diploma to make it all the way to the Faroe Islands? A memorable way to celebrate the end of one chapter and the beginning of the next, surrounded by some truly spectacular landscapes.',
    tags: ['FaroeIslands', 'WUR', 'Graduation'],
    photo: '/photos/faroe-islands/_thumbs/DJI_20260824141506_0364_D_1.jpg',
    href: post('7497555507587538944')
  },
  {
    date: '2026-08',
    kind: { en: 'Sky', zh: '天象' },
    text: 'Total solar eclipse 2026, Calatayud, Spain!',
    photo: '/photos/spain/_thumbs/DSC_8694.jpg',
    href: post('7493381841379463169')
  },
  {
    date: '2026-07',
    kind: { en: 'History of science', zh: '科学史' },
    text:
      'Back from South Africa, after spending a few days in France, I finally arrived in Praia, the capital of Cape Verde, on Santiago Island. On 16 January 1832, Charles Darwin arrived on Santiago Island and spent about three weeks exploring it; it became the first place where he carried out systematic fieldwork during the voyage of the Beagle. In Cape Verde, Darwin realized that rock layers could reveal the history of an island. He later recalled resting beneath a low lava cliff, where he first had the clear idea of writing a book on geology.',
    tags: ['CapeVerde', 'CharlesDarwin', 'Geology'],
    href: post('7483976394763317249')
  },
  {
    date: '2026-07',
    kind: { en: 'Wildlife', zh: '野生动物' },
    text: 'Some animal collection in South Africa. Next stop: Cabo Verde.',
    tags: ['SouthAfrica', 'Wildlife'],
    film: 'BV1mLNn6nEef',
    href: post('7481290144830906368')
  },
  {
    date: '2026-07',
    kind: { en: 'Geography', zh: '地理' },
    text:
      "Day 12 in South Africa, and I finally made it to the iconic Cape of Good Hope! Fun fact: many people believe this is the southernmost point of Africa, but that's actually a common misconception. The Cape of Good Hope is the southwesternmost point of the African continent. The true southernmost point is Cape Agulhas, where the Atlantic and Indian Oceans officially meet.",
    tags: ['SouthAfrica', 'CapeOfGoodHope', 'Geography'],
    photo: '/photos/south-africa/_thumbs/DSC_4554.jpg',
    href: post('7480632659887685632')
  },
  {
    date: '2026-06',
    kind: { en: 'Rivers', zh: '河流' },
    text:
      "Earlier this month I visited the northernmost city in the world, Longyearbyen. Now I'm in South Africa, exploring its largest national park, Kruger National Park. What excites me most is the Southern Hemisphere night sky and of course, the incredible wildlife. From the airplane I saw the Olifants River, one of the most important rivers in Kruger National Park: it originates in Mpumalanga, passes through scenic dams and gorges, and eventually joins the Limpopo River before reaching the Indian Ocean.",
    tags: ['SouthAfrica', 'KrugerNationalPark'],
    photo: '/photos/south-africa/_thumbs/DSC_7891.jpg',
    href: post('7476256166482800641')
  },
  {
    date: '2026-06',
    kind: { en: 'Weather', zh: '天气' },
    text: 'A magnificent thunderstorm just passed by Wageningen.',
    tags: ['Thunderstorm', 'Wageningen'],
    href: post('7473845922674798592')
  },
  {
    date: '2026-06',
    kind: { en: 'Wildlife', zh: '野生动物' },
    text: 'Happy to share some wildlife I saw in the last week in Longyearbyen.',
    tags: ['Longyearbyen', 'Svalbard'],
    film: 'BV1rJEG6XEfb',
    href: post('7469753784060059648')
  },
  {
    date: '2026-06',
    kind: { en: 'Ecology', zh: '生态' },
    text:
      'The little auk (Alle alle) plays a surprisingly important ecological role in the Arctic. Although it is a small seabird, it connects marine and terrestrial ecosystems by feeding on zooplankton at sea and transporting nutrients back to land through guano deposition at breeding colonies. This process enriches Arctic tundra soils, supports vegetation growth, and influences local freshwater and terrestrial food webs. Because little auks depend strongly on cold-water zooplankton, they are also considered an important indicator species for climate change.',
    tags: ['Svalbard', 'Arctic', 'Ecology'],
    href: post('7468169436449943552')
  },
  {
    date: '2026-05',
    kind: { en: 'Graduation', zh: '毕业' },
    text:
      "About 30 minutes ago, I finished my master's thesis defense, which marks the end of my master's study journey. Looking back, two years ago I used ChatGPT to find the “most suitable” university that matched my background in Urban Forestry at The University of British Columbia, and somehow that journey brought me to Urban Environmental Management at Wageningen University & Research. Towards the future, no one knows what will happen. But in this era, for our generation, I deeply feel that we are gradually entering a defining period of the mid-21st century. And all of us, in our own ways, are trying to make the world a better place.",
    tags: ['WUR', 'Graduation'],
    href: post('7465787907182874625')
  },
  {
    date: '2026-04',
    kind: { en: 'AI for research', zh: 'AI 与科研' },
    text:
      'You might be surprised by how Claude Code can facilitate building your personal website (and HTML-based education websites, too). The only thing I did was send my CV and guide the coding by chatting for 10 minutes. I can imagine how powerful this could be for education websites, like introducing your papers or models.',
    href: post('7452032106123300864')
  },
  {
    date: '2026-04',
    kind: { en: 'Weather', zh: '天气' },
    text:
      'Just now, between 10:30 PM and 11:00 PM (April 9, 2026), we experienced a brief but intense 30-minute thunderstorm here in the Wageningen area. I was incredibly lucky to have my camera ready and managed to capture some stunning shots of the lightning lighting up the night sky. There is always something so humbling and awe-inspiring about witnessing the raw power of nature firsthand.',
    tags: ['Wageningen', 'Thunderstorm', 'Lightning'],
    href: post('7448115531506892802')
  },
  {
    date: '2026-04',
    kind: { en: 'Sky', zh: '天象' },
    text: 'Spending more than 70 hours to capture and after processing these deep sky objects in the past 1.5 months using Seestar S30 Pro smart telescopes. I am impressed by the results.',
    tags: ['DeepSky', 'Astro'],
    href: post('7445129073011429376')
  },
  {
    date: '2024',
    kind: { en: 'Wageningen', zh: '瓦赫宁根' },
    text:
      'August 12th marked the beginning of my journey in the Netherlands, kicking off my graduate studies at Wageningen University. This small city is alive with an international vibe, all thanks to the university. The light pollution from nearby cities casts a yellow hue across the lower sky, but when you look up, the deep darkness of the night reveals a unique kind of beauty.',
    tags: ['StudyInHolland', 'WageningenUniversity']
  }
];
