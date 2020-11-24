const url = require('url');
const http = require('http');
const https = require('https');
const sizeOf = require('image-size');
const FileType = require('file-type');

export default (context, inject) => {
	const getImageDimensions = (imageURL) => {
		return new Promise((resolve, reject) => {
			const options = url.parse(imageURL);
			const getter = imageURL.startsWith('https') ? https : http;
			getter.get(options, function (response) {
				let chunks = [];
				response.on('data', function (chunk) {
					chunks.push(chunk);
				}).on('end', async function() {
					const buffer = Buffer.concat(chunks);
					const type = await FileType.fromBuffer(buffer);
					if (type.ext === 'jpg' || type.ext === 'png' || type.ext === 'gif') {
						const dimensions = sizeOf(buffer);
						return resolve({
							w : dimensions.width,
							h : dimensions.height
						});
					} else {
						return resolve({
							w : 800,
							h : 800
						});
					}
				});
			});
		})
	};
	inject('getImageDimensions', getImageDimensions)
}
