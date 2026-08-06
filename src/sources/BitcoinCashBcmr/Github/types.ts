import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type BcmrIdentitySnapshot = {
	name?: string
	description?: string
	token?: {
		category?: string
		symbol?: string
		decimals?: number
	}
	uris?: Record<string, string>
}

export type BcmrIdentity = Record<string, BcmrIdentitySnapshot>

export type BcmrRegistry = {
	$schema?: string
	version?: JsonValue
	latestRevision?: string
	registryIdentity?: {
		name?: string
		description?: string
	}
	identities?: Record<string, BcmrIdentity>
}

export const bcmrIdentitySnapshot = arktype({
	'name?': 'string',
	'description?': 'string',
	'token?': {
		'category?': 'string',
		'symbol?': 'string',
		'decimals?': 'number.integer >= 0',
	},
	'uris?': 'Record<string, string>',
}) satisfies Type<BcmrIdentitySnapshot>

export const bcmrRegistry = arktype({
	'$schema?': 'string',
	'version?': 'unknown',
	'latestRevision?': 'string',
	'registryIdentity?': {
		'name?': 'string',
		'description?': 'string',
	},
	'identities?': 'Record<string, Record<string, unknown>>',
}) satisfies Type<{
	$schema?: string
	version?: unknown
	latestRevision?: string
	registryIdentity?: {
		name?: string
		description?: string
	}
	identities?: Record<string, Record<string, unknown>>
}>
