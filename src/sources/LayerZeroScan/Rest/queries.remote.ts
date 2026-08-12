import { query } from '$app/server'
import { type } from 'arktype'

import { getMessageByGuid } from '$/sources/LayerZeroScan/Rest/queries.ts'

export const getLayerZeroMessageByGuidRemote = query(
	type({ guid: 'string > 0' }),
	(input) => getMessageByGuid(input)
)
