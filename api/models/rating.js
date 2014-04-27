module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord')
		, Joi = require('joi');

	var rating = {
		table: 'rating',
		schema: Joi.object().keys({
			user_id:  Joi.number().integer().required().min(1),
			photo_id: Joi.number().integer().required().min(1),
			score:    Joi.number().integer().required().min(0).max(5),
			id: 			Joi.number().integer().optional()
		})
	};

	return new ActiveRecord(db, rating);
};