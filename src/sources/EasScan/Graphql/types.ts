import type { FragmentOf } from 'gql.tada'

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
		data
		txid
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
	}
`)

export type EasScanSchema = FragmentOf<typeof EasScanSchemaFragment>
