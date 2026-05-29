// Real content languages (every dict entry + journey Loc carries these).
export type Lang = 'en' | 'zh' | 'zh-Hant' | 'nl' | 'de' | 'fi' | 'ja' | 'ko' | 'fr';
// Selectable UI languages = real languages plus playful, derived ones.
export type UILang = Lang | 'mars' | 'cat' | 'klingon' | 'nyaring';

export const LANG_CODES: Lang[] = ['en', 'zh', 'zh-Hant', 'nl', 'de', 'fi', 'ja', 'ko', 'fr'];

// Display order + native names for the language switcher.
export const LANGS: { code: UILang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '简体中文', short: '简' },
  { code: 'zh-Hant', label: '繁體中文', short: '繁' },
  { code: 'ja', label: '日本語', short: '日' },
  { code: 'ko', label: '한국어', short: '한' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'nl', label: 'Nederlands', short: 'NL' },
  { code: 'fi', label: 'Suomi', short: 'FI' },
  { code: 'mars', label: '火星文', short: '火' },
  { code: 'cat', label: '猫猫语 (Nya)', short: '喵' },
  { code: 'klingon', label: 'tlhIngan Hol', short: 'tlh' },
  { code: 'nyaring', label: '猫语 ◌ (圆环)', short: '◌' }
];

