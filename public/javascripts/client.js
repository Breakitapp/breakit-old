//Models
var Post = Backbone.RelationalModel.extend({
	relations : [{
		type 							: Backbone.HasOne,
		key 							: 'user',
		relatedModel			: 'User',
		relatedCollection : 'UserCollection',
		reverseRelation		: {
			key						: 'hasPosted',
			includeInJSON	: 'id'
		}
	},
		type							: Backbone.HasMany,
		key								: 'comments',
		relatedModel			:	'Comment',
		relatedCollection	:	'CommentCollection',
		reverseRelation		:	{
			key						:	'about',
			includeInJSON	:	'id'
		}
	]
});
