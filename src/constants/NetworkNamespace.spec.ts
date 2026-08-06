import {
	describe,
	expect,
	expectTypeOf,
	it,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import {
	networkNamespaceByNamespace,
	networkNamespaces,
} from '$/constants/NetworkNamespace.ts'


const namespaceOrder = [
	NetworkNamespace.Algorand,
	NetworkNamespace.Aptos,
	NetworkNamespace.Avail,
	NetworkNamespace.Avalanche,
	NetworkNamespace.Arweave,
	NetworkNamespace.Bittensor,
	NetworkNamespace.Bitcoin,
	NetworkNamespace.BitcoinCash,
	NetworkNamespace.Cardano,
	NetworkNamespace.Celestia,
	NetworkNamespace.Cosmos,
	NetworkNamespace.Dydx,
	NetworkNamespace.Dogecoin,
	NetworkNamespace.Elements,
	NetworkNamespace.Evm,
	NetworkNamespace.Filecoin,
	NetworkNamespace.Hedera,
	NetworkNamespace.Hyperliquid,
	NetworkNamespace.InternetComputer,
	NetworkNamespace.Kaspa,
	NetworkNamespace.Lightning,
	NetworkNamespace.Litecoin,
	NetworkNamespace.Logos,
	NetworkNamespace.Monero,
	NetworkNamespace.Near,
	NetworkNamespace.Polkadot,
	NetworkNamespace.Quilibrium,
	NetworkNamespace.Solana,
	NetworkNamespace.Starknet,
	NetworkNamespace.Stellar,
	NetworkNamespace.Sui,
	NetworkNamespace.Tron,
	NetworkNamespace.Tezos,
	NetworkNamespace.Ton,
	NetworkNamespace.Xrpl,
	NetworkNamespace.Zcash,
	NetworkNamespace.ZeroG,
] as const satisfies readonly NetworkNamespace[]

const nativeAssetCoinIdByNamespace = {
	[NetworkNamespace.Algorand]: CoinId.ALGO,
	[NetworkNamespace.Aptos]: CoinId.APT,
	[NetworkNamespace.Avail]: undefined,
	[NetworkNamespace.Avalanche]: CoinId.AVAX,
	[NetworkNamespace.Arweave]: CoinId.AR,
	[NetworkNamespace.Bittensor]: CoinId.TAO,
	[NetworkNamespace.Bitcoin]: CoinId.BTC,
	[NetworkNamespace.BitcoinCash]: CoinId.BCH,
	[NetworkNamespace.Cardano]: CoinId.ADA,
	[NetworkNamespace.Celestia]: CoinId.TIA,
	[NetworkNamespace.Cosmos]: CoinId.ATOM,
	[NetworkNamespace.Dydx]: CoinId.DYDX,
	[NetworkNamespace.Dogecoin]: CoinId.DOGE,
	[NetworkNamespace.Elements]: CoinId.BTC,
	[NetworkNamespace.Evm]: CoinId.ETH,
	[NetworkNamespace.Filecoin]: CoinId.FIL,
	[NetworkNamespace.Hedera]: CoinId.HBAR,
	[NetworkNamespace.Hyperliquid]: CoinId.HYPE,
	[NetworkNamespace.InternetComputer]: CoinId.ICP,
	[NetworkNamespace.Kaspa]: CoinId.KAS,
	[NetworkNamespace.Lightning]: undefined,
	[NetworkNamespace.Litecoin]: CoinId.LTC,
	[NetworkNamespace.Logos]: undefined,
	[NetworkNamespace.Monero]: CoinId.XMR,
	[NetworkNamespace.Near]: CoinId.NEAR,
	[NetworkNamespace.Polkadot]: CoinId.DOT,
	[NetworkNamespace.Quilibrium]: CoinId.QUIL,
	[NetworkNamespace.Solana]: CoinId.SOL,
	[NetworkNamespace.Starknet]: CoinId.STRK,
	[NetworkNamespace.Stellar]: CoinId.XLM,
	[NetworkNamespace.Sui]: CoinId.SUI,
	[NetworkNamespace.Tezos]: CoinId.XTZ,
	[NetworkNamespace.Ton]: CoinId.TON,
	[NetworkNamespace.Tron]: CoinId.TRX,
	[NetworkNamespace.Xrpl]: CoinId.XRP,
	[NetworkNamespace.Zcash]: CoinId.ZEC,
	[NetworkNamespace.ZeroG]: CoinId._0G,
} as const satisfies Record<NetworkNamespace, CoinId | undefined>


describe('Network namespace catalog', () => {
	it('covers every namespace exactly once without changing row order', () => {
		expectTypeOf<
			(typeof networkNamespaces)[number]['namespace']
		>().toEqualTypeOf<NetworkNamespace>()

		expect(networkNamespaces.map(({ namespace }) => namespace)).toEqual(namespaceOrder)
		expect(new Set(namespaceOrder).size).toBe(Object.values(NetworkNamespace).length)
		expect([...namespaceOrder].toSorted()).toEqual(
			Object.values(NetworkNamespace).toSorted()
		)
		expect(Object.keys(networkNamespaceByNamespace)).toEqual(namespaceOrder)
	})

	it('owns every native-asset fact and keeps missing stack metadata explicit', () => {
		for (const namespace of namespaceOrder)
			expect(
				networkNamespaceByNamespace[namespace].nativeAssetCoinId
			).toBe(nativeAssetCoinIdByNamespace[namespace])

		expect(
			networkNamespaces
				.filter(({ networkStackId }) => networkStackId == null)
				.map(({ namespace }) => namespace)
		).toEqual([
			NetworkNamespace.Algorand,
			NetworkNamespace.Aptos,
			NetworkNamespace.Avail,
			NetworkNamespace.Avalanche,
			NetworkNamespace.Celestia,
			NetworkNamespace.Dydx,
			NetworkNamespace.Hedera,
			NetworkNamespace.InternetComputer,
			NetworkNamespace.Kaspa,
			NetworkNamespace.Starknet,
			NetworkNamespace.Stellar,
			NetworkNamespace.Sui,
			NetworkNamespace.Ton,
			NetworkNamespace.Xrpl,
		])
		for (const row of networkNamespaces)
			if (row.networkStackId == null)
				expect(row).toMatchObject({
					networkStackId: undefined,
					executionEnvironmentIds: undefined,
					consensusMechanismIds: undefined,
				})
			else {
				expect(row.executionEnvironmentIds).toBeDefined()
				expect(row.consensusMechanismIds).toBeDefined()
			}
	})
})
