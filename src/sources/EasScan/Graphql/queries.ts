import type { VariablesOf } from 'gql.tada'

import {
	EasScanAttestationFragment,
	EasScanSchemaFragment,
	easScanAttestationCountEnvelope,
	easScanAttestationEnvelope,
	easScanAttestationsPageEnvelope,
	easScanSchemaEnvelope,
	easScanSchemasPageEnvelope,
	type EasScanAttestation,
	type EasScanSchema,
} from '$/sources/EasScan/Graphql/types.ts'
import bindings from '$/sources/EasScan/bindings.ts'
import { Source } from '$/sources/Source.ts'

import {
	graphql,
	queryEasScan,
} from './client.ts'

const bytes32Pattern = /^0x[0-9a-f]{64}$/i
const evmAddressPattern = /^0x[0-9a-f]{40}$/i

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`EasScan returned invalid ${label}`)
	}
}

const bindingByNetwork = new Map(
	bindings[Source.EasScan_Graphql].map((binding) => [
		`eip155:${binding.target.key}`,
		binding,
	])
)

const easScanBindingForNetwork = (network: string) => {
	const binding = bindingByNetwork.get(network)
	if (binding == null)
		throw new Error('EasScan GraphQL has no exact network binding')

	return binding
}

const EasScanAttestation = graphql(`
	query EasScanAttestation($where: AttestationWhereUniqueInput!) {
		attestation(where: $where) {
			...EasScanAttestation
		}
	}
`, [
	EasScanAttestationFragment,
])

const EasScanAttestations = graphql(`
	query EasScanAttestations(
		$where: AttestationWhereInput!
		$skip: Int!
		$take: Int!
	) {
		attestations(
			where: $where
			skip: $skip
			take: $take
			orderBy: { time: desc }
		) {
			...EasScanAttestation
		}
	}
`, [
	EasScanAttestationFragment,
])

const EasScanSchema = graphql(`
	query EasScanSchema($where: SchemaWhereUniqueInput!) {
		schema(where: $where) {
			...EasScanSchema
		}
	}
`, [
	EasScanSchemaFragment,
])

const EasScanSchemas = graphql(`
	query EasScanSchemas(
		$skip: Int!
		$take: Int!
	) {
		schemas(
			skip: $skip
			take: $take
			orderBy: { time: desc }
		) {
			...EasScanSchema
		}
	}
`, [
	EasScanSchemaFragment,
])

const EasScanAttestationCount = graphql(`
	query EasScanAttestationCount($where: AttestationWhereInput!) {
		aggregateAttestation(where: $where) {
			_count {
				_all
			}
		}
	}
`)

const assertUid = (
	uid: string,
	label: string
) => {
	if (!bytes32Pattern.test(uid))
		throw new Error(`EasScan returned invalid ${label}`)
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!evmAddressPattern.test(address))
		throw new Error(`EasScan returned invalid ${label}`)
}

const assertAttestation = (
	attestation: EasScanAttestation
) => {
	assertEnvelope(
		'attestation envelope',
		easScanAttestationEnvelope,
		attestation
	)

	if (
		(!attestation.revocable && attestation.revocationTime !== 0)
		|| attestation.revoked !== (attestation.revocationTime !== 0)
	)
		throw new Error('EasScan returned invalid attestation lifecycle')
}

const assertSchema = (
	schema: EasScanSchema
) => {
	assertEnvelope(
		'schema registration',
		easScanSchemaEnvelope,
		schema
	)
}

const countAttestations = async ({
	network,
	where,
}: {	network: string
	where: VariablesOf<typeof EasScanAttestationCount>['where']
}) => {
	const response = assertEnvelope(
		'attestation count',
		easScanAttestationCountEnvelope,
		await queryEasScan(easScanBindingForNetwork(network), EasScanAttestationCount, {
			where,
		})
	)

	const count = response.aggregateAttestation._count._all
	if (count == null)
		throw new Error('EasScan returned invalid attestation count')

	return count
}

const listAttestations = async ({
	network,
	where,
	skip,
	take,
}: {	network: string
	where: VariablesOf<typeof EasScanAttestations>['where']
	skip: number
	take: number
}) => {
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('EasScan skip must be a nonnegative safe integer')

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error('EasScan take must be between 1 and 100')

	const response = assertEnvelope(
		'attestations page',
		easScanAttestationsPageEnvelope,
		await queryEasScan(easScanBindingForNetwork(network), EasScanAttestations, {
			where,
			skip,
			take,
		})
	)

	if (response.attestations.length > take)
		throw new Error('EasScan returned invalid attestation page')

	const attestationUids = new Set<string>()

	for (const attestation of response.attestations) {
		assertAttestation(attestation)

		const uid = attestation.id.toLowerCase()

		if (attestationUids.has(uid))
			throw new Error('EasScan returned duplicate attestations')

		attestationUids.add(uid)
	}

	return response.attestations
}

