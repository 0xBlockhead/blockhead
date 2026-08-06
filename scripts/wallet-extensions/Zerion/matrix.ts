import type { WalletMatrixScenario } from '../WalletCompatibilityMatrix.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'


// Headed Connect chrome is mapped through hashed popup.<hash>.html (see isZerionPopupPageUrl).
// Cloudflare Turnstile CAPTCHA blocks unattended Zerion onboarding; completing CAPTCHA is not safe automation.
export const zerionWalletMatrixScenarios = (version: string) => ([
	{
		id: 'zerion-create-new-1',
		wallet: {
			kind: 'zerion',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_requestAccounts',
		lifecycleEdgeCase: 'turnstile-captcha-blocked',
	},
	{
		id: 'zerion-create-new-2',
		wallet: {
			kind: 'zerion',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 2,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'turnstile-second-account-blocked',
	},
	{
		id: 'zerion-recover-3',
		wallet: {
			kind: 'zerion',
			version,
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'recover',
		accountOrdinal: 3,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:1',
		requestMethod: 'eth_accounts',
		lifecycleEdgeCase: 'turnstile-recover-blocked',
	},
] as const satisfies readonly WalletMatrixScenario[])
