import { photos } from './photos-loader';
import type { Photo } from './photos';

// A small edit of the existing library: the maps still show the full collection.
const edit = [
  ['faroe-islands-dsc_1307-pano', '海与湖之间，瑟沃格湖。'],
  ['spain-dsc_8694', '2026 年 8 月 12 日，日全食。'],
  ['cape-verde-dji_20260718153648_0263_d', '熔岩原之上的福戈火山。'],
  ['south-africa-dsc_4241', '桌山山顶的清晨。'],
  ['faroe-islands-dsc_1857', '海崖外，一只飞行中的海鹦。'],
  ['south-africa-dsc_6096', '枯枝上的紫胸佛法僧。'],
  ['netherlands-dji_0141-pano-2', '圩田之上的落日。'],
  ['faroe-islands-dji_20260825161709_0407_d', '从海上望向韦斯特曼纳的海崖。'],
  ['south-africa-dsc_0330', '两只相互依靠、休息的斑马。'],
  ['france-dsc_5547', '埃菲尔铁塔上空的烟火。'],
  ['netherlands-dji_0116', '费吕沃湖水道，船只从公路上方经过。'],
  ['faroe-islands-dji_20260822122453_0019_d', '雾中的诺尔索伊灯塔。']
] as const;

export const galleryPhotos: (Photo & {captionZh: string})[] = edit.flatMap(([id, captionZh]) => {
  const photo = photos.find(p => p.id === id && p.src && p.thumb);
  return photo ? [{ ...photo, captionZh }] : [];
});
// New photo libraries can still open the exhibition when the original edit changes.
if (!galleryPhotos.length) {
  galleryPhotos.push(...photos.filter(p => p.src && p.thumb).slice(0, 12).map(p => ({...p, captionZh: p.caption ?? p.location.name})));
}
