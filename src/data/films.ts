// Films I've published on Bilibili (space.bilibili.com/437321627), newest first.
// Videos are embedded with Bilibili's player, nothing is self-hosted.
// `cover` is the Bilibili archive image id; featured films use a still pulled
// from the 4K master instead (public/films/*.jpg).
import type { Loc } from './journey';

export const BILIBILI_SPACE = 'https://space.bilibili.com/437321627';

export interface Film {
  bvid: string;
  a3?: string; // ISO country code, matches the Places list
  date: string; // YYYY-MM-DD, Bilibili publish date
  duration: string; // mm:ss
  title: Loc;
  poster?: Loc; // short title set on the archive poster
  place?: Loc;
  cover: string; // https URL without size suffix
  featured?: {
    still: string;
    stillSm: string;
    tagline: Loc;
    coords?: string;
    focus?: string; // object-position of the still
  };
}

const hd = (id: string, ext = 'jpg') => `https://i1.hdslb.com/bfs/archive/${id}.${ext}`;

export const films: Film[] = [
  {
    bvid: 'BV1mLNn6nEef', date: '2026-07-10', duration: '02:50', a3: 'ZAF',
    title: { en: 'What I filmed in South Africa', zh: '我在南非都拍到了什么？' },
    place: { en: 'South Africa', zh: '南非' },
    cover: hd('8f2c45c1d744efdf3fb07795031a6bfc25769668'),
    featured: {
      still: '/films/south-africa.jpg', stillSm: '/films/south-africa-sm.jpg',
      tagline: { en: 'Lions at first light, hippos, whales off the coast and a colony of penguins.', zh: '晨光里的狮子、河马、近海的鲸，还有一群企鹅。' },
      focus: '30% 50%'
    }
  },
  {
    bvid: 'BV1FJjr6bEKc', date: '2026-06-20', duration: '00:44',
    title: { en: "Who's facing the heavenly tribulation?", zh: '何 方 道 友 在 渡 劫!' },
    poster: { en: 'The Tribulation', zh: '渡劫' },
    cover: hd('26ee39c8ac506591cc9b1d3d8378ca65286e87ee')
  },
  {
    bvid: 'BV1rJEG6XEfb', date: '2026-06-08', duration: '03:09', a3: 'NOR',
    title: { en: "Longyearbyen, I'm back", zh: '朗伊尔城我又来了' },
    place: { en: 'Svalbard, Norway', zh: '挪威 斯瓦尔巴' },
    cover: hd('b9a026143fd0de7ea4ad31f530373933416be221'),
    featured: {
      still: '/films/longyearbyen.jpg', stillSm: '/films/longyearbyen-sm.jpg',
      tagline: { en: 'Back at 78°N: walrus, reindeer, glaciers and the bird cliffs of Fuglefjella.', zh: '再次来到北纬 78°：海象、驯鹿、冰川，还有 Fuglefjella 的鸟崖。' },
      coords: '78°13′N', focus: '20% 50%'
    }
  },
  {
    bvid: 'BV13uBcBSEBJ', date: '2025-12-20', duration: '03:38',
    title: { en: 'Europe: looking back on 2025 from the Frozen Throne', zh: '欧洲，坐在冰封王座回望2025！' },
    poster: { en: 'The Frozen Throne', zh: '冰封王座' },
    place: { en: 'Europe', zh: '欧洲' },
    cover: hd('eed44c37515986a2133e34ffcd6f5c0eb2d6853d')
  },
  {
    bvid: 'BV1MCabzbEK4', date: '2025-09-05', duration: '01:20', a3: 'FIN',
    title: { en: 'Finland turns green on me again', zh: '又来，芬兰又绿了我一次！' },
    poster: { en: 'Green Again', zh: '又绿了' },
    place: { en: 'Finland', zh: '芬兰' },
    cover: hd('719582b5b977d544824c41543afcb32997f5d27e')
  },
  {
    bvid: 'BV1iHjTzuEHW', date: '2025-05-25', duration: '04:44', a3: 'NOR',
    title: { en: 'When the "Nikon anthem" meets Longyearbyen', zh: '当 "尼 康 战 歌" 遇到 "朗 伊 尔 城"' },
    poster: { en: 'Nikon Anthem', zh: '尼康战歌' },
    place: { en: 'Svalbard, Norway', zh: '挪威 斯瓦尔巴' },
    cover: hd('a896513a4dabc2782017b41374bff6deb40347f6')
  },
  {
    bvid: 'BV1WRVfzoEKS', date: '2025-05-11', duration: '02:30', a3: 'NOR',
    title: { en: 'Longyearbyen stays with you', zh: '“朗伊尔城的后劲太大了”' },
    poster: { en: 'Aftertaste', zh: '后劲' },
    place: { en: 'Svalbard, Norway', zh: '挪威 斯瓦尔巴' },
    cover: hd('f121493e2384528de349d11ea2e69fede565eefa')
  },
  {
    bvid: 'BV1yXf2YFEFT', date: '2025-01-27', duration: '23:23',
    title: { en: "Don't come to the Arctic Circle! Cracking the aurora oracle", zh: '千万别来北极圈！中国留学生破解欧若拉神谕后的离奇遭遇' },
    poster: { en: 'The Aurora Oracle', zh: '欧若拉神谕' },
    place: { en: 'Arctic Circle', zh: '北极圈' },
    cover: hd('69826ad98eea5115302242e4b54bdcc8291bd6c0')
  },
  {
    bvid: 'BV1pxwte2ELq', date: '2025-01-21', duration: '02:13',
    title: { en: 'Seven nights in the Arctic to see a real aurora storm', zh: '我在北极圈内连续拍摄了7天才明白这才是真正的极光大爆发' },
    poster: { en: 'Seven Nights', zh: '七夜' },
    place: { en: 'Arctic Circle', zh: '北极圈' },
    cover: hd('2832a03d182eced099c6bf8e51436ed3c39c8291')
  },
  {
    bvid: 'BV1vQr4Y7EZU', date: '2025-01-05', duration: '00:26',
    title: { en: 'An aurora storm from the plane window', zh: '飞机上极光大爆发｜想把此刻的幸运分享给大家' },
    poster: { en: 'Window Seat', zh: '靠窗的极光' },
    cover: hd('6e459c8dc4a2e6c9138dacaa652def2bdd1372ae')
  },
  {
    bvid: 'BV1ENU4YNEGh', date: '2024-11-19', duration: '09:31',
    title: { en: 'This is my 2024: a year of landscape timelapse', zh: '我的2024年度风光延时摄影合集 | This is my 2024' },
    poster: { en: 'This Is My 2024', zh: '我的2024' },
    cover: hd('77eb9d6e97d7875e8cdebd575d2de36b561b4c9f')
  },
  {
    bvid: 'BV1NYywYNET2', date: '2024-10-17', duration: '01:22',
    title: { en: 'Farewell, comet Tsuchinshan-ATLAS', zh: '要说再见了紫金山阿特拉斯' },
    poster: { en: 'Farewell, Comet', zh: '再见，彗星' },
    cover: hd('e520224d761cd67245064401745222e7b640a538')
  },
  {
    bvid: 'BV1tymJYhEcB', date: '2024-10-15', duration: '01:24',
    title: { en: 'A 60,000-year encounter: comet C/2023 A3', zh: '众望所归60000年的相遇，见到了紫金山阿特拉斯2023A3' },
    poster: { en: '60,000 Years', zh: '六万年' },
    cover: hd('3e5cad9eecd6c3aa04f040fd4ea26e6a233ebe0c')
  },
  {
    bvid: 'BV1ve2SYdERq', date: '2024-10-11', duration: '01:49', a3: 'NLD',
    title: { en: 'Aurora over the Wageningen campus', zh: '【研究生路上的风景】我在瓦赫宁根校园看到了极光！' },
    poster: { en: 'Campus Aurora', zh: '校园极光' },
    place: { en: 'Wageningen', zh: '瓦赫宁根' },
    cover: hd('e06b8aa0a755d0b6976a9068330c7bdf1b61cef6')
  },
  {
    bvid: 'BV1DK27YREM9', date: '2024-10-08', duration: '02:07', a3: 'NLD',
    title: { en: 'Mid-Autumn to National Day: the same moon, far from home', zh: '【研究生路上的风景】从中秋到国庆，身处异乡看到的是同一轮明月' },
    poster: { en: 'The Same Moon', zh: '同一轮明月' },
    place: { en: 'Wageningen', zh: '瓦赫宁根' },
    cover: hd('7d611d0cc46ee9fe914063200ef8fa8ea865edf2')
  },
  {
    bvid: 'BV1fu4mexETY', date: '2024-09-15', duration: '01:37', a3: 'NLD',
    title: { en: 'A dog park that is secretly a night-sky spot', zh: '【研究生路上的风景】什么，狗狗公园竟然是拍摄极光星空的圣地？' },
    poster: { en: 'Dog Park Nights', zh: '狗狗公园' },
    place: { en: 'Wageningen', zh: '瓦赫宁根' },
    cover: hd('c2a164c5c1113fd7cbd35cf4e0ee3a3750807f46')
  },
  {
    bvid: 'BV16gHtexEFe', date: '2024-09-04', duration: '01:27', a3: 'NLD',
    title: { en: 'Sunrise, sunset and the Milky Way in Wageningen', zh: '【研究生路上的风景】我在瓦赫宁根遇到了最美日出日落和星河灿烂' },
    poster: { en: 'Wageningen Skies', zh: '瓦赫宁根的天空' },
    place: { en: 'Wageningen', zh: '瓦赫宁根' },
    cover: hd('ba2a14f7e333605f2ab4d9c801cb46dbbca2b3bb')
  },
  {
    bvid: 'BV1topZe8E29', date: '2024-08-17', duration: '21:10', a3: 'CHN',
    title: { en: 'Tibet: up at 5:30 on day two to walk the kora', zh: '【西藏之行】什么，我竟然在正式到达西藏的第二天早上5：30起床去转寺？' },
    poster: { en: 'Kora at Dawn', zh: '清晨转寺' },
    place: { en: 'Tibet', zh: '西藏' },
    cover: hd('07ba3a41aeb5b44f762d4871743b24cdbcaec8a5')
  },
  {
    bvid: 'BV1JiYWeGEWi', date: '2024-08-08', duration: '28:49', a3: 'CHN',
    title: { en: 'Tibet: 44 hours on a hard seat, Shanghai to Lhasa on the Z164', zh: '【西藏之行】44个小时Z164硬座上海直达拉萨' },
    poster: { en: '44 Hours to Lhasa', zh: '44小时到拉萨' },
    place: { en: 'Tibet', zh: '西藏' },
    cover: hd('7e810ff53c5dfe9596001140b4854176945b14d7')
  },
  {
    bvid: 'BV1rT421973o', date: '2024-05-04', duration: '05:24',
    title: { en: 'Five years of undergrad in one small montage', zh: '嘿嘿是我5年本科的小合集' },
    poster: { en: 'Five Years', zh: '五年' },
    cover: hd('82436108154c5bb9731f483c8d4fdce15d212a12', 'png')
  },
  {
    bvid: 'BV1394y167XK', date: '2023-08-27', duration: '02:50', a3: 'CAN',
    title: { en: 'Three years in Canada', zh: '来加拿大三年我见证了什么..' },
    poster: { en: 'Three Years in Canada', zh: '加拿大三年' },
    place: { en: 'Canada', zh: '加拿大' },
    cover: hd('5d9af861e13f28710e69e87c91d8ba8a30b3e7f5')
  },
  {
    bvid: 'BV1tv4y117hj', date: '2023-01-16', duration: '04:20',
    title: { en: 'Timelapse: I think, therefore I am', zh: '延时摄影 | 我思故我在' },
    poster: { en: 'Cogito', zh: '我思故我在' },
    cover: hd('3733eddf7f29e8a6f7e44467918d40578eb688b9')
  },
  {
    bvid: 'BV1iv4y1z7oe', date: '2022-12-25', duration: '07:49',
    title: { en: 'Chasing a cinematic look after a night of snow', zh: '寻找电影感 | 当雪下了一个晚上后' },
    poster: { en: 'After the Snow', zh: '雪后' },
    cover: hd('71b2a0353361378b3e1ea4dd75d8222c660a4358')
  },
  {
    bvid: 'BV1dG4y1u7JF', date: '2022-12-15', duration: '02:56',
    title: { en: '2022 in review: two years abroad', zh: '2022年度合集 | 拜了个拜2022 | 留学两年合集' },
    poster: { en: 'Bye-bye, 2022', zh: '拜拜，2022' },
    cover: hd('255c9759cd120b04a605bb34a00c244950237699')
  },
  {
    bvid: 'BV1ka411R7i8', date: '2022-09-01', duration: '01:24', a3: 'CAN',
    title: { en: 'You can always trust Golden Ears', zh: '你永远可以相信 Golden Ears' },
    poster: { en: 'Golden Ears', zh: 'Golden Ears' },
    place: { en: 'British Columbia', zh: '不列颠哥伦比亚' },
    cover: hd('0b422949355cc7c70ccc9243ce2287203c183d0f')
  },
  {
    bvid: 'BV1CT411F76w', date: '2022-08-31', duration: '00:56', a3: 'CAN',
    title: { en: 'Joffre Lakes lives up to the hype', zh: 'Joffre Lake 不愧是你' },
    poster: { en: 'Joffre Lakes', zh: 'Joffre Lakes' },
    place: { en: 'British Columbia', zh: '不列颠哥伦比亚' },
    cover: hd('06b85fb8c55e0c20e6d626bfd0f77fbf04f35e99')
  },
  {
    bvid: 'BV1fP41157R8', date: '2022-08-27', duration: '01:56',
    title: { en: 'A night by the sea', zh: '海边一夜' },
    poster: { en: 'A Night by the Sea', zh: '海边一夜' },
    cover: hd('c84e229a4a4c4f07b340c4ebfe9d739ca08d6973')
  },
  {
    bvid: 'BV1jW4y1t7us', date: '2022-08-27', duration: '02:51', a3: 'CAN',
    title: { en: 'Crossing Canada alone', zh: '一个人穿越加拿大' },
    poster: { en: 'Across Canada', zh: '穿越加拿大' },
    place: { en: 'Canada', zh: '加拿大' },
    cover: hd('f807d9d03edbfe7c52a1e96a126b1a08f7a4b55c')
  },
  {
    bvid: 'BV1kZ4y1Q7YY', date: '2021-12-19', duration: '03:03',
    title: { en: 'ZAFU to UBC: 2021 in memories', zh: '[合集] ZAFU--UBC 2021 时光追忆' },
    poster: { en: 'ZAFU to UBC', zh: '从 ZAFU 到 UBC' },
    cover: hd('56f8884836c1bfa7a9f04eaa157ba14c0d39b305')
  },
  {
    bvid: 'BV1iw411o7Sy', date: '2021-06-22', duration: '03:39', a3: 'CHN',
    title: { en: 'Campus timelapse: light at Zhejiang A&F University', zh: '【校园延时】浙江农林大学ZAFU光影延时摄影' },
    poster: { en: 'Campus Light', zh: '校园光影' },
    place: { en: 'Hangzhou', zh: '杭州' },
    cover: hd('2668abe2a3d7df16fafac65c7dd58921d51baa6a')
  },
  {
    bvid: 'BV1Wf4y1Q7Hz', date: '2020-08-18', duration: '08:57', a3: 'CHN',
    title: { en: 'Rural revitalisation in Laoshan Village: summer fieldwork', zh: '【乡村振兴】探崂山蝶变，索乡村振兴之路 崂山村暑假社会实践锦集' },
    poster: { en: 'Laoshan Village', zh: '崂山村' },
    cover: hd('b27aef5f5a850e65787a9e297bc659fdd72fc0a4')
  },
  {
    bvid: 'BV1S54118791', date: '2020-08-07', duration: '01:15',
    title: { en: 'Cheap eats: homemade Pacific saury', zh: '【廉价美食】自制 秋刀鱼' },
    poster: { en: 'Pacific Saury', zh: '秋刀鱼' },
    cover: hd('c66196648f0d3d9874330dd01e12e58821c71d80')
  },
  {
    bvid: 'BV1Ff4y197QT', date: '2020-08-01', duration: '02:45',
    title: { en: 'WWB: a white-lipped deer conservation trip', zh: '【旅拍】WWB 出走世界白唇鹿保育之旅' },
    poster: { en: 'White-lipped Deer', zh: '白唇鹿' },
    cover: hd('5325a8825a30a67b23c9333ee7caf7d4a2db1960')
  },
  {
    bvid: 'BV19T4y1g7n8', date: '2020-04-29', duration: '03:50', a3: 'CHN',
    title: { en: 'Back on the ZAFU campus after four months away', zh: '【校园】回到浙江农林大学ZAFU校园的前2天匆匆忙忙拍了几段视频带你会想起你离开了四个月的校园' },
    poster: { en: 'Back to Campus', zh: '回到校园' },
    place: { en: 'Hangzhou', zh: '杭州' },
    cover: hd('c2b7f32c79811eebf1b671375951104290fc4d7e')
  }
];

