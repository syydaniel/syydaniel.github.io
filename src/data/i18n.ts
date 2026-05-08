export type Lang = 'en' | 'zh';

export const dict: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.about': { en: 'About', zh: '关于' },
  'nav.journey': { en: 'Journey', zh: '履历' },
  'nav.photography': { en: 'Photography', zh: '摄影' },
  'nav.contact': { en: 'Contact', zh: '联系' },
  'nav.cta': { en: "Let's talk", zh: '聊聊' },
  'nav.cv': { en: 'CV', zh: '简历' },

  // Hero
  'hero.eyebrow': { en: 'Environmental Researcher · Photographer', zh: '环境研究员 · 摄影师' },
  'hero.tagline': {
    en: 'Water systems, global change, and the quiet choreography of light on landscapes.',
    zh: '研究水、研究变化，也在光影落于大地的时刻按下快门。'
  },
  'hero.subtitle': {
    en: "MSc student in Urban Environmental Management at Wageningen University & Research. I study water and plastic, and I photograph the places I study.",
    zh: '瓦赫宁根大学城市环境管理硕士在读。研究水与塑料，也记录我研究过的每一处土地。'
  },
  'hero.cta.primary': { en: 'Explore journey', zh: '探索我的履历' },
  'hero.cta.secondary': { en: 'Photography map', zh: '摄影地图' },
  'hero.cta.cv': { en: 'Download CV (PDF)', zh: '下载简历 (PDF)' },
  'hero.scroll': { en: 'Scroll', zh: '下滑' },
  'stat.countries': { en: 'Countries', zh: '国家' },
  'stat.universities': { en: 'Universities', zh: '高校' },
  'stat.projects': { en: 'Research projects', zh: '科研项目' },
  'stat.photos': { en: 'Photographs', zh: '作品' },

  // About
  'about.eyebrow': { en: 'About me', zh: '关于我' },
  'about.title.a': { en: 'Researching the', zh: '研究那些' },
  'about.title.b': { en: 'quiet systems', zh: '静默运转' },
  'about.title.c': { en: 'we take for granted.', zh: '却被我们视为理所当然的系统。' },
  'about.p1': {
    en: "I'm a researcher working at the intersection of water systems, global change, and urban sustainability. Currently I'm pursuing an MSc in Urban Environmental Management at Wageningen, focused on how microplastics move through catchments.",
    zh: '我的研究处在水系统、全球变化与城市可持续的交叉地带。目前在瓦赫宁根大学攻读城市环境管理硕士，论文方向是微塑料在流域中的迁移。'
  },
  'about.p2': {
    en: "Before Wageningen, I studied forestry across Canada and China and interned with the University of Eastern Finland doing soil-water fieldwork in Lapland. I've been lucky to learn in four very different landscapes — and I carry a camera to each of them.",
    zh: '来瓦大之前，我在加拿大和中国都学过林学，也在东芬兰大学做过拉普兰冻土带的土壤—水实地研究。我很幸运能在四种截然不同的地貌里求学——每一次我都带着相机。'
  },
  'about.p3': {
    en: 'This site is a working notebook: my research, the places I\'ve stood in, and the photographs I\'ve made there.',
    zh: '这个网站就是我的工作笔记：研究、去过的地方，以及在那里拍下的照片。'
  },

  // Journey
  'journey.eyebrow': { en: 'Research journey', zh: '研究履历' },
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
    en: "Every pin on the map is a place I've stood with a camera. Click one to open the frames. Drag the time slider to travel years, or switch to the timeline view for a chronological ribbon.",
    zh: '地图上每一个图钉，都是我曾经举起相机的地方。点击图钉查看照片；拖动时间轴穿越年份；或切换到时间线视图，按时间顺序浏览。'
  },
  'photo.stat.frames': { en: 'Frames', zh: '张' },
  'photo.stat.countries': { en: 'Countries', zh: '国家' },
  'photo.stat.years': { en: 'Years', zh: '年跨度' },
  'photo.view.map': { en: 'Map', zh: '地图' },
  'photo.view.timeline': { en: 'Timeline', zh: '时间线' },
  'photo.demo_label': { en: 'Demo mode:', zh: '演示模式：' },
  'photo.demo_body': {
    en: 'currently showing placeholder pins. Drop photos in /photos/ and run npm run photos:manifest.',
    zh: '目前显示的是占位图钉。把照片放进 /photos/ 再跑 npm run photos:manifest 即可。'
  },
  'photo.time_range': { en: 'Time range', zh: '时间范围' },
  'photo.visible': { en: 'frames visible', zh: '张可见' },
  'photo.no_photos': { en: 'No photos in this time range.', zh: '这个时间段内没有照片。' },

  // Contact
  'contact.eyebrow': { en: 'Contact', zh: '联系我' },
  'contact.title.a': { en: 'Say', zh: '说句' },
  'contact.title.b': { en: 'hello', zh: '你好' },
  'contact.intro': {
    en: "I'm open to research collaborations, photography licensing, and good conversations about water, cities, and forests. Pick whichever channel fits.",
    zh: '欢迎联系——科研合作、图片授权，或者关于水、城市、森林的任何交流。随便选一个渠道。'
  },
  'contact.channel.personal': { en: 'Personal', zh: '个人邮箱' },
  'contact.channel.academic': { en: 'Academic', zh: '学术邮箱' },
  'contact.channel.linkedin': { en: 'LinkedIn', zh: 'LinkedIn' },
  'contact.channel.cv': { en: 'CV (PDF)', zh: '简历 (PDF)' },
  'contact.channel.hint.personal': { en: 'For collaborations, photo licensing, open talk.', zh: '合作、图片授权、随意聊天。' },
  'contact.channel.hint.academic': { en: 'For research & WUR-related correspondence.', zh: '科研相关、瓦大事务。' },
  'contact.channel.hint.linkedin': { en: 'The long-form version of my journey.', zh: '更完整的履历版本。' },
  'contact.channel.hint.cv': { en: 'Latest version — May 2026. Education, research, awards.', zh: '最新版本 —— 2026 年 5 月。教育、科研、奖项。' },
  'contact.based': { en: 'Based in', zh: '常驻' },
  'contact.current': { en: 'Currently — MSc at Wageningen University', zh: '目前 —— 瓦赫宁根大学硕士在读' },

  // Footer
  'footer.title.a': { en: "Let's collaborate on", zh: '让我们一起探索' },
  'footer.title.b': { en: 'water, change, and the world we photograph', zh: '水、变化，以及我们用镜头凝视的世界' },
  'footer.location_hint': {
    en: 'Available for research collaborations and editorial photo use.',
    zh: '接受科研合作与编辑类图片授权。'
  },
  'footer.rights': { en: '© {year} Yiyang Shen · Built with Astro', zh: '© {year} 沈亦旸 · 由 Astro 构建' }
};

export function t(key: string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
