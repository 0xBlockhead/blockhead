import * as Hex from 'ox/Hex'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import {
	applyFarcasterAccountConnectionSelection,
	isCurrentFarcasterAccountConnection,
	standbyFarcasterAccountConnection,
	viewerFidFromFarcasterAccountConnections,
	type FarcasterAccountConnection,
} from '$/state/farcaster/farcasterAccountConnectionState.ts'


export type FarcasterAccountAuthMethod = 'custody' | 'authAddress'

export type FarcasterAccountConnectionChallenge = {
	challengeId: string
	connectionId: string
	fid: number
	method: FarcasterAccountAuthMethod
	signerAddress: string
	origin: string
	uri: string
	chainId: number
	nonce: string
	issuedAt: number
	expiresAt: number
}

export type { FarcasterAccountConnection }

export type FarcasterAccountEvidence =
	| {
		method: 'custody'
		currentCustodyAddress: string
		associationFingerprint: string
	}
	| {
		method: 'authAddress'
		address: string
		status: 'approved' | 'pending' | 'revoked'
		appFid: number
		associationFingerprint: string
	}

const normalizedAddress = (address: string) => address.toLowerCase()

export const parseTrustedFarcasterAppFid = (value: string | undefined) => {
	const fid = Number(value)
	if (
		value == null
		|| value.trim() === ''
		|| !Number.isSafeInteger(fid)
		|| fid <= 0
	)
		throw new Error('PUBLIC_BLOCKHEAD_FARCASTER_APP_FID must be a positive safe integer')

	return fid
}

export const recoverFarcasterAccountConnectionSigner = (
	message: string,
	signature: string
) => {
	Hex.assert(signature)

	return Secp256k1.recoverAddress({
		payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
		signature: Signature.fromHex(signature),
	}).toLowerCase()
}

export const farcasterAccountConnectionChallengeMessage = (
	challenge: FarcasterAccountConnectionChallenge
) => JSON.stringify(challenge)

export const createFarcasterAccountConnectionRuntime = ({
	trustedAppFid,
	now = Date.now,
	recoverSigner,
}: {
	trustedAppFid: number
	now?: () => number
	recoverSigner: (message: string, signature: string) => string | Promise<string>
}) => {
	if (!Number.isSafeInteger(trustedAppFid) || trustedAppFid <= 0)
		throw new Error('Trusted Farcaster app FID must be a positive safe integer')

	const challengeById = new Map<string, FarcasterAccountConnectionChallenge>()
	const consumedChallengeIds = new Set<string>()
	const connectionById = new Map<string, FarcasterAccountConnection>()

	const issueChallenge = (challenge: FarcasterAccountConnectionChallenge) => {
		if (
			challenge.issuedAt > now()
			|| challenge.expiresAt <= challenge.issuedAt
			|| challenge.expiresAt <= now()
		)
			throw new Error('Invalid Farcaster connection challenge lifetime')
		if (challengeById.has(challenge.challengeId))
			throw new Error('Farcaster connection challenge already exists')

		challengeById.set(challenge.challengeId, challenge)
		return challenge
	}

	const consumeChallenge = async ({
		challenge,
		message,
		signature,
		evidence,
	}: {
		challenge: FarcasterAccountConnectionChallenge
		message: string
		signature: string
		evidence: FarcasterAccountEvidence
	}) => {
		const issuedChallenge = challengeById.get(challenge.challengeId)
		if (issuedChallenge == null || JSON.stringify(issuedChallenge) !== JSON.stringify(challenge))
			throw new Error('Farcaster connection challenge mismatch')
		if (consumedChallengeIds.has(challenge.challengeId))
			throw new Error('Farcaster connection challenge already consumed')
		if (challenge.expiresAt <= now())
			throw new Error('Farcaster connection challenge expired')
		if (message !== farcasterAccountConnectionChallengeMessage(challenge))
			throw new Error('Farcaster connection challenge message mismatch')

		consumedChallengeIds.add(challenge.challengeId)
		try {
			const recoveredSigner = normalizedAddress(await recoverSigner(message, signature))
			if (recoveredSigner !== normalizedAddress(challenge.signerAddress))
				throw new Error('Recovered signer does not match Farcaster connection challenge')
			if (evidence.method !== challenge.method)
				throw new Error('Farcaster connection auth method mismatch')

			if (
				evidence.method === 'custody'
				&& normalizedAddress(evidence.currentCustodyAddress) !== recoveredSigner
			)
				throw new Error('Farcaster custody is no longer current')
			if (
				evidence.method === 'authAddress'
				&& (
					normalizedAddress(evidence.address) !== recoveredSigner
					|| evidence.status !== 'approved'
					|| evidence.appFid !== trustedAppFid
				)
			)
				throw new Error('Farcaster auth address is not approved for the trusted app')

			const connection = standbyFarcasterAccountConnection({
				connectionId: challenge.connectionId,
				fid: challenge.fid,
				signerAddress: recoveredSigner,
				authMethod: challenge.method,
				verifiedAt: now(),
				expiresAt: challenge.expiresAt,
				associationFingerprint: evidence.associationFingerprint,
			})
			connectionById.set(connection.connectionId, connection)
			return connection
		} catch (error) {
			connectionById.delete(challenge.connectionId)
			throw error
		}
	}

	const revalidateConnection = (
		connectionId: string,
		evidence: FarcasterAccountEvidence
	) => {
		const connection = connectionById.get(connectionId)
		if (connection == null) return undefined
		if (
			!isCurrentFarcasterAccountConnection(connection, now())
			|| connection.authMethod !== evidence.method
			|| connection.associationFingerprint !== evidence.associationFingerprint
			|| (
				evidence.method === 'custody'
				&& normalizedAddress(evidence.currentCustodyAddress) !== connection.signerAddress
			)
			|| (
				evidence.method === 'authAddress'
				&& (
					normalizedAddress(evidence.address) !== connection.signerAddress
					|| evidence.status !== 'approved'
					|| evidence.appFid !== trustedAppFid
				)
			)
		) {
			connectionById.delete(connectionId)
			return undefined
		}

		return connection
	}

	const selectConnection = (connectionId: string) => {
		const { connections, viewer, selected } = applyFarcasterAccountConnectionSelection(
			[...connectionById.values()],
			connectionId,
			now()
		)
		connectionById.clear()
		for (const connection of connections)
			connectionById.set(connection.connectionId, connection)

		return selected ? viewer : undefined
	}

	return {
		issueChallenge,
		consumeChallenge,
		revalidateConnection,
		selectConnection,
		disconnect: (connectionId: string) => connectionById.delete(connectionId),
		connection: (connectionId: string) => {
			const connection = connectionById.get(connectionId)
			if (connection == null) return undefined
			if (!isCurrentFarcasterAccountConnection(connection, now())) {
				connectionById.delete(connectionId)
				return undefined
			}
			return connection
		},
		viewerFid: () => viewerFidFromFarcasterAccountConnections(
			[...connectionById.values()],
			now()
		),
	}
}
