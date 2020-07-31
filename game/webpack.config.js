// webpack的配置文件

var path = require('path');
// 再内存中根据指定的模板页面生存一份内存中的首页,同时自动把打包好的bundle注入到页面底部
var webpack = require('webpack');
// 如果要配置插件,需要在导出的对象中,挂载一个Plugin节点
var HtmlWebpackPlugin = require('html-webpack-plugin');
//使用插件extract-text-webpack-plugin打包独立的css
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//使用UglifyJsPlugin压缩代码
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
// 清除dist文件
var  {CleanWebpackPlugin} = require('clean-webpack-plugin');
// 全局html入口配置
var utils = require('./utils.js');
//引入glob
var glob = require('glob')
// copy文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Uglify = require('uglify-es')
// 全局入口配置
var entry = require('webpack-glob-entry')
// 混淆js
const JavaScriptObfuscator = require('webpack-obfuscator');

require('babel-polyfill')

module.exports = {
	// 多入口文件
	entry:entry('./src/*.js','./src/js/*.js'),
	// 出口文件
	output:{
		path: path.resolve(__dirname,'dist'),     //输出路径
		filename: 'js/[name]-[hash:7].js'    //指定输出文件的名称
	},
	

	// 所有插件的配置节点
	plugins:[
		// new HtmlWebpackPlugin({
		// 	template: path.join(__dirname,'./src/index.html'),   //指定模板文件页面
		// 	filename: 'index.html'   ,//设置生成的页面名称
		// 	minify:{
		// 		removeComments:true,  //移除HTML中的注释
		// 	    collapseWhitespace:true  //删除空白符与换行符
		// 	}
		// }),

		new CleanWebpackPlugin(),   //删除dist
		new CopyWebpackPlugin([
		   {
			 from:__dirname+'/src/js/public',  //定义要拷贝的源文件
			 to:__dirname+'/dist/js/public'   ,// 定义要拷贝到的目标文件
			 toType:"dir",    //file 或者 dir, 可选，默认是文件
			 transform: function (content) {
			   return Uglify.minify(content.toString()).code //压缩js文件
			 }
		   },
		   {
			 from:__dirname+'/src/images/icon1.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon1.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon2.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon2.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon3.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon3.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon4.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon4.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon5.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon5.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon6.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon6.png',		// 定义要拷贝到的目标文件
		   },
		   {
			 from:__dirname+'/src/images/icon-bg.png',  //定义要拷贝的源文件
			 to:__dirname+'/dist/images/icon-bg.png',		// 定义要拷贝到的目标文件
		   },
		  
		   
		]),
		// 混淆
		new JavaScriptObfuscator({
		}, []),
		new ExtractTextPlugin("styles.css"),
	],
	// 压缩
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					ie8: true, // 解决ie下的关键字default的问题
				}
			})
		]
	},
	
	// 配置所有第三方loader模块
	module:{
		rules:[    //第三方模块的匹配规则
			// 处理css文件的loader
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			},
			// 处理less文件的loader
			{ test:/\.less$/ , use: ["css-loader","style-loader","less-loader"]},
			// 处理url图片路径的loader
			// limit给定的值是图片的大小,单位字节,如引用的图片大于或等于给定的limit的值,
			// 则不会被转为base64格式的字符串,反之则会转为base64格式
			{
				test: /\.(jpg|png|gif|bmp|jpeg|svg)$/,
				use: [{
						loader: 'url-loader',
						options: { // 这里的options选项参数可以定义多大的图片转换为base64
							name: '[name].[ext]',
							limit: 50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
							outputPath: 'images' //定义输出的图片文件夹
						}
					},
					{ //压缩图片要在file-loader之后使用
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true
						}
					}
				]
			},
			// 处理字体文件的loader
			{ test:/\.(ttf|eto|svg|woff|woff2)$/, use:'url-loader' },
			// 处理媒体文件的loader
			{
			    test: /\.(mp3|mp4)(\?.*)?$/,
			    loader: 'url-loader',
			    options: {
			      name:'audio/[name].[ext]',
			      limit:10
			    }
			}, 
			// 处理swf文件的loader
			{
				test: /\.swf$/,            
				loader: 'url-loader',
				options: {
				  limit: 1024,
				  name: 'file/[name]-[hash:7].[ext]'
				}
			},
			
			// 处理js文件的loader
			{ test:/\.js$/, use:"babel-loader", exclude:/node_modules/ },
			{
				test: /.js$/,
				enforce: 'post', // post-loader处理
				loader: 'es3ify-loader'
			},
			// 处理html中插入的img
			{
				test:/\.html$/,
				use:[
					{
						loader:"html-loader",
						options:{
							attrs:["img:src","audio:src"]  //此处的参数值  img是指html中的 <img/> 标签， src是指 img的src属性   表示 html-loader 作用于 img标签中的 src的属性
						}
					}
				]
			},

		]
	},
	
	
	
}


// 读取html文件，生成多个html
let pages = utils.getEntries(path.join(__dirname, './src/*.html'));
for (var page in pages) {
  let conf = {
    //输出文件的文件名称，默认为index.html，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'html/index.html'）
    filename: ''+page+'.html',
    //本地模板文件的位置
    template: pages[page],
    /**
     * 向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同。
     * true或者body：所有JavaScript资源插入到body元素的底部
     * head：所有JavaScript资源插入到head元素中
     * false：所有静态资源css和JavaScript都不会注入到模板文件中
     */
    inject: 'body',
    hash: true,
    minify: {
      collapseWhitespace:true  ,//删除空白符与换行符
	  minifyCSS:true    ,//压缩html内的样式
	  minifyJS:true        ,//压缩html内的js
	  minifyURLs:true,   //在各种属性中缩小url(使用relateurl)
	  decodeEntities:true,   //尽可能使用直接的Unicode字符。
    },
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}





