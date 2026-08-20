import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/TonCenter/bindings.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())
const postJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	postJson,
}))

const queries = await import('$/sources/TonCenter/Rest/queries.ts')
const {
	getAddressInformation,
	getMasterchainInfo,
	runGetMethod,
} = queries
const bindingByNetwork = Object.fromEntries(
	bindings[Source.TonCenter]
		.filter((binding) => binding.apiFamily === ApiFamily.OpenApiHttp)
		.map((binding) => [
			binding.target.key,
			binding,
		])
)

describe('TON Center V2 OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
		postJson.mockReset()
	})

	it('runs a contract get method through the canonical network binding', async () => {
		postJson.mockResolvedValue({
			ok: true,
			result: {
				'@type': 'ext.runResult',
				gas_used: 173,
				stack: [
					[
						'num',
						'0x2a',
					],
				],
				exit_code: 0,
				block_id: {
					'@type': 'ton.blockIdExt',
					workchain: -1,
					shard: '-9223372036854775808',
					seqno: 42,
					root_hash: 'root',
					file_hash: 'file',
				},
				last_transaction_id: {
					'@type': 'internal.transactionId',
					lt: '99',
					hash: 'hash',
				},
			},
			'@extra': 'fixture',
		})

		await expect(runGetMethod('ton:-239', {
			address: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			method: 'seqno',
			stack: [],
		})).resolves.toMatchObject({
			gas_used: 173,
			exit_code: 0,
		})
		expect(postJson).toHaveBeenCalledWith({
			binding: bindingByNetwork['ton:-239'],
			path: 'runGetMethod',
			body: {
				address: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				method: 'seqno',
				stack: [],
			},
		})
	})

	it('requests address state through the canonical target binding and generated parameters', async () => {
		getJson.mockResolvedValue({
			ok: true,
			result: {
				'@type': 'raw.fullAccountState',
				balance: '900719925474099312345',
			},
			'@extra': 'fixture',
		})

		await expect(getAddressInformation('ton:-3', {
			address: '0:account/with path',
			seqno: 42,
		})).resolves.toEqual({
			'@type': 'raw.fullAccountState',
			balance: '900719925474099312345',
		})
		expect(getJson).toHaveBeenCalledWith(
			bindingByNetwork['ton:-3'],
			'getAddressInformation?address=0%3Aaccount%2Fwith+path&seqno=42'
		)
	})

	it('requests the latest masterchain reference through the mainnet binding', async () => {
		getJson.mockResolvedValue({
			ok: true,
			result: {
				'@type': 'blocks.masterchainInfo',
				last: {
					seqno: 42,
				},
			},
			'@extra': 'fixture',
		})

		await expect(getMasterchainInfo('ton:-239')).resolves.toMatchObject({
			last: {
				seqno: 42,
			},
		})
		expect(getJson).toHaveBeenCalledWith(
			bindingByNetwork['ton:-239'],
			'getMasterchainInfo'
		)
	})

	it('rejects missing native result objects instead of exposing undefined state', async () => {
		getJson.mockResolvedValueOnce({ ok: true, result: null })
		await expect(getMasterchainInfo('ton:-239')).rejects.toThrow('response result is missing')

		getJson.mockResolvedValueOnce({ ok: true, result: null })
		await expect(getAddressInformation('ton:-3', {
			address: '0:account',
		})).rejects.toThrow('response result is missing')
	})

})
