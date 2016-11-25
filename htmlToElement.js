import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

const LINE_BREAK = '\n';
const PARAGRAPH_BREAK = '\n\n';
const BULLET = '\u2022 ';

function htmlToElement(rawHtml, opts, done) {
  const parserHandler = new htmlparser.DomHandler((err, dom) => {
    if (err) done(err);
    done(null, domToElement(dom, null, opts));
  });

  const parser = new htmlparser.Parser(parserHandler);
  parser.write(rawHtml);
  parser.done();
}

function domToElement(dom, parent, opts) {
  if (!dom) return null;

  return dom.map((node, index, list) => {
    // for custom render method
    if (opts.renderNode) {
      return opts.renderNode(node, index, list, opts);
    }

    // for text node
    if (node.type == 'text') {
      return renderTextNode(node, parent, index, opts);
    }

    if (node.type === 'tag') {
      let linkPressHandler = null;
      if (node.name == 'a' && node.attribs && node.attribs.href) {
        linkPressHandler = () => opts.onLinkPress(entities.decodeHTML(node.attribs.href))
      }

      return (
        <Text key={index} onPress={linkPressHandler}>
          {node.name == 'pre' ? LINE_BREAK : null}
          {node.name == 'li' ? BULLET : null}
          {domToElement(node.children, node, opts)}
          {node.name == 'br' || node.name == 'li' ? LINE_BREAK : null}
          {node.name == 'p' && index < list.length - 1 ? PARAGRAPH_BREAK : null}
          {node.name == 'h1' || node.name == 'h2' || node.name == 'h3' || node.name == 'h4' || node.name == 'h5' ? LINE_BREAK : null}
        </Text>
      )
    }
  });

  function renderTextNode(node, parent, index, opts) {
    return (
      <Text key={index} style={parent ? opts.stylesheet[parent.name] : null}>
        {entities.decodeHTML(node.data)}
      </Text>
    )
  }
}

export default htmlToElement;