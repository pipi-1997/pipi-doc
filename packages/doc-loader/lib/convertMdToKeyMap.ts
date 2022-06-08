import marked from './markdown';
import SparkMd5 from 'spark-md5';

export const convertMdToKeyMap = (
  markdown: string,
  path: string
): {
  [key: string]: string;
} => {
  const tokenList = marked.lexer(markdown);

  if (!tokenList || !tokenList.length) {
    return {};
  }

  return tokenList.reduce((pre, token) => {
    // 正则带有状态 必须放循环内，因为 exec会改变lastIndex位置， 全局正则结果不一致
    const DOC_MARK = /^ {0,3}(#{1,6})(\sdoc:)(.*)(?:\n+|$)/gi;

    const matchResult = DOC_MARK.exec(token.raw);
    if (token.raw && matchResult && matchResult.length) {
      // 因为content为正则的第三个分组，所以正则匹配的 index === 3为 key
      const key = matchResult[3];
      pre[key.trim()] = SparkMd5.hash(path + key);
    }
    return pre;
  }, {});
};
