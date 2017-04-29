import React, { Component } from 'react';
import ReactMapboxGl, { ZoomControl, ScaleControl, Layer, Feature, Marker } from "react-mapbox-gl";
import location from './location.gif';
import './App.css';

const styles = {
  marker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: 80,
    border: '2px solid #BBFAF8',
    margin: 1,
    background: 'transparent',
    color: '#BBFAF8',
    paddingLeft: 8,
    paddingRight: 8,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
  },
}

export default class App extends Component {

  mapbox = null;

  state = {
    marker: null,
    zoom: [17],
    center: [121.5353092, 25.021611],
  }

  componentDidMount() {
    this.onReady();
  }

  onReady = () => {
    const { map } = this.mapbox.getChildContext();
    if (!map) {
      setImmediate(this.onReady);
      return;
    }

    map.flyTo({ zoom: 1 });
  }

  onClick = (map: Object, event: Object) => {
    const { lngLat } = event;
    this.setState({ marker: lngLat });
  }

  onZoomEnd = (map: Object) => {
    setImmediate(() => {
      this.setState({ zoom: [map.getZoom()] });
    });
  }

  onMoveEnd = (map: Object) => {
    setImmediate(() => {
      this.setState({ center: map.getCenter() });
    });
  }

  render() {
    const { zoom, center, marker } = this.state;

    return (
      <div>
        <ReactMapboxGl
          ref={(mapbox) => { this.mapbox = mapbox; }}
          style="mapbox://styles/mapbox/dark-v9"
          accessToken="pk.eyJ1IjoieXV0aW4xOTg3IiwiYSI6ImNqMjJtamJtazAwMG4ycW82NHR6NmF0cnUifQ.spKWmG2FYMQx_WXr9azNyw"
          center={center}
          zoom={zoom}
          containerStyle={{ height: "100vh", width: "100vw" }}
          onClick={this.onClick}
          onZoomEnd={this.onZoomEnd}
          onMoveEnd={this.onMoveEnd}
        >
          <ZoomControl />
          <ScaleControl />
          {marker &&
            <Marker coordinates={marker} anchor="bottom">
              <div style={styles.marker}>
                <button style={styles.button}><span>US$</span><span>1</span></button>
                <button style={styles.button}><span>US$</span><span>10</span></button>
                <button style={styles.button}><span>US$</span><span>100</span></button>
                <img src={location} width={46} height={46} />
              </div>
            </Marker>
          }
        </ReactMapboxGl>
      </div>
    );
  }
}