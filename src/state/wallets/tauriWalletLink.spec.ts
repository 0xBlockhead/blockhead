import { describe, expect, it, vi } from 'vitest'

import {
	blockheadWalletReturnUrl,
	cancelTauriWalletLink,
	createTauriWalletLinkRuntime,
	markTauriWalletLinkOpened,
	metamaskMobileTauriWalletLaunchTarget,
	observeTauriWalletReturn,
	prepareTauriWalletLink,
	settleTauriWalletLink,
	type WalletLinkCorrelation,
	type WalletLinkRelayReceipt,
	type TauriWalletLinkHost,
} from './tauriWalletLink.ts'
const target = metamaskMobileTauriWalletLaunchTarget

const requestCorrelation = {
	kind: 'request',
	attemptId: 'attempt-7',
	authorityRequestId: 'authority-request-9',
	envelopeHash: 'envelope-hash-11',
	sessionTopic: 'session-topic-13',
	requestId: 'request-15',
} satisfies WalletLinkCorrelation

const pairingCorrelation = {
	kind: 'pairing',
	attemptId: 'pairing-attempt-17',
	authorityRequestId: 'pairing-authority-request-19',
	envelopeHash: 'pairing-envelope-hash-21',
} satisfies WalletLinkCorrelation

const controlledHost = () => {
	let openListener = (_urls: readonly string[]) => {}
	let finishOpen = () => {}
	let stopCount = 0
	const openedUrls: string[] = []
	const host = {
		openUrl: async (url) => {
			openedUrls.push(url)
			await new Promise<void>((resolve) => {
				finishOpen = resolve
			})
		},
		getCurrent: async () => null,
		onOpenUrl: async (listener) => {
			openListener = listener
			return () => {
				stopCount += 1
			}
		},
	} satisfies TauriWalletLinkHost
	return {
		host,
		openedUrls,
		openUrls: (urls: readonly string[]) => openListener(urls),
		finishOpen: () => finishOpen(),
		stopCount: () => stopCount,
	}
}

