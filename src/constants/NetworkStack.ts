// Types

export enum NetworkStackId {
	Ethereum = 'Ethereum',
	Bitcoin = 'Bitcoin',
	Lightning = 'Lightning',
	Zcash = 'Zcash',
	Filecoin = 'Filecoin',
	Solana = 'Solana',
	CosmosSdkCometBft = 'CosmosSdkCometBft',
	PolkadotSdk = 'PolkadotSdk',
	Hyperliquid = 'Hyperliquid',
	Logos = 'Logos',
	Quilibrium = 'Quilibrium',
	Near = 'Near',
	Monero = 'Monero',
	Litecoin = 'Litecoin',
	Dogecoin = 'Dogecoin',
	BitcoinCash = 'BitcoinCash',
	Tron = 'Tron',
	ZeroG = 'ZeroG',
}


// Constants

const networkStacks = [
	{
		networkStackId: NetworkStackId.Ethereum,
		label: 'Ethereum',
	},
	{
		networkStackId: NetworkStackId.Bitcoin,
		label: 'Bitcoin',
	},
	{
		networkStackId: NetworkStackId.Lightning,
		label: 'Lightning Network',
	},
	{
		networkStackId: NetworkStackId.Zcash,
		label: 'Zcash',
	},
	{
		networkStackId: NetworkStackId.Filecoin,
		label: 'Filecoin',
	},
	{
		networkStackId: NetworkStackId.Solana,
		label: 'Solana',
	},
	{
		networkStackId: NetworkStackId.CosmosSdkCometBft,
		label: 'Cosmos SDK + CometBFT',
	},
	{
		networkStackId: NetworkStackId.PolkadotSdk,
		label: 'Polkadot SDK',
	},
	{
		networkStackId: NetworkStackId.Hyperliquid,
		label: 'Hyperliquid',
	},
	{
		networkStackId: NetworkStackId.Logos,
		label: 'Logos',
	},
	{
		networkStackId: NetworkStackId.Quilibrium,
		label: 'Quilibrium',
	},
	{
		networkStackId: NetworkStackId.Near,
		label: 'NEAR',
	},
	{
		networkStackId: NetworkStackId.Monero,
		label: 'Monero',
	},
	{
		networkStackId: NetworkStackId.Litecoin,
		label: 'Litecoin',
	},
	{
		networkStackId: NetworkStackId.Dogecoin,
		label: 'Dogecoin',
	},
	{
		networkStackId: NetworkStackId.BitcoinCash,
		label: 'Bitcoin Cash',
	},
	{
		networkStackId: NetworkStackId.Tron,
		label: 'TRON',
	},
	{
		networkStackId: NetworkStackId.ZeroG,
		label: '0G',
	},
] as const satisfies readonly {
	networkStackId: NetworkStackId
	label: string
}[]


// Lookups

export const networkStackByNetworkStackId = Object.fromEntries(
	networkStacks.map((row) => [
		row.networkStackId,
		row,
	]),
)
