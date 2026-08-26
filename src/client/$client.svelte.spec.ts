import {
	describe,
	expect,
	it,
} from 'vitest'
import type { LoadSubsetOptions } from '@tanstack/db'

import {
	activeLoadSubsetOwner,
	requireActiveLoadSubsetOwner,
	sharedLoadSubsetOptions,
} from '$/client/$client.svelte.ts'


describe('persisted collection subset ownership', () => {
	it('keeps a same-key load active while another requester still owns it', () => {
		const cancelled = new AbortController()
		const current = new AbortController()
		const cancelledOptions: LoadSubsetOptions = {
			signal: cancelled.signal,
		}
		const currentOptions: LoadSubsetOptions = {
			signal: current.signal,
		}
		const activeLoadSubsets = new Map([[
			'subset',
			{
				loadSubsetOptions: new Set([
					cancelledOptions,
					currentOptions,
				]),
			},
		]])
		cancelled.abort()

		expect(activeLoadSubsetOwner(activeLoadSubsets, 'subset')).toBe(currentOptions)
		expect(requireActiveLoadSubsetOwner(activeLoadSubsets, 'subset')).toBe(currentOptions)
		expect(sharedLoadSubsetOptions(activeLoadSubsets, 'subset')).toEqual({
			signal: undefined,
		})
	})

	it('rejects installation after every same-key requester aborts', () => {
		const first = new AbortController()
		const second = new AbortController()
		const activeLoadSubsets = new Map([[
			'subset',
			{
				loadSubsetOptions: new Set<LoadSubsetOptions>([
					{ signal: first.signal },
					{ signal: second.signal },
				]),
			},
		]])
		first.abort()
		second.abort()

		expect(() => requireActiveLoadSubsetOwner(activeLoadSubsets, 'subset'))
			.toThrow(expect.objectContaining({
				name: 'AbortError',
			}))
	})
})
