// Real content languages (every dict entry + journey Loc carries these).
export type Lang = 'en' | 'zh';
// Selectable UI languages = real languages plus the playful cat language.
export type UILang = Lang | 'cat';

export const LANG_CODES: Lang[] = ['en', 'zh'];

// Display order + native names for the language switcher.
export const LANGS: { code: UILang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: '中' },
  { code: 'cat', label: '猫语 (Nya)', short: '喵' }
];

export const dict: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.about': { en: 'About', zh: '关于' },
  'nav.journey': { en: 'Journey', zh: '历程' },
  'nav.photography': { en: 'Photography', zh: '摄影' },
  'nav.contact': { en: 'Contact', zh: '联系' },
  'nav.cta': { en: "Let's talk", zh: '聊聊' },
  'nav.cv': { en: 'CV', zh: '简历' },
  'nav.places': { en: 'Places', zh: '足迹' },
  'nav.films': { en: 'Films', zh: '影像' },

  // Hero
  'hero.eyebrow': {
    en: 'MSc graduate, May 2026 · Photographer',
    zh: '硕士毕业（2026 年 5 月）· 摄影师'
  },
  'hero.gradbanner': {
    en: 'Celebrating my MSc graduation!',
    zh: '庆祝我硕士毕业！'
  },
  'hero.tagline': {
    en: 'Water systems, global change, and the quiet choreography of light on landscapes.',
    zh: '研究水，研究变化，也在光影落于大地的那一刻按下快门。'
  },
  'hero.subtitle': {
    en: 'MSc in Urban Environmental Management from Wageningen University & Research. I study water and plastic, and I photograph the places I study.',
    zh: '瓦赫宁根大学城市环境管理硕士。我研究水与塑料，也用镜头记录下我研究过的每一片土地。'
  },
  'hero.cta.primary': { en: 'Explore journey', zh: '探索我的历程' },
  'hero.cta.secondary': { en: 'Photography map', zh: '摄影地图' },
  'hero.cta.cv': { en: 'Download CV (PDF)', zh: '下载简历 (PDF)' },
  'hero.docs.eyebrow': {
    en: 'Application files: always latest',
    zh: '申请材料：始终是最新版本'
  },
  'hero.docs.cv.label': { en: 'Curriculum Vitae', zh: '简历 (CV)' },
  'hero.docs.cv.title': { en: 'View latest CV', zh: '查看最新简历' },
  'hero.docs.cv.meta': { en: 'PDF · Updated May 2026', zh: 'PDF · 2026 年 5 月更新' },
  'hero.docs.transcript.label': { en: 'Academic Transcript', zh: '成绩单' },
  'hero.docs.transcript.title': { en: 'View latest transcript', zh: '查看最新成绩单' },
  'hero.docs.transcript.meta': { en: 'PDF · WUR record · May 2026', zh: 'PDF · 瓦大成绩 · 2026 年 5 月' },
  'hero.docs.cadence': {
    en: 'Reviewing my application? These files update on a daily-to-monthly cadence. Click through here for the latest version anytime.',
    zh: '正在审阅我的申请吗？这两份文件会以每日到每月的频率持续更新，这里永远是最新版本，随时点开即可。'
  },
  'hero.scroll': { en: 'Scroll', zh: '下滑' },
  'stat.countries': { en: 'Countries', zh: '国家' },
  'stat.universities': { en: 'Universities', zh: '高校' },
  'stat.projects': { en: 'Research projects', zh: '科研项目' },
  'stat.photos': { en: 'Photographs', zh: '作品' },

  // About
  'about.eyebrow': { en: 'About me', zh: '关于我' },
  'about.title.a': { en: 'Researching the', zh: '研究那些' },
  'about.title.b': { en: 'quiet systems', zh: '静默运转' },
  'about.title.c': {
    en: 'we take for granted.',
    zh: '却被我们视为理所当然的系统。'
  },
  'about.p1': {
    en: "I've just graduated with an MSc in Urban Environmental Management from Wageningen (end of May 2026). My thesis estimates how much microplastic is retained in rivers, at the sub-basin scale worldwide, where water systems, global change, and machine learning meet.",
    zh: '我刚从瓦赫宁根大学城市环境管理硕士毕业（2026 年 5 月底）。我的论文估算全球范围内、次流域尺度上河流对微塑料的截留量，正处在水系统、全球变化与机器学习的交汇处。'
  },
  'about.p2': {
    en: "Before Wageningen, I studied forestry across Canada and China and interned with the University of Eastern Finland doing soil-water fieldwork in Lapland. I've been lucky to learn in four very different landscapes, and I carry a camera to each of them.",
    zh: '来瓦大之前，我在加拿大和中国学习林学，还在东芬兰大学实习，到拉普兰做土壤与水的野外工作。我很幸运能在四种截然不同的地貌中求学，而每一次我都带着相机。'
  },
  'about.p3': {
    en: "This site is a working notebook: my research, the places I've stood in, and the photographs I've made there.",
    zh: '这个网站就是我的工作笔记：我的研究、我驻足过的地方，以及我在那里拍下的照片。'
  },

  // Journey
  'journey.eyebrow': { en: 'Research journey', zh: '研究历程' },
  'journey.title.a': { en: 'Four countries. Four universities.', zh: '四个国家，四所高校。' },
  'journey.title.b': { en: 'One question', zh: '一个问题' },
  'journey.title.c': {
    en: ': how do water and life co-evolve under pressure?',
    zh: '：在压力之下，水与生命如何共同演化？'
  },
  'journey.filter.all': { en: 'All', zh: '全部' },
  'journey.filter.education': { en: 'Education', zh: '教育' },
  'journey.filter.experience': { en: 'Experience', zh: '经历' },
  'journey.filter.project': { en: 'Projects', zh: '项目' },
  'journey.kind.education': { en: 'education', zh: '教育' },
  'journey.kind.experience': { en: 'experience', zh: '经历' },
  'journey.kind.project': { en: 'project', zh: '项目' },
  'journey.ongoing': { en: 'Ongoing', zh: '进行中' },
  'journey.present': { en: 'present', zh: '至今' },
  'journey.supervisor': { en: 'Supervisor', zh: '导师' },
  'journey.places': { en: 'Places', zh: '地点' },
  'journey.hover_hint': { en: 'Hover a card', zh: '悬停卡片' },

  // Photography
  'photo.eyebrow': { en: 'Photography', zh: '摄影' },
  'photo.title.a': { en: 'A', zh: '一本' },
  'photo.title.b': { en: 'field notebook', zh: '野外笔记' },
  'photo.title.c': { en: 'in light and silver.', zh: '，以光与银盐写就。' },
  'photo.intro': {
    en: "Every pin on the map is a place I've stood with a camera. Click one to open the frames. Drag the time slider to travel years, or switch to the timeline view, where the photographs and films share one chronological ribbon.",
    zh: '地图上的每一个图钉，都是我曾举起相机的地方。点击图钉即可查看照片；拖动时间滑块穿越不同年份；也可以切换到时间线视图，照片和影片按时间顺序排在一起。'
  },
  'photo.stat.frames': { en: 'Frames', zh: '张' },
  'photo.stat.countries': { en: 'Countries', zh: '国家' },
  'photo.stat.years': { en: 'Years', zh: '年跨度' },
  'photo.view.map': { en: 'Map', zh: '地图' },
  'photo.view.timeline': { en: 'Timeline', zh: '时间线' },
  'photo.demo_label': { en: 'Demo mode:', zh: '演示模式：' },
  'photo.demo_body': {
    en: 'currently showing placeholder pins. Drop photos in /photos/ and run npm run photos:manifest.',
    zh: '当前显示的是占位图钉。把照片放进 /photos/ 再运行 npm run photos:manifest 即可。'
  },
  'photo.time_range': { en: 'Time range', zh: '时间范围' },
  'photo.visible': { en: 'frames visible', zh: '张可见' },
  'photo.no_photos': { en: 'No photos in this time range.', zh: '这个时间段内没有照片。' },

  // Places (GPX footprint map)
  // Shared film language
  'strip.label': { en: 'From the archive', zh: '胶片档案' },
  'strip.all': { en: 'All frames', zh: '全部照片' },
  'about.now_showing': { en: 'Now showing', zh: '正在放映' },
  'journey.films': { en: 'Filmed in this chapter', zh: '这段时期拍的影片' },
  'places.frames': { en: 'frames', zh: '张照片' },
  // Films
  'films.eyebrow': { en: 'Films', zh: '影像' },
  'films.title.a': { en: 'The same places,', zh: '同样的地方，' },
  'films.title.b': { en: 'in motion.', zh: '动起来。' },
  'films.intro': {
    en: 'Short films I shoot, edit and grade myself, from the Arctic to the southern tip of Africa. They live on Bilibili; press play to watch them here.',
    zh: '从北极圈到非洲南端，由我自己拍摄、剪辑和调色的短片。视频放在哔哩哔哩，点击播放即可在这里观看。'
  },
  'films.stat.films': { en: 'Films', zh: '部作品' },
  'films.stat.minutes': { en: 'Minutes', zh: '分钟' },
  'films.stat.since': { en: 'Since', zh: '始于' },
  'films.watch': { en: 'Watch the film', zh: '观看影片' },
  'films.archive.title': { en: 'The archive', zh: '全部作品' },
  'films.archive.intro': { en: "Everything else I've put on Bilibili, newest first.", zh: '我在哔哩哔哩发布的其他视频，按时间从新到旧。' },
  'films.all': { en: 'All', zh: '全部' },
  'films.more': { en: 'Show all films', zh: '显示全部' },
  'films.channel': { en: 'Follow on Bilibili', zh: '在哔哩哔哩关注我' },
  'films.on_bilibili': { en: 'Bilibili', zh: '哔哩哔哩' },

  'places.eyebrow': { en: 'Places', zh: '足迹' },
  'places.title.a': { en: 'Everywhere my', zh: '我的' },
  'places.title.b': { en: 'footsteps', zh: '脚步' },
  'places.title.c': { en: 'have been.', zh: '到过的地方。' },
  'places.intro': {
    en: "Drawn from years of GPS tracks I've recorded. Each glowing square is a roughly 10 km patch of the world I've passed through. Brighter means more time spent there.",
    zh: '由我多年记录的 GPS 轨迹绘制而成。每一个发光的小方块，代表我走过的一片约 10 公里见方的土地；越亮，说明在那里停留得越久。'
  },
  'places.stat.countries': { en: 'Countries', zh: '国家' },
  'places.stat.cities': { en: 'Cities', zh: '城市' },
  'places.stat.km': { en: 'km tracked', zh: '公里轨迹' },
  'places.days': { en: 'days on the move', zh: '天在路上' },

  // Contact
  'contact.eyebrow': { en: 'Contact', zh: '联系我' },
  'contact.title.a': { en: 'Say', zh: '说句' },
  'contact.title.b': { en: 'hello', zh: '你好' },
  'contact.intro': {
    en: "I'm open to research collaborations, photography licensing, and good conversations about water, cities, and forests. Pick whichever channel fits.",
    zh: '我欢迎科研合作、图片授权，也乐意聊聊关于水、城市与森林的一切。选一个你方便的方式就好。'
  },
  'contact.channel.personal': { en: 'Personal', zh: '个人邮箱' },
  'contact.channel.academic': { en: 'Academic', zh: '学术邮箱' },
  'contact.channel.linkedin': { en: 'LinkedIn', zh: 'LinkedIn' },
  'contact.channel.cv': { en: 'CV (PDF)', zh: '简历 (PDF)' },
  'contact.channel.transcript': { en: 'Transcript (PDF)', zh: '成绩单 (PDF)' },
  'contact.channel.hint.personal': { en: 'For collaborations, photo licensing, open talk.', zh: '合作、图片授权，或随意聊聊。' },
  'contact.channel.hint.academic': { en: 'For research & WUR-related correspondence.', zh: '科研相关、瓦大事务。' },
  'contact.channel.hint.linkedin': { en: 'The long-form version of my journey.', zh: '更完整的履历版本。' },
  'contact.channel.hint.cv': { en: 'Latest version, May 2026. Education, research, awards.', zh: '最新版本，2026 年 5 月。教育、科研、奖项。' },
  'contact.channel.hint.transcript': { en: 'WUR academic record, kept current as new grades land.', zh: '瓦大成绩记录，有新成绩会同步更新。' },
  'contact.based': { en: 'Based in', zh: '常驻' },
  'contact.current': { en: 'MSc, Wageningen University · Graduated May 2026', zh: '瓦赫宁根大学硕士 · 2026 年 5 月毕业' },

  // Footer
  'footer.title.a': { en: "Let's collaborate on", zh: '让我们一起探索' },
  'footer.title.b': {
    en: 'water, change, and the world we photograph',
    zh: '水、变化，以及我们用镜头凝视的世界'
  },
  'footer.location_hint': {
    en: 'Available for research collaborations and editorial photo use.',
    zh: '接受科研合作与编辑类图片授权。'
  },
  'footer.rights': {
    en: '© {year} Yiyang Shen · Built with Astro',
    zh: '© {year} 沈亦旸 · 由 Astro 构建'
  },

  // brand / globe / about skills / location / photo / arcade
  'brand.name': {
    en: "Yiyang Shen", zh: "沈亦旸"
  },
  'globe.hint': {
    en: "Drag to rotate · colored dots: countries I've been", zh: "拖动旋转 · 彩色的点是我去过的国家"
  },
  'about.skill.water': {
    en: "Water Quality", zh: "水质"
  },
  'about.skill.microplastics': {
    en: "Microplastics", zh: "微塑料"
  },
  'about.skill.scenario': {
    en: "Scenario Analysis", zh: "情景分析"
  },
  'about.skill.climate': {
    en: "Climate Change", zh: "气候变化"
  },
  'about.skill.ml': {
    en: "Machine Learning", zh: "机器学习"
  },
  'about.skill.gis': {
    en: "GIS Analysis", zh: "GIS 分析"
  },
  'about.skill.boreal': {
    en: "Boreal Ecology", zh: "北方森林生态"
  },
  'about.skill.urban': {
    en: "Urban Forestry", zh: "城市林业"
  },
  'footer.location': {
    en: "Wageningen, Netherlands", zh: "荷兰，瓦赫宁恩"
  },
  'photo.frames_visible': {
    en: "frames visible", zh: "张可见"
  },
  'photo.films_visible': {
    en: "films", zh: "部影片"
  },
  'photo.frames': {
    en: "frames", zh: "张"
  },
  'photo.empty': {
    en: "No photos in this time range.", zh: "此时间范围内没有照片。"
  },
  'arcade.eyebrow': {
    en: "Secret arcade", zh: "隐藏街机"
  },
  'arcade.title': {
    en: "Coffee break 🕹️", zh: "休息一下 🕹️"
  },
  'arcade.tab.snake': {
    en: "Snake", zh: "贪吃蛇"
  },
  'arcade.tab.about': {
    en: "About", zh: "关于"
  },
  'arcade.snake.help': {
    en: "Guide the 💧 water drop. Eat 🧬 microplastic particles. Don't crash into yourself.",
    zh: "操控 💧 水滴，吃掉 🧬 微塑料颗粒，别撞到自己。"
  },
  'arcade.snake.keys': {
    en: "Arrow keys · WASD · tap-direction on mobile",
    zh: "方向键 · WASD · 手机点按方向"
  },
  'arcade.score_best': {
    en: "Score · best", zh: "得分 · 最高"
  },
  'arcade.ready': {
    en: "Ready?", zh: "准备好了吗？"
  },
  'arcade.start': {
    en: "Start game", zh: "开始游戏"
  },
  'arcade.n2048.help': {
    en: "Combine tiles to reach 2048. Arrow keys or swipe.",
    zh: "合并方块，凑到 2048。方向键或滑动。"
  },
  'arcade.luck': {
    en: "Good luck.", zh: "祝你好运。"
  },
  'arcade.score': {
    en: "Score", zh: "得分"
  },
  'arcade.best': {
    en: "Best", zh: "最高"
  },
  'arcade.new': {
    en: "New", zh: "新游戏"
  },
  'arcade.again': {
    en: "Play again", zh: "再玩一次"
  },
  'arcade.gameover': {
    en: "Game over", zh: "游戏结束"
  },
  'arcade.tryagain': {
    en: "Try again", zh: "再试一次"
  },
  'arcade.win': {
    en: "You win! 🎉", zh: "你赢了！🎉"
  },
  'arcade.nomoves': {
    en: "No more moves", zh: "无法移动了"
  },
  'arcade.about.p1': {
    en: "Hey 👋 you found the secret arcade! A few more easter eggs hide on this site. Try clicking the Y logo at the top 5 times, or pressing ↑ ↑ ↓ ↓ ← → ← → B A on any page.",
    zh: "嘿 👋 你找到了隐藏街机！站里还藏着几个彩蛋。试试连点顶部的 Y 标志 5 次，或在任意页面按 ↑ ↑ ↓ ↓ ← → ← → B A。"
  },
  'arcade.about.p2': {
    en: "Both games here are vanilla JS, no libraries. High scores are stored locally in your browser.",
    zh: "这里的两个游戏都是纯 JavaScript，没有任何库。最高分保存在你本地的浏览器里。"
  },
  'arcade.about.p3': {
    en: "Easter eggs added because Daniel believes personal sites should be fun.",
    zh: "加这些彩蛋，是因为 Daniel 觉得个人网站就该好玩。"
  },

  // ---- 猫猫语 (Nya) intro module ----
  'nya.eyebrow': {
    en: "A made language", zh: "一门自创语言"
  },
  'nya.title.a': {
    en: "Nya, a", zh: "Nya，一门"
  },
  'nya.title.b': {
    en: "cat language", zh: "猫的语言"
  },
  'nya.title.c': {
    en: "where every word is one cat.", zh: "每个词都是一只猫。"
  },
  'nya.intro': {
    en: "For fun, I built a small constructed language. It has its own words, a little grammar, and one writing system where each word is drawn as a single cat. The cat's body encodes the word: its sound and its meaning at once. Switch the site language to 猫语 to read the whole page in it.",
    zh: "出于好玩，我做了一门小小的人造语言。它有自己的词汇、一点语法，还有一套文字：每个词都画成一只猫。猫的身体同时编码这个词的读音和含义。把网站语言切到「猫语」，整页都会用它来显示。"
  },
  'nya.try': {
    en: "Type something", zh: "输入点什么"
  },
  'nya.in_nya': {
    en: "In Nya", zh: "用 Nya 写"
  },
  'nya.legend.title': {
    en: "How to read one cat", zh: "如何读懂一只猫"
  },
  'nya.repo': {
    en: "The language repo", zh: "语言代码仓库"
  },
  'nya.dict': {
    en: "3200-word dictionary", zh: "3200 词字典"
  },
  'nya.translator': {
    en: "Open the translator", zh: "打开翻译站"
  }
};

export function t(key: string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
