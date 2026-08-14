import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LifiChainsResponse,
	LifiStatusResponse,
} from '$/sources/Lifi/Rest/types.ts'

const fetchChains = vi.hoisted(() => vi.fn())
const fetchTransferStatus = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Lifi/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Lifi/Rest/queries.ts')>(),
	fetchChains,
	fetchTransferStatus,
}))

const { default: lifiRest } = await import('$/resolvers/Lifi-Rest.ts')

const transfer = {
	source: Source.Lifi_Rest,
	transferId: 'lifi-transfer-id',
}
const sourceTxHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const destinationTxHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const chains = {
	chains: [
		{
			key: 'eth',
			chainType: 'EVM',
			name: 'Ethereum',
			coin: 'ETH',
			id: 1,
			mainnet: true,
		},
		{
			key: 'opt',
			chainType: 'EVM',
			name: 'Optimism',
			coin: 'ETH',
			id: 10,
			mainnet: true,
		},
	],
} satisfies LifiChainsResponse
const status = {
	sending: {
		txHash: sourceTxHash,
		txLink: 'https://example.com/source',
		amount: '1000000000000000000',
		token: {
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			symbol: 'ETH',
			chainId: 1,
			name: 'Ether',
		},
		chainId: 1,
		timestamp: 1_700_000_000,
	},
	receiving: {
		txHash: destinationTxHash,
		txLink: 'https://example.com/destination',
		amount: '999000000000000000',
		token: {
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			symbol: 'ETH',
			chainId: 10,
			name: 'Ether',
		},
		chainId: 10,
		timestamp: 1_700_000_100,
		gasAmount: '21000',
		gasAmountUSD: '0.42',
	},
	feeCosts: [
		{
			name: 'LI.FI fee',
			amount: '1000',
			amountUSD: '0.01',
			percentage: '0.001',
			included: true,
		},
		{
			name: 'Gas fee',
			amount: '2000',
			amountUSD: '0.02',
			percentage: '0.002',
			included: true,
		},
	],
	status: 'DONE',
	substatus: 'COMPLETED',
	substatusMessage: 'The transfer is complete.',
	tool: 'across',
	transactionId: transfer.transferId,
	fromAddress: '0x1111111111111111111111111111111111111111',
	toAddress: '0x2222222222222222222222222222222222222222',
} satisfies LifiStatusResponse

