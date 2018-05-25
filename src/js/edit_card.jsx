import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Image from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class EditCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col16",
      publishing: false,
      schemaJSON: undefined,
      uiSchemaJSON: {},
      errorOnFetchingData: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long, used for the title of the show page after publishing
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL),
        axios.get(this.props.uiSchemaURL)
      ]).then(
        axios.spread((card, schema, opt_config, opt_config_schema,uiSchema) => {
          this.setState({
            dataJSON: card.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            uiSchemaJSON: uiSchema.data
          });
        }))
        .catch((error) => {
          this.setState({
            errorOnFetchingData: true
          })
        });
    }
  }

  onChangeHandler({formData}) {
    //Change the data of the form based on current step and previous data
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.data = formData
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    //Logic to execute on submit of form based on the current step
    switch(this.state.step) {
      case 1:
        if (typeof this.props.onPublishCallback === "function") {
          this.setState({ publishing: true });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  renderSEO() {
    //This function should return all the textual content of the card (no images, videos) inside blockquote tag. The content should be inside h3 and p tags only.
    let seo_blockquote = `<blockquote><h3>${this.state.dataJSON.data.title}</h3><p>${this.state.dataJSON.data.description}</p></blockquote>`
    return seo_blockquote;
  }

  renderSchemaJSON() {
    //The changes between form schemas for different steps are made here
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON.properties.data;
        break;
    }
  }

  renderFormData() {
    //Fills the form with sample data
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.data;
        break;
    }
  }

  showLinkText() {
    return '';
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    //Switch between moving laptop and mobile modes while editing
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(
        <div className="protograph-loader-container">
          {
            !this.state.errorOnFetchingData ?
              "Loading"
            :
              <div className="ui basic message">
                <div className="header">
                  Failed to load resources
                </div>
                <p>Try clearing your browser cache and refresh the page.</p>
              </div>
          }
        </div>
      )
    } else {
      var size = this.state.mode === 'col7' ? 640 : 320;
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toImage
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.state.uiSchemaJSON}
                  formData={this.renderFormData()}>
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col16' ? 'active' : ''}`}
                      data-mode='col16'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      col-16
                    </a>
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      col-7
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      col-4
                    </a>
                    <a className={`item ${this.state.mode === 'col3' ? 'active' : ''}`}
                      data-mode='col3'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      col-3
                    </a>
                    <a className={`item ${this.state.mode === 'col2' ? 'active' : ''}`}
                      data-mode='col2'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      col-2
                    </a>
                  </div>
                </div>
                <div style={{width: 'fit-content', margin: '0 auto'}}>
                  <Image
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    optionalConfigJSON={this.state.optionalConfigJSON}
                    optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
