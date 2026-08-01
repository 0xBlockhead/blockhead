// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSiweChallenge,
	labels: {
		singular: 'blockhead siwe challenge',
		plural: 'blockhead siwe challenges',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'room',
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.One,
	},
	fromPeerId: {
		label: 'from peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toPeerId: {
		label: 'to peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$signer: {
		label: 'signer',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	message: {
		label: 'message',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scheme: {
		label: 'scheme',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	domain: {
		label: 'domain',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	uri: {
		label: 'URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'nonce',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	statement: {
		label: 'statement',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuedAt: {
		label: 'issued AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	expiresAt: {
		label: 'expires AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	notBefore: {
		label: 'not before',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestId: {
		label: 'request ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resources: {
		label: 'resources',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	requestOrigin: {
		label: 'request origin',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureKind: {
		label: 'signature kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verified: {
		label: 'verified',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	verificationMethod: {
		label: 'verification method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAt: {
		label: 'verified AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationError: {
		label: 'verification error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
