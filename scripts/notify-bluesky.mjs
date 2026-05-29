// OPTIONAL: announce newly published journal posts to Bluesky on push to main.
//
// This does nothing unless you add two repo secrets:
//   Settings -> Secrets and variables -> Actions -> New repository secret
//     BLUESKY_HANDLE        e.g.  yiyang.bsky.social
//     BLUESKY_APP_PASSWORD  an app password from Bluesky Settings -> App Passwords
//
// Wired up by .github/workflows/notify-social.yml. It announces posts that were
// added or changed in the triggering push (deduped per translation pair, English
// preferred). It never blocks the deploy.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SITE = 'https://syydaniel.github.io';
const BLOG_DIR = 'src/content/blog';
const HANDLE = process.env.BLUESKY_HANDLE;
const PASSWORD = process.env.BLUESKY_APP_PASSWORD;

if (!HANDLE || !PASSWORD) {
  console.log('[notify] BLUESKY_HANDLE / BLUESKY_APP_PASSWORD not set — skipping.');
  process.exit(0);
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!mm) continue;
    data[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, '');
  }
  return data;
}

function changedFiles() {
  const before = process.env.BEFORE_SHA;
  const after = process.env.AFTER_SHA || 'HEAD';
  const range = before && !/^0+$/.test(before) ? `${before} ${after}` : `${after}~1 ${after}`;
  try {
    return execSync(`git diff --name-only --diff-filter=AM ${range} -- ${BLOG_DIR}`, { encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter((s) => s.endsWith('.md'));
  } catch {
    return [];
  }
}

async function postToBluesky(title, url, description) {
  const sess = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: HANDLE, password: PASSWORD })
  }).then((r) => r.json());
  if (!sess.accessJwt) {
    console.error('[notify] auth failed:', sess);
    return;
  }

  const text = `New on my journal: ${title}\n\n${url}`;
  const enc = new TextEncoder();
  const idx = text.indexOf(url);
  const byteStart = enc.encode(text.slice(0, idx)).length;
  const byteEnd = byteStart + enc.encode(url).length;

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
    facets: [
      {
        index: { byteStart, byteEnd },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }]
      }
    ],
    embed: {
      $type: 'app.bsky.embed.external',
      external: { uri: url, title, description: description || title }
    }
  };

  const res = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sess.accessJwt}` },
    body: JSON.stringify({ repo: sess.did, collection: 'app.bsky.feed.post', record })
  }).then((r) => r.json());

  if (res.uri) console.log('[notify] posted:', title, '->', res.uri);
  else console.error('[notify] post failed:', res);
}

const files = changedFiles();
if (!files.length) {
  console.log('[notify] no new or changed posts in this push.');
  process.exit(0);
}

const posts = files
  .map((f) => {
    try {
      return { f, ...parseFrontmatter(readFileSync(f, 'utf8')) };
    } catch {
      return null;
    }
  })
  .filter((p) => p && p.slug && p.draft !== 'true')
  // English first, so a simultaneously-added EN/ZH pair announces the EN version.
  .sort((a, b) => (a.lang === 'en' ? -1 : 1) - (b.lang === 'en' ? -1 : 1));

const seen = new Set();
for (const p of posts) {
  const key = p.translationKey || p.slug;
  if (seen.has(key)) continue;
  seen.add(key);
  await postToBluesky(p.title, `${SITE}/blog/${p.slug}`, p.description);
}
