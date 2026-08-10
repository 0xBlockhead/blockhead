import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const getCall = vi.hoisted(() => vi.fn())
const getErc4626VaultIdentity = vi.hoisted(() => vi.fn())
const getErc4626VaultBlockState = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [{
				diagnosticLabel: 'mock-rpc',
				getCall,
			}],
		},
	},
}))

vi.mock('$/sources/Erc4626/Contracts/queries.ts', () => ({
	getErc4626VaultIdentity,
	getErc4626VaultBlockState,
}))

const { erc4626Resolvers } = await import('$/resolvers/Voltaire/Erc4626.ts')
const { default: voltaireJsonRpc } = await import('$/resolvers/Voltaire-JsonRpc.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155' as const,
		reference: '1',
	},
}
const vaultAddress = '0x1111111111111111111111111111111111111111'
const assetAddress = '0x2222222222222222222222222222222222222222'
const $contract = {
	$network: ethereumNetwork,
	address: vaultAddress,
}
const $vault = { $contract }


describe('Voltaire ERC-4626 resolvers', () => {
	beforeEach(() => {
		getCall.mockReset()
		getErc4626VaultIdentity.mockReset()
		getErc4626VaultBlockState.mockReset()
	})

	it('registers only vault identity and exact-block state resolvers', () => {
		expect(erc4626Resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.Erc4626Vault,
			EntityType.Erc4626Vault_Block,
		])
		expect(voltaireJsonRpc.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.Erc4626Vault
			|| resolver.entityType === EntityType.Erc4626Vault_Block
		))).toEqual([...erc4626Resolvers])
	})

	it('materializes vault network, asset, and share-token identity', async () => {
		getErc4626VaultIdentity.mockResolvedValue({
			vaultAddress,
			assetAddress,
		})
		const resolver = erc4626Resolvers[0]
		const snapshot = await resolver.resolve.Contract.resolve({ $contract }, context)

		expect(resolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: ethereumNetwork,
		})
		expect(resolver.projections.$asset(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				type: CoinInstanceType.Erc20Token,
				$contract: {
					$network: ethereumNetwork,
					address: assetAddress,
				},
			},
		})
		expect(resolver.projections.$shareToken(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				type: CoinInstanceType.Erc20Token,
				$contract,
			},
		})
		expect(getErc4626VaultIdentity).toHaveBeenCalledWith({
			getCall,
			vaultAddress,
		})
	})

	it('materializes exact-block totals only for the Voltaire source selector', async () => {
		getErc4626VaultBlockState.mockResolvedValue({
			vaultAddress,
			blockNumber: 42n,
			totalAssets: 123n,
			totalSupply: 456n,
		})
		const resolver = erc4626Resolvers[1]
		const snapshot = await resolver.resolve.VaultBlockNumberSource.resolve({
			$vault,
			blockNumber: 42,
			source: Source.Voltaire_JsonRpc,
		}, context)

		expect(resolver.projections.totalAssets(snapshot)).toBe(123n)
		expect(resolver.projections.totalSupply(snapshot)).toBe(456n)
		expect(resolver.resolve.VaultBlockNumberSource.appliesTo).toEqual([{
			source: Source.Voltaire_JsonRpc,
		}])
		expect(getErc4626VaultBlockState).toHaveBeenCalledWith({
			getCall,
			vaultAddress,
			blockNumber: 42n,
		})
	})
})
