import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { FarcasterAccountEvidence } from '$/state/farcaster/farcasterAccountConnectionRuntime.ts'

export const createNeynarFarcasterEvidenceProvider = (
	{
		publicEnv,
		trustedAppFid,
	}: {
		publicEnv: SourcePublicEnv
		trustedAppFid: number
	}
) => ({
	currentCustody: async (fid: number): Promise<FarcasterAccountEvidence | undefined> => {
		const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
		const user = (await getBulkUsers({
			publicEnv,
			fids: [fid],
		})).find((candidate) => candidate.fid === fid)
		if (user?.custody_address == null) return undefined

		return {
			method: 'custody',
			currentCustodyAddress: user.custody_address,
			associationFingerprint: `neynar:custody:${fid}:${user.custody_address.toLowerCase()}`,
		}
	},
	approvedAuthAddress: async ({
		fid,
		address,
	}: {
		fid: number
		address: string
	}): Promise<FarcasterAccountEvidence | undefined> => {
		const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
		const authAddress = (await getBulkUsers({
			publicEnv,
			fids: [fid],
		}))
			.find((candidate) => candidate.fid === fid)
			?.auth_addresses
			?.find((candidate) => (
				candidate.app.fid === trustedAppFid
				&& candidate.address.toLowerCase() === address.toLowerCase()
			))
		if (authAddress == null) return undefined

		return {
			method: 'authAddress',
			address: authAddress.address,
			status: 'approved',
			appFid: authAddress.app.fid,
			associationFingerprint: `neynar:auth:${fid}:${authAddress.app.fid}:${authAddress.address.toLowerCase()}`,
		}
	},
})
