import assert from 'node:assert/strict'
import test from 'node:test'

import { app, EntityType } from '../../APP.ts'
import { compileApp, renderSourcesMarkdown } from './generate.ts'
import { renderGeneratedFile } from './render.ts'


const baselineCompiledApp = compileApp(app)


const assertRecursivelyFrozen = (value: object) => {
	assert.equal(Object.isFrozen(value), true)
	for (const nestedValue of Object.values(value))
		if (nestedValue != null && typeof nestedValue === 'object')
			assertRecursivelyFrozen(nestedValue)
}

test('exports only complete immutable generated-file IR', () => {
	const compiledApp = baselineCompiledApp

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
	const networkView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	assert.ok(networkView)
	assert.equal(networkView.kind, 'svelte')
	const source = renderGeneratedFile(networkView)
	const cardanoTransactions = source.match(/\{#snippet SectionCardanoChainTransactions[\s\S]*?\{\/snippet\}/)?.[0]
	const evmTransactions = source.match(/\{#snippet SectionEvmExecutionTransactions[\s\S]*?\{\/snippet\}/)?.[0]

	assert.ok(cardanoTransactions)
	assert.match(cardanoTransactions, /Source\.CardanoKoios_Rest/)
	assert.match(cardanoTransactions, /Source\.Blockfrost_Rest/)
	assert.doesNotMatch(cardanoTransactions, /Blockscout_Rest/)
	assert.ok(evmTransactions)
	assert.match(evmTransactions, /Source\.Blockscout_Rest/)
})

test('keeps Cardano breadth in one fully declared carousel', () => {
	const networkView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	assert.ok(networkView)
	assert.equal(networkView.kind, 'svelte')
	const source = renderGeneratedFile(networkView)
	const cardanoExplorer = source.match(/id=\{viewDomId \+ '-carousel-cardano-explorer'\}[\s\S]*?<\/CollapsibleTabs>/)?.[0]

	assert.ok(cardanoExplorer)
	assert.equal([...source.matchAll(/id=\{viewDomId \+ '-carousel-cardano-/g)].length, 1)
	assert.match(cardanoExplorer, /id: 'cardano-chain-blocks',[\s\S]*?id: 'cardano-chain-transactions',[\s\S]*?id: 'cardano-chain-observations'/)
	for (const sectionSnippet of [
		'SectionCardanoStakePools',
		'SectionCardanoGovernanceProposals',
		'SectionCardanoGovernanceDreps',
		'SectionCardanoGovernanceCommittee',
		'SectionCardanoAssetsNative',
		'SectionCardanoProtocolParameters',
		'SectionCardanoResourcesEndpoints',
	])
		assert.match(cardanoExplorer, new RegExp(`\\{#snippet ${sectionSnippet}`))
})

test('keeps wallet controls hand-owned and portfolio selections account-scoped', () => {
	const accountsRoute = app.routes.children['~'].children.accounts
	const accountsContent = accountsRoute.page?.view?.Content.raw ?? ''
	const balancesContent = accountsRoute.children.balances.page?.view?.Content.raw ?? ''

	assert.match(
		accountsContent,
		/<WalletConnectionsControl/
	)
	assert.match(
		accountsContent,
		/<WalletAccountPortfolio/
	)
	assert.doesNotMatch(
		accountsContent,
		/\$\$actorCoins/
	)
	assert.match(
		balancesContent,
		/<WalletAccountPortfolio/
	)
	assert.equal(
		'collections' in accountsRoute.children.balances,
		false
	)
})

test('rejects mutation at every exported IR depth', () => {
	const compiledApp = baselineCompiledApp
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

test('requires one explicit route outcome for every selector', () => {
	const missingOutcomeApp = structuredClone(app)
	Reflect.deleteProperty(missingOutcomeApp.routes.outcomes[EntityType._Global], 'Scope')

	assert.throws(
		() => compileApp(missingOutcomeApp),
		/_Global\.Scope is missing an explicit route outcome/
	)
})

test('rejects competing visible and non-visible selector outcomes', () => {
	const competingOutcomeApp = structuredClone(app)
	Object.defineProperty(competingOutcomeApp.routes.outcomes, EntityType.Network, {
		enumerable: true,
		value: {
			Caip2: {
				kind: 'Research',
				decision: 'Negative control',
				evidence: 'scripts/app/compiled-app-index.test.ts',
			},
		},
	})

	assert.throws(
		() => compileApp(competingOutcomeApp),
		/Network\.Caip2 has both a visible route mapping and Research outcome/
	)
})

test('rejects selector outcome alias cycles', () => {
	const cyclicOutcomeApp = structuredClone(app)
	Object.defineProperty(cyclicOutcomeApp.routes.outcomes[EntityType._Global], 'Scope', {
		enumerable: true,
		value: {
			kind: 'Alias',
			target: {
				entityType: EntityType._GlobalAgentNetwork,
				selectorName: 'NetworkId',
			},
		},
	})
	Object.defineProperty(cyclicOutcomeApp.routes.outcomes[EntityType._GlobalAgentNetwork], 'NetworkId', {
		enumerable: true,
		value: {
			kind: 'Alias',
			target: {
				entityType: EntityType._Global,
				selectorName: 'Scope',
			},
		},
	})

	assert.throws(
		() => compileApp(cyclicOutcomeApp),
		/Alias outcome contains a cycle/
	)
})
