import type { RealWalletKind } from './WalletExtensionHarness.ts'

export type WalletCapabilityCorpusEntry = {
	walletKind: RealWalletKind
	version: string
	chain: string
	accountAddress: string
	requestMethod: string
	capability: 'account-visible' | 'message-signing'
}

// Public, deterministic identities used only to bind unit-level observations.
// They are not wallet secrets and must never be used as live signing accounts.
export const walletCapabilityCorpus = [
	{
		walletKind: 'ambire',
		version: '6.14.4',
		chain: 'eip155:31337',
		accountAddress: '0x1111111111111111111111111111111111111111',
		requestMethod: 'eth_accounts',
		capability: 'account-visible',
	},
	{
		walletKind: 'backpack',
		version: '0.10.211',
		chain: 'solana:mainnet',
		accountAddress: '9xQeWvG816bUx9EPfEZLLqvRYcQdhAkZjfLHLXEbiVd',
		requestMethod: 'signMessage',
		capability: 'message-signing',
	},
	{
		walletKind: 'lace',
		version: '2.2.0',
		chain: 'cardano:mainnet',
		accountAddress: '61000000000000000000000000000000000000000000000000000000',
		requestMethod: 'cip30.signData',
		capability: 'message-signing',
	},
] as const satisfies readonly WalletCapabilityCorpusEntry[]
