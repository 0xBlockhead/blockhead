import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
	farcasterProofAccountFromWalletConnection,
	farcasterProofWalletConnection,
	farcasterProofWalletConnections,
	signFarcasterAccountConnectionChallenge,
	type FarcasterEip155WalletAccount,
	type FarcasterProofAccount,
	type FarcasterProofWalletConnection,
	type FarcasterWalletSigner,
} from '$/state/farcaster/farcasterWalletProof.ts'
import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'

const challenge = {
	challengeId: 'challenge',
	connectionId: 'connection',
	fid: 3,
	method: 'custody',
	signerAddress: '0x1111111111111111111111111111111111111111',
	origin: 'https://blockhead.info',
	uri: 'https://blockhead.info/farcaster/accounts',
	chainId: 1,
	nonce: 'nonce',
	issuedAt: 1,
	expiresAt: 2,
} as const

const eip155Account = {
	namespace: 'eip155',
	reference: '1',
	accountAddress: challenge.signerAddress,
	capabilities: [WalletCapability.SignMessage],
} as const satisfies FarcasterEip155WalletAccount

const eip155ProofConnection = {
	connectionKey: 'wallet',
	walletId: 'wallet',
	status: BlockheadConnectionStatus.Connected,
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [{
		namespace: 'eip155',
		reference: '1',
		methods: ['personal_sign'],
		events: ['accountsChanged'],
	}],
	accounts: [eip155Account],
	activeAccount: eip155Account,
	selected: true,
	connectedAt: 1,
} as const satisfies FarcasterProofWalletConnection

const bip122Connection = {
	connectionKey: 'bitcoin',
	walletId: 'bitcoin:unisat',
	status: BlockheadConnectionStatus.Connected,
	protocol: WalletProtocol.BitcoinInjected,
	transportKind: WalletTransportKind.InjectedSigner,
	scopes: [{
		namespace: 'bip122',
		reference: '000000000019d6689c085ae165831e93',
		methods: ['signMessage'],
		events: [],
	}],
	accounts: [{
		namespace: 'bip122',
		reference: '000000000019d6689c085ae165831e93',
		accountAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
		capabilities: [WalletCapability.SignMessage],
	}],
	activeAccount: {
		namespace: 'bip122',
		reference: '000000000019d6689c085ae165831e93',
		accountAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
		capabilities: [WalletCapability.SignMessage],
	},
	selected: true,
	connectedAt: 1,
} as const satisfies WalletConnection

describe('Farcaster wallet proof bridge', () => {
	it('keeps proof accounts eip155-only and projects only Connected+selected EVM sessions', () => {
		expectTypeOf<FarcasterWalletSigner['connections'][number]['activeAccount']['namespace']>()
			.toEqualTypeOf<'eip155'>()
		expectTypeOf<FarcasterProofWalletConnection['accounts'][number]['namespace']>()
			.toEqualTypeOf<'eip155'>()
		expectTypeOf<FarcasterProofAccount['namespace']>().toEqualTypeOf<'eip155'>()
		expectTypeOf<FarcasterEip155WalletAccount>().not.toMatchTypeOf<{
			namespace: 'bip122'
		}>()

		const unselectedEip155 = {
			...eip155ProofConnection,
			selected: false as const,
			activeAccount: undefined,
		} satisfies WalletConnection

		expect(farcasterProofAccountFromWalletConnection(eip155ProofConnection)).toEqual({
			namespace: 'eip155',
			reference: '1',
			accountAddress: challenge.signerAddress,
		})
		expect(farcasterProofAccountFromWalletConnection({
			connectionKey: 'wallet',
			walletId: 'wallet',
			status: BlockheadConnectionStatus.Disconnected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [...eip155ProofConnection.accounts],
		})).toBeUndefined()
		expect(farcasterProofAccountFromWalletConnection(bip122Connection)).toBeUndefined()
		expect(farcasterProofWalletConnection(bip122Connection)).toBeUndefined()
		expect(farcasterProofWalletConnection(unselectedEip155)).toBeUndefined()
		expect(farcasterProofWalletConnection(eip155ProofConnection)).toMatchObject({
			connectionKey: 'wallet',
			activeAccount: {
				namespace: 'eip155',
				accountAddress: challenge.signerAddress,
			},
		})
		expect(farcasterProofWalletConnections([
			bip122Connection,
			eip155ProofConnection,
			unselectedEip155,
		])).toEqual([
			expect.objectContaining({
				connectionKey: 'wallet',
				activeAccount: expect.objectContaining({
					namespace: 'eip155',
				}),
			}),
		])
	})

	it('signs the exact bound challenge through the selected EIP-1193 connection', async () => {
		const signMessage = vi.fn(async () => ({
			accountAddress: challenge.signerAddress,
			signature: '0xsigned',
		}))
		await expect(signFarcasterAccountConnectionChallenge({
			connectionKey: 'wallet',
			challenge,
			walletRuntime: {
				connections: [eip155ProofConnection],
				signMessage,
			},
		})).resolves.toEqual({
			accountAddress: challenge.signerAddress,
			signature: '0xsigned',
		})
		expect(signMessage).toHaveBeenCalledWith(
			'wallet',
			JSON.stringify(challenge)
		)
	})

	it('rejects a wallet account that differs from the challenge signer', async () => {
		await expect(signFarcasterAccountConnectionChallenge({
			connectionKey: 'wallet',
			challenge,
			walletRuntime: {
				connections: [{
					...eip155ProofConnection,
					accounts: [{
						...eip155Account,
						accountAddress: '0x2222222222222222222222222222222222222222',
					}],
					activeAccount: {
						...eip155Account,
						accountAddress: '0x2222222222222222222222222222222222222222',
					},
				}],
				signMessage: vi.fn(),
			},
		})).rejects.toThrow('does not match')
	})

	it('rejects a missing proof connection key without calling signMessage', async () => {
		const signMessage = vi.fn()
		await expect(signFarcasterAccountConnectionChallenge({
			connectionKey: 'missing',
			challenge,
			walletRuntime: {
				connections: [eip155ProofConnection],
				signMessage,
			},
		})).rejects.toThrow('Farcaster proof requires a connected EVM account')
		expect(signMessage).not.toHaveBeenCalled()
	})
})