describe('LI.FI transfer status resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		fetchChains.mockReset()
		fetchTransferStatus.mockReset()
	})

	it('materializes the transfer and one current observation from official status fields', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(fetchTransferStatus).toHaveBeenCalledWith({ txHash: transfer.transferId })
		expect(snapshot).toMatchObject({
			source: Source.Lifi_Rest,
			transferId: transfer.transferId,
			amountIn: 1_000_000_000_000_000_000n,
			amountOut: 999_000_000_000_000_000n,
			railId: 'Across',
			bridgeFeeUsd: '0.03',
			sourceTransactionAtMs: 1_700_000_000_000,
			destinationTransactionAtMs: 1_700_000_100_000,
			transactionLatencyMs: 100_000,
			$sourceTx: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash: sourceTxHash,
				},
			},
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '10',
						},
					},
					txHash: destinationTxHash,
				},
			},
		})
		expect(resolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: 1_700_000_100_000,
				source: Source.Lifi_Rest,
			},
		}])
		expect(resolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
	})

	it('resolves source-tx selectors with fromChain and canonical transactionId', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		const sourceTxTransfer = {
			source: Source.Lifi_Rest,
			$sourceTx: {
				$network: {
					caip2: {
						namespace: 'eip155' as const,
						reference: '1',
					},
				},
				txHash: sourceTxHash,
			},
			logIndex: 0,
		}
		const snapshot = await resolver.resolve.SourceTxSourceLogIndex.resolve(sourceTxTransfer)

		expect(fetchTransferStatus).toHaveBeenCalledWith({
			txHash: sourceTxHash,
			fromChain: '1',
		})
		expect(snapshot.transferId).toBe(transfer.transferId)
	})

	it('rejects status responses that do not identify the requested source transaction', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			...status,
			sending: {
				...status.sending,
				txHash: destinationTxHash,
			},
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTxSourceLogIndex.resolve({
				source: Source.Lifi_Rest,
				$sourceTx: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash: sourceTxHash,
				},
				logIndex: 0,
			})
		).rejects.toThrow('transfer status does not match source transaction')
	})

	it('rejects mismatched transfer ids from official status', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			...status,
			transactionId: 'foreign-transfer-id',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer id does not match status')
	})

	it('rejects malformed EVM identities instead of omitting transfer fields', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			...status,
			sending: {
				...status.sending,
				txHash: 'not-a-transaction-hash',
			},
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('invalid source transaction hash')
	})

	it('projects only status fields present in the official operation', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: 1_700_000_100_000,
			source: Source.Lifi_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'DONE',
			substatus: 'COMPLETED',
			destinationTxHash,
			fillGasFee: 21000n,
			fillGasFeeUsd: '0.42',
		})
		expect(resolver.projections.fillGasFee(snapshot)).toBe(21000n)
		expect(resolver.projections.fillGasFeeUsd(snapshot)).toBe('0.42')
		expect(resolver.projections).not.toHaveProperty('sourceConfirmations')
		expect(resolver.projections).not.toHaveProperty('requiredConfirmations')
		expect(resolver.projections).not.toHaveProperty('relayer')
		expect(resolver.projections).not.toHaveProperty('refundTxHash')
		expect(resolver.projections).not.toHaveProperty('estimatedCompletionMs')
	})

	it('hard-fails BridgeTransfer snapshots for official NOT_FOUND status', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			status: 'NOT_FOUND',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer not found')
	})

	it('hard-fails BridgeTransfer snapshots for official INVALID status', async () => {
		fetchTransferStatus.mockResolvedValue({
			...status,
			status: 'INVALID',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer status invalid')
		expect(fetchChains).not.toHaveBeenCalled()
	})
})

describe('LI.FI network catalog projections', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		fetchChains.mockReset()
	})

	it('projects enrolled name, environment, faucet urls, and native coin instance', async () => {
		fetchChains.mockResolvedValue({
			chains: [{
				key: 'eth',
				chainType: 'EVM',
				name: 'Ethereum',
				coin: 'ETH',
				id: 1,
				mainnet: true,
				logoURI: 'https://example.com/eth.png',
				faucetUrls: [
					'https://faucet.example.com',
					'',
				],
				nativeToken: {
					address: '0x0000000000000000000000000000000000000000',
					decimals: 18,
					symbol: 'ETH',
					chainId: 1,
					name: 'Ether',
				},
				metamask: {
					rpcUrls: [
						'https://rpc.example.com',
					],
					blockExplorerUrls: [
						'https://explorer.example.com',
					],
				},
			}],
		} satisfies LifiChainsResponse)

		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('LI.FI Network name resolver is not registered')

		const snapshot = await resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		})

		expect(snapshot).toMatchObject({
			name: 'Ethereum',
			environment: 'Mainnet',
			iconUrl: 'https://example.com/eth.png',
		})
		expect(resolver.projections.name(snapshot)).toBe('Ethereum')
		expect(resolver.projections.environment(snapshot)).toBe('Mainnet')
		expect(resolver.projections.$$faucetUrls(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				url: 'https://faucet.example.com/',
			},
		}])
		expect(resolver.projections.Evm.$nativeCoinInstance(snapshot)).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				type: 'NativeCurrency',
			},
		})
	})

	it('rejects blank catalog display names', async () => {
		fetchChains.mockResolvedValue({
			chains: [{
				key: 'blank',
				chainType: 'EVM',
				name: '   ',
				coin: 'ETH',
				id: 1,
				mainnet: true,
			}],
		} satisfies LifiChainsResponse)

		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('LI.FI Network name resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		})).rejects.toThrow('chain display name missing')
	})

	it('rejects non-canonical EIP-155 chain references before loading the LI.FI catalog', async () => {
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('LI.FI Network name resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1e0',
			},
		})).rejects.toThrow('invalid eip155 chain id 1e0')
		expect(fetchChains).not.toHaveBeenCalled()
	})
})

