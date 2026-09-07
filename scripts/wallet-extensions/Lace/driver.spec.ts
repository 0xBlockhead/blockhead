import assert from 'node:assert/strict'
import test from 'node:test'

import { ed25519 } from '@noble/curves/ed25519.js'
import { hex } from '@scure/base'
import { Blake2 } from '@tevm/voltaire/Blake2'
import { encode } from 'cborg'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	LaceCip30SigningLifecycle,
	isLaceExpoPageUrl,
	laceDriver,
	laceSidePanelBlockedObservation,
	signLaceCip30Data,
	type LaceCip30Api,
	type LaceCip30Provider,
} from './driver.ts'
import { laceWalletMatrixScenarios } from './matrix.ts'


const privateKey = new Uint8Array([
	7,
	19,
	31,
	43,
	59,
	71,
	83,
	97,
	109,
	127,
	139,
	151,
	163,
	179,
	191,
	211,
	223,
	229,
	233,
	239,
	241,
	251,
	3,
	13,
	23,
	37,
	47,
	61,
	73,
	89,
	101,
	113,
])
const publicKey = ed25519.getPublicKey(privateKey)
const address = hex.encode(new Uint8Array([
	0x61,
	...Blake2.hash(publicKey, 28),
]))
const payload = hex.encode(new TextEncoder().encode('Lace CIP-30 lifecycle contract'))

const signedDataResponse = (
	requestedAddress: string,
	requestedPayload: string
) => {
	const protectedHeaders = encode(new Map<
		number | string,
		number | Uint8Array
	>([
		[
			1,
			-8,
		],
		[
			'address',
			hex.decode(requestedAddress),
		],
	]))
	const signature = ed25519.sign(
		encode([
			'Signature1',
			protectedHeaders,
			new Uint8Array(),
			hex.decode(requestedPayload),
		]),
		privateKey
	)

	return {
		key: hex.encode(encode(new Map<
			number,
			number | Uint8Array
		>([
			[
				1,
				1,
			],
			[
				3,
				-8,
			],
			[
				-1,
				6,
			],
			[
				-2,
				publicKey,
			],
		]))),
		signature: hex.encode(encode([
			protectedHeaders,
			new Map<
				string,
				boolean
			>([
				[
					'hashed',
					false,
				],
			]),
			hex.decode(requestedPayload),
			signature,
		])),
	}
}


test('maps headed CIP-30 Connect chrome to Lace expo/index.html URLs', () => {
	const extensionId = 'gafhhkghbfjjkeiendhlofajokpaflmk'
	assert.equal(isLaceExpoPageUrl(`chrome-extension://${extensionId}/expo/index.html`, extensionId), true)
	assert.equal(isLaceExpoPageUrl(`chrome-extension://${extensionId}/expo/index.html#/`, extensionId), true)
	assert.equal(isLaceExpoPageUrl(`chrome-extension://${extensionId}/hw-usb-picker.html`, extensionId), false)
	assert.equal(isLaceExpoPageUrl(`chrome-extension://other/expo/index.html`, extensionId), false)
})

test('keeps the Lace account lifecycle shard free of invented side-panel passes', () => {
	assert.equal(laceDriver.kind, 'lace')
	assert.deepEqual(laceWalletMatrixScenarios('2.2.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'lace-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'side-panel-onboarding-blocked',
		},
		{
			id: 'lace-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'side-panel-second-account-blocked',
		},
		{
			id: 'lace-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'side-panel-recover-blocked',
		},
	])
})

test('declares Lace side-panel onboarding/recover as explicit blocked matrix cells', async () => {
	const scenarios = laceWalletMatrixScenarios('2.2.0')
	assert.deepEqual(
		scenarios.map((scenario) => laceSidePanelBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-onboarding-blocked',
					detail: 'Lace 2.2.0 headed expo side-panel create-new onboarding is not reliably executable in unattended automation',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-second-account-blocked',
					detail: 'Lace second-account derivation depends on side-panel onboarding that is not yet reliably executable',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-recover-blocked',
					detail: 'Lace side-panel recover onboarding is not reliably executable in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'lace',
				run: async (scenario) => laceSidePanelBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
			'blocked',
		],
		'lace side-panel honesty'
	)
})

