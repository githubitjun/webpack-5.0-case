(self["webpackChunk_20210611_webpack_v5_01"] = self["webpackChunk_20210611_webpack_v5_01"] || []).push([["index"],{

/***/ 138:
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ 486);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-15 09:52:22
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */




// function getComponent() {
//   const element = document.createElement('div');
//   element.innerHTML = 'hello world'
//   element.onclick = function(){
//       // 使用 import 语法 可以实现懒加载  在这个代码执行的时候才会去加载这个文件
//       // webpackChunkName 设置 新 chunk 的名称
//       import( /* webpackChunkName: "my-chunk-name" */'lodash').then(({ default: _ }) => {
//         const element = document.createElement('div');
//         element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//         document.body.appendChild(element);
//       }).catch((error) => 'An error occurred while loading the component');
//    }
//    document.body.appendChild(element);
// }

// getComponent()


// import Print from './print';
 function component() {
   const element = document.createElement('div');

   // lodash 是由当前 script 脚本 import 进来的
   element.innerHTML = lodash__WEBPACK_IMPORTED_MODULE_0___default().join(['Hello', 'webpack'], ' ');
  //  element.onclick = Print.bind(null, 'Hello webpack!');
   return element;
 }

 document.body.appendChild(component());



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__(138)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMDIxMDYxMS13ZWJwYWNrLXY1LTAxLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLGFBQWE7QUFDdEY7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7QUFFdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGtEQUFNO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJpbmRleC44YzdjNzg1MDczMDFkYjIyNjA2MS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEBBdXRob3I6IOS5neWkqVxyXG4gKiBARGF0ZTogMjAyMS0wNi0xMSAxMDozMzozNVxyXG4gKiBATGFzdEVkaXRvcnM6IOS5neWkqVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIxLTA2LTE1IDA5OjUyOjIyXHJcbiAqIEBEZXNjcmlwdGlvbjogXHJcbiAqIEBGaWxlUGF0aDogXFwyMDIxMDYxMS13ZWJwYWNrLXY1LTAxXFxzcmNcXGluZGV4LmpzXHJcbiAqL1xyXG5cclxuXHJcblxyXG5cclxuLy8gZnVuY3Rpb24gZ2V0Q29tcG9uZW50KCkge1xyXG4vLyAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuLy8gICBlbGVtZW50LmlubmVySFRNTCA9ICdoZWxsbyB3b3JsZCdcclxuLy8gICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAvLyDkvb/nlKggaW1wb3J0IOivreazlSDlj6/ku6Xlrp7njrDmh5LliqDovb0gIOWcqOi/meS4quS7o+eggeaJp+ihjOeahOaXtuWAmeaJjeS8muWOu+WKoOi9vei/meS4quaWh+S7tlxyXG4vLyAgICAgICAvLyB3ZWJwYWNrQ2h1bmtOYW1lIOiuvue9riDmlrAgY2h1bmsg55qE5ZCN56ewXHJcbi8vICAgICAgIGltcG9ydCggLyogd2VicGFja0NodW5rTmFtZTogXCJteS1jaHVuay1uYW1lXCIgKi8nbG9kYXNoJykudGhlbigoeyBkZWZhdWx0OiBfIH0pID0+IHtcclxuLy8gICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbi8vICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBfLmpvaW4oWydIZWxsbycsICd3ZWJwYWNrJ10sICcgJyk7XHJcbi8vICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuLy8gICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgbG9hZGluZyB0aGUgY29tcG9uZW50Jyk7XHJcbi8vICAgIH1cclxuLy8gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuLy8gfVxyXG5cclxuLy8gZ2V0Q29tcG9uZW50KClcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbi8vIGltcG9ydCBQcmludCBmcm9tICcuL3ByaW50JztcclxuIGZ1bmN0aW9uIGNvbXBvbmVudCgpIHtcclxuICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgLy8gbG9kYXNoIOaYr+eUseW9k+WJjSBzY3JpcHQg6ISa5pysIGltcG9ydCDov5vmnaXnmoRcclxuICAgZWxlbWVudC5pbm5lckhUTUwgPSBfLmpvaW4oWydIZWxsbycsICd3ZWJwYWNrJ10sICcgJyk7XHJcbiAgLy8gIGVsZW1lbnQub25jbGljayA9IFByaW50LmJpbmQobnVsbCwgJ0hlbGxvIHdlYnBhY2shJyk7XHJcbiAgIHJldHVybiBlbGVtZW50O1xyXG4gfVxyXG5cclxuIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29tcG9uZW50KCkpO1xyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==