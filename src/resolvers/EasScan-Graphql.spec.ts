import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAttestation,
	getAttestationsBySchema,
	getSchema,
} = vi.hoisted(() => ({
	getAttestation: vi.fn(),
	getAttestationsBySchema: vi.fn(),
	getSchema: vi.fn(),
}))

vi.mock('$/sources/EasScan/Graphql/queries.ts', () => ({
	getAttestation,
	getAttestationsBySchema,
	getSchema,
}))

const {
	easAttestationResolver,
	easAttestationTimestampResolver,
	easSchemaAttestationsResolver,
	easSchemaResolver,
} = await import('$/resolvers/EasScan-Graphql.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
		offset: 3,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const
const uid = '0x1111111111111111111111111111111111111111111111111111111111111111'
const schemaUid = '0x2222222222222222222222222222222222222222222222222222222222222222'
const transactionHash = '0x5555555555555555555555555555555555555555555555555555555555555555'
const attester = '0x3333333333333333333333333333333333333333'
const recipient = '0x4444444444444444444444444444444444444444'
const zeroUid = '0x0000000000000000000000000000000000000000000000000000000000000000'

const attestation = {
	id: uid,
	schemaId: schemaUid,
	attester,
	recipient,
	refUID: zeroUid,
	revocable: true,
	revoked: true,
	revocationTime: 1_700_000_100,
	expirationTime: 1_700_000_200,
	time: 1_700_000_000,
	timeCreated: 1_700_000_000,
	data: '0x1234',
	decodedDataJson: '[]',
	txid: transactionHash,
	ipfsHash: '',
	isOffchain: false,
}

beforeEach(() => {
	vi.restoreAllMocks()
	getAttestation.mockReset()
	getAttestationsBySchema.mockReset()
	getSchema.mockReset()
})

describe('EasScan GraphQL resolvers', () => {
	it('materializes an attestation and its exact EVM relationships', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getAttestation.mockResolvedValue(attestation)

		await expect(easAttestationResolver.resolve.NetworkUid.resolve({
			$network: network,
			uid,
		}, context)).resolves.toEqual({
			schemaUid,
			$schema: {
				[EntityMetaKey.Selector]: {
					$network: network,
					schemaUid,
				},
			},
			recipient,
			$recipientAccount: {
				[EntityMetaKey.Selector]: {
					$network: network,
					$actor: {
						address: recipient,
					},
				},
			},
			attester,
			$attesterAccount: {
				[EntityMetaKey.Selector]: {
					$network: network,
					$actor: {
						address: attester,
					},
				},
			},
			attestedAt: 1_700_000_000,
			expirationTime: 1_700_000_200,
			revocable: true,
			data: '0x1234',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$attestation: {
						$network: network,
						uid,
					},
					timestampMs: 1_800_000_000_000,
					source: Source.EasScan_Graphql,
				},
			}],
		})
		expect(getAttestation).toHaveBeenCalledWith(expect.objectContaining({
			network: 'eip155:1',
			uid,
		}))
	})

	it('materializes observation state from the same attestation contract', async () => {
		getAttestation.mockResolvedValue(attestation)

		await expect(easAttestationTimestampResolver.resolve.AttestationTimestampMsSource.resolve({
			$attestation: {
				$network: network,
				uid,
			},
			timestampMs: 1_800_000_000_000,
			source: Source.EasScan_Graphql,
		}, context)).resolves.toEqual({
			revoked: true,
			revocationTime: 1_700_000_100,
			valid: false,
			expired: true,
			transactionHash,
		})
	})

	it('rejects an observation before attestation creation', async () => {
		getAttestation.mockResolvedValue(attestation)

		await expect(easAttestationTimestampResolver.resolve.AttestationTimestampMsSource.resolve({
			$attestation: {
				$network: network,
				uid,
			},
			timestampMs: 1_699_999_999_999,
			source: Source.EasScan_Graphql,
		}, context)).rejects.toThrow('observation precedes attestation creation')
	})

	it('materializes a schema registration with authoritative attestation count', async () => {
		getSchema.mockResolvedValue({
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
		})

		const snapshot = await easSchemaResolver.resolve.NetworkSchemaUid.resolve({
			$network: network,
			schemaUid,
		}, context)

		expect(snapshot).toEqual({
			schema: 'address subject, bool verified',
			resolver: recipient,
			$resolverContract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: recipient,
				},
			},
			revocable: true,
			registerer: attester,
			$registererAccount: {
				[EntityMetaKey.Selector]: {
					$network: network,
					$actor: {
						address: attester,
					},
				},
			},
			registeredAt: 1_699_000_000,
			registeredTransactionHash: transactionHash,
			registeredLogIndex: 42,
			attestationCount: 7,
		})
		expect(easSchemaResolver.projections.$$attestations.resolveCount(snapshot, context)).toBe(7)
		expect(getAttestationsBySchema).not.toHaveBeenCalled()
	})

	it('loads bounded schema attestation references without schema registration I/O', async () => {
		getAttestationsBySchema.mockResolvedValue([attestation])

		await expect(easSchemaAttestationsResolver.resolve.NetworkSchemaUid.resolve({
			$network: network,
			schemaUid,
		}, context)).resolves.toEqual({
			$$attestations: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					uid,
				},
			}],
		})
		expect(getAttestationsBySchema).toHaveBeenCalledWith(expect.objectContaining({
			network: 'eip155:1',
			skip: 3,
			take: 2,
		}))
		expect(getSchema).not.toHaveBeenCalled()
	})
})
