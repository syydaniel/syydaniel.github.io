// Giscus comments config: GitHub Discussions backed, no backend, free.
//
// To turn comments on:
//   1. This repo must be public (it is, for GitHub Pages).
//   2. Repo Settings -> General -> Features -> tick "Discussions".
//   3. Install the giscus app and grant it this repo: https://github.com/apps/giscus
//   4. Open https://giscus.app, enter  syydaniel/syydaniel.github.io , choose a
//      Discussion category (e.g. "Announcements", mapped by pathname), and copy
//      the data-repo-id and data-category-id it shows you.
//   5. Paste them below, set enabled: true, then commit and push.
//
// While disabled, post pages show a small "comments coming soon" note instead
// of a broken widget, so nothing looks broken in the meantime.
export const giscus = {
  enabled: false,
  repo: 'syydaniel/syydaniel.github.io',
  repoId: 'PASTE_REPO_ID_HERE',
  category: 'Announcements',
  categoryId: 'PASTE_CATEGORY_ID_HERE',
  mapping: 'pathname',
  reactionsEnabled: '1',
  theme: 'noborder_dark'
};
