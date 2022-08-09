var babelCore = require("@babel/core");
var sourceCode = `let fn = (number)=>{number + 1}`
var options = {
  code: true,
  ast: true,
  sourceMaps: true,
  plugins: [],
  presets: []
};

babelCore.transform(sourceCode, options, function (err, result) {
  console.log('source code',sourceCode);
  console.log('result code',result.code);
  console.log('result map',result.map);
  console.log('result ast',result.ast);
})