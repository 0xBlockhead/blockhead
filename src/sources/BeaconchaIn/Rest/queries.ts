import { getJson } from '$/lib/http.ts'
import { Source } from '$/sources/$Source.ts'
import BeaconchaIn from '$/sources/BeaconchaIn/index.ts'
import type {
	BeaconchaInEpoch,
	BeaconchaInResponse,
} from '$/sources/BeaconchaIn/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'

export const getEpoch = async (
	publicEnv: SourcePublicEnvFor<Source.BeaconchaIn_Rest>,
	{
		apiBase,
		epoch,
	}: {
	apiBase: string
	epoch: number | 'latest' | 'finalized'
	},
): Promise<BeaconchaInEpoch | undefined> => {
	const wire = await getJson<BeaconchaInResponse<BeaconchaInEpoch>>(
		`${apiBase.replace(/\/$/, '')}/epoch/${String(epoch)}`,
		{
			origins: BeaconchaIn.origins,
			init: {
				headers: {
					Authorization: `Bearer ${publicEnv.PUBLIC_BEACONCHAIN_API_KEY}`,
				},
			},
	},
	)
	return wire.data
}
