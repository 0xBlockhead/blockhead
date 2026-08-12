import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/qBittorrentWebUi/bindings.ts'

const {
	getJson,
	getText,
} = vi.hoisted(() => ({
	getJson: vi.fn(),
	getText: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	getText,
}))

const {
	getApplicationVersion,
	getTorrentFiles,
	getTorrentPieceStates,
	getTorrentProperties,
	getTorrentsInfo,
	getTransferInfo,
} = await import('$/sources/qBittorrentWebUi/Rest/queries.ts')

const binding = bindings[Source.qBittorrentWebUi_Rest][0]

describe('qBittorrent WebUI REST envelopes', () => {
	beforeEach(() => {
		getJson.mockReset()
		getText.mockReset()
	})

	it('reads the text version and validates client and torrent observations', async () => {
		getText.mockResolvedValue(' v5.1.2\n')
		await expect(getApplicationVersion(binding)).resolves.toBe('v5.1.2')

		getJson
			.mockResolvedValueOnce({
				dl_info_speed: 4,
				up_info_speed: 2,
				dl_info_data: 10,
				up_info_data: 5,
			})
			.mockResolvedValueOnce([{
				hash: '0'.repeat(40),
				name: 'release',
				state: 'downloading',
				progress: 0.5,
			}])

		await expect(getTransferInfo(binding)).resolves.toMatchObject({
			dl_info_speed: 4,
			up_info_speed: 2,
		})
		await expect(getTorrentsInfo(binding)).resolves.toEqual([expect.objectContaining({
			name: 'release',
			progress: 0.5,
		})])
	})

	it('validates native file, piece-state, and properties responses', async () => {
		getJson
			.mockResolvedValueOnce([{
				index: 0,
				name: 'release/image.iso',
				size: 1024,
				progress: 1,
			}])
			.mockResolvedValueOnce([2, 2, 1, 0])
			.mockResolvedValueOnce({
				piece_size: 256,
				total_size: 1024,
			})

		await expect(getTorrentFiles(binding, '0'.repeat(40))).resolves.toHaveLength(1)
		await expect(getTorrentPieceStates(binding, '0'.repeat(40))).resolves.toEqual([2, 2, 1, 0])
		await expect(getTorrentProperties(binding, '0'.repeat(40))).resolves.toEqual({
			piece_size: 256,
			total_size: 1024,
		})
	})

	it('fails closed on malformed identities, counters, and piece states', async () => {
		getJson.mockResolvedValueOnce([{ hash: 'not-a-hash' }])
		await expect(getTorrentsInfo(binding)).rejects.toThrow('invalid torrents info response envelope')

		getJson.mockResolvedValueOnce({ dl_info_data: -1 })
		await expect(getTransferInfo(binding)).rejects.toThrow('invalid transfer info response envelope')

		getJson.mockResolvedValueOnce([3])
		await expect(getTorrentPieceStates(binding, '0'.repeat(40))).rejects.toThrow('invalid torrent piece states response envelope')
	})
})
