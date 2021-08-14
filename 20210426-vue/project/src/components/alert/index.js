import Alert from './src/main';

/* istanbul ignore next */
Alert.install = function(Vue) {
    console.log(Alert.name);
    
  Vue.component(Alert.name, Alert);
};

export default Alert;
