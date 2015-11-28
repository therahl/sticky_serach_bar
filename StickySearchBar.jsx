import React, {Component} from 'react';
import classnames from 'classnames';
import SearchBar from './Bar';
import MenuBtn from '../Menu/MenuBtn';
import LocationStore from '../../stores/LocationStore';
import WhatIsMojoBtn from '../whatsit/WhatIsMojoBtn';

class StickySearchBar extends Component{
  constructor(props){
    super(props);
    this.window = $(window);
    this.state = {navBarState: 'default', hidden: true, startId: 'sticky_search_root'};
    this.handleScroll = this.handleScroll.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onLocationStoreUpdate = this.onLocationStoreUpdate.bind(this);
    this.onLogoClicked = this.onLogoClicked.bind(this);
    this.onGlobalClick = this.onGlobalClick.bind(this);
    this.onSearchFocus = this.onSearchFocus.bind(this);
  }
  componentWillMount() {
    LocationStore.addChangeListener(this.onLocationStoreUpdate);
  }
  componentDidMount() {
    // requestAnimationFrame may be buggy, but is used to ensure DOM is rendered for accurate heights and .offset
    window.requestAnimationFrame(() => {
      $(React.findDOMNode(this)).scrollToFixed({dontSetWidth: true});
      let temp = this.props.startId ? this.setState({startId: this.props.startId}) : this.setState({hidden: false});
      let distanceFromTop = $('#' + this.state.startId).offset().top;
      // TODO set height dynamically, not working consistently.  override.  offsetHeight does not include margins
      // let height = document.getElementsByClassName('header-bar-container')[0].offsetHeight;
      this.headerHeight = 52;
      this.siteMenuPadding = parseInt($('.site-menu').css('paddingTop').replace('px', ''));
      this.siteMenu = $('.site-menu');
      this.setState({headingHeight: distanceFromTop});


      if (!this.props.startId) {
        $('.site-menu').css('paddingTop', this.headerHeight);
        $('.site-container').css('paddingTop', this.headerHeight);
      }

      window.addEventListener('scroll', this.handleScroll);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    $(window).off('scroll', this.onWindowScroll);
    LocationStore.removeChangeListener(this.onLocationStoreUpdate);
  }

  onLocationStoreUpdate(){
    this.setState(LocationStore.getState());
  }

  onLogoClicked(){
    window.location.href = `/${this.state.location.curr.path}`;
  }
  onSearchFocus(e){
    this.setState({navBarState: 'mobile-focus'});
  }
  onGlobalClick(e){
    this.onLocationStoreUpdate();
    this.onSearchStoreUpdate();
    if (!React.findDOMNode(this).contains(e.target)) {
      // SearchActions.onSetNavBarState('default');
      this.setState({navBarState: 'default'});
    }
  }
  handleScroll(event) {
    this.setState({navBarState: 'default'});
    let scrollTop = event.target.body.scrollTop || window.pageYOffset;
    let scrollDiff = parseInt(scrollTop) - this.state.headingHeight;
    if(scrollDiff > -1){
      if(this.state.hidden){
        this.setState({
          hidden: false
        });
        this.siteMenu.css('paddingTop', this.headerHeight);
      }
    } else {
      if(!this.state.hidden){
        this.setState({
          hidden: true
        });
        this.siteMenu.css('paddingTop', this.siteMenuPadding);
      }
    }
  }

  render(){
    const classname = {"hidden": this.state.hidden, "section-header": false, "header-bar-container": true, "active": (this.state.navBarState == 'mobile-focus') };
    const style = {top: 0};
    return (
      <div className={classnames(classname)} style={style}>
        <div className="header-bar">
          <div className="site-wide-image main-logo pull-left" onClick={this.onLogoClicked}></div>
          <div className="search-results-searchbar">
            <SearchBar onSearchFocus={this.onSearchFocus} />
          </div>
          <div className="header-bar-right pull-right">
            <div className="header-learn-more">
              <WhatIsMojoBtn text="Social Powered Local Search &trade;" />
            </div>
            <div className="site-wide-image" id="hamburger-sticky"><MenuBtn /></div>
          </div>
        </div>
      </div>
    );
  }
}
export default StickySearchBar;
