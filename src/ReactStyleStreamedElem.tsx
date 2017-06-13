import * as React from 'react';
import * as _ from 'lodash';
import { findDOMNode } from 'react-dom';
import {
  Observable,
  Subscription,
} from 'rxjs';

import { HTMLAllElementsType } from './HTMLAllElementType';
import css = require('dom-css');

export type StyleStreamType = Observable<React.CSSProperties>;

export type PropsType = React.HTMLProps<HTMLAllElementsType> &
{
  tagName: string,
  styleStream: StyleStreamType,
  style?: null,
};

export default class ReactStreamedText
    extends React.Component<PropsType, void> {

  __style?: React.CSSProperties;
  styleSubscription: Subscription;
  refs: {
    [key: string]: HTMLElement;
    targetDOM: HTMLHeadingElement;
  };
  constructor(props: PropsType) {
    super(props);
  }
  componentDidMount() {
    const targetDOM = findDOMNode<HTMLElement>(this.refs.targetDOM);
    this.styleSubscription = this.props.styleStream
      .subscribe((style) => {
        this.__style = style;
        css(targetDOM, style);
      });
  }
  componentWillUnmount() {
    this.styleSubscription.unsubscribe();
  }
  render() {
    const props = _.assign({}, this.props, {
      tagName: null, styleStream: null,
      style: this.__style,
    });
    return React.createElement(
      this.props.tagName, Object.assign({}, props, {
        ref: 'targetDOM',
      }), this.props.children
    );
  }
}