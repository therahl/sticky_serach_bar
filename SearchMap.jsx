/*
  ****************************
  *********   TODO   *********
  ****************************
  left off at createSponSparkCount broken
  [ ] - remove init guard diff current to new markers
  [ ] - mouse overs
  [ ] - check it business is trending/ different icons on map
  [ ] - my location marker
*/

import React, {Component} from 'react';
import Map from '../map/Map';
import LocationStore from '../../stores/LocationStore';
import SearchResultsStore from '../../stores/SearchResultsStore';
import MapService from '../../services/MapService';
import MapExpandBtn from './MapExpandBtn';

class SearchMap extends Map{
  constructor(props){
    super(props);
    this.onLocationStoreUpdate = this.onLocationStoreUpdate.bind(this);
    this.onSearchResultsStoreUpdate = this.onSearchResultsStoreUpdate.bind(this);
  }

  componentWillMount(){
    LocationStore.addChangeListener(this.onLocationStoreUpdate);
    SearchResultsStore.addChangeListener(this.onSearchResultsStoreUpdate);
  }

  componentWillUnmount(){
    LocationStore.removeChangeListener(this.onLocationStoreUpdate);
    SearchResultsStore.removeChangeListener(this.onSearchResultsStoreUpdate);
  }
  componentDidMount(){
    this.fixMap();
  }
  fixMap(){
    $('#fixed-map').scrollToFixed({
      marginTop: function() {
        return $('.header-bar-container').height();
      },
      zIndex: 100,
      spacerClass: 'display-none',
      removeOffsets: true
    });
    MapService.redraw();
  }
  onLocationStoreUpdate(){
    this.setState(LocationStore.getState());
  }
  onSearchResultsStoreUpdate(){
    this.setState(SearchResultsStore.getState());
  }


  render(){
    let state = this.state;
    if(state && state.results && state.location){
      let markers = this.state.results.listings.map(res => {
        if(res.latitude && res.longitude){
          let cat;
          if(res.category){
            cat = res.category.title;
          }
          return {
            lat: res.latitude,
            lng: res.longitude,
            icon: {
              idle: {src: '/public/img/search/trending_pin.png'},
              hover: {src: '/public/img/search/trending_pin_rollover.png'}
            },
            data: {
              id: res.id,
              name: res.name,
              url: res.url,
              score: res.social.totals || -1,
              cat: cat,
              price: res.price || -1
            }
          };
        }
      }).filter(marker => {
        return marker;
      });
      MapService.removeMarkers();
      MapService.addMarkers(markers);
      MapService.createInfoWindow();
      MapService.zoomMarkers();
    }
    return (
      <div>
        {<MapExpandBtn fixMap={this.fixMap}/>}
      </div>);
  }
}

export default SearchMap;
