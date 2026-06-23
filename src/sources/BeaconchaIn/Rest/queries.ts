import { getJson } from '$/lib/http.ts'
import { beaconchaInOrigins } from '$/sources/BeaconchaIn/index.ts'
import type {
	BeaconchaInEpoch,
	BeaconchaInResponse,
} from '$/sources/BeaconchaIn/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export const getEpoch = async (
	publicEnv: SourcePublicEnv,
	{
		apiBase,
		epoch,
	}: {
	apiBase: string
	epoch: number | 'latest' | 'finalized'
	}
): Promise<BeaconchaInEpoch | undefined> => {
	const wire = await getJson<BeaconchaInResponse<BeaconchaInEpoch>>(
		`${apiBase.replace(/\/$/, '')}/epoch/${String(epoch)}`,
		{
			origins: beaconchaInOrigins,
			init: {
				headers: {
					Authorization: `Bearer ${publicEnv.PUBLIC_BEACONCHAIN_API_KEY}`,
				},
			},
	}
	)
	return wire.data
}