// Films that belong to a chapter of the Journey timeline (by journey item id).
export const journeyFilms: Record<string, string[]> = {
  'msc-wur': ['BV1ve2SYdERq', 'BV16gHtexEFe', 'BV1fu4mexETY', 'BV1DK27YREM9'],
  'ra-uef': ['BV1MCabzbEK4'],
  'bsc-ubc': ['BV1394y167XK', 'BV1jW4y1t7us', 'BV1ka411R7i8', 'BV1CT411F76w'],
  'bsc-zafu': ['BV1iw411o7Sy', 'BV19T4y1g7n8', 'BV1kZ4y1Q7YY']
};

export const filmByBvid = (bvid: string) => films.find((f) => f.bvid === bvid);
// Filmography number: upload order, oldest is 01.
export const filmNumber = (bvid: string) => String(films.length - films.findIndex((f) => f.bvid === bvid)).padStart(2, '0');
// Bilibili serves resized covers via an @ suffix; covers only load without a Referer.
// Label for a film's number. Never "N° 34": on a travel site that reads as a latitude.
export const filmLabel = (bvid: string) => {
  const n = String(Number(filmNumber(bvid)));
  return { en: `Film ${n}`, zh: `第 ${n} 部` };
};
export const coverThumb = (url: string, w = 640, h = 360) => `${url}@${w}w_${h}h_1c.webp`;

export const bilibiliPlayer = (bvid: string, autoplay = true) =>
  `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=${autoplay ? 1 : 0}`;
export const bilibiliPage = (bvid: string) => `https://www.bilibili.com/video/${bvid}/`;
