import { NetworkNamespace } from '$/constants/Network.ts'


// Types

export enum WalletProtocol {
	Eip1193 = 'eip1193',
	Eip6963 = 'eip6963',
	TronTip1193 = 'tron-tip1193',
	WalletStandard = 'wallet-standard',
	AptosAip62 = 'aptos-aip62',
	AptosInjected = 'aptos-injected',
	CardanoCip30 = 'cardano-cip30',
	CosmosOfflineSigner = 'cosmos-offline-signer',
	PolkadotInjectedWeb3 = 'polkadot-injected-web3',
	WalletConnectV2 = 'walletconnect-v2',
	TonConnect = 'ton-connect',
	NearWalletSelector = 'near-wallet-selector',
	IcrcSigner = 'icrc-signer',
	StarknetWalletApi = 'starknet-wallet-api',
	BitcoinInjected = 'bitcoin-injected',
	SatsConnect = 'sats-connect',
	TrezorConnect = 'trezor-connect',
	DirectHardwareTransport = 'direct-hardware-transport',
}

export enum WalletDiscoveryKind {
	InjectedEvent = 'injected-event',
	InjectedGlobal = 'injected-global',
	Registry = 'registry',
	PostMessage = 'post-message',
	SandboxedIframe = 'sandboxed-iframe',
	QrDeeplink = 'qr-deeplink',
	P2pJsonRpc = 'p2p-json-rpc',
	HardwareBridge = 'hardware-bridge',
	DirectHardware = 'direct-hardware',
}

export enum WalletTransportKind {
	InjectedProvider = 'injected-provider',
	InjectedSigner = 'injected-signer',
	HttpBridge = 'http-bridge',
	PostMessage = 'post-message',
	IframePostMessage = 'iframe-post-message',
	WalletConnectRelay = 'walletconnect-relay',
	WebRtcJsonRpc = 'webrtc-json-rpc',
	WebHid = 'webhid',
	WebUsb = 'webusb',
	NativeBridge = 'native-bridge',
}

export enum WalletFormFactor {
	BrowserExtension = 'browser-extension',
	MobileWallet = 'mobile-wallet',
	DesktopWallet = 'desktop-wallet',
	HardwareWallet = 'hardware-wallet',
	EmbeddedIframe = 'embedded-iframe',
	RemoteSigner = 'remote-signer',
}

export enum WalletCapability {
	Discover = 'discover',
	Connect = 'connect',
	Reconnect = 'reconnect',
	Disconnect = 'disconnect',
	ListAccounts = 'list-accounts',
	WatchAccounts = 'watch-accounts',
	WatchScopes = 'watch-scopes',
	SignMessage = 'sign-message',
	SignTransaction = 'sign-transaction',
	SendTransaction = 'send-transaction',
	SignTypedData = 'sign-typed-data',
	SwitchScope = 'switch-scope',
}

export enum WalletImplementationStatus {
	Implemented = 'implemented',
	DiscoveryImplemented = 'discovery-implemented',
	Modeled = 'modeled',
}

export type WalletConnectionMethod = {
	id: string
	label: string
	protocol: WalletProtocol
	discoveryKind: WalletDiscoveryKind
	transportKind: WalletTransportKind
	formFactors: readonly WalletFormFactor[]
	networkNamespaces: readonly NetworkNamespace[]
	caipNamespaces: readonly string[]
	capabilities: readonly WalletCapability[]
	implementationStatus: WalletImplementationStatus
	dependencyPolicy: 'none' | 'minimal-required' | 'vendor-required'
}


// Constants

export const walletProtocols = [
	{ protocol: WalletProtocol.Eip6963, label: 'EIP-6963' },
	{ protocol: WalletProtocol.Eip1193, label: 'EIP-1193' },
	{ protocol: WalletProtocol.TronTip1193, label: 'TRON TIP-1193' },
	{ protocol: WalletProtocol.WalletStandard, label: 'Wallet Standard' },
	{ protocol: WalletProtocol.AptosAip62, label: 'Aptos AIP-62' },
	{ protocol: WalletProtocol.AptosInjected, label: 'Aptos injected wallet globals' },
	{ protocol: WalletProtocol.CardanoCip30, label: 'Cardano CIP-30' },
	{ protocol: WalletProtocol.CosmosOfflineSigner, label: 'Cosmos OfflineSigner' },
	{ protocol: WalletProtocol.PolkadotInjectedWeb3, label: 'Polkadot injectedWeb3' },
	{ protocol: WalletProtocol.WalletConnectV2, label: 'WalletConnect v2' },
	{ protocol: WalletProtocol.TonConnect, label: 'TON Connect' },
	{ protocol: WalletProtocol.NearWalletSelector, label: 'NEAR Wallet Selector' },
	{ protocol: WalletProtocol.IcrcSigner, label: 'ICP ICRC signer' },
	{ protocol: WalletProtocol.StarknetWalletApi, label: 'Starknet Wallet API' },
	{ protocol: WalletProtocol.BitcoinInjected, label: 'Bitcoin injected wallet globals' },
	{ protocol: WalletProtocol.SatsConnect, label: 'Sats Connect' },
	{ protocol: WalletProtocol.TrezorConnect, label: 'Trezor Connect' },
	{ protocol: WalletProtocol.DirectHardwareTransport, label: 'Direct hardware transport' },
] as const