describe('LI.FI network applicability', () => {
	it('excludes non-EVM CAIP-2 networks before transport', () => {
		const resolvers = indexResolvers(
			schema,
			[lifiRest],
			new Set([Source.Lifi_Rest])
		).resolverDefinitions.filter((resolver) => resolver.entityType === EntityType.Network)

		expect(resolvers).toHaveLength(2)
		for (const resolver of resolvers) {
			expect(resolver.appliesTo('Caip2', {
				caip2: {
					namespace: 'bip122',
					reference: '000000000019d6689c085ae165831e93',
				},
			})).toBe(false)
			expect(resolver.appliesTo('Caip2', {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			})).toBe(true)
		}
		expect(fetchChains).not.toHaveBeenCalled()
	})
})

describe('LI.FI bridge route step projections', () => {
	it('exposes authoritative $$steps resolveCount from the quote bundle', () => {
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeRoute
			&& '$$steps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeRoute resolver is not registered')

		expect(resolver.projections.$$steps.resolveCount({
			$$steps: [
				{
					[EntityMetaKey.Selector]: {
						$route: {
							fromChainId: 1,
							toChainId: 10,
							fromToken: '0x0',
							toToken: '0x1',
							fromAmount: 1n,
							fromAddress: '0x2',
							slippage: 0.005,
							toAddress: '0x3',
						},
						indexInRoute: 0,
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$route: {
							fromChainId: 1,
							toChainId: 10,
							fromToken: '0x0',
							toToken: '0x1',
							fromAmount: 1n,
							fromAddress: '0x2',
							slippage: 0.005,
							toAddress: '0x3',
						},
						indexInRoute: 1,
					},
				},
			],
		})).toBe(2)

		expect(resolver.projections.$$steps.select({
			$$steps: [{
				[EntityMetaKey.Selector]: {
					$route: {
						fromChainId: 1,
						toChainId: 10,
						fromToken: '0x0',
						toToken: '0x1',
						fromAmount: 1n,
						fromAddress: '0x2',
						slippage: 0.005,
						toAddress: '0x3',
					},
					indexInRoute: 0,
				},
				stepType: 'cross',
				tool: 'across',
				$fromNetwork: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				$toNetwork: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: 'eip155',
							reference: '10',
						},
					},
				},
				railId: BridgeRailId.Across,
				settlementModel: BridgeSettlementModel.IntentFill,
				verificationModel: BridgeVerificationModel.External,
				assetOutcome: BridgeAssetOutcome.LiquidityPoolNative,
			}],
		})).toEqual([{
			[EntityMetaKey.Selector]: {
				$route: {
					fromChainId: 1,
					toChainId: 10,
					fromToken: '0x0',
					toToken: '0x1',
					fromAmount: 1n,
					fromAddress: '0x2',
					slippage: 0.005,
					toAddress: '0x3',
				},
				indexInRoute: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'stepType')]: 'cross',
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'tool')]: 'across',
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$fromNetwork')]: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], '$toNetwork')]: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: 'eip155',
							reference: '10',
						},
					},
				},
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'railId')]: BridgeRailId.Across,
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'settlementModel')]: BridgeSettlementModel.IntentFill,
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'verificationModel')]: BridgeVerificationModel.External,
				[entityFieldAddressKey(EntityType.BridgeRouteStep, [], 'assetOutcome')]: BridgeAssetOutcome.LiquidityPoolNative,
			},
		}])
	})
})
