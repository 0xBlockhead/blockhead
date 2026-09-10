import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { ed25519 } from '@noble/curves/ed25519.js'
import { bech32, hex } from '@scure/base'
import { Blake2 } from '@tevm/voltaire/Blake2'
import { encode } from 'cborg'

import { WalletCapability } from '$/constants/Wallet.ts'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterResponseAuditFailure,
} from './types.ts'
import { createCardanoCip30Adapter } from './cardanoCip30.ts'
import { verifyCardanoCip30SignData } from './cardanoCip30SignData.ts'
import {
	ed25519SiblingPrivateKey as siblingPrivateKey,
	ed25519SigningPrivateKey as privateKey,
} from './ed25519Signing.fixtures.ts'

const walletId = 'cip30:controlled'
const publicKey = ed25519.getPublicKey(privateKey)
const mainnetAddress = hex.encode(new Uint8Array([
	0x61,
	...Blake2.hash(publicKey, 28),
]))
const siblingAddress = hex.encode(new Uint8Array([
	0x61,
	...Blake2.hash(ed25519.getPublicKey(siblingPrivateKey), 28),
]))
const rewardAddress = hex.encode(new Uint8Array([
	0xe1,
	...Blake2.hash(publicKey, 28),
]))

type CoseHeaders = Map<number | string, boolean | number | Uint8Array>

type DataSignature = {
	key: string
	signature: string
}

type ReceiverSensitiveApi = {
	getNetworkId(): Promise<number>
	getUsedAddresses(): Promise<string[]>
	signData(address: string, payload: string): Promise<DataSignature>
}

type ReceiverSensitiveWallet = {
	enable(): Promise<ReceiverSensitiveApi>
	isEnabled(): Promise<boolean>
}

// oxlint-disable-next-line typescript/no-restricted-types -- Controlled providers deliberately vary untrusted CIP-30 return values at this response-wire test seam.
type SignData = (address: string, payload: string) => Promise<unknown>

const dataSignature = ({
	address,
	payload,
	protectedAddress = hex.decode(address),
	responsePublicKey = publicKey,
	signedPayload = hex.decode(payload),
	signingKey = privateKey,
	unprotectedHeaders = new Map([
		['hashed', false],
	]),
}: {
	address: string
	payload: string
	protectedAddress?: Uint8Array
	responsePublicKey?: Uint8Array
	signedPayload?: Uint8Array
	signingKey?: Uint8Array
	unprotectedHeaders?: CoseHeaders
}): DataSignature => {
	const protectedHeaders = encode(new Map<
		number | string,
		number | Uint8Array
	>([
		[1, -8],
		['address', protectedAddress],
	]))
	const signature = ed25519.sign(
		encode([
			'Signature1',
			protectedHeaders,
			new Uint8Array(),
			signedPayload,
		]),
		signingKey
	)

	return {
		key: hex.encode(encode(new Map<number, number | Uint8Array>([
			[1, 1],
			[3, -8],
			[-1, 6],
			[-2, responsePublicKey],
		]))),
		signature: hex.encode(encode([
			protectedHeaders,
			unprotectedHeaders,
			signedPayload,
			signature,
		])),
	}
}

const createControlledWallet = ({
	getNetworkId = async () => 1,
	getUsedAddresses = async () => [mainnetAddress],
	signData = async (address, payload) => dataSignature({
		address,
		payload,
	}),
}: {
	getNetworkId?: () => Promise<number>
	getUsedAddresses?: () => Promise<string[]>
	signData?: SignData
} = {}) => {
	const signDataSpy = vi.fn(signData)
	const signTx = vi.fn()
	const submitTx = vi.fn()
	const enable = vi.fn(async () => ({
		getNetworkId,
		getUsedAddresses,
		signData: signDataSpy,
		signTx,
		submitTx,
	}))
	vi.stubGlobal('window', {
		cardano: {
			controlled: {
				enable,
			},
		},
	})

	const adapter = createCardanoCip30Adapter()
	const stop = adapter.start(() => {})

	return {
		adapter,
		enable,
		signDataSpy,
		signTx,
		stop,
		submitTx,
	}
}

