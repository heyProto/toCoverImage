import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // step: 1,
      dataJSON: {},
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      uiSchemaJSON: {}
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      // step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axiosAll([
        axiosGet(this.props.dataURL),
        axiosGet(this.props.schemaURL),
        axiosGet(this.props.uiSchemaURL)
      ])
        .then(axiosSpread((card, schema, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          uiSchemaJSON: uiSchema.data
        };

        this.setState(stateVars);
      }));
    }
  }

  onChangeHandler({formData}) {
    // switch (this.state.step) {
    //   case 1:
    //     console.log(formData)
        this.setState((prevStep, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevStep.dataJSON;
          dataJSON.data = formData;
          return {
            dataJSON: dataJSON
          }
        })
    //     break;
    //   case 2:
    //     this.setState((prevState, prop) => {
    //       // Manipulate dataJSON
    //       return {
    //         dataJSON: dataJSON
    //       }
    //     })
    //     break;
    // }
  }

  onSubmitHandler({formData}) {
    // switch(this.state.step) {
    //   case 1:
    //     this.setState({ step: 2 });
    //     break;
    //   case 2:
        if (typeof this.props.onPublishCallback === "function") {
          let dataJSON = this.state.dataJSON;
          dataJSON.data.section = dataJSON.data.title;
          this.setState({ publishing: true, dataJSON: dataJSON });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
    //     break;
    // }
  }


  renderSEO() {
    let d = this.state.dataJSON.data;

    let blockquote_string = `<h1>${d.title}</h1>`;
    // Create blockqoute string.
    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  renderSchemaJSON() {
    let schema;
    // switch(this.state.step){
    //   case 1:
        return this.state.schemaJSON.properties.data;
        // break;
      // Add more schemas...
    // }
  }

  renderFormData() {
    // switch(this.state.step) {
    //   case 1:
        return this.state.dataJSON.data;
    //     break;
    //   // Other form data.
    // }
  }

  showLinkText() {
    // switch(this.state.step) {
      // case 1:
        return '';
        // break;
    //   case 2:
    //     return '< Back';
    //     break;
    // }
  }

  showButtonText() {
    // switch(this.state.step) {
    //   case 1:
    //     return 'Next';
    //     break;
    //   case 2:
        return 'Publish';
    //     break;
    // }
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      return {
        mode: mode
      }
    }, (() => {
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
        }))
  }

  getUISchemaJSON() {
    // switch (this.state.step) {
    //   case 1:
        return this.state.uiSchemaJSON;
        // break;
    //   default:
    //     return {};
    //     break;
    // }
  }

  // onPrevHandler() {
  //   let prev_step = --this.state.step;
  //   this.setState({
  //     step: prev_step
  //   });
  // }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    ToCoverImage
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.getUISchemaJSON()}
                  formData={this.renderFormData()}>
                  <br/>
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={this.toggleMode}
                    >
                      col-7
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                    <a className={`item ${this.state.mode === 'col3' ? 'active' : ''}`}
                      data-mode='col3'
                      onClick={this.toggleMode}
                    >
                      col-3
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  <Card
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
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
