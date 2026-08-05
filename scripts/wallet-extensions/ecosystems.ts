import type { RealWalletKind } from './WalletExtensionHarness.ts'


/**
 * Irreducible harness ecosystems — free-string `ecosystem: 'evm'` is forbidden at the type layer.
 * Architectures that are not browser-extension wallets still appear here so coverage gaps stay in the denominator.
 */
export enum WalletHarnessEcosystem {
	Evm = 'evm',
	Solana = 'solana',
	Cosmos = 'cosmos',
	Aptos = 'aptos',
	Polkadot = 'polkadot',
	Cardano = 'cardano',
	Ton = 'ton',
	Tron = 'tron',
	Starknet = 'starknet',
	Bitcoin = 'bitcoin',
	Lightning = 'lightning',
	Farcaster = 'farcaster',
	Near = 'near',
	Sui = 'sui',
}

export enum WalletHarnessConnectionProtocol {
	Eip6963 = 'eip-6963',
	Eip1193 = 'eip-1193',
	WalletStandard = 'wallet-standard',
	WalletConnectV2 = 'walletconnect-v2',
	AptosAip62 = 'aptos-aip62',
	CosmosOfflineSigner = 'cosmos-offline-signer',
	PolkadotInjectedWeb3 = 'polkadot-injected-web3',
	CardanoCip30 = 'cardano-cip30',
	TonConnect = 'ton-connect',
	TronTip6963 = 'tron-tip6963',
	StarknetWalletApi = 'starknet-wallet-api',
	BitcoinInjected = 'bitcoin-injected',
	SatsConnect = 'sats-connect',
	/** Identity proof over an EVM wallet — not a wallet protocol itself */
	FarcasterEvmProof = 'farcaster-evm-proof',
	/** Lightning node / invoice surface — not a browser extension wallet */
	LightningNode = 'lightning-node',
}

export enum WalletHarnessCoverageKind {
	/** Chromium extension driver + matrix scenarios */
	BrowserExtension = 'browser-extension',
	/** Product adapter/unit coverage without extension artifact */
	InjectedAdapter = 'injected-adapter',
	/** Architecture is modeled in schema/sources but not as an extension wallet */
	ArchitectureOnly = 'architecture-only',
	/** Social/session identity orthogonal to wallet connection */
	IdentityOverlay = 'identity-overlay',
}

export type WalletHarnessEcosystemDefinition = {
	ecosystem: WalletHarnessEcosystem
	label: string
	caipNamespaces: readonly string[]
	coverageKind: WalletHarnessCoverageKind
	connectionProtocols: readonly WalletHarnessConnectionProtocol[]
	extensionKinds: readonly RealWalletKind[]
}

export const walletHarnessEcosystems = [
	{
		ecosystem: WalletHarnessEcosystem.Evm,
		label: 'EVM',
		caipNamespaces: ['eip155'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.Eip6963,
			WalletHarnessConnectionProtocol.Eip1193,
			WalletHarnessConnectionProtocol.WalletConnectV2,
		],
		extensionKinds: [
			'ambire',
			'metamask',
			'rabby',
			'taho',
			'zerion',
			'backpack',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Solana,
		label: 'Solana',
		caipNamespaces: ['solana'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.WalletStandard,
			WalletHarnessConnectionProtocol.WalletConnectV2,
		],
		extensionKinds: [
			'backpack',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Cosmos,
		label: 'Cosmos',
		caipNamespaces: ['cosmos'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.CosmosOfflineSigner,
		],
		extensionKinds: [
			'keplr',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Aptos,
		label: 'Aptos',
		caipNamespaces: ['aptos'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.AptosAip62,
		],
		extensionKinds: [
			'petra',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Polkadot,
		label: 'Polkadot',
		caipNamespaces: ['polkadot'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.PolkadotInjectedWeb3,
		],
		extensionKinds: [
			'polkadot-js',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Cardano,
		label: 'Cardano',
		caipNamespaces: ['cardano'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.CardanoCip30,
		],
		extensionKinds: [
			'lace',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Ton,
		label: 'TON',
		caipNamespaces: ['ton'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.TonConnect,
		],
		extensionKinds: [
			'tonkeeper',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Tron,
		label: 'TRON',
		caipNamespaces: ['tron'],
		coverageKind: WalletHarnessCoverageKind.InjectedAdapter,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.TronTip6963,
		],
		extensionKinds: [],
	},
	{
		ecosystem: WalletHarnessEcosystem.Starknet,
		label: 'Starknet',
		caipNamespaces: ['starknet'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.StarknetWalletApi,
		],
		extensionKinds: [
			'argent-x',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Bitcoin,
		label: 'Bitcoin',
		caipNamespaces: ['bip122'],
		coverageKind: WalletHarnessCoverageKind.BrowserExtension,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.BitcoinInjected,
			WalletHarnessConnectionProtocol.SatsConnect,
		],
		extensionKinds: [
			'unisat',
		],
	},
	{
		ecosystem: WalletHarnessEcosystem.Lightning,
		label: 'Lightning Network',
		caipNamespaces: [],
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.LightningNode,
		],
		extensionKinds: [],
	},
	{
		ecosystem: WalletHarnessEcosystem.Farcaster,
		label: 'Farcaster',
		caipNamespaces: ['eip155'],
		coverageKind: WalletHarnessCoverageKind.IdentityOverlay,
		connectionProtocols: [
			WalletHarnessConnectionProtocol.FarcasterEvmProof,
		],
		extensionKinds: [],
	},
	{
		ecosystem: WalletHarnessEcosystem.Near,
		label: 'NEAR',
		caipNamespaces: ['near'],
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocols: [],
		extensionKinds: [],
	},
	{
		ecosystem: WalletHarnessEcosystem.Sui,
		label: 'Sui',
		caipNamespaces: ['sui'],
		coverageKind: WalletHarnessCoverageKind.ArchitectureOnly,
		connectionProtocols: [],
		extensionKinds: [],
	},
] as const satisfies readonly WalletHarnessEcosystemDefinition[]

export const walletHarnessEcosystemByEcosystem = Object.fromEntries(
	walletHarnessEcosystems.map((row) => [
		row.ecosystem,
		row,
	])
) as Record<WalletHarnessEcosystem, (typeof walletHarnessEcosystems)[number]>

export const walletHarnessEcosystemsByExtensionKind = (
	kind: RealWalletKind
) => (
	walletHarnessEcosystems.filter((row) => (
		(row.extensionKinds as readonly string[]).includes(kind)
	))
)

/** Every RealWalletKind must appear in at least one ecosystem extensionKinds list. */
export const assertEveryRealWalletKindHasEcosystem = (
	kinds: readonly RealWalletKind[]
) => {
	const missing = kinds.filter((kind) => (
		walletHarnessEcosystemsByExtensionKind(kind).length === 0
	))
	if (missing.length)
		throw new Error(`RealWalletKind missing harness ecosystem mapping: ${missing.join(', ')}`)
}
