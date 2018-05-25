import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCoverImage extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: undefined,
      optionalConfigJSON: {}
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }
      axios.all(items_to_fetch).then(
        axios.spread((card, site_configs) => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            optionalConfigJSON: {},
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

  renderImage() {
    let data = this.state.dataJSON.data,
      url16 = data.url_16column,
      url7 = data.url_7column,
      style = {},
      image,
      height,
      width,
      aspect_ratio,
      img = new Image();

    if(url7 && this.props.mode != 'col16'){
      image = url7;
    }else{
      image = url16;
    }

    style.width = this.state.width;
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
    return (
      <div className="protograph-toImage-image-container">
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
            <a href={data.link} target={`${(data.tab)? '_blank':'_self'}`}><div className="protograph-toImage-image-container">{this.renderImage()}</div></a>
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
