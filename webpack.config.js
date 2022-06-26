const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
	entry: './src/App.ts',
	output: {
		filename: './js/main.js',
		path: path.resolve(__dirname, 'build')
	},
	devtool: 'inline-source-map',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			minify: false
		})
	],
	module: {
		rules: [
			{
				test: /\.ts|.tsx$/,
				loader: 'ts-loader',
				options: {configFile: 'tsconfig.json'},
				exclude: /node_modules/
			}, {
				test: /\.(frag|vert)$/i,
				use: 'raw-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	}
}];