test('verifies Lace signData and requires an active owned lifecycle across reconnects', async () => {
	const response = signedDataResponse(address, payload)
	const lifecycle = new LaceCip30SigningLifecycle()
	const calls: string[] = []
	let api: LaceCip30Api
	api = {
		getUsedAddresses: async function (this: LaceCip30Api) {
			assert.equal(this, api)
			calls.push('getUsedAddresses')
			return [
				address,
			]
		},
		signData: async function (
			this: LaceCip30Api,
			requestedAddress: string,
			requestedPayload: string
		) {
			assert.equal(this, api)
			assert.equal(requestedAddress, address)
			assert.equal(requestedPayload, payload)
			calls.push('signData')
			return response
		},
	}
	let provider: LaceCip30Provider
	provider = {
		enable: async function (this: LaceCip30Provider) {
			assert.equal(this, provider)
			calls.push('enable')
			return api
		},
		isEnabled: async function (this: LaceCip30Provider) {
			assert.equal(this, provider)
			calls.push('isEnabled')
			return true
		},
	}

	const signature = await signLaceCip30Data({
		address,
		lifecycle,
		payload,
		provider,
	})

	assert.equal(signature, response.signature)
	assert.deepEqual(calls, [
		'isEnabled',
		'enable',
		'getUsedAddresses',
		'signData',
	])

	for (const transition of [
		'stop',
		'disconnect',
	] as const) {
		calls.length = 0
		lifecycle[transition]()
		await assert.rejects(signLaceCip30Data({
			address,
			lifecycle,
			payload,
			provider,
		}), /not active/)
		assert.deepEqual(calls, [], transition)

		lifecycle.reconnect()
		assert.equal(await signLaceCip30Data({
			address,
			lifecycle,
			payload,
			provider,
		}), response.signature)
		assert.deepEqual(calls, [
			'isEnabled',
			'enable',
			'getUsedAddresses',
			'signData',
		], transition)
	}
})

test('does not acquire a Lace CIP-30 API after a stopped enabled read', async () => {
	const lifecycle = new LaceCip30SigningLifecycle()
	const enabled = Promise.withResolvers<boolean>()
	let enableCalls = 0
	const provider: LaceCip30Provider = {
		enable: async () => {
			enableCalls += 1
			throw new Error('Lace CIP-30 API acquisition should not begin after stop')
		},
		isEnabled: async () => enabled.promise,
	}
	const pending = signLaceCip30Data({
		address,
		lifecycle,
		payload,
		provider,
	})

	lifecycle.stop()
	enabled.resolve(true)

	await assert.rejects(pending, /became stale during lifecycle transition/)
	assert.equal(enableCalls, 0)
})

test('does not dispatch Lace signData after a disconnected account read', async () => {
	const lifecycle = new LaceCip30SigningLifecycle()
	const accountReadStarted = Promise.withResolvers<void>()
	const usedAddresses = Promise.withResolvers<readonly string[]>()
	const response = signedDataResponse(address, payload)
	let signDataCalls = 0
	const api: LaceCip30Api = {
		getUsedAddresses: async () => {
			accountReadStarted.resolve()
			return usedAddresses.promise
		},
		signData: async () => {
			signDataCalls += 1
			return response
		},
	}
	const provider: LaceCip30Provider = {
		enable: async () => api,
		isEnabled: async () => true,
	}
	const pending = signLaceCip30Data({
		address,
		lifecycle,
		payload,
		provider,
	})

	await accountReadStarted.promise
	lifecycle.disconnect()
	usedAddresses.resolve([
		address,
	])

	await assert.rejects(pending, /became stale during lifecycle transition/)
	assert.equal(signDataCalls, 0)
})

test('does not return a Lace signData response after reconnect', async () => {
	const lifecycle = new LaceCip30SigningLifecycle()
	const signDataStarted = Promise.withResolvers<void>()
	const responseReady = Promise.withResolvers<ReturnType<typeof signedDataResponse>>()
	const response = signedDataResponse(address, payload)
	const api: LaceCip30Api = {
		getUsedAddresses: async () => [
			address,
		],
		signData: async () => {
			signDataStarted.resolve()
			return responseReady.promise
		},
	}
	const provider: LaceCip30Provider = {
		enable: async () => api,
		isEnabled: async () => true,
	}
	const pending = signLaceCip30Data({
		address,
		lifecycle,
		payload,
		provider,
	})

	await signDataStarted.promise
	lifecycle.reconnect()
	responseReady.resolve(response)

	await assert.rejects(pending, /became stale during lifecycle transition/)
})

test('preserves a Lace signData rejection', async () => {
	const rejection = new Error('Lace user rejected signData')
	const lifecycle = new LaceCip30SigningLifecycle()
	const api: LaceCip30Api = {
		getUsedAddresses: async () => [
			address,
		],
		signData: async () => {
			throw rejection
		},
	}
	const provider: LaceCip30Provider = {
		enable: async () => api,
		isEnabled: async () => true,
	}

	await assert.rejects(signLaceCip30Data({
		address,
		lifecycle,
		payload,
		provider,
	}), rejection)
})
