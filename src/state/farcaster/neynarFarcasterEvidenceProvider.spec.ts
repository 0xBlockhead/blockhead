import { describe, expect, it, vi } from 'vitest'

import { createNeynarFarcasterEvidenceProvider } from '$/state/farcaster/neynarFarcasterEvidenceProvider.ts'

const { getBulkUsers } = vi.hoisted(() => ({
	getBulkUsers: vi.fn(),
}))
vi.mock('$/sources/Neynar/Rest/queries.ts', () => ({ getBulkUsers }))

describe('Neynar Farcaster evidence provider', () => {
	it('tracks current custody and rejects transferred custody fingerprints', async () => {
		getBulkUsers.mockResolvedValueOnce([{
			fid: 3,
			custody_address: '0x1111111111111111111111111111111111111111',
		}])
		const evidence = createNeynarFarcasterEvidenceProvider({
			publicEnv: {},
			trustedAppFid: 4407,
		}).currentCustody(3)
		await expect(evidence).resolves.toMatchObject({
			method: 'custody',
			currentCustodyAddress: '0x1111111111111111111111111111111111111111',
		})
	})

	it('requires same-address membership under the exact app FID', async () => {
		getBulkUsers.mockResolvedValue([{
			fid: 3,
			auth_addresses: [{
				address: '0x1111111111111111111111111111111111111111',
				app: { fid: 4407 },
			}],
		}])
		const provider = createNeynarFarcasterEvidenceProvider({
			publicEnv: {},
			trustedAppFid: 4407,
		})
		await expect(provider.approvedAuthAddress({
			fid: 3,
			address: '0x1111111111111111111111111111111111111111',
		})).resolves.toMatchObject({
			method: 'authAddress',
			status: 'approved',
			appFid: 4407,
		})
		await expect(provider.approvedAuthAddress({
			fid: 3,
			address: '0x1111111111111111111111111111111111111111',
		})).resolves.toMatchObject({
			appFid: 4407,
		})
	})

	it('rejects wrong-app and ordinary verified-address membership', async () => {
		getBulkUsers.mockResolvedValue([{
			fid: 3,
			auth_addresses: [
				{
					address: '0x1111111111111111111111111111111111111111',
					app: { fid: 999 },
				},
				{
					address: '0x2222222222222222222222222222222222222222',
					app: { fid: 4407 },
				},
			],
			verified_addresses: {
				eth_addresses: ['0x1111111111111111111111111111111111111111'],
				sol_addresses: [],
				primary: {
					eth_address: '0x1111111111111111111111111111111111111111',
					sol_address: null,
				},
			},
		}])
		const provider = createNeynarFarcasterEvidenceProvider({
			publicEnv: {},
			trustedAppFid: 4407,
		})

		await expect(provider.approvedAuthAddress({
			fid: 3,
			address: '0x1111111111111111111111111111111111111111',
		})).resolves.toBeUndefined()
	})
})
