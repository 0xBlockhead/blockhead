import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getAccount = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const getLatestBlock = vi.hoisted(() => vi.fn())
const getNodeInfo = vi.hoisted(() => vi.fn())
const getSyncing = vi.hoisted(() => vi.fn())
const getTx = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Mintscan/Rest/queries.ts', () => ({
	getAccount,
	getBlock,
	getLatestBlock,
	getNodeInfo,
	getSyncing,
	getTx,
}))

const { default: mintscan } = await import('$/resolvers/Mintscan.ts')
const accountResolver = mintscan.resolvers.find((resolver) => resolver.entityType === EntityType.CosmosAccount)
const accountTimestampResolver = mintscan.resolvers.find((resolver) => resolver.entityType === EntityType.CosmosAccount_Timestamp)
const blockResolver = mintscan.resolvers.find((resolver) => resolver.entityType === EntityType.CosmosBlock)
const transactionResolver = mintscan.resolvers.find((resolver) => resolver.entityType === EntityType.CosmosTransaction)
const messageResolver = mintscan.resolvers.find((resolver) => resolver.entityType === EntityType.CosmosMessage)
const networkTimestampListResolver = mintscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))
const networkBlocksResolver = mintscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$blocks' in resolver.projections.Cosmos
))

const resolveAccount = (
	accountResolver != null && 'NetworkAddress' in accountResolver.resolve ?
		accountResolver.resolve.NetworkAddress.resolve
	:
		undefined
)
const resolveAccountTimestamp = (
	accountTimestampResolver != null && 'AccountTimestampMsSource' in accountTimestampResolver.resolve ?
		accountTimestampResolver.resolve.AccountTimestampMsSource.resolve
	:
		undefined
)
const resolveBlock = (
	blockResolver != null && 'NetworkHeight' in blockResolver.resolve ?
		blockResolver.resolve.NetworkHeight.resolve
	:
		undefined
)
const resolveTransaction = (
	transactionResolver != null && 'NetworkTxHash' in transactionResolver.resolve ?
		transactionResolver.resolve.NetworkTxHash.resolve
	:
		undefined
)
const resolveMessage = (
	messageResolver != null && 'TransactionIndexInTransaction' in messageResolver.resolve ?
		messageResolver.resolve.TransactionIndexInTransaction.resolve
	:
		undefined
)
const resolveNetworkTimestamps = (
	networkTimestampListResolver != null && 'Slug' in networkTimestampListResolver.resolve ?
		networkTimestampListResolver.resolve.Slug.resolve
	:
		undefined
)
const resolveNetworkBlocks = (
	networkBlocksResolver != null && 'Slug' in networkBlocksResolver.resolve ?
		networkBlocksResolver.resolve.Slug.resolve
	:
		undefined
)

if (resolveAccount == null)
	throw new Error('Mintscan Cosmos account resolver is not registered')
if (resolveAccountTimestamp == null)
	throw new Error('Mintscan Cosmos account timestamp resolver is not registered')
if (resolveBlock == null)
	throw new Error('Mintscan Cosmos block resolver is not registered')
if (resolveTransaction == null)
	throw new Error('Mintscan Cosmos transaction resolver is not registered')
if (resolveMessage == null)
	throw new Error('Mintscan Cosmos message resolver is not registered')
if (resolveNetworkTimestamps == null)
	throw new Error('Mintscan Network $$timestamps resolver is not registered')
if (resolveNetworkBlocks == null)
	throw new Error('Mintscan Network $$blocks resolver is not registered')

const account = {
	$network: {
		slug: 'cosmos',
	},
	address: 'cosmos1account',
} satisfies EntitySelector<typeof schema, EntityType.CosmosAccount>
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_MINTSCAN_API_KEY: 'configured token',
	},
}

const tipBlock = {
	block_id: {
		hash: 'A'.repeat(64),
	},
	block: {
		header: {
			height: '24681012',
			time: '2026-07-23T04:48:08Z',
			proposer_address: 'proposer',
		},
		data: {
			txs: [
				'tx1',
				'tx2',
			],
		},
	},
}

