import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image as ImageNative,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import { nodeType } from '../helpers';
import { ViewPropTypes, withTheme } from '../config';

class Image extends React.Component {
  state = {
    placeholderOpacity: new Animated.Value(1),
  };

  onLoad = () => {
    const minimumWait = 100;
    const staggerNonce = 200 * Math.random();

    setTimeout(
      () => {
        Animated.timing(this.state.placeholderOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS === 'android' ? false : true,
        }).start();
      },
      Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce)
    );
  };

  render() {
    const {
      placeholderStyle,
      PlaceholderContent,
      containerStyle,
      style,
      ImageComponent,
      children,
      ...attributes
    } = this.props;
    const hasImage = Boolean(attributes.source);

    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={StyleSheet.flatten([styles.container, containerStyle])}
      >
        <ImageComponent
          defaultSource={require('./transparent-pixel.png')}
          {...attributes}
          source={Platform.OS === 'android' ? (attributes.source && attributes.source.uri ? attributes.source : require('./transparent-pixel.png')) : attributes.source}
          onLoad={this.onLoad}
          style={StyleSheet.flatten([
            StyleSheet.absoluteFill,
            style,
          ])}
          testID="RNE__Image"
        />

        <Animated.View
          pointerEvents={hasImage ? 'none' : 'auto'}
          accessibilityElementsHidden={hasImage}
          importantForAccessibility={hasImage ? 'no-hide-descendants' : 'yes'}
          style={[
            styles.placeholderContainer,
            {
              opacity: hasImage ? this.state.placeholderOpacity : 1,
            },
          ]}
        >
          <View
            testID="RNE__Image__placeholder"
            style={StyleSheet.flatten([
              style,
              styles.placeholder,
              placeholderStyle,
            ])}
          >
            {PlaceholderContent}
          </View>
        </Animated.View>

        <View style={style}>{children}</View>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

Image.propTypes = {
  ...ImageNative.propTypes,
  ImageComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  PlaceholderContent: nodeType,
  containerStyle: ViewPropTypes.style,
  placeholderStyle: ImageNative.propTypes.style,
};

Image.defaultProps = {
  ImageComponent: ImageNative,
  style: {},
};

export { Image };
export default withTheme(Image, 'Image');
