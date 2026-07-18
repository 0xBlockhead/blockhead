/**
 * L2Beat scaling summary — public project order and TVS summary.
 * @see https://l2beat.com/api/scaling/summary
 */

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { scalingSummaryPath } from '$/sources/L2Beat/Rest/constants.ts'
import type { L2BeatScalingSummaryResponse } from '$/sources/L2Beat/Rest/types.ts'

export const fetchScalingSummary = async (
	binding: SourceBinding,
): Promise<L2BeatScalingSummaryResponse> => (
	getJson<L2BeatScalingSummaryResponse>(
		binding,
		scalingSummaryPath
	)
)
