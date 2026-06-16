import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	decodeCalldataWithSignature,
	decodeLogWithContractAbiJson,
	formatDecodedParamValue,
	functionSelectorFromSignature,
	parseFunctionSignature,
} from '$/lib/calldata-decode.ts'

describe('calldata decoder', () => {
	it('parses nested signatures without splitting tuple arguments', () => {
		expect(parseFunctionSignature('swap((address,uint256),bytes32[])')).toEqual({
			name: 'swap',
			types: [
				'(address,uint256)',
				'bytes32[]',
			],
		})
	})

	it('computes function selectors from canonical signatures', () => {
		expect(functionSelectorFromSignature('transfer(address,uint256)')).toBe('0xa9059cbb')
	})

	it('decodes ERC20 transfer calldata using package-typed ABI parameters', () => {
		expect(decodeCalldataWithSignature(
			'transfer(address,uint256)',
			'0xa9059cbb0000000000000000000000007432f2e8c2e2e8c2e2e8c2e2e8c2e2e8c2e2e8c20000000000000000000000000000000000000000000000000de0b6b3a7640000'
			)).toEqual({
				name: 'transfer',
				params: [
					{
						type: 'address',
						value: '0x7432f2e8c2e2e8c2e2e8c2e2e8c2e2e8c2e2e8c2',
					},
					{
						type: 'uint256',
						value: 1_000_000_000_000_000_000n,
					},
				],
			})
	})

	it('decodes logs through schema-shaped ABI JSON', () => {
		expect(decodeLogWithContractAbiJson(
			JSON.stringify([{
				type: 'event',
				name: 'Transfer',
				inputs: [
					{
						type: 'address',
						name: 'from',
						indexed: true,
					},
					{
						type: 'address',
						name: 'to',
						indexed: true,
					},
					{
						type: 'uint256',
						name: 'value',
					},
				],
			}]),
			[
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				'0x0000000000000000000000007432f2e8c2e2e8c2e2e8c2e2e8c2e2e8c2e2e8c2',
				'0x0000000000000000000000001111111111111111111111111111111111111111',
			],
			'0x000000000000000000000000000000000000000000000000000000000000007b'
			)).toEqual({
				signature: 'Transfer(address indexed,address indexed,uint256)',
				decoded: {
					name: 'Transfer',
					params: [
						{
							type: 'address',
							value: '0x7432f2e8c2e2e8c2e2e8c2e2e8c2e2e8c2e2e8c2',
						},
						{
							type: 'address',
							value: '0x1111111111111111111111111111111111111111',
						},
						{
							type: 'uint256',
							value: 123n,
						},
					],
				},
			})
	})

	it('formats decoded values without unknown value typing', () => {
		expect(formatDecodedParamValue('uint256', 123n)).toBe('123')
		expect(formatDecodedParamValue('bool', true)).toBe('true')
		expect(formatDecodedParamValue('(uint256,bool)', [
			123n,
			false,
		])).toBe('(123, false)')
	})
})
