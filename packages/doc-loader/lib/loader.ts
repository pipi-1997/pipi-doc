import { convertMdToKeyMap } from './convertMdToKeyMap';

export default function (markdown: string) {
  const docKeyMap = convertMdToKeyMap(markdown, this.context);

  return `export default ${JSON.stringify(docKeyMap)}`;
}