export const getAttestation = async ({
	network,
	uid,
}: {	network: string
	uid: string
}) => {
	assertUid(uid, 'requested attestation UID')

	const response = await queryEasScan(easScanBindingForNetwork(network), EasScanAttestation, {
		where: {
			id: uid,
		},
	})

	if (response === undefined)
		throw new Error('EasScan returned no attestation response')

	if (response.attestation === null)
		return null

	assertAttestation(response.attestation)

	if (response.attestation.id.toLowerCase() !== uid.toLowerCase())
		throw new Error('EasScan returned a foreign attestation')

	return response.attestation
}

export const getSchema = async ({
	network,
	schemaUid,
}: {	network: string
	schemaUid: string
}) => {
	assertUid(schemaUid, 'requested schema UID')

	const response = await queryEasScan(easScanBindingForNetwork(network), EasScanSchema, {
		where: {
			id: schemaUid,
		},
	})

	if (response === undefined)
		throw new Error('EasScan returned no schema response')

	if (response.schema === null)
		return null

	assertSchema(response.schema)

	if (response.schema.id.toLowerCase() !== schemaUid.toLowerCase())
		throw new Error('EasScan returned a foreign schema')

	return response.schema
}

/** Network-scoped schema catalog page (APP still needed for Network.$$easSchemas enrollment). */
export const listSchemas = async ({
	network,
	skip = 0,
	take = 100,
}: {	network: string
	skip?: number
	take?: number
}) => {
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('EasScan skip must be a nonnegative safe integer')

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error('EasScan take must be between 1 and 100')

	const response = assertEnvelope(
		'schemas page',
		easScanSchemasPageEnvelope,
		await queryEasScan(easScanBindingForNetwork(network), EasScanSchemas, {
			skip,
			take,
		})
	)

	if (response.schemas.length > take)
		throw new Error('EasScan returned invalid schema page')

	const schemaUids = new Set<string>()

	for (const schema of response.schemas) {
		assertSchema(schema)

		const schemaUid = schema.id.toLowerCase()
		if (schemaUids.has(schemaUid))
			throw new Error('EasScan returned duplicate schemas')

		schemaUids.add(schemaUid)
	}

	return response.schemas
}

export const getAttestationsByAttester = ({
	network,
	attester,
	skip = 0,
	take = 100,
}: {	network: string
	attester: string
	skip?: number
	take?: number
}) => {
	assertAddress(attester, 'requested attester')

	return listAttestations({
		network,
		where: {
			attester: {
				equals: attester,
			},
		},
		skip,
		take,
	}).then((attestations) => {
		if (attestations.some((attestation) => attestation.attester.toLowerCase() !== attester.toLowerCase()))
			throw new Error('EasScan returned an attestation from a foreign attester')

		return attestations
	})
}

export const getAttestationsByRecipient = ({
	network,
	recipient,
	skip = 0,
	take = 100,
}: {	network: string
	recipient: string
	skip?: number
	take?: number
}) => {
	assertAddress(recipient, 'requested recipient')

	return listAttestations({
		network,
		where: {
			recipient: {
				equals: recipient,
			},
		},
		skip,
		take,
	}).then((attestations) => {
		if (attestations.some((attestation) => attestation.recipient.toLowerCase() !== recipient.toLowerCase()))
			throw new Error('EasScan returned an attestation for a foreign recipient')

		return attestations
	})
}

export const getAttestationsBySchema = ({
	network,
	schemaUid,
	skip = 0,
	take = 100,
}: {	network: string
	schemaUid: string
	skip?: number
	take?: number
}) => {
	assertUid(schemaUid, 'requested schema UID')

	return listAttestations({
		network,
		where: {
			schemaId: {
				equals: schemaUid,
			},
		},
		skip,
		take,
	}).then((attestations) => {
		if (attestations.some((attestation) => attestation.schemaId.toLowerCase() !== schemaUid.toLowerCase()))
			throw new Error('EasScan returned an attestation for a foreign schema')

		return attestations
	})
}

export const countAttestationsByAttester = ({
	network,
	attester,
}: {	network: string
	attester: string
}) => {
	assertAddress(attester, 'requested attester')

	return countAttestations({
		network,
		where: {
			attester: {
				equals: attester,
			},
		},
	})
}

export const countAttestationsByRecipient = ({
	network,
	recipient,
}: {	network: string
	recipient: string
}) => {
	assertAddress(recipient, 'requested recipient')

	return countAttestations({
		network,
		where: {
			recipient: {
				equals: recipient,
			},
		},
	})
}

export const countAttestationsBySchema = ({
	network,
	schemaUid,
}: {	network: string
	schemaUid: string
}) => {
	assertUid(schemaUid, 'requested schema UID')

	return countAttestations({
		network,
		where: {
			schemaId: {
				equals: schemaUid,
			},
		},
	})
}
