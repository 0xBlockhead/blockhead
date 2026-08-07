import { describe, expect, it } from 'vitest'

import { parseVoltaireCallTraceRpc } from '$/sources/Voltaire/JsonRpc/CallTrace.ts'

describe('Voltaire CallTrace wire parse', () => {
	it('accepts nested call traces and drops malformed children', () => {
		expect(parseVoltaireCallTraceRpc({
			type: 'CALL',
			from: '0xabc',
			to: '0xdef',
			value: '0x1',
			gas: '0x10',
			gasUsed: '0x5',
			input: '0x',
			output: '0x',
			calls: [
				{
					type: 'DELEGATECALL',
					from: '0xdef',
					to: '0x123',
					input: '0xabcd',
				},
				'not-an-object',
				{
					type: 'STATICCALL',
					calls: [],
				},
			],
		})).toEqual({
			type: 'CALL',
			from: '0xabc',
			to: '0xdef',
			value: '0x1',
			gas: '0x10',
			gasUsed: '0x5',
			input: '0x',
			output: '0x',
			calls: [
				{
					type: 'DELEGATECALL',
					from: '0xdef',
					to: '0x123',
					input: '0xabcd',
				},
				{
					type: 'STATICCALL',
				},
			],
		})
	})

	it('fail-closes non-object traces', () => {
		expect(parseVoltaireCallTraceRpc(null)).toBeNull()
		expect(parseVoltaireCallTraceRpc([])).toBeNull()
		expect(parseVoltaireCallTraceRpc('CALL')).toBeNull()
	})

	it('accepts callTracer revertReason leftovers and drops non-string values', () => {
		expect(parseVoltaireCallTraceRpc({
			type: 'CALL',
			error: 'execution reverted',
			revertReason: 'Insufficient balance',
			calls: [
				{
					type: 'CALL',
					revertReason: 12,
				},
			],
		})).toEqual({
			type: 'CALL',
			error: 'execution reverted',
			revertReason: 'Insufficient balance',
			calls: [
				{
					type: 'CALL',
				},
			],
		})
	})
})
