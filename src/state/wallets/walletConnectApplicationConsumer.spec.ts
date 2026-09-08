import { afterEach, describe, expect, it, vi } from 'vitest'

import {
	blockheadWalletReturnUrl,
	type WalletLinkRelayReceipt,
} from './tauriWalletLink.ts'
import {
	createWalletConnectApplicationConsumer,
	type WalletConnectApplicationConsumer,
} from './walletConnectApplicationConsumer.ts'

const controlledHost = () => {
	let openListener = (_urls: readonly string[]) => {}
	const openedUrls: string[] = []
	const stop = vi.fn()

	return {
		host: {
			openUrl: async (url: string) => {
				openedUrls.push(url)
			},
			getCurrent: async () => null,
			onOpenUrl: async (listener: (urls: readonly string[]) => void) => {
				openListener = listener
				return stop
			},
		},
		openedUrls,
		openUrls: (urls: readonly string[]) => openListener(urls),
		stop,
	}
}

const startConsumer = async () => {
	const controlled = controlledHost()
	const consumer = createWalletConnectApplicationConsumer({
		host: controlled.host,
	})
	await consumer.start()

	return {
		consumer,
		controlled,
	}
}

const openPairing = async (
	consumer: WalletConnectApplicationConsumer,
	walletConnectUri = 'wc:pairing-topic@2?relay-protocol=irn&symKey=secret'
) => consumer.openPairing(walletConnectUri)

