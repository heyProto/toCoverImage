import React from 'react';
import { render } from 'react-dom';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';

export default class toCoverImage extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: undefined,
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.handleClick = this.handleClick.bind(this);
    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  handleClick() {
    if (this.state.dataJSON.data.tab) {
      var win = window.open(this.state.dataJSON.data.link, '_blank');
      win.focus();
    } else {
      window.open(this.state.dataJSON.data.link, '_top');
    }
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }
      axiosAll(items_to_fetch).then(
        axiosSpread((card, site_configs) => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
          };
          this.setState(stateVar);
        })
      );
    }else{
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(){
    //Manipulation of form data to change what is shown in the card can be done here
    this.setState({
      imageRendered: false
    })
  }

  componentWillMount(){
    //Changes before rendering can be made here
  }

  parseQuery (queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  parseUrl(url) {
    var parser = document.createElement('a'),
      search;
    parser.href = url;
    search = this.parseQuery(parser.search);
    return {
      protocol: parser.protocol, // => "http:"
      host: parser.host,     // => "example.com:3000"
      hostnam: parser.hostname, // => "example.com"
      port: parser.port,     // => "3000"
      pathname: parser.pathname, // => "/pathname/"
      hash: parser.hash,     // => "#hash"
      searchString: parser.search,
      search: search,   // => "?search=test"
      origin: parser.origin   // => "http://example.com:3000"
    };
  }

  getfocus(mode){
    switch(mode){
      case "col16":
        return "focus-area-col16";
      case "col7":
        return "focus-area-col7";
      case "col4":
        return "focus-area-col4";
      case "col3":
        return "focus-area-col3";
      default:
        return "";
    }
  }

  renderImage() {
    let data = this.state.dataJSON.data,
      url16 = data.url_16column,
      url7 = data.url_7column,
      url4 = data.url_4column,
      url3 = data.url_3column,
      url2 = data.url_2column,
      left = data.left || 50,
      top = data.top || 50,
      transX,
      transY,
      style = {},
      image,
      height,
      width,
      aspect_ratio,
      img = new Image();
    if(url2 && (this.props.mode !='col16' && this.props.mode !='col7' && this.props.mode !="col4" && this.props.mode != 'col3') ){
      image = url2;
    }
    else if(url3 && (this.props.mode !='col16' && this.props.mode !='col7' && this.props.mode !="col4") ){
      image = url3;
    }
    else if(url4 && (this.props.mode !='col16' && this.props.mode !='col7') ){
      image = url4;
    }
    else if(url7 && this.props.mode != 'col16'){
      image = url7;
    }else{
      image = url16;
    }
    
    if(this.props.mode == 'col16'){
      style.width = this.state.width;
    }

    style.height = this.state.height;
    console.log("Initially", style);
    img.onload = (responseImage)=>{

      height = img.height;
      width = img.width;

      let cont = document.getElementsByClassName('protograph-card')[0],
        card = cont.getBoundingClientRect(),
        rwidth = width;
        // processedHeight = this.getHeight(responseImage.target.naturalHeight);
      if(width > card.width){
        cont.style.height = (this.props.mode == 'col16') ? "430px" : "250px";


      }else{
        cont.style.height = (this.props.mode == 'col16') ? "430px" : "250px";


      }


      if(!this.state.imageRendered){
        this.setState({
          imageRendered: true,
          width: rwidth,
          height: height
        }, e => {
          if (typeof this.props.resizeIframe === "function") {
            this.props.resizeIframe();
          }
        })
      }
    }
    img.src = image;
    if(this.props.mode!=="col16"){
      style.height = "250px";
    }
    if(this.props.mode == 'col7'){
      if(img.width < 540){
        style.width = "540px";
      }
    }
    if(this.props.mode == 'col4'){
      if(img.width < 300){
        style.width = "300px";
      }
    }
    if(this.props.mode == 'col3'){
      if(img.width < 220){
        style.width = "220px";
      }
    }


    style.left = left+"%";
    style.top = top+"%";
    transX = ((100 - left) >= 0 && (100 - left) <= 100) ? 100 - left : ((100 - left) < 0)? 0 : 100;
    transY = ((100 - top) >= 0 && (100 - top) <= 100) ? 100 - top: ((100 - top) < 0)? 0 : 100;
    style.transform = `translate(-${transX}%,-${transY}%)`;
    return (
       <div className="protograph-toImage-image-container">
         {/* <div className={this.getfocus(this.props.mode)}>Area of focus</div> */}
         <img src={image} alt={data.title} style={style} className='protograph-toImage-image' />

       </div>
    );
  }

  renderCredits() {
    const data = this.state.dataJSON.data,
      credit_link = data.credit_link,
      credit = data.credit;

    if ((credit_link && credit_link.length) && (credit && credit.length)) {
      return (
        <div className='proto-toImage-credits proto-toImage-fixed-credits'>
          {
            <a href={`${credit_link ? credit_link : '#'}`} target="_blank">
              {credit}
            </a>
          }
        </div>
      )
    } else if (credit && credit.length) {
      return (
        <div className='proto-toImage-credits proto-toImage-fixed-credits'>
          {credit}
        </div>
      )
    } else {
      return undefined;
    }

  }

  renderCol() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data,
        style = {};
      return (
        <div id="protograph-div" className={`protograph-laptop-mode ${this.props.mode}`} style={style}>
          <div style={{ padding: 0 }} className={`protograph-card ${this.props.mode}`} style={style}>
            <div className="protograph-toImage-image-container" onClick={data.link ? this.handleClick : undefined}>{this.renderImage()}</div>
          </div>
          {this.renderCredits()}
        </div>
      )
    }
  }

  render() {
    return this.renderCol();
  }
}
