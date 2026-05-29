export type Lang = 'en' | 'zh' | 'zh-Hant' | 'nl' | 'de';

// Display order + native names for the language switcher.
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '简体中文', short: '简' },
  { code: 'zh-Hant', label: '繁體中文', short: '繁' },
  { code: 'nl', label: 'Nederlands', short: 'NL' },
  { code: 'de', label: 'Deutsch', short: 'DE' }
];

export const dict: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', zh: '首页', 'zh-Hant': '首頁', nl: 'Home', de: 'Start' },
  'nav.about': { en: 'About', zh: '关于', 'zh-Hant': '關於', nl: 'Over mij', de: 'Über mich' },
  'nav.journey': { en: 'Journey', zh: '履历', 'zh-Hant': '歷程', nl: 'Traject', de: 'Werdegang' },
  'nav.photography': { en: 'Photography', zh: '摄影', 'zh-Hant': '攝影', nl: 'Fotografie', de: 'Fotografie' },
  'nav.contact': { en: 'Contact', zh: '联系', 'zh-Hant': '聯絡', nl: 'Contact', de: 'Kontakt' },
  'nav.blog': { en: 'Journal', zh: '笔记', 'zh-Hant': '筆記', nl: 'Notities', de: 'Notizen' },
  'nav.cta': { en: "Let's talk", zh: '聊聊', 'zh-Hant': '聊聊', nl: 'Even praten', de: 'Lass uns reden' },
  'nav.cv': { en: 'CV', zh: '简历', 'zh-Hant': '履歷', nl: 'CV', de: 'Lebenslauf' },

  // Hero
  'hero.eyebrow': {
    en: 'MSc graduate, May 2026 · Photographer',
    zh: '硕士毕业（2026 年 5 月）· 摄影师',
    'zh-Hant': '碩士畢業（2026 年 5 月）· 攝影師',
    nl: 'Afgestudeerd MSc, mei 2026 · Fotograaf',
    de: 'MSc-Absolvent, Mai 2026 · Fotograf'
  },
  'hero.gradbanner': {
    en: 'Celebrating my MSc graduation!',
    zh: '庆祝我硕士毕业！',
    'zh-Hant': '慶祝我碩士畢業！',
    nl: 'Ik vier mijn MSc-diploma!',
    de: 'Ich feiere meinen MSc-Abschluss!'
  },
  'hero.tagline': {
    en: 'Water systems, global change, and the quiet choreography of light on landscapes.',
    zh: '研究水、研究变化，也在光影落于大地的时刻按下快门。',
    'zh-Hant': '研究水、研究變遷，也在光影落於大地的時刻按下快門。',
    nl: 'Watersystemen, mondiale verandering, en het stille spel van licht over landschappen.',
    de: 'Wassersysteme, globaler Wandel und das leise Spiel des Lichts über Landschaften.'
  },
  'hero.subtitle': {
    en: 'MSc in Urban Environmental Management from Wageningen University & Research. I study water and plastic, and I photograph the places I study.',
    zh: '瓦赫宁根大学城市环境管理硕士。研究水与塑料，也记录我研究过的每一处土地。',
    'zh-Hant': '瓦赫寧根大學都市環境管理碩士。研究水與塑膠，也記錄我研究過的每一處土地。',
    nl: 'MSc Urban Environmental Management aan Wageningen University & Research. Ik onderzoek water en plastic, en fotografeer de plekken die ik bestudeer.',
    de: 'MSc in Urban Environmental Management an der Wageningen University & Research. Ich erforsche Wasser und Plastik und fotografiere die Orte, die ich untersuche.'
  },
  'hero.cta.primary': { en: 'Explore journey', zh: '探索我的履历', 'zh-Hant': '探索我的歷程', nl: 'Bekijk mijn traject', de: 'Werdegang ansehen' },
  'hero.cta.secondary': { en: 'Photography map', zh: '摄影地图', 'zh-Hant': '攝影地圖', nl: 'Fotokaart', de: 'Fotokarte' },
  'hero.cta.cv': { en: 'Download CV (PDF)', zh: '下载简历 (PDF)', 'zh-Hant': '下載履歷 (PDF)', nl: 'Download cv (PDF)', de: 'Lebenslauf herunterladen (PDF)' },
  'hero.docs.eyebrow': {
    en: 'Application files: always latest',
    zh: '申请材料：始终最新版本',
    'zh-Hant': '申請文件：始終最新版本',
    nl: 'Sollicitatiedocumenten: altijd de nieuwste versie',
    de: 'Bewerbungsunterlagen: immer aktuell'
  },
  'hero.docs.cv.label': { en: 'Curriculum Vitae', zh: '简历 (CV)', 'zh-Hant': '履歷 (CV)', nl: 'Curriculum vitae', de: 'Lebenslauf' },
  'hero.docs.cv.title': { en: 'View latest CV', zh: '查看最新简历', 'zh-Hant': '查看最新履歷', nl: 'Bekijk nieuwste cv', de: 'Aktuellen Lebenslauf ansehen' },
  'hero.docs.cv.meta': { en: 'PDF · Updated May 2026', zh: 'PDF · 2026 年 5 月更新', 'zh-Hant': 'PDF · 2026 年 5 月更新', nl: 'PDF · bijgewerkt mei 2026', de: 'PDF · Stand Mai 2026' },
  'hero.docs.transcript.label': { en: 'Academic Transcript', zh: '成绩单', 'zh-Hant': '成績單', nl: 'Cijferlijst', de: 'Notenübersicht' },
  'hero.docs.transcript.title': { en: 'View latest transcript', zh: '查看最新成绩单', 'zh-Hant': '查看最新成績單', nl: 'Bekijk nieuwste cijferlijst', de: 'Aktuelle Notenübersicht ansehen' },
  'hero.docs.transcript.meta': { en: 'PDF · WUR record · May 2026', zh: 'PDF · 瓦大成绩 · 2026 年 5 月', 'zh-Hant': 'PDF · 瓦大成績 · 2026 年 5 月', nl: 'PDF · WUR-cijfers · mei 2026', de: 'PDF · WUR-Nachweis · Mai 2026' },
  'hero.docs.cadence': {
    en: 'Reviewing my application? These files update on a daily-to-monthly cadence. Click through here for the latest version anytime.',
    zh: '正在审阅我的申请？这两份文件会以每日到每月的频率持续更新，这里始终是最新版本，随时点开即是。',
    'zh-Hant': '正在審閱我的申請？這兩份文件會以每日到每月的頻率持續更新，這裡始終是最新版本，隨時點開即是。',
    nl: 'Bekijkt u mijn sollicitatie? Deze bestanden worden dagelijks tot maandelijks bijgewerkt. Klik hier voor altijd de nieuwste versie.',
    de: 'Sie prüfen meine Bewerbung? Diese Dateien werden täglich bis monatlich aktualisiert. Hier finden Sie jederzeit die neueste Version.'
  },
  'hero.scroll': { en: 'Scroll', zh: '下滑', 'zh-Hant': '向下捲動', nl: 'Scroll', de: 'Scrollen' },
  'stat.countries': { en: 'Countries', zh: '国家', 'zh-Hant': '國家', nl: 'Landen', de: 'Länder' },
  'stat.universities': { en: 'Universities', zh: '高校', 'zh-Hant': '大學', nl: 'Universiteiten', de: 'Universitäten' },
  'stat.projects': { en: 'Research projects', zh: '科研项目', 'zh-Hant': '研究計畫', nl: 'Onderzoeksprojecten', de: 'Forschungsprojekte' },
  'stat.photos': { en: 'Photographs', zh: '作品', 'zh-Hant': '作品', nl: "Foto's", de: 'Fotografien' },

  // About
  'about.eyebrow': { en: 'About me', zh: '关于我', 'zh-Hant': '關於我', nl: 'Over mij', de: 'Über mich' },
  'about.title.a': { en: 'Researching the', zh: '研究那些', 'zh-Hant': '研究那些', nl: 'Onderzoek naar de', de: 'Ich erforsche die' },
  'about.title.b': { en: 'quiet systems', zh: '静默运转', 'zh-Hant': '靜默運轉', nl: 'stille systemen', de: 'stillen Systeme' },
  'about.title.c': {
    en: 'we take for granted.',
    zh: '却被我们视为理所当然的系统。',
    'zh-Hant': '卻被我們視為理所當然的系統。',
    nl: 'die we als vanzelfsprekend beschouwen.',
    de: 'hinter unserem Alltag.'
  },
  'about.p1': {
    en: "I've just graduated with an MSc in Urban Environmental Management from Wageningen (end of May 2026). My thesis estimates how much microplastic is retained in rivers, at the sub-basin scale worldwide, where water systems, global change, and machine learning meet.",
    zh: '我刚从瓦赫宁根大学城市环境管理硕士毕业（2026 年 5 月底）。我的论文研究全球范围内河流次流域尺度上的微塑料截留，处在水系统、全球变化与机器学习的交叉地带。',
    'zh-Hant': '我剛從瓦赫寧根大學都市環境管理碩士畢業（2026 年 5 月底）。我的論文研究全球範圍內河流次流域尺度上的微塑膠截留，處在水系統、全球變遷與機器學習的交會之處。',
    nl: 'Ik ben net afgestudeerd als MSc Urban Environmental Management in Wageningen (eind mei 2026). Mijn scriptie schat hoeveel microplastic rivieren vasthouden, op de schaal van deelstroomgebieden wereldwijd, waar watersystemen, mondiale verandering en machine learning samenkomen.',
    de: 'Ich habe gerade meinen MSc in Urban Environmental Management in Wageningen abgeschlossen (Ende Mai 2026). Meine Masterarbeit schätzt, wie viel Mikroplastik Flüsse zurückhalten, auf der Ebene von Teileinzugsgebieten weltweit, dort wo Wassersysteme, globaler Wandel und maschinelles Lernen zusammentreffen.'
  },
  'about.p2': {
    en: "Before Wageningen, I studied forestry across Canada and China and interned with the University of Eastern Finland doing soil-water fieldwork in Lapland. I've been lucky to learn in four very different landscapes, and I carry a camera to each of them.",
    zh: '来瓦大之前，我在加拿大和中国都学过林学，也在东芬兰大学做过拉普兰冻土带的土壤与水实地研究。我很幸运能在四种截然不同的地貌里求学，每一次我都带着相机。',
    'zh-Hant': '來瓦大之前，我在加拿大和中國都學過林學，也在東芬蘭大學做過拉普蘭凍土帶的土壤與水實地研究。我很幸運能在四種截然不同的地貌裡求學，每一次我都帶著相機。',
    nl: "Vóór Wageningen studeerde ik bosbouw in Canada en China en liep ik stage bij de University of Eastern Finland met veldwerk over bodem en water in Lapland. Ik heb het geluk gehad te mogen leren in vier heel verschillende landschappen, en naar elk daarvan neem ik een camera mee.",
    de: 'Vor Wageningen studierte ich Forstwissenschaft in Kanada und China und absolvierte ein Praktikum an der University of Eastern Finland mit Feldarbeit zu Boden und Wasser in Lappland. Ich hatte das Glück, in vier sehr unterschiedlichen Landschaften zu lernen, und in jede nehme ich eine Kamera mit.'
  },
  'about.p3': {
    en: "This site is a working notebook: my research, the places I've stood in, and the photographs I've made there.",
    zh: '这个网站就是我的工作笔记：研究、去过的地方，以及在那里拍下的照片。',
    'zh-Hant': '這個網站就是我的工作筆記：研究、去過的地方，以及在那裡拍下的照片。',
    nl: "Deze site is een werkschrift: mijn onderzoek, de plekken waar ik heb gestaan, en de foto's die ik daar maakte.",
    de: 'Diese Seite ist ein Arbeitsheft: meine Forschung, die Orte, an denen ich stand, und die Fotos, die ich dort gemacht habe.'
  },

  // Journey
  'journey.eyebrow': { en: 'Research journey', zh: '研究履历', 'zh-Hant': '研究歷程', nl: 'Onderzoekstraject', de: 'Forschungsweg' },
  'journey.title.a': { en: 'Four countries. Four universities.', zh: '四个国家，四所高校。', 'zh-Hant': '四個國家，四所大學。', nl: 'Vier landen. Vier universiteiten.', de: 'Vier Länder. Vier Universitäten.' },
  'journey.title.b': { en: 'One question', zh: '一个问题', 'zh-Hant': '一個問題', nl: 'Eén vraag', de: 'Eine Frage' },
  'journey.title.c': {
    en: ': how do water and life co-evolve under pressure?',
    zh: '：在压力之下，水与生命如何共同演化？',
    'zh-Hant': '：在壓力之下，水與生命如何共同演化？',
    nl: ': hoe evolueren water en leven samen onder druk?',
    de: ': Wie entwickeln sich Wasser und Leben unter Druck gemeinsam?'
  },
  'journey.filter.all': { en: 'All', zh: '全部', 'zh-Hant': '全部', nl: 'Alles', de: 'Alle' },
  'journey.filter.education': { en: 'Education', zh: '教育', 'zh-Hant': '教育', nl: 'Opleiding', de: 'Ausbildung' },
  'journey.filter.experience': { en: 'Experience', zh: '经历', 'zh-Hant': '經歷', nl: 'Ervaring', de: 'Erfahrung' },
  'journey.filter.project': { en: 'Projects', zh: '项目', 'zh-Hant': '計畫', nl: 'Projecten', de: 'Projekte' },
  'journey.kind.education': { en: 'education', zh: '教育', 'zh-Hant': '教育', nl: 'opleiding', de: 'Ausbildung' },
  'journey.kind.experience': { en: 'experience', zh: '经历', 'zh-Hant': '經歷', nl: 'ervaring', de: 'Erfahrung' },
  'journey.kind.project': { en: 'project', zh: '项目', 'zh-Hant': '計畫', nl: 'project', de: 'Projekt' },
  'journey.ongoing': { en: 'Ongoing', zh: '进行中', 'zh-Hant': '進行中', nl: 'Lopend', de: 'Laufend' },
  'journey.present': { en: 'present', zh: '至今', 'zh-Hant': '至今', nl: 'heden', de: 'heute' },
  'journey.supervisor': { en: 'Supervisor', zh: '导师', 'zh-Hant': '指導教授', nl: 'Begeleider', de: 'Betreuer' },
  'journey.places': { en: 'Places', zh: '地点', 'zh-Hant': '地點', nl: 'Plekken', de: 'Orte' },
  'journey.hover_hint': { en: 'Hover a card', zh: '悬停卡片', 'zh-Hant': '將游標移至卡片', nl: 'Beweeg over een kaart', de: 'Auf eine Karte zeigen' },

  // Photography
  'photo.eyebrow': { en: 'Photography', zh: '摄影', 'zh-Hant': '攝影', nl: 'Fotografie', de: 'Fotografie' },
  'photo.title.a': { en: 'A', zh: '一本', 'zh-Hant': '一本', nl: 'Een', de: 'Ein' },
  'photo.title.b': { en: 'field notebook', zh: '野外笔记', 'zh-Hant': '野外筆記', nl: 'veldschrift', de: 'Feldtagebuch' },
  'photo.title.c': { en: 'in light and silver.', zh: '，以光与银盐写就。', 'zh-Hant': '，以光與銀鹽寫就。', nl: 'in licht en zilver.', de: 'aus Licht und Silber.' },
  'photo.intro': {
    en: "Every pin on the map is a place I've stood with a camera. Click one to open the frames. Drag the time slider to travel years, or switch to the timeline view for a chronological ribbon.",
    zh: '地图上每一个图钉，都是我曾经举起相机的地方。点击图钉查看照片；拖动时间轴穿越年份；或切换到时间线视图，按时间顺序浏览。',
    'zh-Hant': '地圖上每一個圖釘，都是我曾經舉起相機的地方。點擊圖釘查看照片；拖動時間軸穿越年份；或切換到時間軸檢視，依時間順序瀏覽。',
    nl: "Elke speld op de kaart is een plek waar ik met een camera heb gestaan. Klik er een aan om de foto's te openen. Sleep de tijdschuif om door de jaren te reizen, of schakel naar de tijdlijnweergave voor een chronologisch overzicht.",
    de: 'Jede Markierung auf der Karte ist ein Ort, an dem ich mit einer Kamera stand. Klicken Sie eine an, um die Aufnahmen zu öffnen. Ziehen Sie den Zeitregler, um durch die Jahre zu reisen, oder wechseln Sie zur Zeitleistenansicht für einen chronologischen Überblick.'
  },
  'photo.stat.frames': { en: 'Frames', zh: '张', 'zh-Hant': '張', nl: "Foto's", de: 'Aufnahmen' },
  'photo.stat.countries': { en: 'Countries', zh: '国家', 'zh-Hant': '國家', nl: 'Landen', de: 'Länder' },
  'photo.stat.years': { en: 'Years', zh: '年跨度', 'zh-Hant': '年跨度', nl: 'Jaren', de: 'Jahre' },
  'photo.view.map': { en: 'Map', zh: '地图', 'zh-Hant': '地圖', nl: 'Kaart', de: 'Karte' },
  'photo.view.timeline': { en: 'Timeline', zh: '时间线', 'zh-Hant': '時間軸', nl: 'Tijdlijn', de: 'Zeitleiste' },
  'photo.demo_label': { en: 'Demo mode:', zh: '演示模式：', 'zh-Hant': '示範模式：', nl: 'Demomodus:', de: 'Demomodus:' },
  'photo.demo_body': {
    en: 'currently showing placeholder pins. Drop photos in /photos/ and run npm run photos:manifest.',
    zh: '目前显示的是占位图钉。把照片放进 /photos/ 再跑 npm run photos:manifest 即可。',
    'zh-Hant': '目前顯示的是佔位圖釘。把照片放進 /photos/ 再執行 npm run photos:manifest 即可。',
    nl: "er worden nu plaatshouders getoond. Zet foto's in /photos/ en voer npm run photos:manifest uit.",
    de: 'zeigt derzeit Platzhalter. Lege Fotos in /photos/ ab und führe npm run photos:manifest aus.'
  },
  'photo.time_range': { en: 'Time range', zh: '时间范围', 'zh-Hant': '時間範圍', nl: 'Tijdsbereik', de: 'Zeitraum' },
  'photo.visible': { en: 'frames visible', zh: '张可见', 'zh-Hant': '張可見', nl: "foto's zichtbaar", de: 'Aufnahmen sichtbar' },
  'photo.no_photos': { en: 'No photos in this time range.', zh: '这个时间段内没有照片。', 'zh-Hant': '這個時間段內沒有照片。', nl: "Geen foto's in dit tijdsbereik.", de: 'Keine Fotos in diesem Zeitraum.' },

  // Contact
  'contact.eyebrow': { en: 'Contact', zh: '联系我', 'zh-Hant': '聯絡我', nl: 'Contact', de: 'Kontakt' },
  'contact.title.a': { en: 'Say', zh: '说句', 'zh-Hant': '說聲', nl: 'Zeg', de: 'Sag' },
  'contact.title.b': { en: 'hello', zh: '你好', 'zh-Hant': '你好', nl: 'hallo', de: 'Hallo' },
  'contact.intro': {
    en: "I'm open to research collaborations, photography licensing, and good conversations about water, cities, and forests. Pick whichever channel fits.",
    zh: '欢迎联系：科研合作、图片授权，或者关于水、城市、森林的任何交流。随便选一个渠道。',
    'zh-Hant': '歡迎聯絡：研究合作、圖片授權，或者關於水、城市、森林的任何交流。隨意選一個管道。',
    nl: "Ik sta open voor onderzoekssamenwerkingen, het licentiëren van foto's, en goede gesprekken over water, steden en bossen. Kies het kanaal dat past.",
    de: 'Ich bin offen für Forschungskooperationen, die Lizenzierung von Fotos und gute Gespräche über Wasser, Städte und Wälder. Wählen Sie einfach den passenden Kanal.'
  },
  'contact.channel.personal': { en: 'Personal', zh: '个人邮箱', 'zh-Hant': '個人信箱', nl: 'Persoonlijk', de: 'Privat' },
  'contact.channel.academic': { en: 'Academic', zh: '学术邮箱', 'zh-Hant': '學術信箱', nl: 'Academisch', de: 'Akademisch' },
  'contact.channel.linkedin': { en: 'LinkedIn', zh: 'LinkedIn', 'zh-Hant': 'LinkedIn', nl: 'LinkedIn', de: 'LinkedIn' },
  'contact.channel.cv': { en: 'CV (PDF)', zh: '简历 (PDF)', 'zh-Hant': '履歷 (PDF)', nl: 'cv (PDF)', de: 'Lebenslauf (PDF)' },
  'contact.channel.transcript': { en: 'Transcript (PDF)', zh: '成绩单 (PDF)', 'zh-Hant': '成績單 (PDF)', nl: 'Cijferlijst (PDF)', de: 'Notenübersicht (PDF)' },
  'contact.channel.hint.personal': { en: 'For collaborations, photo licensing, open talk.', zh: '合作、图片授权、随意聊天。', 'zh-Hant': '合作、圖片授權、隨意聊天。', nl: 'Voor samenwerkingen, fotolicenties, vrijuit praten.', de: 'Für Kooperationen, Fotolizenzen, offenen Austausch.' },
  'contact.channel.hint.academic': { en: 'For research & WUR-related correspondence.', zh: '科研相关、瓦大事务。', 'zh-Hant': '研究相關、瓦大事務。', nl: 'Voor onderzoek en WUR-gerelateerde correspondentie.', de: 'Für Forschung und WUR-bezogene Korrespondenz.' },
  'contact.channel.hint.linkedin': { en: 'The long-form version of my journey.', zh: '更完整的履历版本。', 'zh-Hant': '更完整的歷程版本。', nl: 'De uitgebreide versie van mijn traject.', de: 'Die ausführliche Version meines Werdegangs.' },
  'contact.channel.hint.cv': { en: 'Latest version, May 2026. Education, research, awards.', zh: '最新版本，2026 年 5 月。教育、科研、奖项。', 'zh-Hant': '最新版本，2026 年 5 月。教育、研究、獎項。', nl: 'Nieuwste versie, mei 2026. Opleiding, onderzoek, prijzen.', de: 'Neueste Version, Mai 2026. Ausbildung, Forschung, Auszeichnungen.' },
  'contact.channel.hint.transcript': { en: 'WUR academic record, kept current as new grades land.', zh: '瓦大成绩记录，有新成绩会同步更新。', 'zh-Hant': '瓦大成績記錄，有新成績會同步更新。', nl: 'WUR-cijferlijst, steeds bijgewerkt met nieuwe cijfers.', de: 'WUR-Notennachweis, laufend mit neuen Noten aktualisiert.' },
  'contact.based': { en: 'Based in', zh: '常驻', 'zh-Hant': '常駐', nl: 'Gevestigd in', de: 'Ansässig in' },
  'contact.current': { en: 'MSc, Wageningen University · Graduated May 2026', zh: '瓦赫宁根大学硕士 · 2026 年 5 月毕业', 'zh-Hant': '瓦赫寧根大學碩士 · 2026 年 5 月畢業', nl: 'MSc, Wageningen University · afgestudeerd mei 2026', de: 'MSc, Wageningen University · Abschluss Mai 2026' },

  // Blog / Journal
  'blog.eyebrow': { en: 'Journal', zh: '笔记', 'zh-Hant': '筆記', nl: 'Notities', de: 'Notizen' },
  'blog.title': { en: 'Field notes & essays', zh: '野外随记与随笔', 'zh-Hant': '野外隨記與隨筆', nl: 'Veldnotities & essays', de: 'Feldnotizen & Essays' },
  'blog.intro': {
    en: 'Short notes from the water and microplastics work, the occasional photo essay, and things I am still thinking about. Written in English and 中文.',
    zh: '关于水与微塑料工作的短记，偶尔的图片随笔，还有我仍在琢磨的一些问题。中英文写作。',
    'zh-Hant': '關於水與微塑膠工作的短記，偶爾的圖片隨筆，還有我仍在琢磨的一些問題。中英文寫作。',
    nl: 'Korte notities uit het werk over water en microplastics, af en toe een foto-essay, en dingen waar ik nog over nadenk. Geschreven in het Engels en Chinees.',
    de: 'Kurze Notizen aus der Arbeit über Wasser und Mikroplastik, gelegentlich ein Fotoessay und Gedanken, über die ich noch nachdenke. Auf Englisch und Chinesisch.'
  },
  'blog.minread': { en: 'min read', zh: '分钟阅读', 'zh-Hant': '分鐘閱讀', nl: 'min lezen', de: 'Min. Lesezeit' },
  'blog.back': { en: 'All posts', zh: '所有文章', 'zh-Hant': '所有文章', nl: 'Alle berichten', de: 'Alle Beiträge' },
  'blog.backhome': { en: 'Home', zh: '首页', 'zh-Hant': '首頁', nl: 'Home', de: 'Start' },
  'blog.published': { en: 'Published', zh: '发表于', 'zh-Hant': '發表於', nl: 'Gepubliceerd', de: 'Veröffentlicht' },
  'blog.updated': { en: 'updated', zh: '更新', 'zh-Hant': '更新', nl: 'bijgewerkt', de: 'aktualisiert' },
  'blog.empty': { en: 'No posts in this language yet. Showing everything.', zh: '这个语言下还没有文章，先显示全部。', 'zh-Hant': '這個語言下還沒有文章，先顯示全部。', nl: 'Nog geen berichten in deze taal. Alles wordt getoond.', de: 'Noch keine Beiträge in dieser Sprache. Es wird alles angezeigt.' },
  'blog.none': { en: 'No posts yet. Check back soon.', zh: '还没有文章，敬请期待。', 'zh-Hant': '還沒有文章，敬請期待。', nl: 'Nog geen berichten. Kom binnenkort terug.', de: 'Noch keine Beiträge. Schau bald wieder vorbei.' },
  'blog.like_hint': { en: 'Like this if it resonated.', zh: '如果有共鸣，点个赞。', 'zh-Hant': '如果有共鳴，按個讚。', nl: 'Vind je dit mooi? Geef een like.', de: 'Hat es dich angesprochen? Lass ein Like da.' },
  'blog.comments': { en: 'Comments', zh: '评论', 'zh-Hant': '留言', nl: 'Reacties', de: 'Kommentare' },
  'blog.comments_soon': { en: 'Comments are coming soon.', zh: '评论功能即将开放。', 'zh-Hant': '留言功能即將開放。', nl: 'Reacties komen binnenkort.', de: 'Kommentare folgen in Kürze.' },

  // Footer
  'footer.title.a': { en: "Let's collaborate on", zh: '让我们一起探索', 'zh-Hant': '讓我們一起探索', nl: 'Laten we samenwerken aan', de: 'Lass uns zusammenarbeiten an' },
  'footer.title.b': {
    en: 'water, change, and the world we photograph',
    zh: '水、变化，以及我们用镜头凝视的世界',
    'zh-Hant': '水、變遷，以及我們用鏡頭凝視的世界',
    nl: 'water, verandering, en de wereld die we fotograferen',
    de: 'Wasser, Wandel und der Welt, die wir fotografieren'
  },
  'footer.location_hint': {
    en: 'Available for research collaborations and editorial photo use.',
    zh: '接受科研合作与编辑类图片授权。',
    'zh-Hant': '接受研究合作與編輯類圖片授權。',
    nl: 'Beschikbaar voor onderzoekssamenwerkingen en redactioneel fotogebruik.',
    de: 'Verfügbar für Forschungskooperationen und redaktionelle Fotonutzung.'
  },
  'footer.rights': {
    en: '© {year} Yiyang Shen · Built with Astro',
    zh: '© {year} 沈亦旸 · 由 Astro 构建',
    'zh-Hant': '© {year} 沈亦旸 · 以 Astro 建構',
    nl: '© {year} Yiyang Shen · Gebouwd met Astro',
    de: '© {year} Yiyang Shen · Erstellt mit Astro'
  }
};

export function t(key: string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
