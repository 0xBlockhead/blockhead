import type { FragmentOf } from 'gql.tada'
import { type as arktype } from 'arktype'

import { graphql } from './client.ts'

export const EasScanAttestationFragment = graphql(`
	fragment EasScanAttestation on Attestation @_unmask {
		id
		schemaId
		attester
		recipient
		refUID
		revocable
		revoked
		revocationTime
		expirationTime
		time
		timeCreated
		data
		txid
		isOffchain
	}
`)

export type EasScanAttestation = FragmentOf<typeof EasScanAttestationFragment>

export const EasScanSchemaFragment = graphql(`
	fragment EasScanSchema on Schema @_unmask {
		id
		schema
		creator
		resolver
		revocable
		index
		txid
		time
		_count {
			attestations
		}
	}
`)

export type EasScanSchema = FragmentOf<typeof EasScanSchemaFragment>

const easScanBytes32 = arktype('string').matching(/^0x[0-9a-f]{64}$/i)
const easScanAddress = arktype('string').matching(/^0x[0-9a-f]{40}$/i)
const easScanBytes = arktype('string').matching(/^0x(?:[0-9a-f]{2})*$/i)
const easScanNonNegativeSafeInteger = arktype('number.integer >= 0')
const easScanNonNegativeIndex = arktype('string').matching(/^(0|[1-9][0-9]*)$/)

export const easScanAttestationEnvelope = arktype({
	id: easScanBytes32,
	schemaId: easScanBytes32,
	attester: easScanAddress,
	recipient: easScanAddress,
	refUID: easScanBytes32,
	revocable: 'boolean',
	revoked: 'boolean',
	revocationTime: easScanNonNegativeSafeInteger,
	expirationTime: easScanNonNegativeSafeInteger,
	time: easScanNonNegativeSafeInteger,
	timeCreated: easScanNonNegativeSafeInteger,
	data: easScanBytes,
	txid: easScanBytes32,
	isOffchain: 'boolean',
})

export const easScanAttestationsPageEnvelope = arktype({
	attestations: easScanAttestationEnvelope.array(),
})

export const easScanSchemaEnvelope = arktype({
	id: easScanBytes32,
	schema: 'string',
	creator: easScanAddress,
	resolver: easScanAddress,
	revocable: 'boolean',
	index: easScanNonNegativeIndex,
	txid: easScanBytes32,
	time: easScanNonNegativeSafeInteger,
	_count: {
		attestations: easScanNonNegativeSafeInteger,
	},
})

export const easScanSchemasPageEnvelope = arktype({
	schemas: easScanSchemaEnvelope.array(),
})

export const easScanAttestationCountEnvelope = arktype({
	aggregateAttestation: {
		_count: {
			'_all?': easScanNonNegativeSafeInteger.or(arktype('null')),
		},
	},
})
