import assert from 'node:assert/strict'
import test from 'node:test'

import { app, EntityType } from '../../APP.ts'
import { compileApp, renderSourcesMarkdown } from './generate.ts'
import { renderGeneratedFile } from './render.ts'


const assertRecursivelyFrozen = (value: object) => {
	assert.equal(Object.isFrozen(value), true)
	for (const nestedValue of Object.values(value))
		if (nestedValue != null && typeof nestedValue === 'object')
			assertRecursivelyFrozen(nestedValue)
}

test('exports only complete immutable generated-file IR', () => {
	const compiledApp = compileApp(app)

	assert.deepEqual(Object.keys(compiledApp), ['generatedFiles'])
	assertRecursivelyFrozen(compiledApp)
	assert.ok(compiledApp.generatedFiles.length > 0)
	assert.equal(
		new Set(compiledApp.generatedFiles.map((generatedFile) => generatedFile.path)).size,
		compiledApp.generatedFiles.length
	)
	for (const generatedFile of compiledApp.generatedFiles) {
		assert.deepEqual(
			Object.keys(generatedFile).toSorted(),
			generatedFile.kind === 'text' ? [
				'body',
				'kind',
				'path',
			] : [
				'ast',
				'kind',
				'path',
			]
		)
		assert.equal(renderGeneratedFile(generatedFile).endsWith('\n'), true)
	}

	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'SOURCES.md' && generatedFile.kind === 'text'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'src/schema/EntityType.ts' && generatedFile.kind === 'ts'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte' && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+layout.svelte') && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+page.svelte') && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+page.ts') && generatedFile.kind === 'ts'))
	assert.ok(renderSourcesMarkdown(compiledApp).includes('# Blockhead Sources'))
})

test('keeps same-named facet fields source-precise in generated IR', () => {
	const networkView = compileApp(app).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	assert.ok(networkView)
	assert.equal(networkView.kind, 'svelte')
	const source = renderGeneratedFile(networkView)
	const cardanoTransactions = source.match(/\{#snippet SectionCardanoChainTransactions[\s\S]*?\{\/snippet\}/)?.[0]
	const evmTransactions = source.match(/\{#snippet SectionEvmExecutionTransactions[\s\S]*?\{\/snippet\}/)?.[0]

	assert.ok(cardanoTransactions)
	assert.doesNotMatch(cardanoTransactions, /sources:/)
	assert.doesNotMatch(cardanoTransactions, /Blockscout_Rest/)
	assert.ok(evmTransactions)
	assert.match(evmTransactions, /Source\.Blockscout_Rest/)
})

test('rejects mutation at every exported IR depth', () => {
	const compiledApp = compileApp(app)
	const firstFile = compiledApp.generatedFiles[0]
	assert.ok(firstFile)

	assert.throws(() => compiledApp.generatedFiles.push(firstFile))
	assert.throws(() => {
		compiledApp.generatedFiles[0].path = 'mutated'
	})
	if (firstFile.kind === 'text')
		assert.throws(() => firstFile.body.push('mutated'))
	else if (firstFile.kind === 'ts')
		assert.throws(() => firstFile.ast.body.push('mutated'))
	else
		assert.throws(() => (firstFile.ast.markup ?? firstFile.ast.script ?? []).push('mutated'))
})

test('rejects ambiguous same-entity detail components without collapsing selector variants', () => {
	const ambiguousApp = structuredClone(app)
	const networkRoute = ambiguousApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']
	assert.ok(networkRoute)
	Object.defineProperty(networkRoute.selectors?.[EntityType.Network]?.Slug, 'page', {
		value: {
			view: {
				component: 'ConflictingNetworkView',
			},
		},
	})

	assert.throws(
		() => compileApp(ambiguousApp),
		/detail layout assigns ambiguous components or hrefs to Network/
	)
})
