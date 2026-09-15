// A curated selection of Yiyang's LinkedIn posts, newest first. Text is the
// post's own wording (hashtags trimmed). Dates are month-level because LinkedIn
// only shows relative times. `film` links a post to its film on the site;
// `photo` borrows a frame from the photo archive; `href` is the post itself
// when known, otherwise the card links to the LinkedIn activity feed.
import type { Loc } from './journey';

export const LINKEDIN_ACTIVITY = 'https://www.linkedin.com/in/yiyang-shen-%E6%B2%88%E4%BA%A6%E6%97%B8-05502821b/recent-activity/all/';

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
    date: '2026-09',
    kind: { en: 'Climate', zh: '气候' },
    text: 'Does this mean our future climate scenarios need a fundamental recalibration?',
    link: {
      label: 'UNEP: World set to cross 1.5°C global warming, but can still limit, adapt to and return from higher temperatures',
      href: 'https://www.unep.org/'
    }
  },
  {
    date: '2026-08',
    kind: { en: 'Graduation', zh: '毕业' },
    text:
      'For the final stop of my graduation trip, I visited the Faroe Islands at the end of August, and I brought my Wageningen diploma along! Maybe this is the first Wageningen University & Research diploma to make it all the way to the Faroe Islands? A memorable way to celebrate the end of one chapter and the beginning of the next, surrounded by some truly spectacular landscapes.',
    tags: ['FaroeIslands', 'WUR', 'Graduation'],
    photo: '/photos/faroe-islands/_thumbs/DJI_20260824141506_0364_D_1.jpg'
  },
  {
    date: '2026-08',
    kind: { en: 'Sky', zh: '天象' },
    text: 'Total solar eclipse 2026, Calatayud, Spain!',
    photo: '/photos/spain/_thumbs/DSC_8694.jpg'
  },
  {
    date: '2026-07',
    kind: { en: 'History of science', zh: '科学史' },
    text:
      'Back from South Africa, after spending a few days in France, I finally arrived in Praia, the capital of Cape Verde, on Santiago Island. On 16 January 1832, Charles Darwin arrived on Santiago Island and spent about three weeks exploring it; it became the first place where he carried out systematic fieldwork during the voyage of the Beagle. In Cape Verde, Darwin realized that rock layers could reveal the history of an island. He later recalled resting beneath a low lava cliff, where he first had the clear idea of writing a book on geology.',
    tags: ['CapeVerde', 'CharlesDarwin', 'Geology']
  },
  {
    date: '2026-07',
    kind: { en: 'Wildlife', zh: '野生动物' },
    text: 'Some animal collection in South Africa. Next stop: Cabo Verde.',
    tags: ['SouthAfrica', 'Wildlife'],
    film: 'BV1mLNn6nEef'
  },
  {
    date: '2026-06',
    kind: { en: 'Wildlife', zh: '野生动物' },
    text: 'Happy to share some wildlife I saw in the last week in Longyearbyen.',
    tags: ['Longyearbyen', 'Svalbard'],
    film: 'BV1rJEG6XEfb'
  },
  {
    date: '2026',
    kind: { en: 'AI for research', zh: 'AI 与科研' },
    text:
      'You might be surprised by how Claude Code can facilitate building your personal website (and HTML-based education websites, too). The only thing I did was send my CV and guide the coding by chatting for 10 minutes. I can imagine how powerful this could be for education websites, like introducing your papers or models.'
  },
  {
    date: '2024',
    kind: { en: 'Wageningen', zh: '瓦赫宁根' },
    text:
      'August 12th marked the beginning of my journey in the Netherlands, kicking off my graduate studies at Wageningen University. This small city is alive with an international vibe, all thanks to the university. The light pollution from nearby cities casts a yellow hue across the lower sky, but when you look up, the deep darkness of the night reveals a unique kind of beauty.',
    tags: ['StudyInHolland', 'WageningenUniversity']
  }
];
