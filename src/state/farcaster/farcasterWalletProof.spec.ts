import { describe, expect, it, vi } from 'vitest'

import { signFarcasterAccountConnectionChallenge } from '$/state/farcaster/farcasterWalletProof.ts'
import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'

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

describe('Farcaster wallet proof bridge', () => {
	it('signs the exact bound challenge through the selected EIP-1193 connection', async () => {
		const signMessage = vi.fn(async () => ({
			accountAddress: challenge.signerAddress,
			signature: '0xsigned',
		}))
		await expect(signFarcasterAccountConnectionChallenge({
			connectionKey: 'wallet',
			challenge,
			walletRuntime: {
				connections: [{
					connectionKey: 'wallet',
					walletId: 'wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [{
						namespace: 'eip155',
						reference: '1',
						accountAddress: challenge.signerAddress,
						capabilities: [],
					}],
					selected: true,
					connectedAt: 1,
				}],
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
					connectionKey: 'wallet',
					walletId: 'wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [{
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0x2222222222222222222222222222222222222222',
						capabilities: [],
					}],
					selected: true,
					connectedAt: 1,
				}],
				signMessage: vi.fn(),
			},
		})).rejects.toThrow('does not match')
	})
})
