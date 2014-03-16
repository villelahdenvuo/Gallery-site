
var photo = {
	table: 'photo',
	belongs_to: ['folder'],
	//has_many: ['tags']
};

photo.toString = function () {
	return this.name + ' (' + this.path + ')';
};

module.exports = photo;