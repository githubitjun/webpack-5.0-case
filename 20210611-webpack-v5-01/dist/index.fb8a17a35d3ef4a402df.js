(self["webpackChunk_20210611_webpack_v5_01"] = self["webpackChunk_20210611_webpack_v5_01"] || []).push([["index"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 18:04:16
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */




function getComponent() {
  const element = document.createElement('div');
  element.innerHTML = 'hello world'
  element.onclick = function(){
      // 使用 import 语法 可以实现懒加载  在这个代码执行的时候才会去加载这个文件
      // webpackChunkName 设置 新 chunk 的名称
      __webpack_require__.e(/*! import() | my-chunk-name */ "vendors").then(__webpack_require__.t.bind(__webpack_require__, /*! lodash */ "./node_modules/lodash/lodash.js", 23)).then(({ default: _ }) => {
        const element = document.createElement('div');
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        document.body.appendChild(element);
      }).catch((error) => 'An error occurred while loading the component');
   }
   document.body.appendChild(element);
}

getComponent()





/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMDIxMDYxMS13ZWJwYWNrLXY1LTAxLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJLQUF3RCxRQUFRLGFBQWE7QUFDbkY7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJpbmRleC5mYjhhMTdhMzVkM2VmNGE0MDJkZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEBBdXRob3I6IOS5neWkqVxyXG4gKiBARGF0ZTogMjAyMS0wNi0xMSAxMDozMzozNVxyXG4gKiBATGFzdEVkaXRvcnM6IOS5neWkqVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIxLTA2LTExIDE4OjA0OjE2XHJcbiAqIEBEZXNjcmlwdGlvbjogXHJcbiAqIEBGaWxlUGF0aDogXFwyMDIxMDYxMS13ZWJwYWNrLXY1LTAxXFxzcmNcXGluZGV4LmpzXHJcbiAqL1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50KCkge1xyXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBlbGVtZW50LmlubmVySFRNTCA9ICdoZWxsbyB3b3JsZCdcclxuICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAvLyDkvb/nlKggaW1wb3J0IOivreazlSDlj6/ku6Xlrp7njrDmh5LliqDovb0gIOWcqOi/meS4quS7o+eggeaJp+ihjOeahOaXtuWAmeaJjeS8muWOu+WKoOi9vei/meS4quaWh+S7tlxyXG4gICAgICAvLyB3ZWJwYWNrQ2h1bmtOYW1lIOiuvue9riDmlrAgY2h1bmsg55qE5ZCN56ewXHJcbiAgICAgIGltcG9ydCggLyogd2VicGFja0NodW5rTmFtZTogXCJteS1jaHVuay1uYW1lXCIgKi8nbG9kYXNoJykudGhlbigoeyBkZWZhdWx0OiBfIH0pID0+IHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBfLmpvaW4oWydIZWxsbycsICd3ZWJwYWNrJ10sICcgJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgbG9hZGluZyB0aGUgY29tcG9uZW50Jyk7XHJcbiAgIH1cclxuICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxufVxyXG5cclxuZ2V0Q29tcG9uZW50KClcclxuXHJcblxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==