describe('Tauri WalletConnect application linking', () => {
	it('exports the immutable MetaMask Mobile target and encodes the exact WalletConnect URI', () => {
		expect(target).toEqual({
			walletId: 'metamask-mobile',
			bundleId: 'io.metamask.MetaMask',
			version: '8.12.0+904d9f5d',
			launchBaseUrl: 'metamask://wc?uri=',
		})
		expect(Object.isFrozen(target)).toBe(true)
		expect(Object.getOwnPropertyDescriptor(target, 'walletId')).toMatchObject({
			writable: false,
		})

		const attempt = prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:pairing@2?relay-protocol=irn&symKey=secret',
			correlation: requestCorrelation,
		})

		expect(attempt).toMatchObject({ target, correlation: requestCorrelation })
		expect(attempt.launchUrl).toBe(
			'metamask://wc?uri=wc%3Apairing%402%3Frelay-protocol%3Dirn%26symKey%3Dsecret'
		)
		expect(() => prepareTauriWalletLink({
			target: { ...target, launchBaseUrl: 'wc:' },
			walletConnectUri: 'wc:pairing@2',
			correlation: requestCorrelation,
		})).toThrow('one selected wallet')
	})

	it('records the unique app return without treating it as approval', () => {
		const prepared = prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:request-topic@2',
			correlation: requestCorrelation,
		})
		const opened = markTauriWalletLinkOpened(prepared, 17)
		const returned = observeTauriWalletReturn(
			opened,
			[blockheadWalletReturnUrl],
			19
		)

		expect(returned).toMatchObject({ state: 'returned', openedAt: 17, returnedAt: 19 })
		expect(returned).not.toHaveProperty('outcome')
		expect(() => observeTauriWalletReturn(
			cancelTauriWalletLink(opened),
			[blockheadWalletReturnUrl],
			23
		)).toThrow('no matching open attempt')
	})

	it('accepts authority only from an exact relay-correlated receipt', () => {
		const opened = markTauriWalletLinkOpened(prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:request-topic@2',
			correlation: requestCorrelation,
		}), 29)
		const receipt = {
			kind: 'request',
			attemptId: 'attempt-7',
			authorityRequestId: 'authority-request-9',
			envelopeHash: 'envelope-hash-11',
			sessionTopic: 'session-topic-13',
			requestId: 'request-15',
			outcome: 'approved',
		} satisfies WalletLinkRelayReceipt

		expect(settleTauriWalletLink(opened, receipt)).toMatchObject({
			receipt,
			completedBy: 'walletconnect-relay',
		})
		for (const mismatch of [
			{ ...receipt, attemptId: 'stale-attempt' },
			{ ...receipt, authorityRequestId: 'stale-authority-request' },
			{ ...receipt, envelopeHash: 'stale-envelope' },
			{ ...receipt, sessionTopic: 'stale-topic' },
			{ ...receipt, requestId: 'stale-request' },
		])
			expect(() => settleTauriWalletLink(opened, mismatch)).toThrow('does not match')
	})

	it('settles pairing approval with its session topic and pre-approval rejection without one', () => {
		const opened = markTauriWalletLinkOpened(prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:pairing-topic@2',
			correlation: pairingCorrelation,
		}), 31)
		const rejection = {
			...pairingCorrelation,
			outcome: 'rejected',
		} satisfies WalletLinkRelayReceipt
		const approval = {
			...pairingCorrelation,
			sessionTopic: 'approved-session-topic',
			outcome: 'approved',
		} satisfies WalletLinkRelayReceipt

		expect(settleTauriWalletLink(opened, rejection)).toMatchObject({
			receipt: rejection,
			completedBy: 'walletconnect-relay',
		})
		expect(rejection).not.toHaveProperty('sessionTopic')
		expect(settleTauriWalletLink(opened, approval)).toMatchObject({
			receipt: approval,
			completedBy: 'walletconnect-relay',
		})
	})

	it('does not weaken request or pairing receipt correlation', () => {
		const openedRequest = markTauriWalletLinkOpened(prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:request-topic@2',
			correlation: requestCorrelation,
		}), 37)
		const openedPairing = markTauriWalletLinkOpened(prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:pairing-topic@2',
			correlation: pairingCorrelation,
		}), 41)
		const requestRejection = {
			...requestCorrelation,
			outcome: 'rejected',
		} satisfies WalletLinkRelayReceipt
		expect(settleTauriWalletLink(openedRequest, requestRejection)).toMatchObject({
			receipt: requestRejection,
			completedBy: 'walletconnect-relay',
		})
		const requestWithoutTopic = { ...requestRejection }
		const requestWithoutId = { ...requestRejection }
		Object.defineProperty(requestWithoutTopic, 'sessionTopic', { value: undefined })
		Object.defineProperty(requestWithoutId, 'requestId', { value: undefined })

		for (const weakenedRequestReceipt of [
			requestWithoutTopic,
			requestWithoutId,
		])
			expect(() => settleTauriWalletLink(
				openedRequest,
				weakenedRequestReceipt
			)).toThrow('does not match')

		const pairingRejection = {
			...pairingCorrelation,
			outcome: 'rejected',
		} satisfies WalletLinkRelayReceipt
		const pairingApproval = {
			...pairingCorrelation,
			sessionTopic: 'approved-session-topic',
			outcome: 'approved',
		} satisfies WalletLinkRelayReceipt
		const rejectionWithTopic = { ...pairingRejection }
		const rejectionWithRequestId = { ...pairingRejection }
		const approvalWithoutTopic = { ...pairingApproval }
		Object.defineProperty(rejectionWithTopic, 'sessionTopic', {
			value: 'fabricated-session-topic',
		})
		Object.defineProperty(rejectionWithRequestId, 'requestId', {
			value: 'fabricated-request-id',
		})
		approvalWithoutTopic.sessionTopic = ''

		for (const invalidPairingReceipt of [
			rejectionWithTopic,
			rejectionWithRequestId,
			approvalWithoutTopic,
		])
			expect(() => settleTauriWalletLink(
				openedPairing,
				invalidPairingReceipt
			)).toThrow('does not match')
	})

	it('subscribes before native open and ignores a return before the opener succeeds', async () => {
		const controlled = controlledHost()
		const attempts: string[] = []
		const runtime = createTauriWalletLinkRuntime({
			target,
			host: controlled.host,
			onAttempt: ({ state }) => attempts.push(state),
		})
		await runtime.start()
		const opening = runtime.open({
			walletConnectUri: 'wc:pairing@2',
			correlation: requestCorrelation,
		})

		controlled.openUrls([blockheadWalletReturnUrl])
		expect(runtime.current()?.state).toBe('prepared')
		controlled.finishOpen()
		await expect(opening).resolves.toMatchObject({ state: 'opened' })
		controlled.openUrls([blockheadWalletReturnUrl])

		expect(runtime.current()?.state).toBe('returned')
		expect(controlled.openedUrls).toEqual([
			'metamask://wc?uri=wc%3Apairing%402',
		])
		expect(attempts).toEqual(['prepared', 'opened', 'returned'])
	})

	it('restores one exact open attempt and rejects unrelated or post-destroy returns', async () => {
		let openListener = (_urls: readonly string[]) => {}
		let stopCount = 0
		const restoredAttempt = markTauriWalletLinkOpened(prepareTauriWalletLink({
			target,
			walletConnectUri: 'wc:restored@2',
			correlation: requestCorrelation,
		}), 31)
		const runtime = createTauriWalletLinkRuntime({
			target,
			restoredAttempt,
			host: {
				openUrl: async () => {},
				getCurrent: async () => [blockheadWalletReturnUrl],
				onOpenUrl: async (listener) => {
					openListener = listener
					return () => {
						stopCount += 1
					}
				},
			},
		})

		await runtime.start()
		expect(runtime.current()?.state).toBe('returned')
		runtime.destroy()
		openListener([blockheadWalletReturnUrl])
		expect(runtime.current()?.state).toBe('cancelled')
		expect(stopCount).toBe(1)
		await expect(runtime.start()).rejects.toThrow('cannot restart')
	})

	it('tears down a late native listener without reading stale cold-start ingress', async () => {
		let resolveListener = (_stop: () => void) => {}
		const stopOpenUrls = vi.fn()
		const getCurrent = vi.fn(async () => [blockheadWalletReturnUrl])
		const runtime = createTauriWalletLinkRuntime({
			target,
			host: {
				openUrl: async () => {},
				getCurrent,
				onOpenUrl: async () => new Promise((resolve) => {
					resolveListener = resolve
				}),
			},
		})

		const starting = runtime.start()
		runtime.destroy()
		resolveListener(stopOpenUrls)
		await starting

		expect(stopOpenUrls).toHaveBeenCalledOnce()
		expect(getCurrent).not.toHaveBeenCalled()
	})

	it('cancels a failed native open and cannot settle from the app callback', async () => {
		const runtime = createTauriWalletLinkRuntime({
			target,
			host: {
				openUrl: async () => {
					throw new Error('native open denied')
				},
				getCurrent: async () => null,
				onOpenUrl: async () => () => {},
			},
		})
		await runtime.start()

		await expect(runtime.open({
			walletConnectUri: 'wc:failed@2',
			correlation: requestCorrelation,
		})).rejects.toThrow('native open denied')
		expect(runtime.current()?.state).toBe('cancelled')
		expect(() => runtime.settle({
			kind: 'request',
			attemptId: 'attempt-7',
			authorityRequestId: 'authority-request-9',
			envelopeHash: 'envelope-hash-11',
			sessionTopic: 'session-topic-13',
			requestId: 'request-15',
			outcome: 'approved',
		})).toThrow('no active open attempt')
	})
})