export const dict: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', zh: '首页', 'zh-Hant': '首頁', nl: 'Home', de: 'Start', fi: 'Etusivu', ja: 'ホーム', ko: '홈', fr: 'Accueil' },
  'nav.about': { en: 'About', zh: '关于', 'zh-Hant': '關於', nl: 'Over mij', de: 'Über mich', fi: 'Minusta', ja: '自己紹介', ko: '소개', fr: 'À propos' },
  'nav.journey': { en: 'Journey', zh: '历程', 'zh-Hant': '歷程', nl: 'Traject', de: 'Werdegang', fi: 'Polku', ja: '歩み', ko: '여정', fr: 'Parcours' },
  'nav.photography': { en: 'Photography', zh: '摄影', 'zh-Hant': '攝影', nl: 'Fotografie', de: 'Fotografie', fi: 'Valokuvaus', ja: '写真', ko: '사진', fr: 'Photographie' },
  'nav.contact': { en: 'Contact', zh: '联系', 'zh-Hant': '聯絡', nl: 'Contact', de: 'Kontakt', fi: 'Yhteystiedot', ja: '連絡先', ko: '연락처', fr: 'Contact' },
  'nav.blog': { en: 'Journal', zh: '笔记', 'zh-Hant': '筆記', nl: 'Notities', de: 'Notizen', fi: 'Muistiinpanot', ja: 'ノート', ko: '노트', fr: 'Carnet' },
  'nav.cta': { en: "Let's talk", zh: '聊聊', 'zh-Hant': '聊聊', nl: 'Even praten', de: 'Schreib mir', fi: 'Jutellaan', ja: '話しましょう', ko: '이야기해요', fr: 'Discutons' },
  'nav.cv': { en: 'CV', zh: '简历', 'zh-Hant': '履歷', nl: 'CV', de: 'Lebenslauf', fi: 'CV', ja: '履歴書', ko: '이력서', fr: 'CV' },

  // Hero
  'hero.eyebrow': {
    en: 'MSc graduate, May 2026 · Photographer',
    zh: '硕士毕业（2026 年 5 月）· 摄影师',
    'zh-Hant': '碩士畢業（2026 年 5 月）· 攝影師',
    nl: 'Afgestudeerd MSc, mei 2026 · Fotograaf',
    de: 'MSc-Absolvent, Mai 2026 · Fotograf',
    fi: 'Valmistunut MSc, toukokuu 2026 · Valokuvaaja',
    ja: '修士課程修了、2026年5月 · 写真家',
    ko: '석사 졸업, 2026년 5월 · 사진가',
    fr: 'Diplômé MSc, mai 2026 · Photographe'
  },
  'hero.gradbanner': {
    en: 'Celebrating my MSc graduation!',
    zh: '庆祝我硕士毕业！',
    'zh-Hant': '慶祝我碩士畢業！',
    nl: 'Ik vier mijn MSc-diploma!',
    de: 'Ich feiere meinen MSc-Abschluss!',
    fi: 'Juhlin MSc-valmistumistani!',
    ja: '修士課程の修了を祝って！',
    ko: '석사 졸업을 축하합니다!',
    fr: 'Je célèbre mon diplôme de MSc !'
  },
  'hero.tagline': {
    en: 'Water systems, global change, and the quiet choreography of light on landscapes.',
    zh: '研究水，研究变化，也在光影落于大地的那一刻按下快门。',
    'zh-Hant': '研究水，研究變遷，也在光影落於大地的那一刻按下快門。',
    nl: 'Watersystemen, mondiale verandering, en het stille spel van licht over het landschap.',
    de: 'Wassersysteme, globaler Wandel und das leise Spiel des Lichts über Landschaften.',
    fi: 'Vesijärjestelmät, globaali muutos ja valon hiljainen tanssi maisemien yllä.',
    ja: '水システム、地球規模の変化、そして風景に降りそそぐ光の静かな振り付け。',
    ko: '물 시스템, 지구적 변화, 그리고 풍경 위에 내려앉는 빛의 고요한 안무.',
    fr: "Les systèmes hydriques, le changement planétaire, et la chorégraphie silencieuse de la lumière sur les paysages."
  },
  'hero.subtitle': {
    en: 'MSc in Urban Environmental Management from Wageningen University & Research. I study water and plastic, and I photograph the places I study.',
    zh: '瓦赫宁根大学城市环境管理硕士。我研究水与塑料，也用镜头记录下我研究过的每一片土地。',
    'zh-Hant': '瓦赫寧根大學都市環境管理碩士。我研究水與塑膠，也用鏡頭記錄下我研究過的每一片土地。',
    nl: 'MSc Urban Environmental Management aan Wageningen University & Research. Ik onderzoek water en plastic, en fotografeer de plekken die ik bestudeer.',
    de: 'MSc in Urban Environmental Management an der Wageningen University & Research. Ich erforsche Wasser und Plastik und fotografiere die Orte, die ich untersuche.',
    fi: 'Ympäristöjohtamisen maisteri (Urban Environmental Management), Wageningen University & Research. Tutkin vettä ja muovia, ja valokuvaan paikkoja, joita tutkin.',
    ja: 'ワーヘニンゲン大学（WUR）都市環境管理学修士。水とプラスチックを研究し、研究した場所を写真に収めています。',
    ko: '바흐닝언 대학교(WUR) 도시환경관리 석사. 물과 플라스틱을 연구하고, 제가 연구한 장소를 사진으로 담습니다.',
    fr: "MSc en Urban Environmental Management de Wageningen University & Research. J'étudie l'eau et le plastique, et je photographie les lieux que j'étudie."
  },
  'hero.cta.primary': { en: 'Explore journey', zh: '探索我的历程', 'zh-Hant': '探索我的歷程', nl: 'Bekijk mijn traject', de: 'Werdegang ansehen', fi: 'Tutustu polkuuni', ja: '歩みを見る', ko: '여정 살펴보기', fr: 'Voir le parcours' },
  'hero.cta.secondary': { en: 'Photography map', zh: '摄影地图', 'zh-Hant': '攝影地圖', nl: 'Fotokaart', de: 'Fotokarte', fi: 'Valokuvakartta', ja: '写真マップ', ko: '사진 지도', fr: 'Carte photo' },
  'hero.cta.cv': { en: 'Download CV (PDF)', zh: '下载简历 (PDF)', 'zh-Hant': '下載履歷 (PDF)', nl: 'Download cv (PDF)', de: 'Lebenslauf herunterladen (PDF)', fi: 'Lataa CV (PDF)', ja: '履歴書をダウンロード (PDF)', ko: '이력서 내려받기 (PDF)', fr: 'Télécharger le CV (PDF)' },
  'hero.docs.eyebrow': {
    en: 'Application files: always latest',
    zh: '申请材料：始终是最新版本',
    'zh-Hant': '申請文件：始終是最新版本',
    nl: 'Sollicitatiedocumenten: altijd de nieuwste versie',
    de: 'Bewerbungsunterlagen: immer aktuell',
    fi: 'Hakemusasiakirjat: aina uusin versio',
    ja: '出願書類：常に最新版',
    ko: '지원 서류: 항상 최신 버전',
    fr: 'Dossiers de candidature : toujours à jour'
  },
  'hero.docs.cv.label': { en: 'Curriculum Vitae', zh: '简历 (CV)', 'zh-Hant': '履歷 (CV)', nl: 'Curriculum vitae', de: 'Lebenslauf', fi: 'Ansioluettelo', ja: '履歴書 (CV)', ko: '이력서 (CV)', fr: 'Curriculum vitae' },
  'hero.docs.cv.title': { en: 'View latest CV', zh: '查看最新简历', 'zh-Hant': '查看最新履歷', nl: 'Bekijk nieuwste cv', de: 'Aktuellen Lebenslauf ansehen', fi: 'Katso uusin CV', ja: '最新の履歴書を見る', ko: '최신 이력서 보기', fr: 'Voir le dernier CV' },
  'hero.docs.cv.meta': { en: 'PDF · Updated May 2026', zh: 'PDF · 2026 年 5 月更新', 'zh-Hant': 'PDF · 2026 年 5 月更新', nl: 'PDF · bijgewerkt mei 2026', de: 'PDF · Stand Mai 2026', fi: 'PDF · päivitetty toukokuussa 2026', ja: 'PDF · 2026年5月更新', ko: 'PDF · 2026년 5월 업데이트', fr: 'PDF · mis à jour mai 2026' },
  'hero.docs.transcript.label': { en: 'Academic Transcript', zh: '成绩单', 'zh-Hant': '成績單', nl: 'Cijferlijst', de: 'Notenübersicht', fi: 'Opintosuoritusote', ja: '成績証明書', ko: '성적 증명서', fr: 'Relevé de notes' },
  'hero.docs.transcript.title': { en: 'View latest transcript', zh: '查看最新成绩单', 'zh-Hant': '查看最新成績單', nl: 'Bekijk nieuwste cijferlijst', de: 'Aktuelle Notenübersicht ansehen', fi: 'Katso uusin ote', ja: '最新の成績証明書を見る', ko: '최신 성적 증명서 보기', fr: 'Voir le dernier relevé' },
  'hero.docs.transcript.meta': { en: 'PDF · WUR record · May 2026', zh: 'PDF · 瓦大成绩 · 2026 年 5 月', 'zh-Hant': 'PDF · 瓦大成績 · 2026 年 5 月', nl: 'PDF · WUR-cijfers · mei 2026', de: 'PDF · WUR-Nachweis · Mai 2026', fi: 'PDF · WUR-ote · toukokuu 2026', ja: 'PDF · WUR成績 · 2026年5月', ko: 'PDF · WUR 성적 · 2026년 5월', fr: 'PDF · relevé WUR · mai 2026' },
  'hero.docs.cadence': {
    en: 'Reviewing my application? These files update on a daily-to-monthly cadence. Click through here for the latest version anytime.',
    zh: '正在审阅我的申请吗？这两份文件会以每日到每月的频率持续更新，这里永远是最新版本，随时点开即可。',
    'zh-Hant': '正在審閱我的申請嗎？這兩份文件會以每日到每月的頻率持續更新，這裡永遠是最新版本，隨時點開即可。',
    nl: 'Bekijkt u mijn sollicitatie? Deze bestanden worden dagelijks tot maandelijks bijgewerkt. Hier vindt u altijd de nieuwste versie.',
    de: 'Sie prüfen meine Bewerbung? Diese Dateien werden täglich bis monatlich aktualisiert. Hier finden Sie jederzeit die neueste Version.',
    fi: 'Arvioitko hakemustani? Nämä tiedostot päivittyvät päivittäin tai kuukausittain. Täältä löydät aina uusimman version.',
    ja: '私の出願書類をご確認中ですか？これらのファイルは毎日から毎月の頻度で更新されます。ここからいつでも最新版をご覧いただけます。',
    ko: '제 지원서를 검토 중이신가요? 이 파일들은 매일에서 매월 주기로 업데이트됩니다. 언제든 여기에서 최신 버전을 확인하실 수 있습니다.',
    fr: "Vous examinez ma candidature ? Ces fichiers sont mis à jour quotidiennement à mensuellement. Retrouvez ici la dernière version à tout moment."
  },
  'hero.scroll': { en: 'Scroll', zh: '下滑', 'zh-Hant': '向下捲動', nl: 'Scroll', de: 'Scrollen', fi: 'Vieritä', ja: 'スクロール', ko: '스크롤', fr: 'Défiler' },
  'stat.countries': { en: 'Countries', zh: '国家', 'zh-Hant': '國家', nl: 'Landen', de: 'Länder', fi: 'Maata', ja: 'カ国', ko: '개국', fr: 'Pays' },
  'stat.universities': { en: 'Universities', zh: '高校', 'zh-Hant': '大學', nl: 'Universiteiten', de: 'Universitäten', fi: 'Yliopistoa', ja: '大学', ko: '개 대학', fr: 'Universités' },
  'stat.projects': { en: 'Research projects', zh: '科研项目', 'zh-Hant': '研究計畫', nl: 'Onderzoeksprojecten', de: 'Forschungsprojekte', fi: 'Tutkimusprojektia', ja: '研究プロジェクト', ko: '연구 프로젝트', fr: 'Projets de recherche' },
  'stat.photos': { en: 'Photographs', zh: '作品', 'zh-Hant': '作品', nl: "Foto's", de: 'Fotografien', fi: 'Valokuvaa', ja: '作品', ko: '작품', fr: 'Photographies' },

  // About
  'about.eyebrow': { en: 'About me', zh: '关于我', 'zh-Hant': '關於我', nl: 'Over mij', de: 'Über mich', fi: 'Tietoa minusta', ja: '自己紹介', ko: '소개', fr: 'À propos' },
  'about.title.a': { en: 'Researching the', zh: '研究那些', 'zh-Hant': '研究那些', nl: 'Onderzoek naar de', de: 'Ich erforsche die', fi: 'Tutkin', ja: '私たちが当たり前と思う', ko: '우리가 당연하게 여기는', fr: 'Étudier les' },
  'about.title.b': { en: 'quiet systems', zh: '静默运转', 'zh-Hant': '靜默運轉', nl: 'stille systemen', de: 'stillen Systeme', fi: 'hiljaisia järjestelmiä', ja: '静かなシステムを', ko: '고요한 시스템을', fr: 'systèmes silencieux' },
  'about.title.c': {
    en: 'we take for granted.',
    zh: '却被我们视为理所当然的系统。',
    'zh-Hant': '卻被我們視為理所當然的系統。',
    nl: 'die we als vanzelfsprekend beschouwen.',
    de: 'hinter unserem Alltag.',
    fi: 'arkemme taustalla.',
    ja: '研究しています。',
    ko: '연구합니다.',
    fr: "que l'on tient pour acquis."
  },
  'about.p1': {
    en: "I've just graduated with an MSc in Urban Environmental Management from Wageningen (end of May 2026). My thesis estimates how much microplastic is retained in rivers, at the sub-basin scale worldwide, where water systems, global change, and machine learning meet.",
    zh: '我刚从瓦赫宁根大学城市环境管理硕士毕业（2026 年 5 月底）。我的论文估算全球范围内、次流域尺度上河流对微塑料的截留量，正处在水系统、全球变化与机器学习的交汇处。',
    'zh-Hant': '我剛從瓦赫寧根大學都市環境管理碩士畢業（2026 年 5 月底）。我的論文估算全球範圍內、次流域尺度上河流對微塑膠的截留量，正處在水系統、全球變遷與機器學習的交會處。',
    nl: 'Ik ben net afgestudeerd als MSc Urban Environmental Management in Wageningen (eind mei 2026). Mijn scriptie schat hoeveel microplastic rivieren vasthouden, op de schaal van deelstroomgebieden wereldwijd, waar watersystemen, mondiale verandering en machine learning samenkomen.',
    de: 'Ich habe gerade meinen MSc in Urban Environmental Management in Wageningen abgeschlossen (Ende Mai 2026). Meine Masterarbeit schätzt, wie viel Mikroplastik Flüsse zurückhalten, und zwar auf der Ebene von Teileinzugsgebieten weltweit, dort wo Wassersysteme, globaler Wandel und maschinelles Lernen zusammentreffen.',
    fi: 'Valmistuin juuri ympäristöjohtamisen maisteriksi (Urban Environmental Management) Wageningenista (toukokuun 2026 lopussa). Pro gradussani arvioin, kuinka paljon mikromuovia joet pidättävät osavaluma-alueiden mittakaavassa maailmanlaajuisesti, siellä missä vesijärjestelmät, globaali muutos ja koneoppiminen kohtaavat.',
    ja: 'ワーヘニンゲン大学で都市環境管理学の修士課程を修了したばかりです（2026年5月末）。修士論文では、世界の流域（サブ流域スケール）で河川がどれだけのマイクロプラスチックを保持しているかを推定しました。水システム、地球規模の変化、機械学習が交わる領域です。',
    ko: '바흐닝언 대학교에서 도시환경관리 석사를 막 졸업했습니다(2026년 5월 말). 제 논문은 전 세계 소유역 규모에서 강이 미세플라스틱을 얼마나 붙잡아 두는지를 추정합니다. 물 시스템, 지구적 변화, 그리고 기계학습이 만나는 지점입니다.',
    fr: "Je viens d'obtenir mon MSc en Urban Environmental Management à Wageningen (fin mai 2026). Mon mémoire estime la quantité de microplastique retenue par les rivières, à l'échelle des sous-bassins versants dans le monde entier, là où se rejoignent systèmes hydriques, changement planétaire et apprentissage automatique."
  },
  'about.p2': {
    en: "Before Wageningen, I studied forestry across Canada and China and interned with the University of Eastern Finland doing soil-water fieldwork in Lapland. I've been lucky to learn in four very different landscapes, and I carry a camera to each of them.",
    zh: '来瓦大之前，我在加拿大和中国学习林学，还在东芬兰大学实习，到拉普兰做土壤与水的野外工作。我很幸运能在四种截然不同的地貌中求学，而每一次我都带着相机。',
    'zh-Hant': '來瓦大之前，我在加拿大和中國學習林學，還在東芬蘭大學實習，到拉普蘭做土壤與水的野外工作。我很幸運能在四種截然不同的地貌中求學，而每一次我都帶著相機。',
    nl: "Vóór Wageningen studeerde ik bosbouw in Canada en China, en liep ik stage bij de University of Eastern Finland met veldwerk over bodem en water in Lapland. Ik heb het geluk gehad in vier heel verschillende landschappen te leren, en naar elk daarvan neem ik een camera mee.",
    de: 'Vor Wageningen studierte ich Forstwissenschaft in Kanada und China und absolvierte ein Praktikum an der University of Eastern Finland mit Feldarbeit zu Boden und Wasser in Lappland. Ich hatte das Glück, in vier sehr unterschiedlichen Landschaften zu lernen, und in jede nehme ich eine Kamera mit.',
    fi: 'Ennen Wageningenia opiskelin metsätiedettä Kanadassa ja Kiinassa ja olin harjoittelijana Itä-Suomen yliopistossa tehden maaperä- ja vesitutkimusta maastossa Lapissa. Olen saanut onnekseni oppia neljässä hyvin erilaisessa maisemassa, ja jokaiseen niistä otan kameran mukaan.',
    ja: 'ワーヘニンゲンの前は、カナダと中国で森林学を学び、東フィンランド大学でインターンとしてラップランドで土壌と水の野外調査を行いました。四つのまったく異なる風景で学べたのは幸運で、そのどこにもカメラを持って行きます。',
    ko: '바흐닝언 이전에는 캐나다와 중국에서 임학을 공부했고, 동핀란드 대학교에서 인턴으로 라플란드에서 토양과 물 현장 조사를 했습니다. 네 곳의 아주 다른 풍경에서 배울 수 있어 운이 좋았고, 그 어디에나 카메라를 들고 갑니다.',
    fr: "Avant Wageningen, j'ai étudié la foresterie au Canada et en Chine, et j'ai effectué un stage à l'University of Eastern Finland pour du travail de terrain sur le sol et l'eau en Laponie. J'ai eu la chance d'apprendre dans quatre paysages très différents, et j'emporte un appareil photo dans chacun d'eux."
  },
  'about.p3': {
    en: "This site is a working notebook: my research, the places I've stood in, and the photographs I've made there.",
    zh: '这个网站就是我的工作笔记：我的研究、我驻足过的地方，以及我在那里拍下的照片。',
    'zh-Hant': '這個網站就是我的工作筆記：我的研究、我駐足過的地方，以及我在那裡拍下的照片。',
    nl: "Deze site is een werkschrift: mijn onderzoek, de plekken waar ik heb gestaan, en de foto's die ik daar maakte.",
    de: 'Diese Seite ist ein Arbeitsheft: meine Forschung, die Orte, an denen ich stand, und die Fotos, die ich dort gemacht habe.',
    fi: 'Tämä sivusto on työpäiväkirja: tutkimukseni, paikat joissa olen seisonut, ja valokuvat jotka olen siellä ottanut.',
    ja: 'このサイトは作業用のノートです。私の研究、立ち止まった場所、そしてそこで撮った写真。',
    ko: '이 사이트는 작업 노트입니다. 제 연구, 제가 머물렀던 장소, 그리고 그곳에서 찍은 사진들.',
    fr: "Ce site est un carnet de travail : mes recherches, les lieux où je me suis tenu, et les photographies que j'y ai faites."
  },

  // Journey
  'journey.eyebrow': { en: 'Research journey', zh: '研究历程', 'zh-Hant': '研究歷程', nl: 'Onderzoekstraject', de: 'Forschungsweg', fi: 'Tutkimuspolku', ja: '研究の歩み', ko: '연구 여정', fr: 'Parcours de recherche' },
  'journey.title.a': { en: 'Four countries. Four universities.', zh: '四个国家，四所高校。', 'zh-Hant': '四個國家，四所大學。', nl: 'Vier landen. Vier universiteiten.', de: 'Vier Länder. Vier Universitäten.', fi: 'Neljä maata. Neljä yliopistoa.', ja: '四つの国。四つの大学。', ko: '네 나라. 네 대학교.', fr: 'Quatre pays. Quatre universités.' },
  'journey.title.b': { en: 'One question', zh: '一个问题', 'zh-Hant': '一個問題', nl: 'Eén vraag', de: 'Eine Frage', fi: 'Yksi kysymys', ja: '一つの問い', ko: '하나의 질문', fr: 'Une question' },
  'journey.title.c': {
    en: ': how do water and life co-evolve under pressure?',
    zh: '：在压力之下，水与生命如何共同演化？',
    'zh-Hant': '：在壓力之下，水與生命如何共同演化？',
    nl: ': hoe evolueren water en leven samen onder druk?',
    de: ': Wie entwickeln sich Wasser und Leben unter Druck gemeinsam?',
    fi: ': miten vesi ja elämä kehittyvät yhdessä paineen alla?',
    ja: '：圧力のもとで、水と生命はどう共に進化するのか？',
    ko: '：압력 속에서 물과 생명은 어떻게 함께 진화하는가?',
    fr: " : comment l'eau et la vie coévoluent-elles sous la pression ?"
  },
  'journey.filter.all': { en: 'All', zh: '全部', 'zh-Hant': '全部', nl: 'Alles', de: 'Alle', fi: 'Kaikki', ja: 'すべて', ko: '전체', fr: 'Tout' },
  'journey.filter.education': { en: 'Education', zh: '教育', 'zh-Hant': '教育', nl: 'Opleiding', de: 'Ausbildung', fi: 'Koulutus', ja: '学歴', ko: '학력', fr: 'Formation' },
  'journey.filter.experience': { en: 'Experience', zh: '经历', 'zh-Hant': '經歷', nl: 'Ervaring', de: 'Erfahrung', fi: 'Kokemus', ja: '経験', ko: '경력', fr: 'Expérience' },
  'journey.filter.project': { en: 'Projects', zh: '项目', 'zh-Hant': '計畫', nl: 'Projecten', de: 'Projekte', fi: 'Projektit', ja: 'プロジェクト', ko: '프로젝트', fr: 'Projets' },
  'journey.kind.education': { en: 'education', zh: '教育', 'zh-Hant': '教育', nl: 'opleiding', de: 'Ausbildung', fi: 'koulutus', ja: '学歴', ko: '학력', fr: 'formation' },
  'journey.kind.experience': { en: 'experience', zh: '经历', 'zh-Hant': '經歷', nl: 'ervaring', de: 'Erfahrung', fi: 'kokemus', ja: '経験', ko: '경력', fr: 'expérience' },
  'journey.kind.project': { en: 'project', zh: '项目', 'zh-Hant': '計畫', nl: 'project', de: 'Projekt', fi: 'projekti', ja: 'プロジェクト', ko: '프로젝트', fr: 'projet' },
  'journey.ongoing': { en: 'Ongoing', zh: '进行中', 'zh-Hant': '進行中', nl: 'Lopend', de: 'Laufend', fi: 'Käynnissä', ja: '進行中', ko: '진행 중', fr: 'En cours' },
  'journey.present': { en: 'present', zh: '至今', 'zh-Hant': '至今', nl: 'heden', de: 'heute', fi: 'nyt', ja: '現在', ko: '현재', fr: "aujourd'hui" },
  'journey.supervisor': { en: 'Supervisor', zh: '导师', 'zh-Hant': '指導教授', nl: 'Begeleider', de: 'Betreuer', fi: 'Ohjaaja', ja: '指導教員', ko: '지도교수', fr: 'Encadrant' },
  'journey.places': { en: 'Places', zh: '地点', 'zh-Hant': '地點', nl: 'Plekken', de: 'Orte', fi: 'Paikat', ja: '場所', ko: '장소', fr: 'Lieux' },
  'journey.hover_hint': { en: 'Hover a card', zh: '悬停卡片', 'zh-Hant': '將游標移至卡片', nl: 'Beweeg over een kaart', de: 'Auf eine Karte zeigen', fi: 'Vie osoitin kortin päälle', ja: 'カードにカーソルを', ko: '카드에 마우스를 올리세요', fr: 'Survolez une carte' },

  // Photography
  'photo.eyebrow': { en: 'Photography', zh: '摄影', 'zh-Hant': '攝影', nl: 'Fotografie', de: 'Fotografie', fi: 'Valokuvaus', ja: '写真', ko: '사진', fr: 'Photographie' },
  'photo.title.a': { en: 'A', zh: '一本', 'zh-Hant': '一本', nl: 'Een', de: 'Ein', fi: '', ja: '光と銀で綴った', ko: '빛과 은으로 쓴', fr: 'Un' },
  'photo.title.b': { en: 'field notebook', zh: '野外笔记', 'zh-Hant': '野外筆記', nl: 'veldschrift', de: 'Feldtagebuch', fi: 'maastopäiväkirja', ja: '野帳', ko: '야외 노트', fr: 'carnet de terrain' },
  'photo.title.c': { en: 'in light and silver.', zh: '，以光与银盐写就。', 'zh-Hant': '，以光與銀鹽寫就。', nl: 'in licht en zilver.', de: 'aus Licht und Silber.', fi: 'valosta ja hopeasta.', ja: '。', ko: '.', fr: "fait de lumière et d'argent." },
  'photo.intro': {
    en: "Every pin on the map is a place I've stood with a camera. Click one to open the frames. Drag the time slider to travel years, or switch to the timeline view for a chronological ribbon.",
    zh: '地图上的每一个图钉，都是我曾举起相机的地方。点击图钉即可查看照片；拖动时间滑块穿越不同年份；也可以切换到时间线视图，按时间顺序浏览。',
    'zh-Hant': '地圖上的每一個圖釘，都是我曾舉起相機的地方。點擊圖釘即可查看照片；拖動時間滑桿穿越不同年份；也可以切換到時間軸檢視，依時間順序瀏覽。',
    nl: "Elke speld op de kaart is een plek waar ik met een camera heb gestaan. Klik op een speld om de foto's te openen. Sleep de tijdschuif om door de jaren te reizen, of schakel naar de tijdlijnweergave voor een chronologisch overzicht.",
    de: 'Jede Markierung auf der Karte ist ein Ort, an dem ich mit einer Kamera stand. Klicke auf eine, um die Aufnahmen zu öffnen. Zieh den Zeitregler, um durch die Jahre zu reisen, oder wechsle zur Zeitleistenansicht für einen chronologischen Überblick.',
    fi: 'Jokainen nasta kartalla on paikka, jossa olen seisonut kamera kädessä. Klikkaa nastaa avataksesi kuvat. Vedä aikajanan liukusäädintä matkataksesi vuosien halki, tai vaihda aikajananäkymään selataksesi aikajärjestyksessä.',
    ja: '地図上のすべてのピンは、私がカメラを手に立った場所です。ピンをクリックすると写真が開きます。タイムスライダーをドラッグして年を行き来したり、タイムライン表示に切り替えて時系列でご覧ください。',
    ko: '지도 위의 모든 핀은 제가 카메라를 들고 서 있던 장소입니다. 핀을 클릭하면 사진이 열립니다. 시간 슬라이더를 드래그해 여러 해를 넘나들거나, 타임라인 보기로 전환해 시간순으로 살펴보세요.',
    fr: "Chaque repère sur la carte est un lieu où je me suis tenu, appareil photo en main. Cliquez sur l'un d'eux pour ouvrir les images. Faites glisser le curseur temporel pour traverser les années, ou passez à la vue chronologique."
  },
  'photo.stat.frames': { en: 'Frames', zh: '张', 'zh-Hant': '張', nl: "Foto's", de: 'Aufnahmen', fi: 'Kuvaa', ja: '枚', ko: '장', fr: 'Images' },
  'photo.stat.countries': { en: 'Countries', zh: '国家', 'zh-Hant': '國家', nl: 'Landen', de: 'Länder', fi: 'Maata', ja: 'カ国', ko: '개국', fr: 'Pays' },
  'photo.stat.years': { en: 'Years', zh: '年跨度', 'zh-Hant': '年跨度', nl: 'Jaren', de: 'Jahre', fi: 'Vuotta', ja: '年', ko: '년', fr: 'Années' },
  'photo.view.map': { en: 'Map', zh: '地图', 'zh-Hant': '地圖', nl: 'Kaart', de: 'Karte', fi: 'Kartta', ja: '地図', ko: '지도', fr: 'Carte' },
  'photo.view.timeline': { en: 'Timeline', zh: '时间线', 'zh-Hant': '時間軸', nl: 'Tijdlijn', de: 'Zeitleiste', fi: 'Aikajana', ja: 'タイムライン', ko: '타임라인', fr: 'Chronologie' },
  'photo.demo_label': { en: 'Demo mode:', zh: '演示模式：', 'zh-Hant': '示範模式：', nl: 'Demomodus:', de: 'Demomodus:', fi: 'Esittelytila:', ja: 'デモモード：', ko: '데모 모드:', fr: 'Mode démo :' },
  'photo.demo_body': {
    en: 'currently showing placeholder pins. Drop photos in /photos/ and run npm run photos:manifest.',
    zh: '当前显示的是占位图钉。把照片放进 /photos/ 再运行 npm run photos:manifest 即可。',
    'zh-Hant': '目前顯示的是佔位圖釘。把照片放進 /photos/ 再執行 npm run photos:manifest 即可。',
    nl: "er worden nu plaatshouders getoond. Zet foto's in /photos/ en voer npm run photos:manifest uit.",
    de: 'zeigt derzeit Platzhalter. Leg Fotos in /photos/ ab und führe npm run photos:manifest aus.',
    fi: 'näytetään tällä hetkellä paikkamerkkejä. Lisää kuvat kansioon /photos/ ja aja npm run photos:manifest.',
    ja: '現在はプレースホルダーのピンを表示しています。/photos/ に写真を入れて npm run photos:manifest を実行してください。',
    ko: '현재 자리표시자 핀을 표시 중입니다. /photos/ 에 사진을 넣고 npm run photos:manifest 를 실행하세요.',
    fr: "des repères provisoires sont affichés pour l'instant. Placez des photos dans /photos/ et lancez npm run photos:manifest."
  },
  'photo.time_range': { en: 'Time range', zh: '时间范围', 'zh-Hant': '時間範圍', nl: 'Tijdsbereik', de: 'Zeitraum', fi: 'Aikaväli', ja: '期間', ko: '기간', fr: 'Période' },
  'photo.visible': { en: 'frames visible', zh: '张可见', 'zh-Hant': '張可見', nl: "foto's zichtbaar", de: 'Aufnahmen sichtbar', fi: 'kuvaa näkyvissä', ja: '枚表示中', ko: '장 표시됨', fr: 'images visibles' },
  'photo.no_photos': { en: 'No photos in this time range.', zh: '这个时间段内没有照片。', 'zh-Hant': '這個時間段內沒有照片。', nl: "Geen foto's in dit tijdsbereik.", de: 'Keine Fotos in diesem Zeitraum.', fi: 'Ei kuvia tällä aikavälillä.', ja: 'この期間の写真はありません。', ko: '이 기간에는 사진이 없습니다.', fr: 'Aucune photo sur cette période.' },

  // Contact
  'contact.eyebrow': { en: 'Contact', zh: '联系我', 'zh-Hant': '聯絡我', nl: 'Contact', de: 'Kontakt', fi: 'Ota yhteyttä', ja: '連絡先', ko: '연락처', fr: 'Contact' },
  'contact.title.a': { en: 'Say', zh: '说句', 'zh-Hant': '說聲', nl: 'Zeg', de: 'Sag', fi: 'Sano', ja: '', ko: '', fr: 'Dites' },
  'contact.title.b': { en: 'hello', zh: '你好', 'zh-Hant': '你好', nl: 'hallo', de: 'Hallo', fi: 'moi', ja: 'こんにちは', ko: '안녕하세요', fr: 'bonjour' },
  'contact.intro': {
    en: "I'm open to research collaborations, photography licensing, and good conversations about water, cities, and forests. Pick whichever channel fits.",
    zh: '我欢迎科研合作、图片授权，也乐意聊聊关于水、城市与森林的一切。选一个你方便的方式就好。',
    'zh-Hant': '我歡迎研究合作、圖片授權，也樂意聊聊關於水、城市與森林的一切。選一個你方便的方式就好。',
    nl: "Ik sta open voor onderzoekssamenwerkingen, het in licentie geven van foto's, en goede gesprekken over water, steden en bossen. Kies het kanaal dat je het beste past.",
    de: 'Ich bin offen für Forschungskooperationen, die Lizenzierung von Fotos und gute Gespräche über Wasser, Städte und Wälder. Wähl einfach den Kanal, der dir passt.',
    fi: 'Olen avoin tutkimusyhteistyölle, valokuvien lisensoinnille ja hyville keskusteluille vedestä, kaupungeista ja metsistä. Valitse sinulle sopiva kanava.',
    ja: '研究協力、写真のライセンス、そして水・都市・森についての良い対話を歓迎します。お好きなチャネルをお選びください。',
    ko: '연구 협업, 사진 라이선스, 그리고 물·도시·숲에 관한 좋은 대화를 환영합니다. 편한 채널을 골라 주세요.',
    fr: "Je suis ouvert aux collaborations de recherche, aux licences de photos et aux bonnes conversations sur l'eau, les villes et les forêts. Choisissez le canal qui vous convient."
  },
  'contact.channel.personal': { en: 'Personal', zh: '个人邮箱', 'zh-Hant': '個人信箱', nl: 'Persoonlijk', de: 'Privat', fi: 'Henkilökohtainen', ja: '個人', ko: '개인', fr: 'Personnel' },
  'contact.channel.academic': { en: 'Academic', zh: '学术邮箱', 'zh-Hant': '學術信箱', nl: 'Academisch', de: 'Akademisch', fi: 'Akateeminen', ja: '学術', ko: '학술', fr: 'Académique' },
  'contact.channel.linkedin': { en: 'LinkedIn', zh: 'LinkedIn', 'zh-Hant': 'LinkedIn', nl: 'LinkedIn', de: 'LinkedIn', fi: 'LinkedIn', ja: 'LinkedIn', ko: 'LinkedIn', fr: 'LinkedIn' },
  'contact.channel.cv': { en: 'CV (PDF)', zh: '简历 (PDF)', 'zh-Hant': '履歷 (PDF)', nl: 'cv (PDF)', de: 'Lebenslauf (PDF)', fi: 'CV (PDF)', ja: '履歴書 (PDF)', ko: '이력서 (PDF)', fr: 'CV (PDF)' },
  'contact.channel.transcript': { en: 'Transcript (PDF)', zh: '成绩单 (PDF)', 'zh-Hant': '成績單 (PDF)', nl: 'Cijferlijst (PDF)', de: 'Notenübersicht (PDF)', fi: 'Opintosuoritusote (PDF)', ja: '成績証明書 (PDF)', ko: '성적 증명서 (PDF)', fr: 'Relevé de notes (PDF)' },
  'contact.channel.hint.personal': { en: 'For collaborations, photo licensing, open talk.', zh: '合作、图片授权，或随意聊聊。', 'zh-Hant': '合作、圖片授權，或隨意聊聊。', nl: 'Voor samenwerkingen, fotolicenties, vrijuit praten.', de: 'Für Kooperationen, Fotolizenzen, offenen Austausch.', fi: 'Yhteistyöhön, kuvalisensseihin, vapaaseen juttuun.', ja: '協力、写真ライセンス、気軽な会話に。', ko: '협업, 사진 라이선스, 자유로운 대화.', fr: 'Pour les collaborations, licences photo, échanges libres.' },
  'contact.channel.hint.academic': { en: 'For research & WUR-related correspondence.', zh: '科研相关、瓦大事务。', 'zh-Hant': '研究相關、瓦大事務。', nl: 'Voor onderzoek en WUR-gerelateerde correspondentie.', de: 'Für Forschung und WUR-bezogene Korrespondenz.', fi: 'Tutkimukseen ja WUR-asioihin liittyvään viestintään.', ja: '研究・WUR関連の連絡に。', ko: '연구 및 WUR 관련 연락.', fr: 'Pour la recherche et la correspondance liée à WUR.' },
  'contact.channel.hint.linkedin': { en: 'The long-form version of my journey.', zh: '更完整的履历版本。', 'zh-Hant': '更完整的歷程版本。', nl: 'De uitgebreide versie van mijn traject.', de: 'Die ausführliche Version meines Werdegangs.', fi: 'Polkuni laajempi versio.', ja: '私の歩みの詳しい版。', ko: '제 여정의 더 자세한 버전.', fr: 'La version détaillée de mon parcours.' },
  'contact.channel.hint.cv': { en: 'Latest version, May 2026. Education, research, awards.', zh: '最新版本，2026 年 5 月。教育、科研、奖项。', 'zh-Hant': '最新版本，2026 年 5 月。教育、研究、獎項。', nl: 'Nieuwste versie, mei 2026. Opleiding, onderzoek, prijzen.', de: 'Neueste Version, Mai 2026. Ausbildung, Forschung, Auszeichnungen.', fi: 'Uusin versio, toukokuu 2026. Koulutus, tutkimus, palkinnot.', ja: '最新版、2026年5月。学歴、研究、受賞。', ko: '최신 버전, 2026년 5월. 학력, 연구, 수상.', fr: 'Dernière version, mai 2026. Formation, recherche, distinctions.' },
  'contact.channel.hint.transcript': { en: 'WUR academic record, kept current as new grades land.', zh: '瓦大成绩记录，有新成绩会同步更新。', 'zh-Hant': '瓦大成績記錄，有新成績會同步更新。', nl: 'WUR-cijferlijst, steeds bijgewerkt met nieuwe cijfers.', de: 'WUR-Notennachweis, laufend mit neuen Noten aktualisiert.', fi: 'WUR-opintosuoritusote, päivittyy uusien arvosanojen myötä.', ja: 'WURの成績記録。新しい成績が出るたびに更新。', ko: 'WUR 성적 기록, 새 성적이 나오면 갱신됩니다.', fr: 'Relevé WUR, tenu à jour au fil des nouvelles notes.' },
  'contact.based': { en: 'Based in', zh: '常驻', 'zh-Hant': '常駐', nl: 'Gevestigd in', de: 'Ansässig in', fi: 'Asuinpaikka', ja: '拠点', ko: '거주지', fr: 'Basé à' },
  'contact.current': { en: 'MSc, Wageningen University · Graduated May 2026', zh: '瓦赫宁根大学硕士 · 2026 年 5 月毕业', 'zh-Hant': '瓦赫寧根大學碩士 · 2026 年 5 月畢業', nl: 'MSc, Wageningen University · afgestudeerd mei 2026', de: 'MSc, Wageningen University · Abschluss Mai 2026', fi: 'MSc, Wageningen University · valmistunut toukokuussa 2026', ja: 'ワーヘニンゲン大学 修士 · 2026年5月修了', ko: '바흐닝언 대학교 석사 · 2026년 5월 졸업', fr: 'MSc, Wageningen University · diplômé en mai 2026' },

  // Blog / Journal
  'blog.eyebrow': { en: 'Journal', zh: '笔记', 'zh-Hant': '筆記', nl: 'Notities', de: 'Notizen', fi: 'Muistiinpanot', ja: 'ノート', ko: '노트', fr: 'Carnet' },
  'blog.title': { en: 'Field notes & essays', zh: '野外随记与随笔', 'zh-Hant': '野外隨記與隨筆', nl: 'Veldnotities & essays', de: 'Feldnotizen & Essays', fi: 'Maastomuistiinpanoja & esseitä', ja: 'フィールドノート＆エッセイ', ko: '현장 노트 & 에세이', fr: 'Notes de terrain & essais' },
  'blog.intro': {
    en: 'Short notes from the water and microplastics work, the occasional photo essay, and things I am still thinking about. Written in English and 中文.',
    zh: '关于水与微塑料研究的短记、偶尔的图片随笔，以及我仍在琢磨的一些问题。以中英文写作。',
    'zh-Hant': '關於水與微塑膠研究的短記、偶爾的圖片隨筆，以及我仍在琢磨的一些問題。以中英文寫作。',
    nl: 'Korte notities uit het werk over water en microplastics, af en toe een foto-essay, en dingen waar ik nog over nadenk. Geschreven in het Engels en Chinees.',
    de: 'Kurze Notizen aus der Arbeit über Wasser und Mikroplastik, hin und wieder ein Fotoessay und Gedanken, über die ich noch nachdenke. Auf Englisch und Chinesisch.',
    fi: 'Lyhyitä muistiinpanoja vesi- ja mikromuovityöstä, satunnainen valokuvaessee, ja asioita joita yhä pohdin. Kirjoitettu englanniksi ja kiinaksi.',
    ja: '水とマイクロプラスチックの研究からの短いメモ、時折の写真エッセイ、そしてまだ考え続けていること。英語と中国語で書いています。',
    ko: '물과 미세플라스틱 연구에서 나온 짧은 기록, 가끔의 사진 에세이, 그리고 아직 고민 중인 것들. 영어와 중국어로 씁니다.',
    fr: "De courtes notes issues de mes travaux sur l'eau et les microplastiques, quelques essais photo, et des questions qui me préoccupent encore. Écrit en anglais et en chinois."
  },
  'blog.minread': { en: 'min read', zh: '分钟阅读', 'zh-Hant': '分鐘閱讀', nl: 'min lezen', de: 'Min. Lesezeit', fi: 'min lukuaika', ja: '分で読めます', ko: '분 읽기', fr: 'min de lecture' },
  'blog.back': { en: 'All posts', zh: '所有文章', 'zh-Hant': '所有文章', nl: 'Alle berichten', de: 'Alle Beiträge', fi: 'Kaikki kirjoitukset', ja: 'すべての記事', ko: '모든 글', fr: 'Tous les articles' },
  'blog.backhome': { en: 'Home', zh: '首页', 'zh-Hant': '首頁', nl: 'Home', de: 'Start', fi: 'Etusivu', ja: 'ホーム', ko: '홈', fr: 'Accueil' },
  'blog.published': { en: 'Published', zh: '发表于', 'zh-Hant': '發表於', nl: 'Gepubliceerd', de: 'Veröffentlicht', fi: 'Julkaistu', ja: '公開', ko: '게시일', fr: 'Publié' },
  'blog.updated': { en: 'updated', zh: '更新', 'zh-Hant': '更新', nl: 'bijgewerkt', de: 'aktualisiert', fi: 'päivitetty', ja: '更新', ko: '수정', fr: 'mis à jour' },
  'blog.empty': { en: 'No posts in this language yet. Showing everything.', zh: '这个语言下还没有文章，先显示全部。', 'zh-Hant': '這個語言下還沒有文章，先顯示全部。', nl: 'Nog geen berichten in deze taal. Alles wordt getoond.', de: 'Noch keine Beiträge in dieser Sprache. Es wird alles angezeigt.', fi: 'Ei vielä kirjoituksia tällä kielellä. Näytetään kaikki.', ja: 'この言語の記事はまだありません。すべて表示します。', ko: '아직 이 언어로 된 글이 없어 전체를 표시합니다.', fr: 'Aucun article dans cette langue pour le moment. Tout est affiché.' },
  'blog.none': { en: 'No posts yet. Check back soon.', zh: '还没有文章，敬请期待。', 'zh-Hant': '還沒有文章，敬請期待。', nl: 'Nog geen berichten. Kom binnenkort terug.', de: 'Noch keine Beiträge. Schau bald wieder vorbei.', fi: 'Ei vielä kirjoituksia. Palaa pian uudelleen.', ja: 'まだ記事がありません。またのぞいてください。', ko: '아직 글이 없습니다. 곧 다시 확인해 주세요.', fr: "Pas encore d'articles. Revenez bientôt." },
  'blog.like_hint': { en: 'Like this if it resonated.', zh: '如果有共鸣，点个赞。', 'zh-Hant': '如果有共鳴，按個讚。', nl: 'Vind je dit mooi? Geef een like.', de: 'Hat es dich angesprochen? Lass ein Like da.', fi: 'Jos tämä kolahti, anna tykkäys.', ja: '心に響いたら、いいねを。', ko: '공감했다면 좋아요를 눌러 주세요.', fr: 'Un like si cela vous a parlé.' },
  'blog.comments': { en: 'Comments', zh: '评论', 'zh-Hant': '留言', nl: 'Reacties', de: 'Kommentare', fi: 'Kommentit', ja: 'コメント', ko: '댓글', fr: 'Commentaires' },
  'blog.comments_soon': { en: 'Comments are coming soon.', zh: '评论功能即将开放。', 'zh-Hant': '留言功能即將開放。', nl: 'Reacties komen binnenkort.', de: 'Kommentare folgen in Kürze.', fi: 'Kommentit tulossa pian.', ja: 'コメントは近日公開予定です。', ko: '댓글 기능은 곧 제공됩니다.', fr: 'Les commentaires arrivent bientôt.' },

  // Footer
  'footer.title.a': { en: "Let's collaborate on", zh: '让我们一起探索', 'zh-Hant': '讓我們一起探索', nl: 'Laten we samenwerken aan', de: 'Lass uns zusammenarbeiten an', fi: 'Tehdään yhdessä työtä', ja: '一緒に探求しましょう', ko: '함께 탐구해요', fr: 'Collaborons autour de' },
  'footer.title.b': {
    en: 'water, change, and the world we photograph',
    zh: '水、变化，以及我们用镜头凝视的世界',
    'zh-Hant': '水、變遷，以及我們用鏡頭凝視的世界',
    nl: 'water, verandering, en de wereld die we fotograferen',
    de: 'Wasser, Wandel und der Welt, die wir fotografieren',
    fi: 'veden, muutoksen ja sen maailman parissa, jota valokuvaamme',
    ja: '水、変化、そして私たちが写し取る世界',
    ko: '물, 변화, 그리고 우리가 사진으로 담는 세계',
    fr: "l'eau, le changement et le monde que nous photographions"
  },
  'footer.location_hint': {
    en: 'Available for research collaborations and editorial photo use.',
    zh: '接受科研合作与编辑类图片授权。',
    'zh-Hant': '接受研究合作與編輯類圖片授權。',
    nl: 'Beschikbaar voor onderzoekssamenwerkingen en redactioneel fotogebruik.',
    de: 'Verfügbar für Forschungskooperationen und redaktionelle Fotonutzung.',
    fi: 'Käytettävissä tutkimusyhteistyöhön ja toimitukselliseen kuvankäyttöön.',
    ja: '研究協力および編集用途の写真利用が可能です。',
    ko: '연구 협업과 편집용 사진 사용이 가능합니다.',
    fr: 'Disponible pour des collaborations de recherche et un usage éditorial des photos.'
  },
  'footer.rights': {
    en: '© {year} Yiyang Shen · Built with Astro',
    zh: '© {year} 沈亦旸 · 由 Astro 构建',
    'zh-Hant': '© {year} 沈亦旸 · 以 Astro 建構',
    nl: '© {year} Yiyang Shen · Gebouwd met Astro',
    de: '© {year} Yiyang Shen · Erstellt mit Astro',
    fi: '© {year} Yiyang Shen · Rakennettu Astrolla',
    ja: '© {year} 沈亦旸 · Astro で構築',
    ko: '© {year} 沈亦旸 · Astro로 제작',
    fr: '© {year} Yiyang Shen · Conçu avec Astro'
  }
};

export function t(key: string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
