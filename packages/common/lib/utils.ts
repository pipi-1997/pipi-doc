import SparkMD5 from 'spark-md5';
import marked from './markdown';
import Token = marked.Token;

export const calculateHashKey = (str: string, raw = false) => {
  return SparkMD5.hash(str, raw);
};

export const getDocRegularMark = () => {
  return /^ {0,3}(#{1,6})(\sdoc:)(.*)(?:\n+|$)/gi;
};

export const getMatchDocKey = (token: Token): { raw: string; docKey: string } | null => {
  const matchResult = getDocRegularMark().exec(token.raw);
  // 因为content为正则的第三个分组，所以正则匹配的 index === 3为 key
  if (token.raw && matchResult?.length === 3) {
    return {
      raw: token.raw,
      docKey: matchResult[3].trim(),
    };
  }
  return null;
};

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
    const docKey = getMatchDocKey(token)?.docKey;
    if (docKey) {
      pre[docKey] = calculateHashKey(path + docKey);
    }
    return pre;
  }, {});
};
