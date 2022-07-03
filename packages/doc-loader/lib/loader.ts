import { convertMdToKeyMap } from '@/common';

export default function (markdown: string) {
  const docKeyMap = convertMdToKeyMap(markdown, this.resourcePath);

  return `export default ${JSON.stringify(docKeyMap)}`;
}