describe('WalletConnect application consumer', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('opens the immutable MetaMask Mobile target with an exact hashed pairing correlation', async () => {
		vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
			'00000000-0000-4000-8000-000000000010'
		)
		const { consumer, controlled } = await startConsumer()
		const attempt = await openPairing(consumer)

		expect(attempt).toMatchObject({
			target: {
				walletId: 'metamask-mobile',
				bundleId: 'io.metamask.MetaMask',
				version: '8.12.0+904d9f5d',
				launchBaseUrl: 'metamask://wc?uri=',
			},
			walletConnectUri: 'wc:pairing-topic@2?relay-protocol=irn&symKey=secret',
			correlation: {
				kind: 'pairing',
				attemptId: 'walletconnect-pairing-00000000-0000-4000-8000-000000000010',
				authorityRequestId: 'walletconnect-pairing:pairing-topic',
				envelopeHash: '0x7676af12ba63fd9538f7018999c2d843486d2098232bd3a47f311fd186f63d6b',
			},
			state: 'opened',
		})
		expect(controlled.openedUrls).toEqual([
			'metamask://wc?uri=wc%3Apairing-topic%402%3Frelay-protocol%3Dirn%26symKey%3Dsecret',
		])
	})

	it('treats app return as observation and accepts approval only through the relay result', async () => {
		const { consumer, controlled } = await startConsumer()
		const attempt = await openPairing(consumer)

		controlled.openUrls([blockheadWalletReturnUrl])
		expect(consumer.current()).toMatchObject({
			state: 'returned',
		})
		expect(consumer.current()).not.toHaveProperty('outcome')
		expect(() => consumer.approvePairing(
			attempt.walletConnectUri,
			''
		)).toThrow('requires an exact session topic')

		const approval = consumer.approvePairing(
			attempt.walletConnectUri,
			'approved-session-topic'
		)
		expect(approval).toMatchObject({
			completedBy: 'walletconnect-relay',
			receipt: {
				kind: 'pairing',
				sessionTopic: 'approved-session-topic',
				outcome: 'approved',
			},
		})
		expect(consumer.approvePairing(
			attempt.walletConnectUri,
			'approved-session-topic'
		)).toBe(approval)
		expect(() => consumer.rejectPairing(
			attempt.walletConnectUri
		)).toThrow('conflicts with the terminal settlement')
		expect(consumer.current()).toMatchObject({ state: 'returned' })
	})

	it('settles request approval and rejection while rejecting every mismatched correlation field', async () => {
		const { consumer } = await startConsumer()
		const correlation = {
			kind: 'request',
			attemptId: 'request-attempt',
			authorityRequestId: 'authority-request',
			envelopeHash: 'envelope-hash',
			sessionTopic: 'session-topic',
			requestId: 'request-id',
		} as const
		await consumer.open({
			walletConnectUri: 'wc:request-pairing@2',
			correlation,
		})
		const receipt = {
			kind: 'request',
			attemptId: correlation.attemptId,
			authorityRequestId: correlation.authorityRequestId,
			envelopeHash: correlation.envelopeHash,
			sessionTopic: correlation.sessionTopic,
			requestId: correlation.requestId,
			outcome: 'approved',
		} satisfies WalletLinkRelayReceipt
		const kindMismatch = { ...receipt }
		Object.defineProperty(kindMismatch, 'kind', { value: 'pairing' })

		for (const mismatch of [
			{ ...receipt, attemptId: 'stale-attempt' },
			{ ...receipt, authorityRequestId: 'stale-authority-request' },
			{ ...receipt, sessionTopic: 'stale-topic' },
			{ ...receipt, requestId: 'stale-request' },
			{ ...receipt, envelopeHash: 'stale-envelope' },
			kindMismatch,
		])
			expect(() => consumer.settle(mismatch)).toThrow(
				'Wallet relay receipt does not match the open attempt'
			)

		const approval = consumer.settle(receipt)
		expect(approval).toMatchObject({
			completedBy: 'walletconnect-relay',
		})
		expect(consumer.settle(receipt)).toBe(approval)
		expect(() => consumer.settle({
			...receipt,
			outcome: 'rejected',
		})).toThrow('conflicts with the terminal settlement')

		const retryCorrelation = {
			kind: 'request',
			attemptId: 'retry-attempt',
			authorityRequestId: 'retry-authority-request',
			envelopeHash: 'retry-envelope-hash',
			sessionTopic: 'retry-session-topic',
			requestId: 'retry-request-id',
		} as const
		await consumer.open({
			walletConnectUri: 'wc:retry-request-pairing@2',
			correlation: retryCorrelation,
		})
		expect(() => consumer.settle(receipt)).toThrow(
			'Wallet relay receipt does not match the open attempt'
		)
		const rejection = consumer.settle({
			...retryCorrelation,
			outcome: 'rejected',
		})
		expect(rejection).toMatchObject({
			completedBy: 'walletconnect-relay',
			receipt: {
				kind: 'request',
				sessionTopic: 'retry-session-topic',
				requestId: 'retry-request-id',
				outcome: 'rejected',
			},
		})
		expect(consumer.settle({
			...retryCorrelation,
			outcome: 'rejected',
		})).toBe(rejection)
	})

	it('fences a superseded pairing before accepting the current relay approval', async () => {
		const { consumer } = await startConsumer()
		const first = await openPairing(consumer, 'wc:first@2')
		const second = await openPairing(consumer, 'wc:second@2')

		expect(first.state).toBe('opened')
		expect(() => consumer.approvePairing(
			first.walletConnectUri,
			'first-session'
		)).toThrow('stale or superseded')
		expect(() => consumer.rejectPairing(
			first.walletConnectUri
		)).toThrow('stale or superseded')
		expect(() => consumer.settle({
			...first.correlation,
			sessionTopic: 'first-session',
			outcome: 'approved',
		})).toThrow('does not match the open attempt')
		expect(consumer.approvePairing(
			second.walletConnectUri,
			'second-session'
		)).toMatchObject({
			receipt: {
				sessionTopic: 'second-session',
			},
		})
	})

	it('settles an exact pairing rejection without session or request fields', async () => {
		const { consumer, controlled } = await startConsumer()
		const attempt = await openPairing(consumer)

		const settlement = consumer.rejectPairing(attempt.walletConnectUri)
		expect(settlement).toMatchObject({
			completedBy: 'walletconnect-relay',
			receipt: {
				kind: 'pairing',
				attemptId: attempt.correlation.attemptId,
				authorityRequestId: attempt.correlation.authorityRequestId,
				envelopeHash: attempt.correlation.envelopeHash,
				outcome: 'rejected',
			},
		})
		const rejection = {
			...attempt.correlation,
			outcome: 'rejected',
		} satisfies WalletLinkRelayReceipt
		expect(rejection).not.toHaveProperty('sessionTopic')
		expect(rejection).not.toHaveProperty('requestId')

		const rejectionWithTopic = { ...rejection }
		const rejectionWithRequestId = { ...rejection }
		Object.defineProperty(rejectionWithTopic, 'sessionTopic', {
			value: 'fabricated-session-topic',
		})
		Object.defineProperty(rejectionWithRequestId, 'requestId', {
			value: 'fabricated-request-id',
		})
		for (const fabricated of [
			rejectionWithTopic,
			rejectionWithRequestId,
		])
			expect(() => consumer.settle(fabricated)).toThrow('does not match')

		controlled.openUrls([blockheadWalletReturnUrl])
		expect(consumer.rejectPairing(attempt.walletConnectUri)).toBe(settlement)
		expect(() => consumer.approvePairing(
			attempt.walletConnectUri,
			'late-approved-session'
		)).toThrow('conflicts with the terminal settlement')
	})

	it('exposes no send or broadcast operation', async () => {
		const { consumer } = await startConsumer()

		expect(consumer).not.toHaveProperty('send')
		expect(consumer).not.toHaveProperty('broadcast')
		consumer.destroy()
	})

	it('fences app callbacks and relay results after destroy', async () => {
		const { consumer, controlled } = await startConsumer()
		const attempt = await openPairing(consumer)
		const settlement = consumer.rejectPairing(attempt.walletConnectUri)
		expect(settlement).toMatchObject({
			receipt: {
				outcome: 'rejected',
			},
		})
		consumer.destroy()

		controlled.openUrls([blockheadWalletReturnUrl])
		expect(consumer.current()).toMatchObject({
			state: 'cancelled',
		})
		await expect(openPairing(consumer)).rejects.toThrow('consumer is inactive')
		expect(() => consumer.approvePairing(
			attempt.walletConnectUri,
			'late-session'
		)).toThrow('consumer is inactive')
		expect(() => consumer.rejectPairing(
			attempt.walletConnectUri
		)).toThrow('consumer is inactive')
		expect(() => consumer.settle({
			...attempt.correlation,
			sessionTopic: 'late-session',
			outcome: 'approved',
		})).toThrow('consumer is inactive')
		expect(controlled.stop).toHaveBeenCalledOnce()
	})
})
