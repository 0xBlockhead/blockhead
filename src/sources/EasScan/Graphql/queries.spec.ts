import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import {
	getAttestation,
	getAttestationsByAttester,
	getAttestationsByRecipient,
	getAttestationsBySchema,
} from '$/sources/EasScan/Graphql/queries.ts'

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql: vi.fn(),
}))

const binding = {
	source: Source.EasScan_Graphql,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: 'eip155:1',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://easscan.org/graphql',
		origin: 'https://easscan.org',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.Graphql,
	apiFamily: ApiFamily.GraphqlHttp,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.None,
	}],
} as const satisfies SourceBinding

const uid = `0x${'1'.repeat(64)}`
const schemaUid = `0x${'2'.repeat(64)}`
const refUid = `0x${'0'.repeat(64)}`
const attester = '0x3333333333333333333333333333333333333333'
const recipient = '0x4444444444444444444444444444444444444444'

const attestation = {
	id: uid,
	schemaId: schemaUid,
	attester,
	recipient,
	refUID: refUid,
	revocable: true,
	revocationTime: 1_700_000_100,
	expirationTime: 1_800_000_000,
	time: 1_700_000_000,
	data: '0x1234',
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('EasScan GraphQL public reads', () => {
	it('gets an exact network-scoped attestation lifecycle', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({
			attestation,
		})

		await expect(getAttestation({
			binding,
			network: 'eip155:1',
			uid,
		})).resolves.toEqual(attestation)
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			binding,
			variables: {
				where: {
					id: uid,
				},
			},
		}))
	})

	it('keeps attester, recipient, and schema pages bounded and exact', async () => {
		vi.mocked(graphql)
			.mockResolvedValueOnce({
				attestations: [attestation],
			})
			.mockResolvedValueOnce({
				attestations: [attestation],
			})
			.mockResolvedValueOnce({
				attestations: [attestation],
			})

		await expect(getAttestationsByAttester({
			binding,
			network: 'eip155:1',
			attester,
			skip: 25,
			take: 10,
		})).resolves.toEqual([attestation])
		await expect(getAttestationsByRecipient({
			binding,
			network: 'eip155:1',
			recipient,
		})).resolves.toEqual([attestation])
		await expect(getAttestationsBySchema({
			binding,
			network: 'eip155:1',
			schemaUid,
		})).resolves.toEqual([attestation])
		expect(vi.mocked(graphql).mock.calls[0]?.[0].variables).toEqual({
			where: {
				attester: {
					equals: attester,
				},
			},
			skip: 25,
			take: 10,
		})
	})

	it('rejects global bindings, foreign subjects, and over-broad pages', async () => {
		await expect(getAttestation({
			binding: {
				...binding,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eas-scan',
				},
			},
			network: 'eip155:1',
			uid,
		})).rejects.toThrow('exact CAIP-2 network binding')

		vi.mocked(graphql).mockResolvedValueOnce({
			attestations: [{
				...attestation,
				recipient: attester,
			}],
		})
		await expect(getAttestationsByRecipient({
			binding,
			network: 'eip155:1',
			recipient,
		})).rejects.toThrow('foreign recipient')
		await expect(getAttestationsBySchema({
			binding,
			network: 'eip155:1',
			schemaUid,
			take: 101,
		})).rejects.toThrow('between 1 and 100')
		expect(graphql).toHaveBeenCalledTimes(1)
	})

	it('fails closed on malformed revocation and duplicate identities', async () => {
		vi.mocked(graphql)
			.mockResolvedValueOnce({
				attestation: {
					...attestation,
					revocable: false,
				},
			})
			.mockResolvedValueOnce({
				attestations: [
					attestation,
					attestation,
				],
			})

		await expect(getAttestation({
			binding,
			network: 'eip155:1',
			uid,
		})).rejects.toThrow('invalid attestation lifecycle')
		await expect(getAttestationsByAttester({
			binding,
			network: 'eip155:1',
			attester,
		})).rejects.toThrow('duplicate attestations')
	})
})
