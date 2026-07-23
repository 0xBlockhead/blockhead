import type { KeplrWallet } from '$/sources/Keplr/WalletApi/types.ts'

export type LeapWallet = Pick<
	KeplrWallet,
	'enable' | 'getOfflineSignerAuto'
>
