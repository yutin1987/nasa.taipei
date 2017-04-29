import _ from 'lodash';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Accelerometer, Gyroscope } from 'react-native-sensors';
import axios from 'axios';

const domain = 'https://g0v.social';
const clientId = 'd5c1379effc39325e95a142467259d5ecce416bdcc19132da8c9cd68adc08bff';
const clientSecret = '';

const accelerationObservable = new Accelerometer();
const gyroscopeObservable = new Gyroscope();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 32,
  },
});

export default class Component extends React.Component {

  state = {
    run: 0,
    accessToken: null,
  }

  componentDidMount() {
    gyroscopeObservable
      .map(({ x, y, z }) => {
        let subtract = 0;
        const prev = this.prev;

        if (prev) {
          subtract = Math.abs(_.subtract(x, prev.x)) +
                     Math.abs(_.subtract(y, prev.y)) +
                     Math.abs(_.subtract(z, prev.z));
        }

        this.prev = { x, y, z };
        return subtract;
      })
      .subscribe((subtract) => {
        if (subtract < 10) return;
        this.enable();
      });

    accelerationObservable
      .map(({ x, y, z }) => Math.abs(x) + Math.abs(y) + Math.abs(z))
      .subscribe((speed) => {
        if (this.isEnable && speed < 0.3) this.handlePost();
      });

    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  onAuthorization = () => {
    Linking.openURL(`${domain}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('tatooine://callback')}&scope=read+write&response_type=code`);
  }

  handlePost = _.throttle(async () => {
    const { run, accessToken } = this.state;

    this.setState({ run: run + 1 });

    if (!accessToken) return;

    await axios.post(`${domain}/api/v1/statuses`, {
      status: 'I am flying high to recorded this earth. http://nasa.taipei',
      visibility: 'public',
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }, 3000, { leading: true, trailing: false });

  handleOpenURL = async (e) => {
    const { url } = e;
    const code = url.match(/\?code=([a-z0-9]+)/i)[1];

    const { data } = await axios.post(`${domain}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'tatooine://callback',
    });

    this.setState({ accessToken: data.access_token });
  }

  enable = _.throttle(() => {
    this.isEnable = true;
    this.disable();
  }, 1000, { leading: true, trailing: false });

  disable = _.debounce(() => {
    this.isEnable = false;
  }, 2000);

  prev = null;

  isEnable = false;

  render() {
    const { run, accessToken } = this.state;

    return (
      <View style={styles.container}>
        <Text>RUN: {run}</Text>

        {accessToken ?
          <Text>{accessToken}</Text>
        :
          <TouchableOpacity onPress={this.onAuthorization}>
            <Text style={styles.button}>enable g0v.social</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}
