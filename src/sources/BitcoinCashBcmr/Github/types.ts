import type { JsonValue } from '$/typescript/JsonValue.ts'

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
