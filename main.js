import React from 'react';
import {render, hydrate} from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toCoverImage = function () {
  this.cardType = 'toCoverImage';
}

ProtoGraph.Card.toCoverImage.prototype.init = function (options) {
  this.options = options;
}
ProtoGraph.Card.toCoverImage.prototype.renderSixteenCol= function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderSevenCol= function (data) {
  this.mode = 'col7';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderFourCol= function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderThreeCol= function (data) {
  this.mode = 'col3';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderTwoCol= function (data) {
  this.mode = 'col2';
  this.render();
}
ProtoGraph.Card.toCoverImage.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCoverImage.prototype.render = function () {
  if (this.options.isFromSSR){
    hydrate(
      <Card
        selector={this.options.selector}
        dataURL={this.options.data_url}
        siteConfigs={this.options.site_configs}
        // dataJSON={this.options.initialState.dataJSON}
        mode={this.options.mode}
        renderingSSR={true}
      />,
      this.options.selector);
  } else {
    render(
      <Card
        dataURL={this.options.data_url}
        selector={this.options.selector}
        domain={this.options.domain}
        siteConfigURL={this.options.site_config_url}
        mode={this.mode}
        siteConfigs={this.options.site_configs}
        clickCallback={this.options.onClickCallback}
        ref={(e) => {
          this.containerInstance = this.containerInstance || e;
        }} />,
      this.options.selector);
  }
}