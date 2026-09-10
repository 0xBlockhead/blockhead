import { readFileSync } from 'node:fs'
import { buildSchema, parse, validate } from 'graphql'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import bindings from '$/sources/EasScan/bindings.ts'
import {
	countAttestationsByAttester,
	countAttestationsByRecipient,
	countAttestationsBySchema,
	getAttestation,
	getAttestationsByAttester,
	getAttestationsByRecipient,
	getAttestationsBySchema,
	getSchema,
	listSchemas,
} from '$/sources/EasScan/Graphql/queries.ts'

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql: vi.fn(),
}))

const binding = bindings[Source.EasScan_Graphql][0]

const uid = `0x${'1'.repeat(64)}`
const schemaUid = `0x${'2'.repeat(64)}`
const refUid = `0x${'0'.repeat(64)}`
const attester = '0x3333333333333333333333333333333333333333'
const recipient = '0x4444444444444444444444444444444444444444'
const transactionHash = `0x${'5'.repeat(64)}`

const attestation = {
	id: uid,
	schemaId: schemaUid,
	attester,
	recipient,
	refUID: refUid,
	revocable: true,
	revoked: true,
	revocationTime: 1_700_000_100,
	expirationTime: 1_800_000_000,
	time: 1_700_000_000,
	timeCreated: 1_700_000_000,
	data: '0x1234',
	decodedDataJson: '[{"name":"subject","value":"0x4444444444444444444444444444444444444444"}]',
	txid: transactionHash,
	ipfsHash: '',
	isOffchain: false,
}

const easSchema = {
	id: schemaUid,
	schema: 'address subject, bool verified',
	creator: attester,
	resolver: recipient,
	revocable: true,
	index: '42',
	txid: transactionHash,
	time: 1_699_000_000,
	_count: {
		attestations: 7,
	},
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('EasScan GraphQL public reads', () => {
	it('validates the emitted schema-list document against the checked-in schema', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({ schemas: [easSchema] })
		await expect(listSchemas({ network: 'eip155:1' })).resolves.toEqual([easSchema])
		const request = vi.mocked(graphql).mock.calls[0]?.[0]
		if (request == null)
			throw new Error('Schema list did not issue a GraphQL request')

		expect(validate(
			buildSchema(readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8')),
			parse(request.query)
		)).toEqual([])
	})

	it('gets an exact network-scoped attestation lifecycle', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({
			attestation,
		})

		await expect(getAttestation({
			network: 'eip155:1',
			uid,
		})).resolves.toEqual(attestation)
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			variables: {
				where: {
					id: uid,
				},
			},
		}))
	})

	it('keeps attester-supplied time separate from later on-chain creation time', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({
			attestation: {
				...attestation,
				time: attestation.time - 30,
			},
		})

		await expect(getAttestation({
			network: 'eip155:1',
			uid,
		})).resolves.toMatchObject({
			time: attestation.time - 30,
			timeCreated: attestation.timeCreated,
		})
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
			network: 'eip155:1',
			attester,
			skip: 25,
			take: 10,
		})).resolves.toEqual([attestation])
		await expect(getAttestationsByRecipient({
			network: 'eip155:1',
			recipient,
		})).resolves.toEqual([attestation])
		await expect(getAttestationsBySchema({
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

	it('gets an exact network-scoped schema registration with attestation count', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({
			schema: easSchema,
		})

		await expect(getSchema({
			network: 'eip155:1',
			schemaUid,
		})).resolves.toEqual(easSchema)
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			variables: {
				where: {
					id: schemaUid,
				},
			},
		}))
	})

	it('counts attestations by attester, recipient, and schema without soft-empty failures', async () => {
		vi.mocked(graphql)
			.mockResolvedValueOnce({
				aggregateAttestation: {
					_count: {
						_all: 3,
					},
				},
			})
			.mockResolvedValueOnce({
				aggregateAttestation: {
					_count: {
						_all: 0,
					},
				},
			})
			.mockResolvedValueOnce({
				aggregateAttestation: {
					_count: {
						_all: 11,
					},
				},
			})

		await expect(countAttestationsByAttester({
			network: 'eip155:1',
			attester,
		})).resolves.toBe(3)
		await expect(countAttestationsByRecipient({
			network: 'eip155:1',
			recipient,
		})).resolves.toBe(0)
		await expect(countAttestationsBySchema({
			network: 'eip155:1',
			schemaUid,
		})).resolves.toBe(11)
		expect(vi.mocked(graphql).mock.calls[2]?.[0].variables).toEqual({
			where: {
				schemaId: {
					equals: schemaUid,
				},
			},
		})
	})

	it('rejects unsupported networks, foreign subjects, and over-broad pages', async () => {
		await expect(getAttestation({
			network: 'eip155:999999',
			uid,
		})).rejects.toThrow('no exact network binding')

		vi.mocked(graphql).mockResolvedValueOnce({
			attestations: [{
				...attestation,
				recipient: attester,
			}],
		})
		await expect(getAttestationsByRecipient({
			network: 'eip155:1',
			recipient,
		})).rejects.toThrow('foreign recipient')
		await expect(getAttestationsBySchema({
			network: 'eip155:1',
			schemaUid,
			take: 101,
		})).rejects.toThrow('between 1 and 100')
		expect(graphql).toHaveBeenCalledTimes(1)
	})

	it('fails closed on malformed revocation, counts, duplicate identities, and arktype envelopes', async () => {
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
			.mockResolvedValueOnce({
				aggregateAttestation: {
					_count: {
						_all: -1,
					},
				},
			})
			.mockResolvedValueOnce({
				schema: {
					...easSchema,
					_count: {
						attestations: -2,
					},
				},
			})
			.mockResolvedValueOnce({
				attestation: {
					...attestation,
					id: '0xdead',
				},
			})
			.mockResolvedValueOnce({
				attestation: {
					...attestation,
					decodedDataJson: 12,
				},
			})

		await expect(getAttestation({
			network: 'eip155:1',
			uid,
		})).rejects.toThrow('invalid attestation lifecycle')
		await expect(getAttestationsByAttester({
			network: 'eip155:1',
			attester,
		})).rejects.toThrow('duplicate attestations')
		await expect(countAttestationsBySchema({
			network: 'eip155:1',
			schemaUid,
		})).rejects.toThrow('invalid attestation count')
		await expect(getSchema({
			network: 'eip155:1',
			schemaUid,
		})).rejects.toThrow('invalid schema registration')
		await expect(getAttestation({
			network: 'eip155:1',
			uid,
		})).rejects.toThrow('invalid attestation envelope')
		await expect(getAttestation({
			network: 'eip155:1',
			uid,
		})).rejects.toThrow('invalid attestation envelope')
	})
})
