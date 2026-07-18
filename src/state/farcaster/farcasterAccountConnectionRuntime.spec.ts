import { describe, expect, it, vi } from 'vitest'

import {
	createFarcasterAccountConnectionRuntime,
	farcasterAccountConnectionChallengeMessage,
	parseTrustedFarcasterAppFid,
	recoverFarcasterAccountConnectionSigner,
	type FarcasterAccountConnectionChallenge,
} from '$/state/farcaster/farcasterAccountConnectionRuntime.ts'

const signerAddress = '0x1111111111111111111111111111111111111111'
const personalSignVector = {
	message: 'Blockhead Farcaster proof vector',
	address: '0xfcad0b19bb29d4674531d6f115237e16afce377c',
	signature: '0x399c9c1e211852ddb5c058681a97b71c696c58fab6f00c4d03e6dec1acdb572146df169da8debba566cf5cc49b5b58b063b5f16db5e53d4472133c3659bc07b51b',
} as const
const challenge = {
	challengeId: 'challenge-1',
	connectionId: 'connection-1',
	fid: 3,
	method: 'custody',
	signerAddress,
	origin: 'https://blockhead.info',
	uri: 'https://blockhead.info/farcaster/accounts',
	chainId: 1,
	nonce: 'nonce-1',
	issuedAt: 1_000,
	expiresAt: 10_000,
} as const satisfies FarcasterAccountConnectionChallenge

const runtime = ({
	trustedAppFid = 4407,
	now = 2_000,
}: {
	trustedAppFid?: number
	now?: number
} = {}) => createFarcasterAccountConnectionRuntime({
	trustedAppFid,
	now: () => now,
	recoverSigner: vi.fn(async () => signerAddress),
})

describe('Farcaster account connection configuration', () => {
	it('parses a configured positive safe integer without a fallback', () => {
		expect(parseTrustedFarcasterAppFid('4407')).toBe(4407)
	})

	it.each([
		undefined,
		'',
		' ',
		'0',
		'-1',
		'1.5',
		'not-a-fid',
		String(Number.MAX_SAFE_INTEGER + 1),
	])('rejects an invalid trusted app FID: %s', (value) => {
		expect(() => parseTrustedFarcasterAppFid(value)).toThrow(
			'PUBLIC_BLOCKHEAD_FARCASTER_APP_FID'
		)
	})

	it('captures trusted configuration before challenge issuance', async () => {
		const configuration = {
			PUBLIC_BLOCKHEAD_FARCASTER_APP_FID: '4407',
		}
		const current = createFarcasterAccountConnectionRuntime({
			trustedAppFid: parseTrustedFarcasterAppFid(
				configuration.PUBLIC_BLOCKHEAD_FARCASTER_APP_FID
			),
			now: () => 2_000,
			recoverSigner: vi.fn(async () => signerAddress),
		})
		configuration.PUBLIC_BLOCKHEAD_FARCASTER_APP_FID = '999'
		const authChallenge = {
			...challenge,
			method: 'authAddress',
		} as const
		current.issueChallenge(authChallenge)

		await expect(current.consumeChallenge({
			challenge: authChallenge,
			message: farcasterAccountConnectionChallengeMessage(authChallenge),
			signature: 'signature',
			evidence: {
				method: 'authAddress',
				address: signerAddress,
				status: 'approved',
				appFid: 4407,
				associationFingerprint: 'auth:1',
			},
		})).resolves.toMatchObject({
			fid: authChallenge.fid,
		})
	})

	it.each([
		0,
		-1,
		1.5,
		Number.MAX_SAFE_INTEGER + 1,
	])('rejects an invalid trusted app FID at the runtime boundary: %s', (trustedAppFid) => {
		expect(() => runtime({ trustedAppFid })).toThrow('positive safe integer')
	})
})

describe('Farcaster account connection EIP-191 recovery', () => {
	it('recovers the fixed known-key personal_sign vector', () => {
		expect(recoverFarcasterAccountConnectionSigner(
			personalSignVector.message,
			personalSignVector.signature
		)).toBe(personalSignVector.address)
	})

	it('binds recovery to the exact message', () => {
		expect(recoverFarcasterAccountConnectionSigner(
			`${personalSignVector.message} altered`,
			personalSignVector.signature
		)).not.toBe(personalSignVector.address)
	})

	it.each([
		'',
		'0x',
		'0x12',
		'0xnothex',
	])('rejects a malformed signature before account persistence: %s', (signature) => {
		expect(() => recoverFarcasterAccountConnectionSigner(
			personalSignVector.message,
			signature
		)).toThrow()
	})

	it('rejects a valid signature from the wrong signer before persistence', async () => {
		const current = createFarcasterAccountConnectionRuntime({
			trustedAppFid: 4407,
			now: () => 2_000,
			recoverSigner: recoverFarcasterAccountConnectionSigner,
		})
		current.issueChallenge(challenge)

		await expect(current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: personalSignVector.signature,
			evidence: {
				method: 'custody',
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})).rejects.toThrow('Recovered signer')
		expect(current.connection(challenge.connectionId)).toBeUndefined()
	})
})

