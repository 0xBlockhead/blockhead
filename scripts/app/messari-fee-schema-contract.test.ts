import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
	app,
	EntityType,
} from '../../APP.ts'


const feeTypes = [
	'FIXED_TRADING_FEE',
	'TIERED_TRADING_FEE',
	'DYNAMIC_TRADING_FEE',
	'FIXED_LP_FEE',
	'DYNAMIC_LP_FEE',
	'FIXED_PROTOCOL_FEE',
	'DYNAMIC_PROTOCOL_FEE',
	'FIXED_STAKE_FEE',
	'DYNAMIC_STAKE_FEE',
	'DEPOSIT_FEE',
	'WITHDRAWAL_FEE',
	'DYNAMIC_TAKER_FEE',
	'DYNAMIC_TAKER_DELAYED_FEE',
	'DYNAMIC_TAKER_DELAYED_OFFCHAIN_FEE',
	'DYNAMIC_MAKER_FEE',
	'DYNAMIC_MAKER_DELAYED_FEE',
	'DYNAMIC_MAKER_DELAYED_OFFCHAIN_FEE',
]


test('preserves the complete Messari fee-type denominator and direct selectors', () => {
	const feeType = app.schema.valueTypes.find(({ id }) => id === 'LiquidityPoolFeeType')
	assert.ok(feeType)
	assert.equal(feeType.routeParam?.matcher, 'stringSegment')
	assert.deepEqual(
		[...(feeType.type.raw?.matchAll(/'([^']+)'/g) ?? [])].map((match) => match[1]),
		feeTypes,
	)

	const schedule = app.schema.entities.find(({ entityType }) => entityType === EntityType.LiquidityPoolFeeSchedule)
	const observation = app.schema.entities.find(({ entityType }) => entityType === EntityType.LiquidityPoolFeeSchedule_EvmBlock)
	assert.ok(schedule)
	assert.ok(observation)
	assert.deepEqual(schedule.selectors, [{ name: 'PoolFeeType', fields: ['$pool', 'feeType'] }])
	assert.deepEqual(observation.selectors, [{ name: 'ScheduleBlockRevision', fields: ['$feeSchedule', '$block', 'sourceRevision'] }])
	assert.equal(schedule.fields.find(({ name }) => name === 'feePercentage')?.valueType, 'NonNegativeDecimalString')
	assert.equal(observation.fields.find(({ name }) => name === 'feePercentage')?.valueType, 'NonNegativeDecimalString')
})

test('generated fee routes preserve exact block selector round trips and raw decimals', () => {
	const observationView = readFileSync(new URL('../../src/views/LiquidityPoolFeeSchedule_EvmBlockView.svelte', import.meta.url), 'utf8')
	const observationsView = readFileSync(new URL('../../src/views/LiquidityPoolFeeSchedule_EvmBlocksView.svelte', import.meta.url), 'utf8')
	for (const source of [observationView, observationsView]) {
		assert.match(source, /from 'devalue'/)
		assert.match(source, /String\(stringify\([^)]*\$block\)/)
		assert.doesNotMatch(source, /format=\"percent\"/)
	}
})