export const walletConnectionMethods = [
	{
		id: 'eip6963',
		label: 'EIP-6963 injected EVM wallet',
		protocol: WalletProtocol.Eip6963,
		discoveryKind: WalletDiscoveryKind.InjectedEvent,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.DesktopWallet],
		networkNamespaces: [NetworkNamespace.Evm],
		caipNamespaces: ['eip155'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
			WalletCapability.SignTypedData,
			WalletCapability.SwitchScope,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'eip1193-legacy',
		label: 'EIP-1193 provider API',
		protocol: WalletProtocol.Eip1193,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.DesktopWallet],
		networkNamespaces: [NetworkNamespace.Evm],
		caipNamespaces: ['eip155'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
			WalletCapability.SignTypedData,
			WalletCapability.SwitchScope,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'none',
	},
	{
		id: 'tron-tip6963',
		label: 'TRON TIP-6963 announced wallet',
		protocol: WalletProtocol.TronTip1193,
		discoveryKind: WalletDiscoveryKind.InjectedEvent,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Tron],
		caipNamespaces: ['tron'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'tron-tip1193',
		label: 'TRON injected wallet',
		protocol: WalletProtocol.TronTip1193,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Tron],
		caipNamespaces: ['tron'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'wallet-standard',
		label: 'Wallet Standard registry wallet',
		protocol: WalletProtocol.WalletStandard,
		discoveryKind: WalletDiscoveryKind.Registry,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet, WalletFormFactor.DesktopWallet],
		networkNamespaces: [NetworkNamespace.Solana],
		caipNamespaces: ['solana'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'aptos-aip62',
		label: 'Aptos AIP-62 wallet',
		protocol: WalletProtocol.AptosAip62,
		discoveryKind: WalletDiscoveryKind.InjectedEvent,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Aptos],
		caipNamespaces: ['aptos'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'aptos-injected-globals',
		label: 'Aptos injected wallet globals',
		protocol: WalletProtocol.AptosInjected,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Aptos],
		caipNamespaces: ['aptos'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'cardano-cip30',
		label: 'Cardano CIP-30 injected wallet',
		protocol: WalletProtocol.CardanoCip30,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Cardano],
		caipNamespaces: ['cip34'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'cosmos-offline-signer',
		label: 'Cosmos OfflineSigner wallet',
		protocol: WalletProtocol.CosmosOfflineSigner,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Cosmos],
		caipNamespaces: ['cosmos'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'polkadot-injected-web3',
		label: 'Polkadot injectedWeb3 wallet',
		protocol: WalletProtocol.PolkadotInjectedWeb3,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension],
		networkNamespaces: [NetworkNamespace.Polkadot],
		caipNamespaces: ['polkadot'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'walletconnect-v2',
		label: 'WalletConnect v2 session',
		protocol: WalletProtocol.WalletConnectV2,
		discoveryKind: WalletDiscoveryKind.QrDeeplink,
		transportKind: WalletTransportKind.WalletConnectRelay,
		formFactors: [WalletFormFactor.MobileWallet, WalletFormFactor.DesktopWallet, WalletFormFactor.HardwareWallet],
		networkNamespaces: [
			NetworkNamespace.Evm,
			NetworkNamespace.Solana,
		],
		caipNamespaces: ['eip155', 'solana'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'minimal-required',
	},
	{
		id: 'ton-connect-injected',
		label: 'TON Connect injected wallet',
		protocol: WalletProtocol.TonConnect,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.DesktopWallet],
		networkNamespaces: [NetworkNamespace.Ton],
		caipNamespaces: ['ton'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'ton-connect',
		label: 'TON Connect wallet',
		protocol: WalletProtocol.TonConnect,
		discoveryKind: WalletDiscoveryKind.QrDeeplink,
		transportKind: WalletTransportKind.HttpBridge,
		formFactors: [WalletFormFactor.MobileWallet, WalletFormFactor.DesktopWallet],
		networkNamespaces: [NetworkNamespace.Ton],
		caipNamespaces: ['ton'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'minimal-required',
	},
	{
		id: 'near-wallet-selector',
		label: 'NEAR Wallet Selector',
		protocol: WalletProtocol.NearWalletSelector,
		discoveryKind: WalletDiscoveryKind.Registry,
		transportKind: WalletTransportKind.PostMessage,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet, WalletFormFactor.EmbeddedIframe],
		networkNamespaces: [NetworkNamespace.Near],
		caipNamespaces: ['near'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'minimal-required',
	},
	{
		id: 'icrc-signer',
		label: 'ICP ICRC draft signer',
		protocol: WalletProtocol.IcrcSigner,
		discoveryKind: WalletDiscoveryKind.PostMessage,
		transportKind: WalletTransportKind.PostMessage,
		formFactors: [WalletFormFactor.EmbeddedIframe, WalletFormFactor.MobileWallet],
		networkNamespaces: [],
		caipNamespaces: ['icp'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'none',
	},
	{
		id: 'starknet-wallet-api',
		label: 'Starknet Wallet API',
		protocol: WalletProtocol.StarknetWalletApi,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [],
		caipNamespaces: ['starknet'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'minimal-required',
	},
	{
		id: 'sats-connect',
		label: 'Sats Connect wallet',
		protocol: WalletProtocol.SatsConnect,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Bitcoin],
		caipNamespaces: ['bip122'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'minimal-required',
	},
	{
		id: 'bitcoin-injected-globals',
		label: 'Bitcoin injected wallet globals',
		protocol: WalletProtocol.BitcoinInjected,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		formFactors: [WalletFormFactor.BrowserExtension, WalletFormFactor.MobileWallet],
		networkNamespaces: [NetworkNamespace.Bitcoin],
		caipNamespaces: ['bip122'],
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Implemented,
		dependencyPolicy: 'none',
	},
	{
		id: 'trezor-connect',
		label: 'Trezor Connect',
		protocol: WalletProtocol.TrezorConnect,
		discoveryKind: WalletDiscoveryKind.HardwareBridge,
		transportKind: WalletTransportKind.NativeBridge,
		formFactors: [WalletFormFactor.HardwareWallet],
		networkNamespaces: [NetworkNamespace.Evm, NetworkNamespace.Bitcoin],
		caipNamespaces: ['eip155', 'bip122'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'vendor-required',
	},
	{
		id: 'direct-hardware-transport',
		label: 'Ledger WebHID hardware wallet',
		protocol: WalletProtocol.DirectHardwareTransport,
		discoveryKind: WalletDiscoveryKind.DirectHardware,
		transportKind: WalletTransportKind.WebHid,
		formFactors: [WalletFormFactor.HardwareWallet],
		networkNamespaces: [NetworkNamespace.Evm, NetworkNamespace.Bitcoin],
		caipNamespaces: ['eip155', 'bip122'],
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
		implementationStatus: WalletImplementationStatus.Modeled,
		dependencyPolicy: 'vendor-required',
	},
] as const satisfies readonly WalletConnectionMethod[]

const walletDiscoveryKinds = [
	{ discoveryKind: WalletDiscoveryKind.InjectedEvent, label: 'Injected event' },
	{ discoveryKind: WalletDiscoveryKind.InjectedGlobal, label: 'Injected global' },
	{ discoveryKind: WalletDiscoveryKind.Registry, label: 'Registry' },
	{ discoveryKind: WalletDiscoveryKind.PostMessage, label: 'PostMessage' },
	{ discoveryKind: WalletDiscoveryKind.SandboxedIframe, label: 'Sandboxed iframe' },
	{ discoveryKind: WalletDiscoveryKind.QrDeeplink, label: 'QR / deeplink' },
	{ discoveryKind: WalletDiscoveryKind.P2pJsonRpc, label: 'P2P JSON-RPC' },
	{ discoveryKind: WalletDiscoveryKind.HardwareBridge, label: 'Hardware bridge' },
	{ discoveryKind: WalletDiscoveryKind.DirectHardware, label: 'Direct hardware' },
] as const satisfies readonly {
	discoveryKind: WalletDiscoveryKind
	label: string
}[]

const walletTransportKinds = [
	{ transportKind: WalletTransportKind.InjectedProvider, label: 'Injected provider' },
	{ transportKind: WalletTransportKind.InjectedSigner, label: 'Injected signer' },
	{ transportKind: WalletTransportKind.HttpBridge, label: 'HTTP bridge' },
	{ transportKind: WalletTransportKind.PostMessage, label: 'PostMessage' },
	{ transportKind: WalletTransportKind.IframePostMessage, label: 'Iframe PostMessage' },
	{ transportKind: WalletTransportKind.WalletConnectRelay, label: 'WalletConnect relay' },
	{ transportKind: WalletTransportKind.WebRtcJsonRpc, label: 'WebRTC JSON-RPC' },
	{ transportKind: WalletTransportKind.WebHid, label: 'WebHID' },
	{ transportKind: WalletTransportKind.WebUsb, label: 'WebUSB' },
	{ transportKind: WalletTransportKind.NativeBridge, label: 'Native bridge' },
] as const satisfies readonly {
	transportKind: WalletTransportKind
	label: string
}[]

const walletFormFactors = [
	{ formFactor: WalletFormFactor.BrowserExtension, label: 'Browser extension' },
	{ formFactor: WalletFormFactor.MobileWallet, label: 'Mobile wallet' },
	{ formFactor: WalletFormFactor.DesktopWallet, label: 'Desktop wallet' },
	{ formFactor: WalletFormFactor.HardwareWallet, label: 'Hardware wallet' },
	{ formFactor: WalletFormFactor.EmbeddedIframe, label: 'Embedded iframe' },
	{ formFactor: WalletFormFactor.RemoteSigner, label: 'Remote signer' },
] as const satisfies readonly {
	formFactor: WalletFormFactor
	label: string
}[]

const walletCapabilities = [
	{ capability: WalletCapability.Discover, label: 'Discover' },
	{ capability: WalletCapability.Connect, label: 'Connect' },
	{ capability: WalletCapability.Reconnect, label: 'Reconnect' },
	{ capability: WalletCapability.Disconnect, label: 'Disconnect' },
	{ capability: WalletCapability.ListAccounts, label: 'List accounts' },
	{ capability: WalletCapability.WatchAccounts, label: 'Watch accounts' },
	{ capability: WalletCapability.WatchScopes, label: 'Watch scopes' },
	{ capability: WalletCapability.SignMessage, label: 'Sign message' },
	{ capability: WalletCapability.SignTransaction, label: 'Sign transaction' },
	{ capability: WalletCapability.SendTransaction, label: 'Send transaction' },
	{ capability: WalletCapability.SignTypedData, label: 'Sign typed data' },
	{ capability: WalletCapability.SwitchScope, label: 'Switch scope' },
] as const satisfies readonly {
	capability: WalletCapability
	label: string
}[]

const walletImplementationStatuses = [
	{ implementationStatus: WalletImplementationStatus.Implemented, label: 'Implemented' },
	{ implementationStatus: WalletImplementationStatus.DiscoveryImplemented, label: 'Discovery implemented' },
	{ implementationStatus: WalletImplementationStatus.Modeled, label: 'Modeled' },
] as const satisfies readonly {
	implementationStatus: WalletImplementationStatus
	label: string
}[]

const walletDependencyPolicies = [
	{ dependencyPolicy: 'none', label: 'None' },
	{ dependencyPolicy: 'minimal-required', label: 'Minimal required' },
	{ dependencyPolicy: 'vendor-required', label: 'Vendor required' },
] as const satisfies readonly {
	dependencyPolicy: WalletConnectionMethod['dependencyPolicy']
	label: string
}[]


// Lookups

export const walletProtocolByProtocol = Object.fromEntries(
	walletProtocols.map((walletProtocol) => [
		walletProtocol.protocol,
		walletProtocol,
	])
)

export const walletDiscoveryKindByDiscoveryKind = Object.fromEntries(
	walletDiscoveryKinds.map((row) => [
		row.discoveryKind,
		row,
	])
)

export const walletTransportKindByTransportKind = Object.fromEntries(
	walletTransportKinds.map((row) => [
		row.transportKind,
		row,
	])
)

export const walletFormFactorByFormFactor = Object.fromEntries(
	walletFormFactors.map((row) => [
		row.formFactor,
		row,
	])
)

export const walletCapabilityByCapability = Object.fromEntries(
	walletCapabilities.map((row) => [
		row.capability,
		row,
	])
)

export const walletImplementationStatusByImplementationStatus = Object.fromEntries(
	walletImplementationStatuses.map((row) => [
		row.implementationStatus,
		row,
	])
)

export const walletDependencyPolicyByDependencyPolicy = Object.fromEntries(
	walletDependencyPolicies.map((row) => [
		row.dependencyPolicy,
		row,
	])
)

export const walletConnectionMethodById = Object.fromEntries(
	walletConnectionMethods.map((walletConnectionMethod) => [
		walletConnectionMethod.id,
		walletConnectionMethod,
	])
)

export const walletConnectionMethodByProtocolDiscoveryKindTransportKind = Object.fromEntries(
	walletConnectionMethods.map((walletConnectionMethod) => [
		[
			walletConnectionMethod.protocol,
			walletConnectionMethod.discoveryKind,
			walletConnectionMethod.transportKind,
		].join(':'),
		walletConnectionMethod,
	])
)
