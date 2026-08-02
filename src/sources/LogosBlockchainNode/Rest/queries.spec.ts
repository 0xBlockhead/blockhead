import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')

const binding = bindings[Source.LogosBlockchainNode_Rest][0]

const lib = '2'.repeat(64)
const tip = '3'.repeat(64)

describe('Logos Blockchain 0.2.0 node API', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it.each([
		'AwaitingStart',
		{
			Started: 'Bootstrapping',
		},
		{
			Started: 'Online',
		},
	])('reads the official chain-service response in mode %j', async (mode) => {
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
			},
			mode,
		})

		await expect(queries.getCryptarchiaInfo()).resolves.toEqual({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
			},
			mode,
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/cryptarchia/info')
	})

	it('rejects the obsolete flattened documentation example', async () => {
		getJson.mockResolvedValue({
			lib,
			tip,
			slot: 70_899,
			height: 120,
			mode: 'Bootstrapping',
		})

		await expect(queries.getCryptarchiaInfo()).rejects.toThrow()
	})

	it.each([
		{
			field: 'lib',
			value: `0x${lib}`,
		},
		{
			field: 'slot',
			value: Number.MAX_SAFE_INTEGER + 1,
		},
	])('rejects invalid $field wire values', async ({ field, value }) => {
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
				[field]: value,
			},
			mode: {
				Started: 'Online',
			},
		})

		await expect(queries.getCryptarchiaInfo()).rejects.toThrow()
	})

	it('exports only the endpoint-specific operation', () => {
		expect(Object.keys(queries)).toEqual(['getCryptarchiaInfo'])
	})
})
