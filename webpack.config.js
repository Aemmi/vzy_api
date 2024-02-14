const path = require("path");

module.exports = {
	mode: "production",
	entry: "./index.js",
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/",
		filename: "final.js",
	},
	target: "node",
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: "ignore-loader" // or any other appropriate loader to ignore HTML files
			}
		]
	}
};