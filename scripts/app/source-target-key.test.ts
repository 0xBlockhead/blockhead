import assert from 'node:assert/strict'
import {
	describe,
	test,
} from 'node:test'

import {
	SourceTargetKind,
	app,
} from '../../APP.ts'
import { compileApp } from './generate.ts'
import { networks } from './inputs/Network.ts'
import { renderGeneratedFile } from './render.ts'

const bindings = app.sources.sources.flatMap((source) => [
	...(source.binding == null ? [] : [{
		source: source.source,
		binding: source.binding,
	}]),
	...(source.bindings ?? []).map((binding) => ({
		source: source.source,
		binding,
	})),
])

describe('source target keys', () => {
	test('keeps network targets inside their catalog-derived namespaces', () => {
		const caip2NetworkKeys = new Set(networks.flatMap((network) => (
			'caip2' in network ? [`${network.caip2.namespace}:${network.caip2.reference}`] : []
		)))
		const networkSlugs = new Set(networks.map((network) => network.slug))

		assert.deepEqual(bindings.flatMap(({ binding, source }) => (
			binding.target.kind === SourceTargetKind.Caip2Network && !caip2NetworkKeys.has(binding.target.key)
			|| binding.target.kind === SourceTargetKind.NetworkSlug && !networkSlugs.has(binding.target.key) ?
				[`${source}/${binding.target.kind}/${binding.target.key}`]
				:
				[]
		)), [])
	})

	test('projects discriminated target types', () => {
		const generatedFiles = compileApp(app).generatedFiles
		const sourceBinding = generatedFiles.find((file) => file.path === 'src/sources/SourceBinding.ts')
		const sourceProviders = generatedFiles.find((file) => file.path === 'src/sources/$sourceProviders.ts')

		assert.ok(sourceBinding)
		assert.ok(sourceProviders)
		if (sourceBinding == null || sourceProviders == null)
			throw new Error('Missing generated source target products')

		assert.match(renderGeneratedFile(sourceBinding), /key: Caip2NetworkKey/)
		assert.match(renderGeneratedFile(sourceBinding), /key: NetworkSlug/)
	})
})
