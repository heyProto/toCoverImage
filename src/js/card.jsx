import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';

export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    let img = new Image();
    let height,width;
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }

      axiosAll(items_to_fetch).then(axiosSpread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
        };

        stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
        stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.data.language);
        this.setState(stateVar);
        img.onload = (image) =>{
          height = image.path[0].height;
          width = image.path[0].width;
          console.log(height,width)
          this.setState({imgHeight:height,imgWidth:width})
        }
        img.src = stateVar.dataJSON.data.img_url
        console.log(img)
      }));



    } else {
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  // renderFixed(img_url){
  //  console.log(img_url)
  //  return(
  //     <div className="toimage-card-fixed">
  //       <img className="blur-image-bg" src={img_url}/>
  //       <img src={img_url} width="100%"/>
  //     </div>
  //  )
  // }

  // renderFluid(img_url){
  //   // console.log(img_url)
  //   return(
  //       <img src={img_url} width="100%"/>
  //   )

  // }

  renderHTML(data) {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      return(
        <div className="image-card">
          {<img src={data.img_url} width="1260px" height="430px"/>}
        </div>
      )
    }
  }
  renderSixteenCol() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON.data;

      return (
        <div className="pro-column-16">
          <div className="pro-rows-5">
            {this.renderHTML(data)}
          </div>
        </div>
      );
    }
  }
  renderSevenCol() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON.data;

      return (
        <div className="pro-column-7">
          <div className="pro-rows-3">
              {this.renderHTML(data)}
          </div>
        </div>
      );
    }
  }
  renderFourCol() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON.data;

      return (
        <div className="pro-column-4">
          <div className="pro-rows-3">
            {this.renderHTML(data)}
          </div>
        </div>
      );
    }
  }
  renderTwoCol() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON.data;

      return (
        <div className="pro-column-2">
          <div className="pro-rows-3">
            {this.renderHTML(data)}
          </div>
        </div>
      );
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col16':
        return this.renderSixteenCol();
      case 'col7':
        return this.renderSevenCol();
      case 'col4':
        return this.renderFourCol();
      case 'col2':
        return this.renderTwoCol();
      default :
        return this.renderHTML(this.state.dataJSON.data);
    }
  }
}