describe('Mintscan Cosmos Hub resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('registers tip and enrolled Cosmos explorer resolvers', () => {
		expect(mintscan).toMatchObject({
			source: Source.Mintscan,
		})
		expect(mintscan.resolvers).toHaveLength(7)
		expect(accountResolver?.entityType).toBe(EntityType.CosmosAccount)
		expect(accountTimestampResolver?.entityType).toBe(EntityType.CosmosAccount_Timestamp)
		expect(blockResolver?.entityType).toBe(EntityType.CosmosBlock)
		expect(transactionResolver?.entityType).toBe(EntityType.CosmosTransaction)
		expect(messageResolver?.entityType).toBe(EntityType.CosmosMessage)
		expect(mintscan.resolvers.some((resolver) => resolver.entityType === EntityType.Network_Timestamp)).toBe(false)
	})

	it('reads account and block concurrently and preserves lossless account counters', async () => {
		const accountRequest = Promise.withResolvers<{
			account: {
				address: string
				account_number: string
				sequence: string
			}
		}>()
		const blockRequest = Promise.withResolvers<typeof tipBlock>()
		getAccount.mockReturnValue(accountRequest.promise)
		getLatestBlock.mockReturnValue(blockRequest.promise)

		const result = resolveAccount(account, context)
		await vi.waitFor(() => {
			expect(getAccount).toHaveBeenCalledWith(context.publicEnv, {
				network: 'cosmos',
				address: account.address,
			})
			expect(getLatestBlock).toHaveBeenCalledWith(context.publicEnv, {
				network: 'cosmos',
			})
		})

		accountRequest.resolve({
			account: {
				address: account.address,
				account_number: '900719925474099312345',
				sequence: '123456789012345678901',
			},
		})
		blockRequest.resolve(tipBlock)

		await expect(result).resolves.toEqual({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$account: account,
					timestampMs: 1_784_782_088_000,
					source: Source.Mintscan,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: {
						[EntityMetaKey.Selector]: account,
					},
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: 900719925474099312345n,
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: 123456789012345678901n,
				},
			}],
		})
	})

	it('resolves account timestamp facets without a second latest-block fetch', async () => {
		getAccount.mockResolvedValue({
			account: {
				address: account.address,
				account_number: '11',
				sequence: '22',
			},
		})

		await expect(resolveAccountTimestamp({
			$account: account,
			timestampMs: 1_784_782_088_000,
			source: Source.Mintscan,
		}, context)).resolves.toEqual({
			$account: {
				[EntityMetaKey.Selector]: account,
			},
			timestampMs: 1_784_782_088_000,
			source: Source.Mintscan,
			accountNumber: 11n,
			sequence: 22n,
		})
		expect(getLatestBlock).not.toHaveBeenCalled()
		expect(getBlock).not.toHaveBeenCalled()
	})

	it('maps Cosmos blocks by height through the LCD proxy', async () => {
		getBlock.mockResolvedValue({
			block_id: {
				hash: 'B'.repeat(64),
			},
			block: {
				header: {
					height: '24681012',
					time: '2026-07-23T04:48:08Z',
					proposer_address: 'proposer',
				},
				data: {
					txs: [
						'tx1',
						'tx2',
					],
				},
			},
		})

		await expect(resolveBlock({
			$network: account.$network,
			height: 24681012n,
		}, context)).resolves.toEqual({
			hash: 'B'.repeat(64),
			proposerConsensusAddress: 'proposer',
			timestampMs: 1_784_782_088_000,
			transactionCount: 2,
		})
		expect(getBlock).toHaveBeenCalledWith(context.publicEnv, {
			network: 'cosmos',
			height: 24681012n,
		})
	})

	it('embeds network tip observations from latest block, node info, and syncing', async () => {
		getLatestBlock.mockResolvedValue(tipBlock)
		getNodeInfo.mockResolvedValue({
			default_node_info: {
				network: 'cosmoshub-4',
			},
			application_version: {
				app_name: 'gaiad',
				version: 'v15.0.0',
				cosmos_sdk_version: 'v0.47.0',
			},
		})
		getSyncing.mockResolvedValue({
			syncing: false,
		})

		await expect(resolveNetworkTimestamps(account.$network, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				timestampMs: 1_784_782_088_000,
				source: Source.Mintscan,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Account],
				[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [NetworkExecutionModel.CosmosSdk],
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockHeight')]: 24681012n,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockHash')]: 'A'.repeat(64),
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockTimeMs')]: 1_784_782_088_000,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockTransactionCount')]: 2,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'chainId')]: 'cosmoshub-4',
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'nodeNetwork')]: 'cosmoshub-4',
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'applicationName')]: 'gaiad',
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'applicationVersion')]: 'v15.0.0',
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'cosmosSdkVersion')]: 'v0.47.0',
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'isSyncing')]: false,
			},
		}])
	})

	it('lists tip-enriched Network $$blocks', async () => {
		getLatestBlock.mockResolvedValue(tipBlock)
		await expect(resolveNetworkBlocks(account.$network, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					height: 24681012n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'hash')]: 'A'.repeat(64),
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'proposerConsensusAddress')]: 'proposer',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'timestampMs')]: 1_784_782_088_000,
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'transactionCount')]: 2,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					height: 24681011n,
				},
			},
		])
	})

	it('projects enrolled Cosmos transaction and message fields from getTx', async () => {
		getTx.mockResolvedValue({
			tx: {
				body: {
					memo: 'mintscan',
					timeout_height: '10',
					messages: [
						{
							'@type': '/cosmos.bank.v1beta1.MsgSend',
							from_address: 'cosmos1sender',
						},
						{
							'@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
							sender: 'cosmos1sender',
							contract: 'cosmos1contract',
						},
					],
				},
				auth_info: {
					fee: {
						amount: [
							{
								denom: 'uatom',
								amount: '1000',
							},
						],
						gas_limit: '200000',
					},
				},
				signatures: [
					'sig',
				],
			},
			tx_response: {
				height: '24681012',
				txhash: 'ABCD',
				code: 0,
				codespace: '',
				gas_wanted: '200000',
				gas_used: '100000',
				raw_log: '[]',
				events: [
					{
						type: 'transfer',
					},
					{
						type: 'message',
					},
				],
			},
		})

		const transactionSelector = {
			$network: account.$network,
			txHash: 'ABCD',
		}
		await expect(resolveTransaction(transactionSelector, context)).resolves.toEqual({
			$block: {
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					height: 24681012n,
				},
			},
			code: 0,
			codespace: '',
			gasWanted: 200000n,
			gasUsed: 100000n,
			feeAmount: [
				{
					denom: 'uatom',
					amount: 1000n,
				},
			],
			feeGasLimit: 200000n,
			memo: 'mintscan',
			timeoutHeight: 10n,
			signerAddresses: [
				'cosmos1sender',
			],
			signatures: [
				'sig',
			],
			rawLog: '[]',
			eventTypes: [
				'transfer',
				'message',
			],
			$$messages: [
				{
					[EntityMetaKey.Selector]: {
						$transaction: transactionSelector,
						indexInTransaction: 0,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CosmosMessage, [], 'typeUrl')]: '/cosmos.bank.v1beta1.MsgSend',
						[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: {
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								address: 'cosmos1sender',
							},
						},
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$transaction: transactionSelector,
						indexInTransaction: 1,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CosmosMessage, [], 'typeUrl')]: '/cosmwasm.wasm.v1.MsgExecuteContract',
						[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: {
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								address: 'cosmos1sender',
							},
						},
						[entityFieldAddressKey(EntityType.CosmosMessage, [], '$contract')]: {
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								address: 'cosmos1contract',
							},
						},
					},
				},
			],
		})

		await expect(resolveMessage({
			$transaction: transactionSelector,
			indexInTransaction: 1,
		}, context)).resolves.toEqual({
			typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					address: 'cosmos1sender',
				},
			},
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					address: 'cosmos1contract',
				},
			},
		})
	})

	it('rejects an account response for another subject', async () => {
		getAccount.mockResolvedValue({
			account: {
				address: 'cosmos1foreign',
				account_number: '1',
				sequence: '2',
			},
		})
		getLatestBlock.mockResolvedValue(tipBlock)

		await expect(resolveAccount(account, context)).rejects.toThrow(
			'Mintscan: account response does not match the subject'
		)
	})

	it.each([
		{
			accountNumber: '01',
			sequence: '2',
			time: '2026-07-23T04:48:08Z',
			error: 'Mintscan: invalid account number',
		},
		{
			accountNumber: '1',
			sequence: '2.5',
			time: '2026-07-23T04:48:08Z',
			error: 'Mintscan: invalid account sequence',
		},
		{
			accountNumber: '1',
			sequence: '2',
			time: 'not-a-time',
			error: 'Mintscan: latest block has an invalid timestamp',
		},
	])('rejects malformed source values without lossy coercion', async ({
		accountNumber,
		sequence,
		time,
		error,
	}) => {
		getAccount.mockResolvedValue({
			account: {
				address: account.address,
				account_number: accountNumber,
				sequence,
			},
		})
		getLatestBlock.mockResolvedValue({
			block_id: {
				hash: 'A'.repeat(64),
			},
			block: {
				header: {
					height: '1',
					time,
					proposer_address: 'proposer',
				},
				data: {},
			},
		})

		await expect(resolveAccount(account, context)).rejects.toThrow(error)
	})

	it('rejects mismatched block heights and non-Cosmos-Hub selectors before useful I/O', async () => {
		getBlock.mockResolvedValue({
			block_id: {
				hash: 'C'.repeat(64),
			},
			block: {
				header: {
					height: '1',
					time: '2026-07-23T04:48:08Z',
					proposer_address: 'proposer',
				},
				data: {},
			},
		})

		await expect(resolveBlock({
			$network: account.$network,
			height: 24681012n,
		}, context)).rejects.toThrow('Mintscan: block response does not match the subject height')

		await expect(resolveAccount({
			$network: {
				slug: 'osmosis',
			},
			address: 'osmo1account',
		}, context)).rejects.toThrow('Mintscan: unsupported network')
		expect(getAccount).not.toHaveBeenCalled()
		expect(getLatestBlock).not.toHaveBeenCalled()
	})
})
