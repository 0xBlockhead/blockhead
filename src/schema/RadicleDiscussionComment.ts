// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleDiscussionComment,
	labels: {
		singular: 'radicle discussion comment',
		plural: 'radicle discussion comments',
	},
})({
	discussionSelector: {
		label: 'discussion selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	commentId: {
		label: 'comment ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorDid: {
		label: 'author DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	body: {
		label: 'body',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyObjectId: {
		label: 'body object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyToCommentId: {
		label: 'reply to comment ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$payloadObject: {
		label: 'payload object',
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		DiscussionSelectorCommentId: [
			'discussionSelector',
			'commentId',
		],
	},
})
