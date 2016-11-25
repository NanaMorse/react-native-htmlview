import * as React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import htmlToElement from './htmlToElement';

const { Component, PropTypes } = React;

const boldStyle = {fontWeight: '500'};
const italicStyle = {fontStyle: 'italic'};
const codeStyle = {fontFamily: 'Menlo'};
const linkStyle = {fontWeight: '500', color: '#007AFF'};

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: linkStyle,
});

class HTMLView extends Component {
  constructor() {
    super();
    this.state = {
      element: null,
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.startHtmlRender(this.props.value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  startHtmlRender(value) {
    if (!value) {
      this.setState({element: null})
    }

    const opts = {
      ...this.props,
      stylesheet: Object.assign({}, baseStyles, this.props.stylesheet),
    };

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({element})
      }
    })
  }

  render() {
    if (this.state.element) {
      return <Text children={this.state.element} />
    }
    return <Text />
  }
}

HTMLView.propTypes = {
  value: PropTypes.string,
  stylesheet: PropTypes.object,
  onLinkPress: PropTypes.func,
  onError: PropTypes.func,
  renderNode: PropTypes.func,
};

HTMLView.defaultProps = {
  onLinkPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
};

export default HTMLView
