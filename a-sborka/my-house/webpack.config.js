const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = 
{
	//mode: 'development',
	mode: 'production',
	entry: './src/index.js',
	output: 
	{
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js'
	}, 	
	plugins: 
	[
		//new CleanWebpackPlugin(),
		new HtmlWebPackPlugin(
		{
			template: path.resolve(__dirname, './src/index.php'),
			filename: 'index.php',
		})
	]
};
