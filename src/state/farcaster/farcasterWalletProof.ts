import {
	farcasterAccountConnectionChallengeMessage,
	type FarcasterAccountConnectionChallenge,
} from '$/state/farcaster/farcasterAccountConnectionRuntime.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type {
	WalletAccount,
	WalletConnection,
} from '$/state/wallets/adapters/types.ts'
import { walletConnectionKey } from '$/state/wallets/walletConnectionState.ts'


/**
 * CAIP-10 Account identity used for Farcaster custody / auth-address proof.
 * Orthogonal to `BlockheadWalletConnection` / `BlockheadFarcasterAccountConnection`:
 * the wallet session only executes `personal_sign`; enrollment stays on the Farcaster row.
 */
export type FarcasterProofAccount = {
	namespace: 'eip155'
	reference: string
	accountAddress: string
}

/** EVM account slice on a proofable wallet session (includes session capabilities). */
export type FarcasterEip155WalletAccount = FarcasterProofAccount & {
	capabilities: WalletAccount['capabilities']
}

/**
 * Connected + selected wallet connection whose accounts are all eip155.
 * Non-eip155 / unselected / unsettled connections are unrepresentable here —
 * project from general `WalletConnection` via `farcasterProofWalletConnection`.
 * Does not narrow general `signMessage` on wallet runtime adapters.
 */
export type FarcasterProofWalletConnection =
	& Extract<WalletConnection, {
		status: BlockheadConnectionStatus.Connected
		selected: true
	}>
	& {
		accounts: readonly [FarcasterEip155WalletAccount, ...FarcasterEip155WalletAccount[]]
		activeAccount: FarcasterEip155WalletAccount
	}

export type FarcasterWalletSigner = {
	/** Proofable EVM sessions only — not Farcaster identity enrollment. */
	connections: readonly FarcasterProofWalletConnection[]
	signMessage(connectionKey: string, message: string): Promise<{
		accountAddress: string
		signature: string
	}>
}

const farcasterEip155WalletAccount = (
	account: WalletAccount
): FarcasterEip155WalletAccount | undefined => (
	account.namespace === 'eip155' ?
		{
			namespace: 'eip155',
			reference: account.reference,
			accountAddress: account.accountAddress,
			capabilities: account.capabilities,
		}
	:
		undefined
)

export const farcasterProofAccountFromWalletConnection = (
	connection: WalletConnection | undefined
): FarcasterProofAccount | undefined => {
	if (connection?.status !== BlockheadConnectionStatus.Connected)
		return

	const account = connection.activeAccount ?? connection.accounts.at(0)
	if (account == null || account.namespace !== 'eip155')
		return

	return {
		namespace: 'eip155',
		reference: account.reference,
		accountAddress: account.accountAddress,
	}
}

/** Project a general wallet connection into a Farcaster-proofable EVM connection, if eligible. */
export const farcasterProofWalletConnection = (
	connection: WalletConnection
): FarcasterProofWalletConnection | undefined => {
	if (connection.status !== BlockheadConnectionStatus.Connected || connection.selected !== true)
		return

	const accounts = connection.accounts.flatMap((account) => {
		const eip155Account = farcasterEip155WalletAccount(account)
		return eip155Account == null ? [] : [eip155Account]
	})
	if (accounts.length === 0 || accounts.length !== connection.accounts.length)
		return

	const activeAccount = farcasterEip155WalletAccount(connection.activeAccount)
	if (
		activeAccount == null
		|| !accounts.some((account) => (
			account.reference === activeAccount.reference
			&& account.accountAddress === activeAccount.accountAddress
		))
	)
		return

	const [firstAccount, ...restAccounts] = accounts
	if (firstAccount == null)
		return

	return {
		...connection,
		accounts: [firstAccount, ...restAccounts],
		activeAccount,
	}
}

export const farcasterProofWalletConnections = (
	connections: readonly WalletConnection[]
) => (
	connections.flatMap((connection) => {
		const proofConnection = farcasterProofWalletConnection(connection)
		return proofConnection == null ? [] : [proofConnection]
	})
)

export const signFarcasterAccountConnectionChallenge = async ({
	walletRuntime,
	connectionKey,
	challenge,
}: {
	walletRuntime: FarcasterWalletSigner
	connectionKey: string
	challenge: FarcasterAccountConnectionChallenge
}) => {
	const connection = walletRuntime.connections.find((candidate) => (
		walletConnectionKey(candidate) === connectionKey
	))
	if (connection == null)
		throw new Error('Farcaster proof requires a connected EVM account')
	if (connection.activeAccount.accountAddress.toLowerCase() !== challenge.signerAddress.toLowerCase())
		throw new Error('Selected wallet account does not match the Farcaster challenge signer')

	return walletRuntime.signMessage(
		connectionKey,
		farcasterAccountConnectionChallengeMessage(challenge)
	)
}
