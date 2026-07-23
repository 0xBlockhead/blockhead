import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type {
	EasScanAttestation,
	EasScanAttestationResponse,
	EasScanAttestationsResponse,
} from '$/sources/EasScan/Graphql/types.ts'

const bytesPattern = /^0x(?:[0-9a-f]{2})*$/i
const bytes32Pattern = /^0x[0-9a-f]{64}$/i
const evmAddressPattern = /^0x[0-9a-f]{40}$/i

const attestationFields = `
	id
	schemaId
	attester
	recipient
	refUID
	revocable
	revocationTime
	expirationTime
	time
	data
`

const assertNetworkBinding = (
	binding: SourceBinding,
	network: string
) => {
	if (
		binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== network
	)
		throw new Error('EasScan GraphQL requires an exact CAIP-2 network binding')
}

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
	assertUid(attestation.id, 'attestation UID')
	assertUid(attestation.schemaId, 'schema UID')
	assertUid(attestation.refUID, 'reference UID')
	assertAddress(attestation.attester, 'attester')
	assertAddress(attestation.recipient, 'recipient')

	if (
		!bytesPattern.test(attestation.data)
		|| !Number.isSafeInteger(attestation.time)
		|| attestation.time < 0
		|| !Number.isSafeInteger(attestation.expirationTime)
		|| attestation.expirationTime < 0
		|| !Number.isSafeInteger(attestation.revocationTime)
		|| attestation.revocationTime < 0
		|| (!attestation.revocable && attestation.revocationTime !== 0)
	)
		throw new Error('EasScan returned invalid attestation lifecycle')
}

const listAttestations = async ({
	binding,
	network,
	where,
	skip,
	take,
}: {
	binding: SourceBinding
	network: string
	where:
		| {
			attester: {
				equals: string
			}
		}
		| {
			recipient: {
				equals: string
			}
		}
		| {
			schemaId: {
				equals: string
			}
		}
	skip: number
	take: number
}) => {
	assertNetworkBinding(binding, network)

	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('EasScan skip must be a nonnegative safe integer')

	if (!Number.isSafeInteger(take) || take < 1 || take > 100)
		throw new Error('EasScan take must be between 1 and 100')

	const response = await graphql<EasScanAttestationsResponse>({
		binding,
		query: `query Attestations($where: AttestationWhereInput!, $skip: Int!, $take: Int!) {
			attestations(
				where: $where
				skip: $skip
				take: $take
				orderBy: { time: desc }
			) {
				${attestationFields}
			}
		}`,
		variables: {
			where,
			skip,
			take,
		},
	})

	if (response === undefined || response.attestations.length > take)
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
	binding,
	network,
	uid,
}: {
	binding: SourceBinding
	network: string
	uid: string
}) => {
	assertNetworkBinding(binding, network)
	assertUid(uid, 'requested attestation UID')

	const response = await graphql<EasScanAttestationResponse>({
		binding,
		query: `query Attestation($where: AttestationWhereUniqueInput!) {
			attestation(where: $where) {
				${attestationFields}
			}
		}`,
		variables: {
			where: {
				id: uid,
			},
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

export const getAttestationsByAttester = ({
	binding,
	network,
	attester,
	skip = 0,
	take = 100,
}: {
	binding: SourceBinding
	network: string
	attester: string
	skip?: number
	take?: number
}) => {
	assertAddress(attester, 'requested attester')

	return listAttestations({
		binding,
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
	binding,
	network,
	recipient,
	skip = 0,
	take = 100,
}: {
	binding: SourceBinding
	network: string
	recipient: string
	skip?: number
	take?: number
}) => {
	assertAddress(recipient, 'requested recipient')

	return listAttestations({
		binding,
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
	binding,
	network,
	schemaUid,
	skip = 0,
	take = 100,
}: {
	binding: SourceBinding
	network: string
	schemaUid: string
	skip?: number
	take?: number
}) => {
	assertUid(schemaUid, 'requested schema UID')

	return listAttestations({
		binding,
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
