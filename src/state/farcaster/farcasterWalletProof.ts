import {
	farcasterAccountConnectionChallengeMessage,
	type FarcasterAccountConnectionChallenge,
} from '$/state/farcaster/farcasterAccountConnectionRuntime.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'

export type FarcasterWalletSigner = {
	connections: WalletConnection[]
	signMessage(connectionKey: string, message: string): Promise<{
		accountAddress: string
		signature: string
	}>
}

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
		(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey
	))
	const account = connection?.activeAccount ?? connection?.accounts.at(0)
	if (account == null || account.namespace !== 'eip155')
		throw new Error('Farcaster proof requires a connected EVM account')
	if (account.accountAddress.toLowerCase() !== challenge.signerAddress.toLowerCase())
		throw new Error('Selected wallet account does not match the Farcaster challenge signer')

	return walletRuntime.signMessage(
		connectionKey,
		farcasterAccountConnectionChallengeMessage(challenge)
	)
}
