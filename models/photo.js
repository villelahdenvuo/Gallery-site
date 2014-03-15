
module.exports = {
	table: 'photo',
	schema: {
		name: 'string',
		path: 'string',
		folder_id: 'ref:folder'
	}
};