describe('Farcaster account connection runtime', () => {
	it('accepts current custody proof and rejects stale custody transfers', async () => {
		const current = runtime()
		current.issueChallenge(challenge)
		await expect(current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: 'signature',
			evidence: {
				method: 'custody',
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})).resolves.toMatchObject({
			connectionId: challenge.connectionId,
			fid: challenge.fid,
		})
		expect(current.revalidateConnection(challenge.connectionId, {
			method: 'custody',
			currentCustodyAddress: '0x2222222222222222222222222222222222222222',
			associationFingerprint: 'custody:2',
		})).toBeUndefined()
	})

	it('requires approved exact-app auth-address evidence and recovered-signer equality', async () => {
		const authChallenge = {
			...challenge,
			method: 'authAddress',
		} as const
		for (const evidence of [
			{
				method: 'authAddress',
				address: signerAddress,
				status: 'pending',
				appFid: 4407,
				associationFingerprint: 'auth:1',
			},
			{
				method: 'authAddress',
				address: signerAddress,
				status: 'revoked',
				appFid: 4407,
				associationFingerprint: 'auth:1',
			},
			{
				method: 'authAddress',
				address: signerAddress,
				status: 'approved',
				appFid: 999,
				associationFingerprint: 'auth:1',
			},
			{
				method: 'authAddress',
				address: '0x2222222222222222222222222222222222222222',
				status: 'approved',
				appFid: 4407,
				associationFingerprint: 'auth:1',
			},
		] as const) {
			const current = runtime()
			current.issueChallenge(authChallenge)
			await expect(current.consumeChallenge({
				challenge: authChallenge,
				message: farcasterAccountConnectionChallengeMessage(authChallenge),
				signature: 'signature',
				evidence,
			})).rejects.toThrow()
		}
	})

	it('rejects every bound challenge-field mismatch', async () => {
		const mismatches: FarcasterAccountConnectionChallenge[] = [
			{ ...challenge, challengeId: 'mismatch' },
			{ ...challenge, connectionId: 'mismatch' },
			{ ...challenge, fid: 4 },
			{ ...challenge, method: 'authAddress' },
			{ ...challenge, signerAddress: '0x2222222222222222222222222222222222222222' },
			{ ...challenge, origin: 'https://example.com' },
			{ ...challenge, uri: 'https://example.com/farcaster' },
			{ ...challenge, chainId: 10 },
			{ ...challenge, nonce: 'mismatch' },
			{ ...challenge, issuedAt: 1_001 },
			{ ...challenge, expiresAt: 9_999 },
		]
		for (const mismatched of mismatches) {
			const current = runtime()
			current.issueChallenge(challenge)
			await expect(current.consumeChallenge({
				challenge: mismatched,
				message: farcasterAccountConnectionChallengeMessage(mismatched),
				signature: 'signature',
				evidence: {
					method: 'custody',
					currentCustodyAddress: signerAddress,
					associationFingerprint: 'custody:1',
				},
			})).rejects.toThrow('challenge mismatch')
		}
	})

	it('atomically permits exactly one concurrent challenge consumption', async () => {
		const current = runtime()
		current.issueChallenge(challenge)
		const attempt = () => current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: 'signature',
			evidence: {
				method: 'custody' as const,
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})
		const outcomes = await Promise.allSettled([
			attempt(),
			attempt(),
		])
		expect(outcomes.filter(({ status }) => status === 'fulfilled')).toHaveLength(1)
		expect(outcomes.filter(({ status }) => status === 'rejected')).toHaveLength(1)
	})

	it('invalidates transfer revocation expiry and app mismatch', async () => {
		const current = runtime()
		current.issueChallenge(challenge)
		await current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: 'signature',
			evidence: {
				method: 'custody',
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})
		expect(current.revalidateConnection(challenge.connectionId, {
			method: 'custody',
			currentCustodyAddress: signerAddress,
			associationFingerprint: 'transferred',
		})).toBeUndefined()

		const expired = runtime({ now: 11_000 })
		expect(() => expired.issueChallenge(challenge)).toThrow()

		const wrongApp = runtime({ trustedAppFid: 999 })
		const authChallenge = {
			...challenge,
			method: 'authAddress',
		} as const
		wrongApp.issueChallenge(authChallenge)
		await expect(wrongApp.consumeChallenge({
			challenge: authChallenge,
			message: farcasterAccountConnectionChallengeMessage(authChallenge),
			signature: 'signature',
			evidence: {
				method: 'authAddress',
				address: signerAddress,
				status: 'approved',
				appFid: 4407,
				associationFingerprint: 'auth:1',
			},
		})).rejects.toThrow('trusted app')
	})

	it('selects only a current verified connection without clearing the current viewer on invalid selection', async () => {
		const current = runtime()
		current.issueChallenge(challenge)
		await current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: 'signature',
			evidence: {
				method: 'custody',
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})

		expect(current.selectConnection(challenge.connectionId)?.selected).toBe(true)
		expect(current.viewerFid()).toBe(challenge.fid)
		expect(current.selectConnection('unverified-connection')).toBeUndefined()
		expect(current.viewerFid()).toBe(challenge.fid)
	})

	it('never exposes an expired selected connection as viewer authority', async () => {
		let now = 2_000
		const current = createFarcasterAccountConnectionRuntime({
			trustedAppFid: 4407,
			now: () => now,
			recoverSigner: vi.fn(async () => signerAddress),
		})
		current.issueChallenge(challenge)
		await current.consumeChallenge({
			challenge,
			message: farcasterAccountConnectionChallengeMessage(challenge),
			signature: 'signature',
			evidence: {
				method: 'custody',
				currentCustodyAddress: signerAddress,
				associationFingerprint: 'custody:1',
			},
		})
		current.selectConnection(challenge.connectionId)

		now = challenge.expiresAt
		expect(current.viewerFid()).toBeUndefined()
		expect(current.selectConnection(challenge.connectionId)).toBeUndefined()
		expect(current.connection(challenge.connectionId)).toBeUndefined()
	})
})
