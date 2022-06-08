import { marked } from 'marked';

const renderer = {
  heading: (text, level) => {
    const isDocNode = true;
    return `<h${level} ${isDocNode ? "class='doc'" : ''}>
              ${text}
            </h${level}>`;
  },
};

marked.use({ renderer });

export default marked;
