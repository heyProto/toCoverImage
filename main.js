import React from 'react';
import ReactDOM from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toCoverImage = function () {
  this.cardType = 'Image';
}

ProtoGraph.Card.toCoverImage.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toCoverImage.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCoverImage.prototype.renderCol4 = function (data) {
  this.mode = 'col4';
  ReactDOM.render(
    <Card
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

ProtoGraph.Card.toCoverImage.prototype.renderCol2 = function (data) {
  this.mode = 'col2';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderCol3 = function (data) {
  this.mode = 'col3';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderCol4 = function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.toCoverImage.prototype.renderCol7 = function (data) {
  this.mode = 'col7';
  this.render();
}
ProtoGraph.Card.toCoverImage.prototype.renderCol16 = function (data) {
  this.mode = 'col16';
  this.render();
}
ProtoGraph.Card.toCoverImage.prototype.render = function (data) {
  ReactDOM.render(
    <Card
      dataURL={this.options.data_url}
      selector={this.options.selector}
      siteConfigURL={this.options.site_config_url}
      siteConfigs={this.options.site_configs}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}




