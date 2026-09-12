import { expect, test } from 'vitest'

import { defineObservationTimeWriter } from '$/resolvers/observationTimeWriter.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


defineObservationTimeWriter({
	entityType: EntityType.BeaconBlock,
	// @ts-expect-error A non-observation selector cannot register an observation-time writer.
	selectorName: 'NetworkRoot',
	source: Source.Beacon_Rest,
	provenance: 'LocalRefresh',
})

test('emits the registered observation envelope without reshaping its selector', () => {
	const writer = defineObservationTimeWriter({
		entityType: EntityType.BeaconBlock_Timestamp,
		selectorName: 'BlockTimestampMsSource',
		source: Source.Beacon_Rest,
		provenance: 'LocalRefresh',
	})
	const selector = {
		$block: {
			$network: {
				caip2: {
					namespace: 'eip155' as const,
					reference: '1',
				},
			},
			root: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		timestampMs: 1,
		source: Source.Beacon_Rest,
	} as const

	expect(writer.write(selector, { canonical: true })).toEqual({
		[EntityMetaKey.Selector]: selector,
		[EntityMetaKey.Fields]: { canonical: true },
	})

	// @ts-expect-error A valid schema string must still match this writer's registered source.
	writer.write({ ...selector, source: Source.Local_Internal }, {})
})