const connectedAccount = async (
	adapter: ReturnType<typeof createCardanoCip30Adapter>
) => {
	const connection = await adapter.connect(walletId)
	const account = connection?.accounts[0]
	if (connection == null || account == null)
		throw new Error('Controlled Cardano wallet did not return an account')

	return {
		account,
		connection,
	}
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('controlled Cardano CIP-30 signData boundary', () => {
	it('drops an API acquired after adapter cleanup before its first connection read', async () => {
		const getNetworkId = vi.fn(async () => 1)
		const enabledApi = Promise.withResolvers<{
			getNetworkId(): Promise<number>
			getUsedAddresses(): Promise<string[]>
		}>()
		const enable = vi.fn(() => enabledApi.promise)
		vi.stubGlobal('window', {
			cardano: {
				controlled: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const stop = adapter.start(() => {})
		const pending = adapter.connect(walletId)
		stop()
		enabledApi.resolve({
			getNetworkId,
			getUsedAddresses: async () => [mainnetAddress],
		})

		await expect(pending).resolves.toBeUndefined()
		expect(getNetworkId).not.toHaveBeenCalled()
	})

	it('drops a connection read that finishes after a stop and reconnect', async () => {
		const firstNetworkId = Promise.withResolvers<number>()
		const firstGetNetworkId = vi.fn(() => firstNetworkId.promise)
		let enableCount = 0
		const enable = vi.fn(async () => {
			enableCount++
			if (enableCount === 1) {
				return {
					getNetworkId: firstGetNetworkId,
					getUsedAddresses: async () => [mainnetAddress],
				}
			}

			return {
				getNetworkId: async () => 1,
				getUsedAddresses: async () => [mainnetAddress],
			}
		})
		vi.stubGlobal('window', {
			cardano: {
				controlled: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const firstStop = adapter.start(() => {})
		const firstConnection = adapter.connect(walletId)
		await vi.waitFor(() => {
			expect(firstGetNetworkId).toHaveBeenCalledOnce()
		})
		firstStop()
		const secondStop = adapter.start(() => {})

		try {
			const secondConnection = await adapter.connect(walletId)
			firstNetworkId.resolve(1)

			await expect(firstConnection).resolves.toBeUndefined()
			expect(secondConnection?.accounts[0]?.accountAddress).toBe(
				bech32.encode('addr', bech32.toWords(hex.decode(mainnetAddress)), false)
			)
		}
		finally {
			secondStop()
		}
	})

	it('preserves injected wallet and API receivers for polling and signData', async () => {
		let api: ReceiverSensitiveApi
		api = {
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [mainnetAddress],
			signData: vi.fn(async function (
				this: ReceiverSensitiveApi,
				address: string,
				payload: string
		) {
				if (this !== api)
					throw new Error('Cardano CIP-30 signData lost its injected API receiver')

				return dataSignature({ address, payload })
			}),
		}
		let wallet: ReceiverSensitiveWallet
		wallet = {
			enable: vi.fn(async () => api),
			isEnabled: vi.fn(async function (this: ReceiverSensitiveWallet) {
				if (this !== wallet)
					throw new Error('Cardano CIP-30 isEnabled lost its injected wallet receiver')

				return true
			}),
		}
		vi.stubGlobal('window', {
			cardano: {
				controlled: wallet,
			},
		})
		const adapter = createCardanoCip30Adapter()
		const stop = adapter.start(() => {})
		let accountAddress: string | undefined
		const unsubscribe = adapter.subscribeConnection(walletId, (connection) => {
			accountAddress = connection.accounts[0]?.accountAddress
		})

		try {
			await vi.waitFor(() => {
				expect(accountAddress).toBeDefined()
			})
			if (accountAddress == null)
				throw new Error('Receiver-sensitive Cardano wallet did not publish an account')

			await expect(adapter.signMessage?.(
				walletId,
				accountAddress,
				'Retain Cardano provider receivers'
			)).resolves.toMatch(/^[0-9a-f]+$/)
			expect(wallet.isEnabled).toHaveBeenCalled()
			expect(api.signData).toHaveBeenCalledOnce()
		}
		finally {
			unsubscribe()
			stop()
		}
	})

	it('returns only a verified COSE response for the exact hexadecimal CIP-30 request', async () => {
		const message = 'Blockhead Cardano signing challenge: session 42, revision 3'
		const controlled = createControlledWallet()

		try {
			const {
				account,
				connection,
			} = await connectedAccount(controlled.adapter)
			const returned = await controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				message
			)
			const payload = hex.encode(new TextEncoder().encode(message))

			expect(connection.accounts[0]?.capabilities).toContain(WalletCapability.SignMessage)
			expect(connection.accounts[0]?.capabilities).not.toContain(WalletCapability.SignTransaction)
			expect(connection.scopes[0]?.methods).toEqual([
				'enable',
				'getUsedAddresses',
				'signData',
			])
			expect(returned).toMatch(/^[0-9a-f]+$/)
			expect(controlled.signDataSpy).toHaveBeenCalledExactlyOnceWith(
				mainnetAddress,
				payload
			)
			expect(controlled.signTx).not.toHaveBeenCalled()
			expect(controlled.submitTx).not.toHaveBeenCalled()
		}
		finally {
			controlled.stop()
		}
	})

	it('accepts an exact reward-address COSE response at the verifier boundary', () => {
		const payload = hex.encode(new TextEncoder().encode('Cardano reward credential'))
		const response = dataSignature({
			address: rewardAddress,
			payload,
		})

		expect(verifyCardanoCip30SignData({
			address: rewardAddress,
			payload,
			response,
		})).toBe(response.signature)
	})

	it('rejects malformed DataSignature values after dispatch', async () => {
		const controlled = createControlledWallet({
			signData: async () => 42,
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Malformed Cardano COSE response'
			)).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
			expect(controlled.signDataSpy).toHaveBeenCalledOnce()
		}
		finally {
			controlled.stop()
		}
	})

	it('rejects malformed CBOR evidence after dispatch', async () => {
		const controlled = createControlledWallet({
			signData: async (address, payload) => ({
				...dataSignature({ address, payload }),
				signature: 'ff',
			}),
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Malformed Cardano CBOR response'
			)).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
			expect(controlled.signDataSpy).toHaveBeenCalledOnce()
		}
		finally {
			controlled.stop()
		}
	})

	it.each([
		{
			name: 'sibling public key',
			response: (address: string, payload: string) => dataSignature({
				address,
				payload,
				responsePublicKey: ed25519.getPublicKey(siblingPrivateKey),
				signingKey: siblingPrivateKey,
			}),
		},
		{
			name: 'substituted protected address',
			response: (address: string, payload: string) => dataSignature({
				address,
				payload,
				protectedAddress: hex.decode(siblingAddress),
			}),
		},
		{
			name: 'substituted payload',
			response: (address: string, payload: string) => dataSignature({
				address,
				payload,
				signedPayload: new Uint8Array([
					...hex.decode(payload),
					0,
				]),
			}),
		},
	])('rejects a $name even when its COSE signature is otherwise valid', async ({
		response,
	}) => {
		const controlled = createControlledWallet({
			signData: async (address, payload) => response(address, payload),
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Exact Cardano request'
			)).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
			expect(controlled.signDataSpy).toHaveBeenCalledOnce()
		}
		finally {
			controlled.stop()
		}
	})

	it('rejects a CIP-8 response without its required unhashed marker', async () => {
		const controlled = createControlledWallet({
			signData: async (address, payload) => dataSignature({
				address,
				payload,
				unprotectedHeaders: new Map<
					number | string,
					boolean | number | Uint8Array
				>(),
			}),
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'CIP-8 declares hashed payload mode explicitly'
			)).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		}
		finally {
			controlled.stop()
		}
	})

	it('rejects CIP-8 hashed mode because CIP-30 requires an unhashed payload', async () => {
		const controlled = createControlledWallet({
			signData: async (address, payload) => dataSignature({
				address,
				payload,
				unprotectedHeaders: new Map([
					['hashed', true],
				]),
			}),
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'CIP-30 does not permit hashed payload mode'
			)).rejects.toBeInstanceOf(WalletAdapterResponseAuditFailure)
		}
		finally {
			controlled.stop()
		}
	})

	it('preserves the wallet approval rejection without attempting a transaction', async () => {
		const rejection = new Error('User rejected Cardano data signing')
		const controlled = createControlledWallet({
			signData: async () => {
				throw rejection
			},
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)

			await expect(controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Do not approve this Cardano challenge'
			)).rejects.toBe(rejection)
			expect(controlled.signDataSpy).toHaveBeenCalledOnce()
			expect(controlled.signTx).not.toHaveBeenCalled()
			expect(controlled.submitTx).not.toHaveBeenCalled()
		}
		finally {
			controlled.stop()
		}
	})

	it('fences a disconnect that happens while the live authority read is pending', async () => {
		const liveNetworkId = Promise.withResolvers<number>()
		const getNetworkId = vi.fn()
			.mockResolvedValueOnce(1)
			.mockImplementationOnce(() => liveNetworkId.promise)
		const controlled = createControlledWallet({
			getNetworkId,
		})

		try {
			const {
				account,
			} = await connectedAccount(controlled.adapter)
			const pending = controlled.adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Fence stale Cardano authority before dispatch'
			)
			await vi.waitFor(() => expect(getNetworkId).toHaveBeenCalledTimes(2))
			controlled.adapter.disconnect(walletId)
			liveNetworkId.resolve(1)

			await expect(pending).rejects.toBeInstanceOf(WalletAdapterPreDispatchFailure)
			expect(controlled.signDataSpy).not.toHaveBeenCalled()
		}
		finally {
			controlled.stop()
		}
	})

	it('fences an old signData response across stop and reconnect', async () => {
		const oldResponse = Promise.withResolvers<DataSignature>()
		const firstSignData = vi.fn(() => oldResponse.promise)
		const secondSignData = vi.fn(async (address: string, payload: string) => dataSignature({
			address,
			payload,
		}))
		const firstEnable = vi.fn(async () => ({
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [mainnetAddress],
			signData: firstSignData,
		}))
		const secondEnable = vi.fn(async () => ({
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [mainnetAddress],
			signData: secondSignData,
		}))
		vi.stubGlobal('window', {
			cardano: {
				controlled: {
					enable: vi.fn()
						.mockImplementationOnce(firstEnable)
						.mockImplementationOnce(secondEnable),
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const firstStop = adapter.start(() => {})

		try {
			const {
				account,
			} = await connectedAccount(adapter)
			const pending = adapter.signMessage?.(
				walletId,
				account.accountAddress,
				'Fence stale Cardano signature after dispatch'
			)
			await vi.waitFor(() => expect(firstSignData).toHaveBeenCalledOnce())
			firstStop()
			const secondStop = adapter.start(() => {})
			const reconnected = await connectedAccount(adapter)
			oldResponse.resolve(dataSignature({
				address: mainnetAddress,
				payload: hex.encode(new TextEncoder().encode('Fence stale Cardano signature after dispatch')),
			}))

			await expect(pending).rejects.toThrow(
				'Cardano CIP-30 connection changed while signData was pending'
			)
			await expect(adapter.signMessage?.(
				walletId,
				reconnected.account.accountAddress,
				'Current Cardano signature'
			)).resolves.toMatch(/^[0-9a-f]+$/)
			expect(secondSignData).toHaveBeenCalledOnce()
			secondStop()
		}
		finally {
			firstStop()
		}
	})
})
