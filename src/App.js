import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import './App.css';

class App extends Component {
  render() {
    return (
      <ReactMapboxGl
        style="mapbox://styles/mapbox/streets-v8"
        accessToken="pk.eyJ1IjoieXV0aW4xOTg3IiwiYSI6ImNqMjJtamJtazAwMG4ycW82NHR6NmF0cnUifQ.spKWmG2FYMQx_WXr9azNyw"
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
          </Layer>
      </ReactMapboxGl>
    );
  }
}

export default App;
