import React, { Component } from 'react';
import ReactMapboxGl, { ZoomControl, ScaleControl } from "react-mapbox-gl";
import './App.css';

const styles = {
}

export default class App extends Component {

  mapbox = null;

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

  render() {
    return (
      <div>
        <ReactMapboxGl
          ref={(mapbox) => { this.mapbox = mapbox; }}
          style="mapbox://styles/mapbox/streets-v8"
          accessToken="pk.eyJ1IjoieXV0aW4xOTg3IiwiYSI6ImNqMjJtamJtazAwMG4ycW82NHR6NmF0cnUifQ.spKWmG2FYMQx_WXr9azNyw"
          center={[121.5353092, 25.021611]}
          zoom={[17]}
          containerStyle={{ height: "100vh", width: "100vw" }}
        >
          <ZoomControl />
          <ScaleControl />
        </ReactMapboxGl>
      </div>
    );
  }
}