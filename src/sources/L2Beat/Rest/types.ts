/**
 * Fail-closed arktype wires for `GET https://l2beat.com/api/scaling/summary`.
 * @see https://l2beat.com/api/scaling/summary
 */

import { type as arktype } from 'arktype'


export const l2BeatScalingSummaryProjectWire = arktype({
	id: 'string > 0',
	name: 'string > 0',
	slug: 'string > 0',
	/** Wire kind (`layer2` / `layer3`), not the rollup category label. */
	type: 'string > 0',
	/** Settled-on / host chain label; maps via `l2BeatHostChainByLabel`. */
	hostChain: 'string > 0',
	'category?': 'string > 0',
	'stage?': 'string > 0',
	'isArchived?': 'boolean',
	'isUpcoming?': 'boolean',
	'isUnderReview?': 'boolean',
}).onUndeclaredKey('delete')

export type L2BeatScalingSummaryProject = typeof l2BeatScalingSummaryProjectWire.infer

export const l2BeatScalingSummaryResponseWire = arktype({
	projects: arktype('Record<string, unknown>').pipe((projects) => (
		Object.fromEntries(
			Object.entries(projects)
				.map(([projectId, project]) => [
					projectId,
					l2BeatScalingSummaryProjectWire.assert(project),
				])
		)
	)),
	chart: arktype({
		/** Unix seconds; L2Beat summary freshness clock. */
		syncedUntil: 'number.integer >= 0',
	}).onUndeclaredKey('delete'),
}).onUndeclaredKey('delete')

export type L2BeatScalingSummaryResponse = typeof l2BeatScalingSummaryResponseWire.infer
