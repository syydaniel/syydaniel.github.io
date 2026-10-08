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

  'gallery.eyebrow': { en: 'Selected photographs', zh: '摄影精选' },
  'gallery.invitation': { en: 'The ones I would print.', zh: '想打印出来的那几张。' },
  'gallery.invitation.body': { en: 'A small 3D room with the photographs I like best. Drag to look around, click one to open it.', zh: '最喜欢的几张照片，挂在一间 3D 小屋里。拖着看，点开放大。' },
  'gallery.enter': { en: 'Go in', zh: '进去看看' },
  'gallery.title': { en: 'The ones I would print.', zh: '想打印出来的那几张。' },
  'gallery.instructions': { en: 'Drag to explore · Scroll to change · Select a frame to open', zh: '拖动浏览 · 滚轮切换 · 点击照片展开' },
  'gallery.open': { en: 'View photograph', zh: '展开照片' },
  'gallery.previous': { en: 'Previous photograph', zh: '上一张照片' },
  'gallery.next': { en: 'Next photograph', zh: '下一张照片' },
  'gallery.return': { en: 'Back to the map', zh: '回到地图' },
  'gallery.back': { en: 'Back to the room', zh: '回到展厅' },
  'gallery.photograph': { en: 'Photograph', zh: '照片' },
  'nav.menu': { en: 'Navigation menu', zh: '导航菜单' },
  'places.map_hint': { en: 'Drag to turn it · The taller the column, the longer I stayed in that square', zh: '拖动旋转 · 柱子越高，在那个格子里待得越久' },
  'chapter.next': { en: 'Next', zh: '下一章' },
  'cursor.turn': { en: 'Turn', zh: '转动' },
  'theme.dark': { en: 'Switch to dark', zh: '切换到深色' },
  'theme.light': { en: 'Switch to light', zh: '切换到浅色' },
  'theme.follows': { en: 'follows the sky over Wageningen until', zh: '跟着瓦赫宁根的天色，直到' },
  'theme.pinned': { en: 'kept until', zh: '保持到' },
  'sky.sunrise': { en: 'sunrise', zh: '日出' },
  'sky.chip': { en: 'The sky over Wageningen, and what it does to the page', zh: '瓦赫宁根的天色，以及它对网页做了什么' },
  'sky.card.title': { en: 'Wageningen right now', zh: '此刻的瓦赫宁根' },
  'sky.card.moon': { en: 'Moon', zh: '月相' },
  'sky.card.theme': { en: 'Ink', zh: '墨色' },
  'sky.card.weather': { en: 'Weather', zh: '天气' },
  'sky.card.sun': { en: 'Sun', zh: '日出日落' },
  'sky.card.day': { en: 'day ink until sunset {t}', zh: '日墨，到日落 {t} 为止' },
  'sky.card.night': { en: 'night ink until sunrise {t}', zh: '夜墨，到日出 {t} 为止' },
  'sky.hour.dawn': { en: 'Dawn in Wageningen', zh: '瓦赫宁根的清晨' },
  'sky.hour.morning': { en: 'Morning in Wageningen', zh: '瓦赫宁根的上午' },
  'sky.hour.afternoon': { en: 'Afternoon in Wageningen', zh: '瓦赫宁根的下午' },
  'sky.hour.evening': { en: 'Evening in Wageningen', zh: '瓦赫宁根的傍晚' },
  'sky.hour.dusk': { en: 'Dusk in Wageningen', zh: '瓦赫宁根的黄昏' },
  'sky.hour.night': { en: 'Night in Wageningen', zh: '瓦赫宁根的夜里' },
  'sky.hour.small': { en: 'Before dawn in Wageningen', zh: '瓦赫宁根的凌晨' },
  'sky.note.rain': { en: 'It is raining in Wageningen right now, so it rains in the ink here.', zh: '瓦赫宁根这会儿在下雨，这里的墨里也落着雨。' },
  'sky.note.snow': { en: 'It is snowing in Wageningen: snow lies on the heights of the catchment above.', zh: '瓦赫宁根在下雪，上面那片流域的高处积了雪。' },
  'sky.note.storm': { en: 'A thunderstorm over Wageningen: now and then the paper lights up.', zh: '瓦赫宁根有雷雨，纸面不时会亮一下。' },
  'sky.note.fog': { en: 'Fog in Wageningen: the mist has closed in on the contours above.', zh: '瓦赫宁根起了雾，上面的等高线让雾收了进去。' },
  'sky.note.cloud': { en: 'An overcast sky over Wageningen: the light on the page is flat and grey today.', zh: '瓦赫宁根今天阴着，纸上的光也平、也灰。' },
  'sky.note.clear': { en: 'The Sun is out over Wageningen; the paper follows it and turns to its night ink at sunset {t}.', zh: '瓦赫宁根天晴，纸色跟着太阳走，日落 {t} 后换上夜墨。' },
  'sky.note.night': { en: 'Night over Wageningen: the page wears its night ink until sunrise {t}.', zh: '瓦赫宁根已是夜里，网页穿着夜墨，到日出 {t} 为止。' },
  'sky.sunset': { en: 'sunset', zh: '日落' },
  'nav.skip': { en: 'Skip to content', zh: '跳至正文' },

  // Hero
  'hero.eyebrow': {
    en: 'MSc Wageningen 2026 · Environmental modelling · Open to PhD positions',
    zh: '瓦赫宁根硕士 2026 · 环境建模 · 在找博士'
  },
  // The tagline is set in three parts so the middle one can carry the ink underline.
  'hero.tagline.a': {
    en: 'I do environmental modelling. Wherever that takes me, I bring a',
    zh: '我做环境建模；走到哪儿都带着'
  },
  'hero.tagline.b': { en: 'camera', zh: '相机' },
  'hero.tagline.c': { en: '.', zh: '。' },
  'hero.hint': { en: 'Move the mouse: the light follows it and the contours give under your hand', zh: '动动鼠标：光跟着走，等高线在手底下陷一点' },
  'ticker.local_time': { en: 'Local time, Wageningen', zh: '瓦赫宁根当地时间' },
  'ticker.frames': { en: 'Frames', zh: '照片' },
  'ticker.films': { en: 'Films', zh: '影片' },
  'ticker.km': { en: 'km tracked', zh: '公里轨迹' },
  'ticker.latest_film': { en: 'Latest film', zh: '最新影片' },
  'hero.subtitle': {
    en: 'MSc in Urban Environmental Management, Wageningen University & Research. I do environmental modelling: what people do to water and soil, from microplastics in rivers to greenhouse gases from farmland. I take a camera to the places I study.',
    zh: '瓦赫宁根大学城市环境管理硕士。做环境建模，从河里的微塑料到农田排的温室气体。去哪儿做研究，相机就带到哪儿。'
  },
  // Typographic statement between About and the archive strip.
  'statement.1': { en: 'Rivers hold on to', zh: '塑料进了河，' },
  'statement.2': { en: 'the plastic we lose.', zh: '河会留下一部分；' },
  'statement.3': { en: 'Farm soils give off', zh: '肥施进地里，' },
  'statement.4': { en: 'what we feed them.', zh: '一部分变成气。' },
  'statement.5': { en: 'I model both,', zh: '这两件事我都在算，' },
  'statement.6': { en: 'and take pictures on the way.', zh: '顺手也拍点照片。' },
  'hero.cta.primary': { en: 'See what I do', zh: '看看我在做什么' },
  'hero.cta.secondary': { en: 'Photography', zh: '摄影' },
  'hero.cta.cv': { en: 'Download CV (PDF)', zh: '下载简历 (PDF)' },
  'hero.docs.eyebrow': {
    en: 'CV and transcript: always the latest',
    zh: '简历与成绩单：始终是最新版本'
  },
  'hero.docs.cv.label': { en: 'Curriculum Vitae', zh: '简历 (CV)' },
  'hero.docs.cv.title': { en: 'View latest CV', zh: '查看最新简历' },
  'hero.docs.cv.meta': {
    en: 'PDF · Updated Sep 2026',
    zh: 'PDF · 2026 年 9 月更新'
  },
  'hero.docs.transcript.label': { en: 'Academic Transcript', zh: '成绩单' },
  'hero.docs.transcript.title': { en: 'View latest transcript', zh: '查看最新成绩单' },
  'hero.docs.transcript.meta': { en: 'PDF · WUR record · May 2026', zh: 'PDF · 瓦大成绩 · 2026 年 5 月' },
  'hero.docs.cadence': {
    en: 'Both files are kept current. These links always open the latest version.',
    zh: '两份文件都会持续更新，这里的链接永远指向最新版本。'
  },
  'hero.scroll': { en: 'Scroll', zh: '下滑' },
  'stat.countries': {
    en: 'Countries studied in',
    zh: '求学国家'
  },
  'stat.universities': { en: 'Universities', zh: '高校' },
  'stat.projects': { en: 'Research projects', zh: '科研项目' },
  'stat.photos': { en: 'Photographs', zh: '作品' },

  // About
  'about.eyebrow': { en: 'About me', zh: '关于我' },
  // Title parts sit in one line box: punctuation stays at the end of a part, never at the start.
  'about.title.a': { en: 'I study', zh: '我研究' },
  'about.title.b': { en: 'soil and water,', zh: '土壤和水，' },
  'about.title.c': {
    en: 'and what farming does to them.',
    zh: '还有\u200B种地\u200B怎么影响\u200B它们。'
  },
  'about.p1': {
    en: "I finished my MSc in Urban Environmental Management at Wageningen in May 2026, and I'm now looking for a PhD. My thesis estimated how much microplastic rivers hold back, sub-basin by sub-basin across the world, using machine learning checked against the MARINA-Multi model.",
    zh: '2026 年 5 月，我在瓦赫宁根读完了城市环境管理硕士，现在在找博士。论文做的是全球各个次流域里，河流能截留多少微塑料：用机器学习算，再拿 MARINA-Multi 模型对照。'
  },
  'about.p2': {
    en: "Before that I studied forestry in Hangzhou and Vancouver. My first lab work was on soil microbes, and later I spent a summer in Lapland with the University of Eastern Finland, measuring dissolved organic carbon in wetland forests. Four places, four quite different landscapes. I took a camera to all of them.",
    zh: '再往前，我在杭州和温哥华学林学。最早在实验室做的是土壤微生物，后来跟着东芬兰大学去拉普兰过了一个夏天，测湿地森林里的溶解性有机碳。四个地方，四种完全不同的地貌，相机一直在身上。'
  },
  'about.next': {
    en: "Next, I want to work on large-scale modelling of agriculture, water and other environmental systems.",
    zh: '接下来想做的，是农业、水和其他环境问题的大尺度建模。'
  },
  'about.p3': {
    en: "This site is where I keep all of it: the research, the places, and the photos from them.",
    zh: '这个网站就是把这些放在一起：做的研究，去过的地方，还有在那儿拍的照片。'
  },

  // Journey
  'journey.eyebrow': { en: 'Research journey', zh: '研究经历' },
  'journey.title.a': { en: 'Four universities, four countries,', zh: '四个国家、四所学校，\u200B绕来绕去\u200B还是' },
  'journey.title.b': { en: 'the same question', zh: '同一个问题。' },
  'journey.title.c': {
    en: 'every time.',
    zh: ''
  },
  'journey.filter.all': { en: 'All', zh: '全部' },
  'journey.filter.education': { en: 'Education', zh: '教育' },
  'journey.filter.experience': { en: 'Experience', zh: '经历' },
  'journey.filter.project': { en: 'Projects', zh: '项目' },
  'journey.kind.education': { en: 'education', zh: '教育' },
  'journey.kind.experience': { en: 'experience', zh: '经历' },
  'journey.kind.project': { en: 'project', zh: '项目' },
  'journey.ongoing': { en: 'Ongoing', zh: '进行中' },
  'journey.next': { en: 'Next chapter', zh: '下一章' },
  'journey.present': { en: 'present', zh: '至今' },
  'journey.supervisor': { en: 'Supervisor', zh: '导师' },
  'journey.places': { en: 'Places', zh: '地点' },
  'journey.hover_hint': { en: 'Hover a card', zh: '鼠标放到卡片上' },

  // Photography
  'photo.eyebrow': { en: 'Photography', zh: '摄影' },
  'photo.title.a': { en: 'Taken in the field,', zh: '野外拍的，' },
  'photo.title.b': { en: 'and on the way there.', zh: '还有\u200B路上拍的。' },
  'photo.title.c': { en: '', zh: '' },
  'photo.intro': {
    en: "Pins are places I took a photo; the ones with a frame are films. Click to open. Drag the time range to narrow it down, or switch to the timeline.",
    zh: '图钉是拍过照的地方，带框的是片子，点开就能看。想按时间筛，拖下面的时间范围，或者切到时间线。'
  },
  'photo.stat.frames': { en: 'Frames', zh: '张' },
  'photo.stat.countries': { en: 'Countries', zh: '国家' },
  'photo.stat.years': { en: 'Years', zh: '年' },
  'photo.view.map': { en: 'Map', zh: '地图' },
  'photo.view.timeline': { en: 'Timeline', zh: '时间线' },
  'photo.demo_label': { en: 'Demo mode:', zh: '演示模式：' },
  'photo.demo_body': {
    en: 'currently showing placeholder pins. Drop photos in /photos/ and run npm run photos:manifest.',
    zh: '当前显示的是占位图钉。把照片放进 /photos/ 再运行 npm run photos:manifest 即可。'
  },
  'photo.time_range': { en: 'Time range', zh: '时间范围' },
  'photo.reset': { en: 'Show everything', zh: '看全部' },
  'photo.visible': { en: 'frames visible', zh: '张可见' },
  'photo.no_photos': { en: 'No photos in this time range.', zh: '这段时间没拍照片。' },

  // Places (GPX footprint map)
  // Shared film language
  'strip.label': { en: 'From the archive', zh: '胶片档案' },
  'strip.all': { en: 'All frames', zh: '全部照片' },
  'about.now_showing': { en: 'Now showing', zh: '正在放映' },
  'journey.films': { en: 'Films from this time', zh: '这段时间拍的片子' },
  'places.frames': { en: 'frames', zh: '张照片' },
  // Notes (LinkedIn)
  'notes.eyebrow': { en: 'Notes', zh: '随笔' },
  'notes.title.a': { en: "Things I've", zh: '最近' },
  'notes.title.b': { en: 'written down', zh: '写的' },
  'notes.title.c': { en: 'lately.', zh: '一些东西。' },
  'notes.intro': {
    en: "Posts from LinkedIn: papers I've read, where I've been, what's changed.",
    zh: '发在 LinkedIn 上的一些短帖：读到的论文，去过的地方，近况。'
  },
  'notes.all': { en: 'All posts on LinkedIn', zh: '去 LinkedIn 看全部' },
  // Films
  'films.eyebrow': { en: 'Films', zh: '影像' },
  'films.title.a': { en: 'The same places,', zh: '同样的地方，' },
  'films.title.b': { en: 'moving,', zh: '会动的，' },
  'films.title.c': { en: 'with sound.', zh: '有声音。' },
  'films.intro': {
    en: 'Short films, shot and cut by me, on Bilibili. Press play and they open here.',
    zh: '片子都是自己拍、自己剪的，放在 B 站。点播放就能在这儿看。'
  },
  'films.stat.films': { en: 'Films', zh: '部' },
  'films.stat.minutes': { en: 'Minutes', zh: '分钟' },
  'films.stat.since': { en: 'Since', zh: '始于' },
  'films.watch': { en: 'Watch the film', zh: '看这部' },
  'films.archive.title': { en: 'Everything else', zh: '其他的' },
  'films.archive.intro': { en: "The rest of what I've put on Bilibili, newest first.", zh: '放在 B 站上的其他视频，新的在前。' },
  'films.all': { en: 'All', zh: '全部' },
  'films.more': { en: 'Show all films', zh: '全部展开' },
  'films.channel': { en: 'Follow on Bilibili', zh: 'B 站关注我' },
  'films.on_bilibili': { en: 'Bilibili', zh: '哔哩哔哩' },

  'places.eyebrow': { en: 'Places', zh: '足迹' },
  'places.title.a': { en: "Everywhere I've been,", zh: '去过的地方，' },
  'places.title.b': { en: 'ten kilometres', zh: '十公里一格。' },
  'places.title.c': { en: 'at a time.', zh: '' },
  'places.intro': {
    en: "Years of GPS tracks, cut into 10 km squares. The taller the column, the longer I stayed.",
    zh: '这些年的 GPS 轨迹，切成 10 公里见方的格子。柱子越高，在那儿待得越久。'
  },
  'places.stat.countries': { en: 'Countries', zh: '国家' },
  'places.stat.cities': { en: 'Cities', zh: '城市' },
  'places.stat.km': { en: 'km tracked', zh: '公里轨迹' },
  'places.days': { en: 'days on the move', zh: '天在路上' },

  // Contact
  'contact.eyebrow': { en: 'Contact', zh: '联系我' },
  'contact.title.a': { en: 'Say', zh: '来' },
  'contact.title.b': { en: 'hello.', zh: '聊聊。' },
  'contact.title.c': { en: '', zh: '' },
  'contact.intro': {
    en: "I'm looking for a PhD position in environmental modelling. I'm also glad to hear about collaborations, photo licensing, or anything to do with soil and water. Use whichever of these suits you.",
    zh: '我在找环境建模方向的博士。想合作、想用照片，或者就想聊聊土壤和水，都可以。下面几个方式，哪个顺手用哪个。'
  },
  'contact.channel.bilibili': { en: 'Bilibili', zh: '哔哩哔哩' },
  'contact.channel.hint.bilibili': { en: 'The films, in full quality.', zh: '片子的高清完整版。' },
  'contact.channel.personal': { en: 'Personal', zh: '个人邮箱' },
  'contact.channel.linkedin': { en: 'LinkedIn', zh: 'LinkedIn' },
  'contact.channel.cv': { en: 'CV (PDF)', zh: '简历 (PDF)' },
  'contact.channel.transcript': { en: 'Transcript (PDF)', zh: '成绩单 (PDF)' },
  'contact.channel.hint.personal': { en: 'Collaborations, photo licensing, or just to say hi. Click to copy.', zh: '合作、用图，或者打个招呼。点一下就复制。' },
  'contact.copied': { en: 'Copied', zh: '已复制' },
  'contact.channel.hint.linkedin': { en: 'The full CV, in LinkedIn form.', zh: '更完整的履历。' },
  'contact.channel.hint.cv': {
    en: 'Latest version, September 2026. Education, research, awards.',
    zh: '2026 年 9 月更新的。教育、科研、奖项都在里面。'
  },
  'contact.channel.hint.transcript': { en: 'Grades from Wageningen, updated as they come in.', zh: '瓦大的成绩，出一门更新一门。' },
  'contact.based': { en: 'Based in', zh: '在' },
  'contact.current': {
    en: 'MSc, Wageningen University · Looking for a PhD position',
    zh: '瓦赫宁根大学硕士 · 在找博士'
  },

  // Marquee ribbons between chapters
  'marquee.soils': { en: 'Soils', zh: '土壤' },
  'marquee.water': { en: 'Water', zh: '水' },
  'marquee.climate': { en: 'Climate', zh: '气候' },
  'marquee.light': { en: 'Light', zh: '光' },
  'marquee.fieldwork': { en: 'Fieldwork', zh: '野外' },
  'marquee.talk': { en: "Let's talk", zh: '聊聊' },
  'marquee.phd': { en: 'PhD, 2026', zh: '2026 博士' },
  'marquee.collab': { en: 'Collaborate', zh: '合作' },
  'marquee.photography': { en: 'Photography', zh: '摄影' },
  'marquee.film': { en: 'Film', zh: '影像' },

  // Footer
  'footer.local_time': { en: 'Local time, Wageningen', zh: '瓦赫宁根当地时间' },
  'footer.top': { en: 'Back to top', zh: '回到顶部' },
  'footer.term': { en: 'Solar term', zh: '节气' },
  'footer.lunar': { en: 'Lunar date', zh: '农历' },
  'footer.sun': { en: 'Sun, Wageningen', zh: '瓦赫宁根日出日落' },
  'footer.alive': { en: 'The paper follows the Sun over Wageningen; when it rains there, it rains in the ink here.', zh: '纸色跟着瓦赫宁根的太阳走；那边下雨，这里的墨里也落雨。' },
  'footer.weather': { en: 'Weather, Wageningen', zh: '瓦赫宁根天气' },
  'cursor.play': { en: 'Play', zh: '播放' },
  'cursor.view': { en: 'View', zh: '查看' },
  'cursor.enter': { en: 'Enter', zh: '进入' },
  'cursor.drag': { en: 'Drag', zh: '拖动' },
  'footer.title.a': { en: 'If you work on', zh: '如果你也做' },
  'footer.title.b': {
    en: 'soil, water or climate,',
    zh: '土壤、水或气候，'
  },
  'footer.title.c': { en: 'write to me.', zh: '给我写信。' },
  'footer.location_hint': {
    en: 'Looking for a PhD. Open to collaborations and editorial use of the photos.',
    zh: '在找博士。合作、用图，都可以聊。'
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
    en: "Drag to turn · The coloured dots are countries I've been to", zh: "拖动旋转 · 彩色的点是去过的国家"
  },
  'about.skill.water': {
    en: "Water Quality", zh: "水质"
  },
  'about.skill.microplastics': {
    en: "Microplastics", zh: "微塑料"
  },
  'about.skill.scenario': {
    en: 'Environmental Modelling',
    zh: '环境建模'
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
    en: 'Carbon & Nutrient Cycles',
    zh: '碳与养分循环'
  },
  'about.skill.urban': {
    en: 'Soils & Agriculture',
    zh: '土壤与农业'
  },
  'footer.location': {
    en: "Wageningen, Netherlands", zh: "荷兰，瓦赫宁根"
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
    en: "No photos in this time range.", zh: "这段时间没拍照片。"
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
    en: "A made-up language", zh: "自己编的一门语言"
  },
  'nya.title.a': {
    en: "Nya,", zh: "Nya，"
  },
  'nya.title.b': {
    en: "a cat language", zh: "一门猫语，"
  },
  'nya.title.c': {
    en: "I made up.", zh: "我自己编的。"
  },
  'nya.intro': {
    en: "I made a small language for fun. It has its own words, a bit of grammar, and a script where each word is drawn as one cat: the cat's body spells out the sound and the meaning. Switch the site to 猫语 and the whole page turns into it.",
    zh: "闲着没事编了一门小语言。有自己的词、一点语法，还有一套文字：每个词画成一只猫，猫的身体同时写出读音和意思。把网站语言切到「猫语」，整页都会变成它。"
  },
  'nya.try': {
    en: "Type something", zh: "输入点什么"
  },
  'nya.in_nya': {
    en: "In Nya", zh: "用 Nya 写"
  },
  'nya.legend.title': {
    en: "How to read one cat", zh: "怎么读一只猫"
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
