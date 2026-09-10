import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'

export const account = {
	namespace: 'eip155',
	reference: '1',
	accountAddress: '0x1111111111111111111111111111111111111111',
	capabilities: [WalletCapability.SendTransaction],
} as const

export const base = {
	walletId: 'eip6963:com.example',
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [{
		namespace: 'eip155',
		reference: '1',
		methods: ['eth_sendTransaction'],
		events: [],
	}],
	accounts: [account],
	activeAccount: account,
} as const
