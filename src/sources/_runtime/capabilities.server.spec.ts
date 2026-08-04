import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { readFileSync } from 'node:fs'

import { sourceBindings } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const runtimeSecret = vi.hoisted(() => ({
	value: '',
}))

vi.mock('$env/dynamic/private', () => ({
	env: {
		get STARKSCAN_API_KEY() {
			return runtimeSecret.value
		},
	},
}))

const starkscanBinding = sourceBindings.find((binding) => (
	binding.source === Source.Starkscan
))
if (starkscanBinding == null)
	throw new Error('Missing Starkscan source binding fixture')

describe('browser server source capabilities', () => {
	it('exposes only enabled browser-server lanes by stable binding id', async () => {
		runtimeSecret.value = ''
		vi.resetModules()
		const unavailable = await import('$/sources/index.server.ts')
		expect(unavailable.enabledBrowserServerSourceBindingIds.has(
			sourceBindingId(starkscanBinding)
		)).toBe(false)
		expect([...unavailable.enabledBrowserServerSourceBindingIds].every((bindingId) => (
			unavailable.enabledSourceBindings.some((binding) => (
				sourceBindingId(binding) === bindingId
				&& (
					binding.delivery === SourceDelivery.HttpProxy
						|| binding.delivery === SourceDelivery.RemoteLive
						|| binding.delivery === SourceDelivery.RemoteQuery
				)
			))
		))).toBe(true)

		runtimeSecret.value = 'configured'
		vi.resetModules()
		const available = await import('$/sources/index.server.ts')
		expect(available.enabledBrowserServerSourceBindingIds.has(
			sourceBindingId(starkscanBinding)
		)).toBe(true)
	})

	it('publishes one deterministic remote query without credential data', () => {
		const source = readFileSync(
			'src/sources/_runtime/capabilities.remote.ts',
			'utf8'
		)
		expect(source).toContain("import { query } from '$app/server'")
		expect(source).toContain('enabledBrowserServerSourceBindingIds')
		expect(source).toContain('enabledServerBindingIds: [...enabledBrowserServerSourceBindingIds].toSorted()')
		expect(source).not.toMatch(/privateEnv|sourceServerCredentials|secret/)
	})
})
