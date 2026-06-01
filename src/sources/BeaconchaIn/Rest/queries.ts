import { getJson } from '$/lib/http.ts'
import BeaconchaIn from '$/sources/BeaconchaIn/index.ts'
import type {
	BeaconchaInEpoch,
	BeaconchaInResponse,
} from '$/sources/BeaconchaIn/Rest/types.ts'

export const getEpoch = async ({
	apiBase,
	epoch,
}: {
	apiBase: string
	epoch: number | 'latest' | 'finalized'
}): Promise<BeaconchaInEpoch | undefined> => {
	const wire = await getJson<BeaconchaInResponse<BeaconchaInEpoch>>(
		`${apiBase.replace(/\/$/, '')}/epoch/${String(epoch)}`,
		{ origins: BeaconchaIn.origins ?? [] },
	)
	return wire.data
}
