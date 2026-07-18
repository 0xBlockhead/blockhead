import assert from 'node:assert/strict'
import {
	copyFileSync,
	existsSync,
	mkdtempSync,
	mkdirSync,
	readFileSync,
	rmSync,
	statSync,
	utimesSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import test from 'node:test'
import ts from 'typescript'

import {
	ApiFamily,
	app,
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	Source,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceProvider,
	SourceTargetKind,
	WireProtocol,
	sourceBindingCompatibility,
	_ExpressionDecode,
	type _SourceSelection,
} from '../../APP.ts'
import {
	compileApp,
	composeSelectorHrefAlternatives,
	nearestApplicableSelectorAncestors,
	validateSourceBindingCompatibility,
} from './generate.ts'
import { renderGeneratedFile } from './render.ts'


const root = process.cwd()
const subprocessTimeoutMs = 300_000
const subprocessMetrics: {
	phase: string
	elapsedMs: number
}[] = []
const fixtureMetrics: {
	phase: 'create' | 'stage' | 'cleanup'
	elapsedMs: number
}[] = []
const testMetrics: {
	name: string
	elapsedMs: number
	assertionElapsedMs: number
}[] = []
const freshRoots = new Set<string>()
let testStartedAt = 0
let testSubprocessElapsedMs = 0
let testFixtureElapsedMs = 0

type SourceSelectionFixture = {
	name?: string
	default: readonly Source[]
	cases?: {
		when: {
			prop?: string
			field?: string
			equals: string | number | boolean
		}[]
		sources: readonly Source[]
	}[]
}

const runTestProcess = (
	phase: string,
	command: string,
	args: string[],
	options: {
		env?: NodeJS.ProcessEnv
	}
) => {
	const startedAt = performance.now()
	const result = spawnSync(
		command,
		args,
		{
			cwd: root,
			encoding: 'utf8',
			env: options.env,
			killSignal: 'SIGKILL',
			maxBuffer: 128 * 1024 * 1024,
			timeout: subprocessTimeoutMs,
		}
	)
	const elapsedMs = performance.now() - startedAt
	const commandLine = [command, ...args].join(' ')

	subprocessMetrics.push({
		phase,
		elapsedMs,
	})

	return {
		...result,
		failure: [
			`Generator test subprocess failed`,
			`phase: ${phase}`,
			`command: ${commandLine}`,
			`elapsedMs: ${elapsedMs.toFixed(1)}`,
			`exit: ${String(result.status)}`,
			`signal: ${String(result.signal)}`,
			`error: ${result.error?.stack ?? result.error?.message ?? ''}`,
			`stdout:\n${result.stdout}`,
			`stderr:\n${result.stderr}`,
		].join('\n'),
	}
}

const runGenerator = (
	command: 'check' | 'generate',
	generatedOutputRoot: string,
	phase = `generator:${command}`
) => runTestProcess(
	phase,
	process.execPath,
	[
		'--import',
		'tsx',
		path.join(root, 'scripts/app/generate.ts'),
		command,
	],
	{
		env: {
			...process.env,
			APP_GENERATED_OUTPUT_ROOT: generatedOutputRoot,
		},
	}
)

const createFreshRoot = (prefix: string) => {
	const startedAt = performance.now()
	const freshRoot = mkdtempSync(path.join(tmpdir(), prefix))

	freshRoots.add(freshRoot)
	fixtureMetrics.push({
		phase: 'create',
		elapsedMs: performance.now() - startedAt,
	})

	return freshRoot
}

const removeFreshRoot = (freshRoot: string) => {
	const startedAt = performance.now()

	rmSync(freshRoot, {
		force: true,
		recursive: true,
	})
	freshRoots.delete(freshRoot)
	fixtureMetrics.push({
		phase: 'cleanup',
		elapsedMs: performance.now() - startedAt,
	})
}

const baselineCompileStartedAt = performance.now()
const baselineCompiledApp = compileApp(app)
const baselineCompileElapsedMs = performance.now() - baselineCompileStartedAt

const stageReadOnlyGeneratedFixture = (generatedOutputRoot: string) => {
	const startedAt = performance.now()

	for (const generatedFile of baselineCompiledApp.generatedFiles) {
		const generatedFilePath = path.join(generatedOutputRoot, generatedFile.path)

		mkdirSync(path.dirname(generatedFilePath), {
			recursive: true,
		})
		writeFileSync(generatedFilePath, renderGeneratedFile(generatedFile))
	}
	fixtureMetrics.push({
		phase: 'stage',
		elapsedMs: performance.now() - startedAt,
	})
}

test.beforeEach(() => {
	testStartedAt = performance.now()
	testSubprocessElapsedMs = subprocessMetrics.reduce(
		(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
		0
	)
	testFixtureElapsedMs = fixtureMetrics.reduce(
		(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
		0
	)
})

test.afterEach((testContext) => {
	const elapsedMs = performance.now() - testStartedAt
	const subprocessElapsedMs = subprocessMetrics.reduce(
		(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
		0
	) - testSubprocessElapsedMs
	const fixtureElapsedMs = fixtureMetrics.reduce(
		(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
		0
	) - testFixtureElapsedMs

	testMetrics.push({
		name: testContext.name,
		elapsedMs,
		assertionElapsedMs: Math.max(0, elapsedMs - subprocessElapsedMs - fixtureElapsedMs),
	})
})

test.after(() => {
	console.log(JSON.stringify({
		phase: 'generator-test-process-summary',
		baselineCompile: {
			count: 1,
			elapsedMs: Number(baselineCompileElapsedMs.toFixed(1)),
		},
		subprocesses: {
			count: subprocessMetrics.length,
			elapsedMs: Number(subprocessMetrics.reduce(
				(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
				0
			).toFixed(1)),
			phases: Object.fromEntries(
				Object.entries(Object.groupBy(subprocessMetrics, ({ phase }) => phase))
					.map(([phase, metrics]) => [
						phase,
						{
							count: metrics.length,
							elapsedMs: Number(metrics.reduce(
								(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
								0
							).toFixed(1)),
						},
					])
			),
		},
		fixtures: {
			count: fixtureMetrics.filter(({ phase }) => phase === 'create').length,
			elapsedMs: Number(fixtureMetrics.reduce(
				(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
				0
			).toFixed(1)),
			phases: Object.fromEntries(
				Object.entries(Object.groupBy(fixtureMetrics, ({ phase }) => phase))
					.map(([phase, metrics]) => [
						phase,
						{
							count: metrics.length,
							elapsedMs: Number(metrics.reduce(
								(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
								0
							).toFixed(1)),
						},
					])
			),
		},
		tests: {
			count: testMetrics.length,
			elapsedMs: Number(testMetrics.reduce(
				(totalElapsedMs, metric) => totalElapsedMs + metric.elapsedMs,
				0
			).toFixed(1)),
			assertionElapsedMs: Number(testMetrics.reduce(
				(totalElapsedMs, metric) => totalElapsedMs + metric.assertionElapsedMs,
				0
			).toFixed(1)),
			slowest: testMetrics
				.toSorted((left, right) => right.elapsedMs - left.elapsedMs)
				.slice(0, 5)
				.map(({ name, elapsedMs, assertionElapsedMs }) => ({
					name,
					elapsedMs: Number(elapsedMs.toFixed(1)),
					assertionElapsedMs: Number(assertionElapsedMs.toFixed(1)),
				})),
		},
	}))
})

test.after(() => {
	assert.deepEqual(
		[...freshRoots],
		[],
		`Generator tests leaked fresh roots:\n${[...freshRoots].join('\n')}`
	)
})

test('generates one APP-ordered lazy resolver loader registry', () => {
	const resolverIndex = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/resolvers/index.ts')

	assert.ok(resolverIndex)
	const source = renderGeneratedFile(resolverIndex)
	assert.doesNotMatch(source, /import\.meta\.glob|eager: true|export const resolvers/)
	assert.match(source, /export const loadResolverEntries = async/)
	assert.match(source, /export const loadResolvers = async/)
	assert.match(source, /Resolver module source mismatch/)
	assert.deepEqual(
		[...source.matchAll(/\[Source\.([A-Za-z0-9_]+), \(\) => import\('([^']+)'\)\]/g)].map((match) => ({
			source: match[1],
			path: `src/resolvers/${match[2]?.replace(/^\.\//, '')}`,
		})),
		app.resolvers.modules
	)
	assert.throws(
		() => compileApp({
			...app,
			resolvers: {
				...app.resolvers,
				modules: [...app.resolvers.modules, app.resolvers.modules[0]],
			},
		}),
		/duplicate resolver module source/
	)
	assert.throws(
		() => compileApp({
			...app,
			resolvers: {
				...app.resolvers,
				modules: app.resolvers.modules.map((module, index) => index === 0 ? {
					...module,
					source: 'MissingSource',
				} : module),
			},
		}),
		/references missing source MissingSource/
	)
})

test('projects APP field enums and navigation structure into runtime modules', () => {
	const generatedFileByPath = new Map(baselineCompiledApp.generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))
	const viewsIndex = generatedFileByPath.get('src/views/index.ts')

	assert.ok(viewsIndex)
	assert.match(viewsIndex, /export const entityViewComponentByType: Record<EntityType, EntityViewComponent> = \{/)
	assert.match(viewsIndex, /\[EntityType\.Network\]: NetworkView,/)
	assert.doesNotMatch(viewsIndex, /export const View =/)
	assert.doesNotMatch(viewsIndex, /: View\.[A-Za-z_]/)

	assert.equal(
		generatedFileByPath.get('src/schema/EntityField.ts'),
		`// Generated from APP.ts. Do not edit by hand.

export enum EntityFieldCardinality {
${Object.values(EntityFieldCardinality).map((member) => `\t${member} = '${member}',`).join('\n')}
}

export enum EntityFieldType {
${Object.values(EntityFieldType).map((member) => `\t${member} = '${member}',`).join('\n')}
}
`
	)
	assert.equal(
		generatedFileByPath.get('src/routes/NavigationItem.ts'),
		`// Generated from APP.ts. Do not edit by hand.

export type NavigationItem = {
	id: string
	title: string
	icon?: string
	address?: {
		network?: { chainId: number }
		address: \`0x\${string}\`
	}
	href?: string
	tag?: string
	tagIcon?: string
	defaultIsOpen?: boolean
	manualWatch?: boolean
	children?: NavigationItem[]
	allChildren?: NavigationItem[]
}
`
	)
	assert.match(
		generatedFileByPath.get('src/schema/Account.ts') ?? '',
		/import \{ entity, facet \} from '\$\/schema\/\$schema\.ts'[\s\S]*?import \{ EntityFieldCardinality, EntityFieldType \} from '\$\/schema\/EntityField\.ts'/
	)
})

test('keeps APP compiler registries internally aligned', () => {
	const appEntityTypes = app.schema.entities.map((entity) => entity.entityType)
	const appSourceProviders = app.sources.providers.map((provider) => provider.provider)
	const appSources = app.sources.sources.map((source) => source.source)
	const appResolverModulePaths = app.resolvers.modules.map((resolverModule) => resolverModule.path)

	assert.equal(appEntityTypes.length, new Set(appEntityTypes).size)
	assert.deepEqual(
		Object.values(EntityType).filter((entityType) => !appEntityTypes.includes(entityType)),
		[]
	)
	assert.equal(
		(app.schema.entities.find((entity) => entity.entityType === EntityType.Network)?.facets ?? [])
			.some((facet) => facet.name === 'Evm'),
		true
	)
	assert.deepEqual(appEntityTypes.filter((entityType) => !(entityType in EntityType)), [])
	assert.equal(appSourceProviders.length, new Set(appSourceProviders).size)
	assert.deepEqual(appSourceProviders.filter((sourceProvider) => !(sourceProvider in SourceProvider)), [])
	assert.equal(appSources.length, new Set(appSources).size)
	assert.deepEqual(appSources.filter((source) => !(source in Source)), [])
	assert.equal(appResolverModulePaths.length, new Set(appResolverModulePaths).size)
})

test('keeps prefetched list cards from expanding singular root queries to every entity field', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const singularRootQuery = (source: string) => (
		source.match(/const \w+ = \$derived\(selection\(([\s\S]*?)\)\)\n\tconst titleFallback = \$derived\(/)?.[1]
	)
	const singularViewRootQueries = generatedFiles.flatMap((generatedFile) => {
		if (!/^src\/views\/[^/]+View\.svelte$/.test(generatedFile.path))
			return []

		const source = renderGeneratedFile(generatedFile)
		const query = singularRootQuery(source)
		return query == null ? [] : [{
			path: generatedFile.path,
			query,
		}]
	})
	const xrplLedgerView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/XrplLedgerView.svelte')
	const xrplLedgersView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/XrplLedgersView.svelte')
	const singularViewSources = generatedFiles
		.filter((generatedFile) => /^src\/views\/[^/]+View\.svelte$/.test(generatedFile.path))
		.map(renderGeneratedFile)

	assert.ok(xrplLedgerView)
	assert.ok(xrplLedgersView)
	assert.ok(singularViewRootQueries.length > 400)
	assert.deepEqual(
		singularViewRootQueries
			.filter(({ query }) => !/prefetched\[EntityMetaKey\.Selector\] != null && layout !== EntityLayout\.SummaryDetails \? \{[\s\S]*?\bfields: \{\}/.test(query))
			.map(({ path }) => path),
		[]
	)
	assert.match(
		singularRootQuery(renderGeneratedFile(xrplLedgerView)) ?? '',
		/prefetched\[EntityMetaKey\.Selector\] != null && layout !== EntityLayout\.SummaryDetails \? \{[\s\S]*?fields: \{\}[\s\S]*?: \{[\s\S]*?sources: selection\.sources,[\s\S]*?\}/
	)
	assert.match(
		renderGeneratedFile(xrplLedgersView),
		/prefetched=\{xrplLedgerFields\}[\s\S]*?layout=\{EntityLayout\.Summary\}/
	)
	assert.ok(singularViewSources.filter((source) => (
		source.includes('{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}')
	)).length > 300)
	for (const [path, snippets] of [
		['src/views/CosmosBlockView.svelte', ['HeadingAfter']],
		['src/views/CosmosValidatorView.svelte', ['Title', 'Value', 'HeadingAfter']],
		['src/views/CosmosAccountView.svelte', ['Title', 'Value', 'HeadingAfter']],
		['src/views/CosmosGovernanceProposalView.svelte', ['Title', 'Value', 'HeadingAfter']],
	] as const) {
		const source = generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(source)
		for (const snippetName of snippets)
			assert.match(
				renderGeneratedFile(source),
				new RegExp(
					`\\{#snippet ${snippetName}\\(\\)\\}\\s*\\{#if prefetched\\[EntityMetaKey\\.Selector\\] != null && layout !== EntityLayout\\.SummaryDetails\\}[\\s\\S]*?\\{:else\\}[\\s\\S]*?<ResourceBoundary resource=`
				)
			)
	}

	const rootQueryWithoutExplicitFields = renderGeneratedFile(xrplLedgerView).replace('\n\t\tfields: {},', '')
	assert.doesNotMatch(
		singularRootQuery(rootQueryWithoutExplicitFields) ?? '',
		/prefetched\[EntityMetaKey\.Selector\] != null && layout !== EntityLayout\.SummaryDetails \? \{[\s\S]*?\bfields:/
	)
	const titleWithoutPrefetchedBranch = renderGeneratedFile(xrplLedgerView)
		.replace(
			'{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}',
			'{#if false}'
		)
	assert.doesNotMatch(
		titleWithoutPrefetchedBranch,
		/\{#snippet Title\(\)\}\s*\{#if prefetched\[EntityMetaKey\.Selector\] != null && layout !== EntityLayout\.SummaryDetails\}/
	)
})

test('renders value display facts and their query dependencies in definition lists', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const beaconValidatorView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BeaconValidatorView.svelte')
	const cashuProofView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadCashuProofView.svelte')
	const cashuWalletTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadCashuWalletState_TimestampView.svelte')
	const assetSupplyView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AssetSupply_LedgerCoordinateView.svelte')
	const evmBalanceTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmNetworkActorCoinBalance_TimestampView.svelte')
	const algorandAssetTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AlgorandAsset_TimestampView.svelte')

	assert.ok(beaconValidatorView)
	assert.ok(cashuProofView)
	assert.ok(cashuWalletTimestampView)
	assert.ok(assetSupplyView)
	assert.ok(evmBalanceTimestampView)
	assert.ok(algorandAssetTimestampView)

	assert.match(
		renderGeneratedFile(beaconValidatorView),
		/<dt>Balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balanceGwei\}[\s\S]*?<span> gwei<\/span>/
	)
	assert.match(
		renderGeneratedFile(cashuProofView),
		/fields: \{[\s\S]*?amount: true,[\s\S]*?unit: true,[\s\S]*?\}[\s\S]*?<dt>amount<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{amount\}[\s\S]*?<span>\{[\s\S]*?\.unit == null \? '' : ` \$\{String\([\s\S]*?\.unit\)\}`\}<\/span>/
	)
	assert.match(
		renderGeneratedFile(cashuWalletTimestampView),
		/fields: \{[\s\S]*?balance: true,[\s\S]*?\$walletState: \{[\s\S]*?unit: true,[\s\S]*?\}[\s\S]*?<dt>balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balance\}[\s\S]*?<span>\{[\s\S]*?\.\$walletState\.unit == null/
	)
	assert.match(
		renderGeneratedFile(assetSupplyView),
		/fields: \{[\s\S]*?totalSupply: true,[\s\S]*?\$assetInstance: \{[\s\S]*?decimals: true,[\s\S]*?symbol: true,[\s\S]*?\}[\s\S]*?<dt>total supply<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{totalSupply\}[\s\S]*?decimalPlaces=\{[\s\S]*?\.\$assetInstance\.decimals\}[\s\S]*?<span>\{[\s\S]*?\.\$assetInstance\.symbol == null/
	)
	assert.match(
		renderGeneratedFile(evmBalanceTimestampView),
		/fields: \{[\s\S]*?balance: true,[\s\S]*?\$actorCoin: \{[\s\S]*?decimals: true,[\s\S]*?symbol: true,[\s\S]*?\}[\s\S]*?<dt>Balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balance\}[\s\S]*?decimalPlaces=\{[\s\S]*?\.\$actorCoin\.decimals\}[\s\S]*?<span>\{[\s\S]*?\.\$actorCoin\.symbol == null/
	)
	assert.match(
		renderGeneratedFile(algorandAssetTimestampView),
		/fields: \{[\s\S]*?total: true,[\s\S]*?decimals: true,[\s\S]*?unitName: true,[\s\S]*?\}[\s\S]*?<dt>total<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{total\}[\s\S]*?decimalPlaces=\{[\s\S]*?\.decimals\}[\s\S]*?<span>\{[\s\S]*?\.unitName == null/
	)
})

test('omits Lens relationships without executable source ownership', () => {
	for (const viewPath of [
		'src/views/LensNetworkView.svelte',
		'src/views/LensAccountView.svelte',
	]) {
		const generatedView = baselineCompiledApp.generatedFiles.find(({ path }) => path === viewPath)

		assert.ok(generatedView)
		assert.doesNotMatch(
			renderGeneratedFile(generatedView),
			/LensFeedsView|LensUsernameNamespacesView|LensAccountManagersView|lens-(?:network-)?feeds|lens-(?:network-)?username-namespaces|lens-account-managers/
		)
	}
})

test('lowers source-backed social hub lists as carousel cards', () => {
	for (const [viewPath, listName] of [
		['src/views/RssNetworkView.svelte', 'RssFeedsView'],
		['src/views/XNetworkView.svelte', 'XUsersView'],
		['src/views/XNetworkView.svelte', 'XPostsView'],
	] as const) {
		const generatedView = baselineCompiledApp.generatedFiles.find(({ path }) => path === viewPath)

		assert.ok(generatedView)
		assert.match(
			renderGeneratedFile(generatedView),
			new RegExp(`<CollapsibleTabs[\\s\\S]*?<${listName}[\\s\\S]*?data-column-item="flexible"[\\s\\S]*?data-card[\\s\\S]*?data-scroll-container`)
		)
	}
})

test('keeps entity-list selection props distinct from projection boundary props', () => {
	const nostrRelayView = baselineCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/views/NostrRelayView.svelte'
	))

	assert.ok(nostrRelayView)
	const renderedNostrRelayView = renderGeneratedFile(nostrRelayView)
	assert.match(
		renderedNostrRelayView,
		/<Projection projection=\{projectionValue\}>[\s\S]*?<NostrNotesView[\s\S]*?selection=\{[\s\S]*?projection\.\$\$notes\(/
	)
	assert.doesNotMatch(
		baselineCompiledApp.generatedFiles
			.filter(({ path }) => /\/[^/]+sView\.svelte$/.test(path))
			.map(renderGeneratedFile)
			.join('\n'),
		/<[A-Za-z0-9_]+sView[\s\S]{0,160}?\bprojection=\{/
	)
})

test('emits declarative Network enrichment and stable carousel article boundaries', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const generatedFiles = baselineCompiledApp.generatedFiles
	const networkView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	const xrplLedgersView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/XrplLedgersView.svelte')
	const urlsView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UrlsView.svelte')
	const evmUserOperationView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmUserOperationView.svelte')
	const networksPage = generatedFiles.find((generatedFile) => generatedFile.path === 'src/routes/(explore)/networks/+page.svelte')
	const collapsibleTabs = readFileSync(path.join(root, 'src/components/CollapsibleTabs.svelte'), 'utf8')

	assert.ok(network?.views.singular?.pending)
	assert.ok(networkView)
	assert.ok(xrplLedgersView)
	assert.ok(urlsView)
	assert.ok(evmUserOperationView)
	assert.ok(networksPage)
	assert.match(collapsibleTabs, /\{#each sections as section \(section\.id\)\}[\s\S]*?\{#if Section\}[\s\S]*?\{@render Section\(/)
	assert.doesNotMatch(collapsibleTabs, /loadedSectionIds|Section &&|section\.id === activeSectionId \|\|/)

	const renderedNetworkView = renderGeneratedFile(networkView)
	const networkRootQuery = renderedNetworkView.slice(
		renderedNetworkView.indexOf('const network = $derived('),
		renderedNetworkView.indexOf('const titleFallback = $derived(')
	)

	assert.match(renderedNetworkView, /import \{ beaconRestBaseByExecutionChainId \} from '\$\/constants\/BeaconConsensus\.ts'/)
	assert.match(renderedNetworkView, /import \{[^}]*networkByCaip2, networkBySlug[^}]*\} from '\$\/constants\/Network\.ts'/)
	assert.match(renderedNetworkView, /import \{ SourceTargetKind \} from '\$\/sources\/SourceBinding\.ts'/)
	assert.match(renderedNetworkView, /const pendingEntity = \$derived\([\s\S]*?networkByCaip2\[caip2Key\][\s\S]*?networkBySlug\[base\.slug\][\s\S]*?beaconRestBaseByExecutionChainId/)
	assert.doesNotMatch(networkRootQuery, /\$networkStack|\$icon|\$\$nativeAssets|\$\$blockExplorerUrls|\$\$faucetUrls/)
	assert.match(renderedNetworkView, /SectionEvmAssetsNativeCoin[\s\S]*?<article[\s\S]*?data-card[\s\S]*?data-scroll-container[\s\S]*?<ResourceBoundary[\s\S]*?<p data-text="muted" data-section-state="resolved-empty">No native coin available\.<\/p>[\s\S]*?layout=\{EntityLayout\.SummaryInline\}/)
	assert.match(renderedNetworkView, /SectionEvmConsensusEndpoints[\s\S]*?\{:else\}\s*<p data-text="muted" data-section-state="resolved-empty">Consensus endpoints are not listed for this network\.<\/p>/)
	assert.match(renderedNetworkView, /import Projection from '\$\/components\/Projection\.svelte'/)
	assert.match(renderedNetworkView, /resource=\{selection\.Evm\}[\s\S]*?<Projection projection=\{projectionValue\}>[\s\S]*?\{#snippet Applicable\(projection\)\}[\s\S]*?<CollapsibleTabs/)
	assert.doesNotMatch(renderedNetworkView, /\{#snippet (?:NotApplicable|Blocked|Unsupported)\(/)
	assert.doesNotMatch(renderedNetworkView, /data-section-state="projection-(?:not-applicable|blocked|unsupported)"/)
	assert.match(renderedNetworkView, /SectionEvmExecutionBlocks[\s\S]*?<EvmBlocksView[\s\S]*?emptyText='No blocks available\.'[\s\S]*?\/>/)
	for (const [collapsibleTabs] of renderedNetworkView.matchAll(/<CollapsibleTabs[\s\S]*?>/g))
		assert.doesNotMatch(collapsibleTabs, /networkApplicableSources/)
	const executionBlocksSection = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionBlocks'),
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionTransactions')
	)
	assert.doesNotMatch(executionBlocksSection, /\{#if (?:open|!open)|\{#if [^}]*\bopen\b/)
	assert.match(renderedNetworkView, /<XrplLedgersView[\s\S]*?CollapsibleProps=\{\{ canToggle: false \}\}[\s\S]*?collapsible=\{false\}[\s\S]*?open=\{open\}/)
	assert.doesNotMatch(renderedNetworkView, /SectionEvmExecutionUpgrades[\s\S]*?projection\.\$\$executionUpgrades\(\{[\s\S]*?count: true,[\s\S]*?<\/snippet>/)
	assert.match(renderGeneratedFile(xrplLedgersView), /<EntitiesList[\s\S]*?resource=\{[\s\S]*?getResourceItems=/)
	assert.doesNotMatch(renderGeneratedFile(xrplLedgersView), /\{#if open \|\| !collapsible\}|\{#snippet Pending\(\)\}/)
	assert.match(renderGeneratedFile(urlsView), /url: encodeURIComponent\(String\(urlHrefFields\.url \?\? ''\)\)/)
	assert.match(renderGeneratedFile(networksPage), /data-column-item="flexible"[\s\S]*?data-card[\s\S]*?data-scroll-container/)
	const renderedEvmUserOperationView = renderGeneratedFile(evmUserOperationView)
	for (const tab of ['participants', 'gas-fees', 'payloads'])
		assert.match(renderedEvmUserOperationView, new RegExp(`id=\\{\\\`\\$\\{id\\}-${tab}-fields\\\`\\} data-column-item="flexible" data-card data-scroll-container`))
	assert.match(renderedNetworkView, /<dt>Name<\/dt>[\s\S]*?<dt>Namespace<\/dt>[\s\S]*?<dt>Ledger models<\/dt>[\s\S]*?<dt>Execution models<\/dt>[\s\S]*?<dt>Network stack<\/dt>[\s\S]*?<dt>Environment<\/dt>[\s\S]*?<dt>CAIP-2<\/dt>/)
	assert.match(renderedNetworkView, /<dt>Upgrade<\/dt>[\s\S]*?<dt>Block<\/dt>[\s\S]*?<dt>Fee market<\/dt>[\s\S]*?<dt>Mempool<\/dt>[\s\S]*?resource=\{selection\.Evm\.EthereumBeacon\}[\s\S]*?<dt>Epoch<\/dt>[\s\S]*?resource=\{selection\.Evm\.EthereumBeacon\}[\s\S]*?<dt>Slot<\/dt>/)
	const ethereumBeaconCarousel = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet SectionEvmConsensusUpgrades'),
		renderedNetworkView.indexOf('{#snippet SectionEvmDataAvailability')
	)
	assert.match(ethereumBeaconCarousel, /selection\.Evm\.\$\$consensusUpgrades\(/)
	assert.match(ethereumBeaconCarousel, /selection\.Evm\.consensusEndpoints\(/)
	assert.doesNotMatch(ethereumBeaconCarousel, /projection\.Evm/)
	assert.doesNotMatch(
		ethereumBeaconCarousel,
		/selection\.Evm\.consensusEndpoints\(\{[\s\S]*?fields:\s*\{\s*Evm:/
	)
	assert.match(renderedNetworkView, /<dt>Native currency<\/dt>[\s\S]*?<dt>Native coin<\/dt>[\s\S]*?<dt>Parent<\/dt>[\s\S]*?<dt>Mainnet<\/dt>/)
	assert.ok(renderedNetworkView.indexOf('SectionEvmAssetsNativeCoin') < renderedNetworkView.indexOf('SectionEvmAssetsNativeInstance'))
	assert.ok(renderedNetworkView.indexOf('SectionEvmAssetsNativeInstance') < renderedNetworkView.indexOf('SectionEvmAssetsNativeAssets'))
	const pendingNetworkFacets = [...network.facets]
	const networkFacetCarousels = []
	for (const facet of pendingNetworkFacets) {
		networkFacetCarousels.push(...(facet.singularView?.carousels ?? []))
		pendingNetworkFacets.push(...(facet.facets ?? []))
	}
	assert.equal(
		[...renderedNetworkView.matchAll(/<CollapsibleTabs\b/g)].length,
		networkFacetCarousels.length
	)
	for (const carousel of networkFacetCarousels) {
		assert.ok(renderedNetworkView.includes(`id={viewDomId + '-carousel-${carousel.id}'}`), carousel.id)
		assert.ok(renderedNetworkView.includes(`<HeadingComponent>${carousel.label}</HeadingComponent>`), carousel.id)
		for (const section of carousel.sections)
			assert.match(
				renderedNetworkView,
				new RegExp(`\\{#snippet Section${section.id.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`).join('')}\\(`),
				section.id
			)
	}
	for (const carouselLabel of [
		'Topology',
		'Execution',
		'Consensus and block production',
		'Data availability',
		'Contracts and accounts',
		'Assets',
		'Resources',
	])
		assert.notEqual(renderedNetworkView.indexOf(`<HeadingComponent>${carouselLabel}</HeadingComponent>`), -1)
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Topology</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Execution</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Execution</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Consensus and block production</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Consensus and block production</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Data availability</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Data availability</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Contracts and accounts</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Contracts and accounts</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Assets</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Assets</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Resources</HeadingComponent>'))

	const hederaFacet = network.facets.find((facet) => facet.name === 'Hedera')
	const xrplFacet = network.facets.find((facet) => facet.name === 'Xrpl')

	assert.ok(hederaFacet?.singularView)
	assert.ok(xrplFacet?.singularView)
	assert.deepEqual(hederaFacet.fields.map((field) => field.name), [
		'shard',
		'realm',
		'$$blocks',
		'$$accounts',
	])
	assert.deepEqual(xrplFacet.fields.map((field) => field.name), [
		'$$accounts',
		'$$amendments',
		'$$amms',
		'$$ledgerEntries',
		'$$ledgers',
		'$$transactions',
	])
	assert.deepEqual(
		hederaFacet.singularView.carousels?.flatMap((carousel) => carousel.sections.map((section) => section.id)),
		[
			'hedera-chain-blocks',
			'hedera-accounts',
		]
	)
	assert.deepEqual(
		xrplFacet.singularView.carousels?.flatMap((carousel) => carousel.sections.map((section) => section.id)),
		[
			'xrpl-chain-ledgers',
			'xrpl-chain-transactions',
			'xrpl-ledger-state-accounts',
			'xrpl-ledger-state-entries',
			'xrpl-protocol-amendments',
			'xrpl-liquidity-amms',
		]
	)
	for (const section of [
		'SectionHederaChainBlocks',
		'SectionHederaAccounts',
		'SectionXrplChainLedgers',
		'SectionXrplChainTransactions',
		'SectionXrplLedgerStateAccounts',
		'SectionXrplLedgerStateEntries',
		'SectionXrplProtocolAmendments',
		'SectionXrplLiquidityAmms',
	])
		assert.match(renderedNetworkView, new RegExp(section))
})

test('keeps every projection-carousel field at its declared facet owner', () => {
	for (const entity of app.schema.entities) {
		const view = baselineCompiledApp.generatedFiles.find(({ path: generatedFilePath }) => generatedFilePath === `src/views/${entity.entityType}View.svelte`)
		if (view == null)
			continue

		const renderedView = renderGeneratedFile(view)
		const pendingFacets = (entity.facets ?? []).map((facet) => ({
			facet,
			path: [facet.name],
		}))
		const carousels = [...(entity.singularView?.carousels ?? [])]
		for (const { facet, path: facetPath } of pendingFacets) {
			carousels.push(...(facet.singularView?.carousels ?? []))

			for (const nestedFacet of facet.facets ?? [])
				pendingFacets.push({
					facet: nestedFacet,
					path: [...facetPath, nestedFacet.name],
				})
		}
		for (const carousel of carousels) {
			if (carousel.projectionPath == null)
				continue

			for (const section of carousel.sections) {
				if (typeof section.field === 'string' || section.field == null)
					continue

				const fieldFacetPath = section.field.slice(0, -1)
				const snippetName = `Section${section.id.split(/[^A-Za-z0-9]+/).map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join('')}`
				const snippetStart = renderedView.indexOf(`{#snippet ${snippetName}`)
				const snippetEnd = renderedView.indexOf('{#snippet ', snippetStart + 1)
				const snippet = renderedView.slice(snippetStart, snippetEnd === -1 ? undefined : snippetEnd)

				assert.ok(snippetStart !== -1, `${entity.entityType}.${snippetName} must be generated`)
				if (fieldFacetPath.length === carousel.projectionPath.length && fieldFacetPath.every((facetName, index) => carousel.projectionPath[index] === facetName)) {
					assert.match(snippet, new RegExp(`projection\\.${section.field.at(-1)}`), `${entity.entityType}.${snippetName} must read a current-projection field directly`)
					assert.doesNotMatch(snippet, new RegExp(`selection\\.${section.field.join('\\.')}`), `${entity.entityType}.${snippetName} must not escape its current projection`)
				} else if (fieldFacetPath.length < carousel.projectionPath.length && fieldFacetPath.every((facetName, index) => carousel.projectionPath[index] === facetName)) {
					assert.match(snippet, new RegExp(`selection\\.${section.field.join('\\.')}`), `${entity.entityType}.${snippetName} must retain its ancestor field owner`)
					assert.doesNotMatch(snippet, new RegExp(`projection\\.${fieldFacetPath[0]}`), `${entity.entityType}.${snippetName} must not reinterpret an ancestor facet through the current projection`)
				} else {
					assert.match(snippet, new RegExp(`resource=\\{[\\s\\S]*?selection\\.${fieldFacetPath.join('\\.')}`), `${entity.entityType}.${snippetName} must gate a descendant or sibling field through its declared projection`)
					assert.match(snippet, new RegExp(`projection\\.${section.field.at(-1)}`), `${entity.entityType}.${snippetName} must read the field relative to that projection`)
					assert.doesNotMatch(snippet, new RegExp(`projection\\.${fieldFacetPath.join('\\.')}`), `${entity.entityType}.${snippetName} must not repeat an absolute facet path inside its projection`)
				}
			}
		}
	}
})

test('renders every generated entity-list item through a card-backed singular summary', () => {
	const pluralViews = baselineCompiledApp.generatedFiles.flatMap((generatedFile) => {
		const source = renderGeneratedFile(generatedFile)

		if (!source.includes('<EntitiesList'))
			return []

		return [{
			path: generatedFile.path,
			source,
		}]
	})

	assert.ok(pluralViews.length > 0)
	for (const pluralView of pluralViews) {
		assert.equal([...pluralView.source.matchAll(/<EntitiesList\b/g)].length, 1, pluralView.path)
		assert.match(pluralView.source, /\{#snippet Item\b[\s\S]*?layout=\{EntityLayout\.Summary\}[\s\S]*?\{\/snippet\}/, pluralView.path)
		assert.doesNotMatch(pluralView.source, /\{#snippet Item\b[\s\S]*?layout=\{EntityLayout\.(?:Title|Value)\}/, pluralView.path)
		assert.match(pluralView.source, /<\/EntitiesList>\s*$/, pluralView.path)
	}
})

test('renders selected entity titles on every multi-selector detail page', () => {
	const multiSelectorPages = baselineCompiledApp.generatedFiles.flatMap((generatedFile) => {
		const source = renderGeneratedFile(generatedFile)

		return generatedFile.path.endsWith('/+page.svelte') && source.includes('data.selectorMapping') ?
			[{
				path: generatedFile.path,
				source,
			}]
		:
			[]
	})

	assert.ok(multiSelectorPages.length > 0)
	for (const page of multiSelectorPages) {
		assert.match(page.source, /const pageSelection = \$derived\(/, page.path)
		assert.match(page.source, /const pageEntityTitle = \$derived\(/, page.path)
		assert.match(page.source, /<svelte:head>[\s\S]*?<title>\{pageEntityTitle\} • \{pageEntityTypeLabel\} • Blockhead<\/title>[\s\S]*?<\/svelte:head>/, page.path)
		assert.match(page.source, /selection=\{pageSelection\}/, page.path)
		assert.doesNotMatch(page.source, /^\s*[A-Za-z_$][A-Za-z0-9_$]*,[A-Za-z_$][A-Za-z0-9_$]*:\s*true,/m, page.path)
	}

	const networkPage = multiSelectorPages.find((page) => page.path.endsWith('/network/[network=networkCaip2OrNetworkSlug]/+page.svelte'))
	assert.ok(networkPage)
	assert.match(networkPage.source, /Evm: \{[\s\S]*?consensusProtocol: true,[\s\S]*?registryStatus: true,[\s\S]*?\}/)
})

test('gates subject-specific carousels through schema facets', () => {
	const marketView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/MarketView.svelte')

	assert.ok(marketView)
	const renderedMarketView = renderGeneratedFile(marketView)

	assert.match(renderedMarketView, /resource=\{selection\.Spot\}[\s\S]*?id=\{viewDomId \+ '-carousel-market-spot'\}/)
	assert.match(renderedMarketView, /resource=\{selection\.Derivative\}[\s\S]*?id=\{viewDomId \+ '-carousel-market-derivatives'\}/)
	assert.doesNotMatch(renderedMarketView, /\{#if pendingEntity\.marketKind/)
	for (const sectionSnippet of renderedMarketView.matchAll(
		/^(\t*)\{#snippet SectionMarket(?:Prices|Ohlc|DerivativeTimestamps)\([^]*?^\1\{\/snippet\}/gm
	))
		assert.doesNotMatch(sectionSnippet[0], /\{#if .*marketKind/)
})

test('emits every source-axis enum and only valid enum references in provider rows', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const sourceBinding = generatedFiles.find((generatedFile) => generatedFile.path === 'src/sources/SourceBinding.ts')
	const sourceProviders = generatedFiles.find((generatedFile) => generatedFile.path === 'src/sources/$sourceProviders.ts')

	assert.ok(sourceBinding)
	assert.ok(sourceProviders)

	const renderedSourceBinding = renderGeneratedFile(sourceBinding)
	const renderedSourceProviders = renderGeneratedFile(sourceProviders)
	const sourceAxes = {
		ApiFamily,
		SourceArtifactKind,
		SourceCredentialScope,
		SourceDelivery,
		SourceEndpointKind,
		SourceOperationGroup,
		SourceTargetKind,
		WireProtocol,
	}

	for (const [enumName, sourceAxis] of Object.entries(sourceAxes)) {
		const enumBody = renderedSourceBinding.match(new RegExp(`export enum ${enumName} \\{([\\s\\S]*?)\\n\\}`))?.[1]

		assert.ok(enumBody)
		for (const enumValue of Object.values(sourceAxis))
			assert.match(enumBody, new RegExp(`\\b${enumValue}\\s*=\\s*'${enumValue}'`))
	}

	for (const enumReference of renderedSourceProviders.matchAll(/\b(ApiFamily|SourceArtifactKind|SourceCredentialScope|SourceDelivery|SourceEndpointKind|SourceOperationGroup|SourceTargetKind|WireProtocol)\.([A-Za-z0-9_]+)/g))
		assert.match(renderedSourceBinding, new RegExp(`\\b${enumReference[2]}\\s*=\\s*'${enumReference[2]}'`), `${enumReference[0]} must be emitted by SourceBinding.ts`)

	assert.match(renderedSourceProviders, /ApiFamily\.EnvioHyperSyncApi/)
	assert.match(renderedSourceProviders, /ApiFamily\.GoldRushFoundationalApi/)
	assert.match(renderedSourceProviders, /ApiFamily\.SqdPortalStream/)
})

test('projects APP source binding compatibility into runtime rows', () => {
	const generatedFile = baselineCompiledApp.generatedFiles.find((candidate) => candidate.path === 'src/sources/$sourceBindingCompatibility.ts')

	assert.ok(generatedFile)
	assert.equal(renderGeneratedFile(generatedFile).match(/wireProtocol:/g)?.length, sourceBindingCompatibility.length)
	assert.match(renderGeneratedFile(generatedFile), /apiFamilies: \[\s*ApiFamily\.EvmExecutionJsonRpc,/)
	assert.match(renderGeneratedFile(generatedFile), /operationGroups: \[[\s\S]*?SourceOperationGroup\.EvmRpcCore/)
	assert.match(renderGeneratedFile(generatedFile), /artifactKinds: \[[\s\S]*?SourceArtifactKind\.OpenRpcSpec/)
	assert.match(renderGeneratedFile(generatedFile), /apiFamilies: \[\s*ApiFamily\.WalletApi,[\s\S]*?artifactKinds: \[\]/)
	assert.match(renderGeneratedFile(generatedFile), /WireProtocol\.Grpc,[\s\S]*?ApiFamily\.GrpcService,[\s\S]*?SourceEndpointKind\.HttpUrl,[\s\S]*?SourceEndpointKind\.TcpAddress,/)
	assert.match(renderGeneratedFile(generatedFile), /WireProtocol\.Grpc,[\s\S]*?operationGroups: true,[\s\S]*?artifactKinds: true,/)
})

test('keeps Bsky Social transport on its own registered proxy binding', () => {
	const source = app.sources.sources.find((candidate) => (
		candidate.source === Source.Atproto_BskySocial_Xrpc
	))

	assert.ok(source?.binding)
	assert.equal(source.binding.delivery, SourceDelivery.HttpProxy)
	assert.deepEqual(source.binding.endpoints.map((endpoint) => endpoint.corsEnabled), [false])

	const transportMutationApp = structuredClone(app)
	const mutatedSource = transportMutationApp.sources.sources.find((candidate) => (
		candidate.source === Source.Atproto_BskySocial_Xrpc
	))

	assert.ok(mutatedSource?.binding)
	Object.defineProperty(mutatedSource.binding, 'delivery', {
		value: SourceDelivery.BrowserDirect,
	})
	Object.defineProperty(mutatedSource.binding.endpoints[0], 'corsEnabled', {
		value: true,
	})
	const generatedSourceProviders = compileApp(transportMutationApp).generatedFiles.find((candidate) => (
		candidate.path === 'src/sources/$sourceProviders.ts'
	))

	assert.ok(generatedSourceProviders)
	assert.match(
		renderGeneratedFile(generatedSourceProviders),
		/Source\.Atproto_BskySocial_Xrpc,[\s\S]*?corsEnabled: true,[\s\S]*?delivery: SourceDelivery\.BrowserDirect/
	)
})

test('covers every authored source binding with APP compatibility rows', () => {
	assert.deepEqual(
		[...new Set(sourceBindingCompatibility.flatMap((compatibility) => compatibility.apiFamilies.flatMap((apiFamily) => compatibility.endpointKinds.map((endpointKind) => (
			`${compatibility.wireProtocol}/${apiFamily}/${endpointKind}`
		)))))].sort(),
		[...new Set(app.sources.sources.flatMap((source) => [
			...(source.binding == null ? [] : [source.binding]),
			...(source.bindings ?? []),
		].flatMap((binding) => binding.endpoints.map((endpoint) => (
			`${binding.wireProtocol}/${binding.apiFamily}/${endpoint.endpointKind}`
		)))))].sort()
	)

	for (const source of app.sources.sources)
		for (const binding of [
			...(source.binding == null ? [] : [source.binding]),
			...(source.bindings ?? []),
		]) {
			const compatibility = sourceBindingCompatibility.find((candidate) => (
				candidate.wireProtocol === binding.wireProtocol
				&& candidate.apiFamilies.some((apiFamily) => apiFamily === binding.apiFamily)
			))

			assert.ok(compatibility, `${source.source}: ${binding.wireProtocol}/${binding.apiFamily}`)
			for (const endpoint of binding.endpoints)
				assert.equal(
					compatibility.endpointKinds.some((endpointKind) => endpointKind === endpoint.endpointKind),
					true,
					`${source.source}: ${binding.wireProtocol}/${binding.apiFamily}/${endpoint.endpointKind}`
				)
			if (compatibility.operationGroups !== true)
				for (const operationGroup of binding.operationGroups)
					assert.equal(
						compatibility.operationGroups.some((allowedOperationGroup) => allowedOperationGroup === operationGroup),
						true,
						`${source.source}: ${binding.apiFamily}/${operationGroup}`
					)
			if (compatibility.artifactKinds !== true)
				for (const artifact of binding.artifacts ?? [])
					assert.equal(
						compatibility.artifactKinds.some((artifactKind) => artifactKind === artifact.kind),
						true,
						`${source.source}: ${binding.apiFamily}/${artifact.kind}`
					)
		}
})

test('rejects malformed source binding compatibility rows before lowering', () => {
	assert.throws(
		() => validateSourceBindingCompatibility([
			sourceBindingCompatibility[0],
			sourceBindingCompatibility[0],
		]),
		/Duplicate source binding compatibility pair/
	)
	assert.throws(
		() => validateSourceBindingCompatibility([{
			...sourceBindingCompatibility[0],
			apiFamilies: [],
		}]),
		/requires at least one API family/
	)
	assert.throws(
		() => validateSourceBindingCompatibility([{
			...sourceBindingCompatibility[0],
			endpointKinds: [],
		}]),
		/requires at least one endpoint kind/
	)
	assert.throws(
		() => validateSourceBindingCompatibility([{
			...sourceBindingCompatibility[0],
			operationGroups: [],
		}]),
		/constrained operation groups must be nonempty/
	)
	assert.throws(
		() => validateSourceBindingCompatibility([{
			...sourceBindingCompatibility[0],
			endpointKinds: [
				SourceEndpointKind.TcpAddress,
				SourceEndpointKind.TcpAddress,
			],
		}]),
		/duplicate endpoint kind/
	)
})

test('rejects incompatible and empty authored bindings before lowering', () => {
	const incompatibleApp = structuredClone(app)
	const incompatibleBinding = incompatibleApp.sources.sources.find((source) => source.binding != null)?.binding

	assert.ok(incompatibleBinding)
	Object.defineProperty(incompatibleBinding, 'apiFamily', {
		value: ApiFamily.GraphqlHttp,
	})
	assert.throws(() => compileApp(incompatibleApp), /GraphqlHttp is incompatible/)

	const emptyEndpointApp = structuredClone(app)
	const emptyEndpointBinding = emptyEndpointApp.sources.sources.find((source) => source.binding != null)?.binding

	assert.ok(emptyEndpointBinding)
	emptyEndpointBinding.endpoints.splice(0)
	assert.throws(() => compileApp(emptyEndpointApp), /requires at least one endpoint/)

	const emptyOperationApp = structuredClone(app)
	const emptyOperationBinding = emptyOperationApp.sources.sources.find((source) => source.binding != null)?.binding

	assert.ok(emptyOperationBinding)
	emptyOperationBinding.operationGroups.splice(0)
	assert.throws(() => compileApp(emptyOperationApp), /requires at least one operation group/)
})

test('consumes authored singular lists and plural query presentation defaults', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const ensNetworkView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/_GlobalEnsNetworkView.svelte')
	const marketCandlesView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/Market_TimeInterval_TimestampsView.svelte')

	assert.ok(ensNetworkView)
	assert.ok(marketCandlesView)
	assert.match(renderGeneratedFile(ensNetworkView), /_GlobalEnsNetwork_TimestampsView/)
	assert.match(renderGeneratedFile(marketCandlesView), /placeholderText = 'Loading OHLC candles\.\.\.'/)
	assert.match(renderGeneratedFile(marketCandlesView), /limit: 4096/)
})

test('rejects missing, Many, and Zero selector fields before route compilation', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)

	assert.ok(network)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== network ? entity : {
					...entity,
					fields: entity.fields.map((field) => field.name !== 'caip2' ? field : {
						...field,
						cardinality: EntityFieldCardinality.Many,
					}),
				}),
			},
		}),
		/Network\.Caip2 selector field caip2 must be singular, received Many/
	)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== network ? entity : {
					...entity,
					fields: entity.fields.map((field) => field.name !== 'caip2' ? field : {
						...field,
						cardinality: EntityFieldCardinality.Zero,
					}),
				}),
			},
		}),
		/Network\.Caip2 selector field caip2 must be singular, received Zero/
	)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== network ? entity : {
					...entity,
					fields: entity.fields.map((field) => field.name !== 'caip2' ? field : {
						...field,
						type: EntityFieldType.EntitiesReference,
						cardinality: EntityFieldCardinality.ZeroOrOne,
						entityType: EntityType.Network,
					}),
				}),
			},
		}),
		/Network\.Caip2 selector field caip2 must be a primitive or entity reference/
	)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== network ? entity : {
					...entity,
					selectors: entity.selectors.map((selector) => selector.name !== 'Caip2' ? selector : {
						...selector,
						fields: ['missing'],
					}),
				}),
			},
		}),
		/Network\.Caip2 selector references missing field missing/
	)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== network ? entity : {
					...entity,
					selectors: entity.selectors.map((selector) => selector.name !== 'Caip2' ? selector : {
						...selector,
						fields: [],
					}),
				}),
			},
		}),
		/Network\.Caip2 selector must contain at least one field/
	)
})

test('keeps route projection ownership explicit', () => {
	const assertProjectionOwnership = (nodes: typeof app.routes.children): void => {
		for (const node of Object.values(nodes)) {
			for (const selectorMappings of Object.values(node.selectors ?? {}))
				for (const mapping of Object.values(selectorMappings))
					if (mapping.projection != null)
						assert.notEqual(mapping.projection.entityType, undefined)

			assertProjectionOwnership(node.children ?? {})
		}
	}

	assertProjectionOwnership(app.routes.children)
})

test('rejects duplicate selector route mappings before indexing', () => {
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]

	assert.ok(networkMappings?.Caip2)
	assert.throws(
		() => compileApp({
			...app,
			routes: {
				children: {
					'(first)': {
						children: {
							network: {
								children: {
									'[network]': {
										selectors: {
											[EntityType.Network]: {
												Caip2: networkMappings.Caip2,
											},
										},
									},
								},
							},
						},
					},
					'(second)': {
						children: {
							network: {
								children: {
									'[network]': {
										selectors: {
											[EntityType.Network]: {
												Caip2: networkMappings.Caip2,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		}),
		/Duplicate route selector mapping Network\.Caip2/
	)
})

test('derives EVM account list hrefs from the canonical account route', () => {
	const accountRoute = app.routes.children['(explore)']?.children?.account

	assert.ok(accountRoute)
	const evmAccountsView = compileApp({
		...app,
		routes: {
			children: {
				'(explore)': {
					children: {
						account: accountRoute,
					},
				},
			},
		},
	}).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmAccountsView.svelte')

	assert.ok(evmAccountsView)
	assert.match(renderGeneratedFile(evmAccountsView), /resolve\('\/account\/\[address=evmAddress\]'/)
	assert.doesNotMatch(renderGeneratedFile(evmAccountsView), /\/xmtp\/account/)
})

test('keeps ActivityPub relation list hrefs scoped to their owning entity', () => {
	const activityPubActorView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))
	const activityPubNoteView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubNoteView.svelte'
	))
	const globalActivityPubNetworkView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/_GlobalActivityPubNetworkView.svelte'
	))

	assert.ok(activityPubActorView)
	assert.ok(activityPubNoteView)
	assert.ok(globalActivityPubNetworkView)
	assert.match(
		renderGeneratedFile(activityPubActorView),
		/resolve\('\/activitypub\/actor\/\[instanceOrigin=absoluteUrl\]\/\[localAccountId=stringSegment\]\/notes', \{[\s\S]*instanceOrigin: encodeURIComponent\(String\(entity\.instanceOrigin \?\? ''\)\)[\s\S]*localAccountId: entity\.localAccountId/
	)
	assert.doesNotMatch(renderGeneratedFile(activityPubActorView), /href=\{resolve\('\/activitypub\/notes'\)\}/)
	assert.doesNotMatch(renderGeneratedFile(activityPubActorView), /encodeURIComponent\(encodeURIComponent/)
	assert.match(
		renderGeneratedFile(activityPubNoteView),
		/resolve\('\/activitypub\/note\/\[instanceOrigin=absoluteUrl\]\/\[localStatusId=stringSegment\]\/thread', \{[\s\S]*instanceOrigin: encodeURIComponent\(String\(selection\.entitySelector\.instanceOrigin \?\? ''\)\)[\s\S]*localStatusId: selection\.entitySelector\.localStatusId/
	)
	assert.doesNotMatch(renderGeneratedFile(activityPubNoteView), /href=\{resolve\('\/activitypub\/notes'\)\}/)
	assert.doesNotMatch(renderGeneratedFile(activityPubNoteView), /encodeURIComponent\(encodeURIComponent/)
	assert.match(renderGeneratedFile(globalActivityPubNetworkView), /href=\{resolve\('\/activitypub\/notes'\)\}/)

	const routeMutationApp = structuredClone(app)
	const actorChildren = routeMutationApp.routes.children['(social)']?.children?.['(activitypub)']?.children?.activitypub
		?.children?.actor?.children?.['[instanceOrigin]']
		?.children?.['[localAccountId]']?.children

	assert.ok(actorChildren?.notes)
	actorChildren['actor-posts'] = actorChildren.notes
	delete actorChildren.notes
	const mutatedActivityPubActorView = compileApp(routeMutationApp).generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))

	assert.ok(mutatedActivityPubActorView)
	assert.match(renderGeneratedFile(mutatedActivityPubActorView), /localAccountId=stringSegment\]\/actor-posts'/)
	assert.doesNotMatch(renderGeneratedFile(mutatedActivityPubActorView), /localAccountId=stringSegment\]\/notes'/)
})

test('lowers ActivityPub syndication HTML through one safe rich-body mode and plain summaries', () => {
	const actorView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))
	const noteView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubNoteView.svelte'
	))

	assert.ok(actorView)
	assert.ok(noteView)
	for (const generatedView of [actorView, noteView].map(renderGeneratedFile)) {
		assert.match(generatedView, /<Markdown content=\{String\([^)]+\)\} mode="syndication" \/>/)
		assert.doesNotMatch(generatedView, /\{@html/)
	}
	assert.match(renderGeneratedFile(noteView), /htmlToPlainText/)

	const syndicationValueType = app.schema.valueTypes.find((valueType) => valueType.id === 'syndicationHtml')
	assert.ok(syndicationValueType)
	const mutatedNoteView = compileApp({
		...app,
		schema: {
			...app.schema,
			valueTypes: app.schema.valueTypes.map((valueType) => valueType !== syndicationValueType ? valueType : {
				...valueType,
				displayExpression: 'value.toUpperCase()',
			}),
		},
	}).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNoteView.svelte')

	assert.ok(mutatedNoteView)
	assert.match(renderGeneratedFile(mutatedNoteView), /pendingEntity\.content\)\.toUpperCase\(\)/)
})

test('lowers ActivityPub content warnings as selector-scoped native disclosure', () => {
	const noteView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNoteView.svelte')
	const notesView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNotesView.svelte')

	assert.ok(noteView)
	assert.ok(notesView)
	const noteSource = renderGeneratedFile(noteView)
	const notesSource = renderGeneratedFile(notesView)
	assert.match(noteSource, /const contentWarningSelectorKey = \$derived\(stringify\(/)
	assert.match(noteSource, /open=\{revealedContentWarningSelectorKey === contentWarningSelectorKey\}/)
	assert.match(noteSource, /<Collapsible[\s\S]*?<header[^>]*>[\s\S]*?Show content/)
	assert.match(noteSource, /<Collapsible\n\s+open=\{revealedContentWarningSelectorKey[\s\S]{0,500}\{#snippet Summary\(\)\}/)
	assert.doesNotMatch(noteSource, /<Collapsible\n\s+open=\{revealedContentWarningSelectorKey[\s\S]{0,500}\{#snippet Summary\(\{\}\)\}/)
	assert.doesNotMatch(noteSource, /\{#snippet Summary\(\{\}\)\}/)
	assert.match(noteSource, /\{@const hasContentWarning = resolvedEntity\.sensitive === true \|\|/)
	assert.doesNotMatch(noteSource, /\{@const hasContentWarning = \(/)
	assert.doesNotMatch(noteSource, /\{#snippet children\(\)\}[\s\S]{0,200}ContentWarningContent/)
	assert.equal((noteSource.match(/-carousel-activitypub-note-thread'/g) ?? []).length, 1)
	assert.equal((noteSource.match(/-carousel-activitypub-note-thread-sensitive-media'/g) ?? []).length, 1)
	assert.equal((noteSource.match(/id: ['"]activitypub-note-media['"]/g) ?? []).length, 0)
	assert.equal((noteSource.match(/id: ['"]activitypub-note-media-sensitive-media['"]/g) ?? []).length, 1)
	assert.equal((noteSource.match(/<Markdown content=/g) ?? []).length, 1)
	assert.ok(noteSource.indexOf('<Markdown content=') > noteSource.indexOf('{#snippet ContentWarningContent'))
	assert.ok(noteSource.indexOf('<MediaListView') > noteSource.indexOf('{#snippet ContentWarningContent'))
	assert.match(noteSource, /sensitive: true/)
	assert.match(noteSource, /spoilerText: true/)
	assert.match(notesSource, /sensitive: true/)
	assert.match(notesSource, /spoilerText: true/)
	assert.doesNotMatch(noteSource, /\.ready|\.loading|\.error|\{@html/)
	for (const path of [
		'src/views/NostrNoteView.svelte',
		'src/views/NostrArticleView.svelte',
	]) {
		const nostrView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(nostrView)
		const nostrSource = renderGeneratedFile(nostrView)
		assert.match(nostrSource, /resolvedEntity\.sensitive === true \|\| String\(resolvedEntity\.contentWarning/)
		assert.equal((nostrSource.match(/<Collapsible\n/g) ?? []).length, 1)
		assert.equal((nostrSource.match(/<Markdown content=/g) ?? []).length, path.includes('Article') ? 1 : 0)
		assert.doesNotMatch(nostrSource, /\.ready|\.loading|\.error|\{@html/)
		if (path.includes('Note')) {
			assert.match(nostrSource, /selection\.\$replyToNote\([\s\S]*?<NostrNoteView/)
			assert.match(nostrSource, /selection\.\$rootNote\([\s\S]*?<NostrNoteView/)
		}
	}

	for (const [
		fieldName,
		mutate,
		expected,
	] of [
		['sensitive', (field) => ({ ...field, cardinality: EntityFieldCardinality.One }), /contentWarning sensitive field must be ZeroOrOne/],
		['spoilerText', (field) => ({ ...field, valueType: 'boolean' }), /contentWarning text field must be string/],
	] as const) {
		const mutatedApp = structuredClone(app)
		const note = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.ActivityPubNote)
		assert.ok(note)
		note.fields = note.fields.map((field) => field.name === fieldName ? mutate(field) : field)
		assert.throws(() => compileApp(mutatedApp), expected)
	}
})

test('keeps ATProto actor aliases converged on DID and observation routes source-bearing', () => {
	const actor = app.schema.entities.find(({ entityType }) => entityType === EntityType.AtprotoActor)
	const observation = app.schema.entities.find(({ entityType }) => entityType === EntityType.AtprotoActor_Timestamp)
	const routeMetadata = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'tests/e2e/_generatedRouteFixtureMetadata.ts')
	const didPage = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/routes/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/+page.svelte')
	const handlePage = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/routes/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]/+page.svelte')

	assert.ok(actor)
	assert.ok(observation)
	assert.ok(routeMetadata)
	assert.ok(didPage)
	assert.ok(handlePage)
	assert.deepEqual(actor.selectors.map(({ name }) => name), ['Did', 'Handle'])
	assert.match(renderGeneratedFile(didPage), /<AtprotoActorView\n\t\thref=/)
	assert.doesNotMatch(renderGeneratedFile(didPage), /globalThis\.location\.replace/)
	assert.doesNotMatch(renderGeneratedFile(handlePage), /<AtprotoActorView/)
	assert.match(renderGeneratedFile(handlePage), /<ResourceBoundary resource=\{pageSelection\}>/)
	assert.match(renderGeneratedFile(handlePage), /globalThis\.location\.replace\(canonicalEntityHref\)/)
	assert.match(renderGeneratedFile(handlePage), /resolve\('\/atproto\/actor\/\[did=stringSegment\]'/)
	assert.match(
		renderGeneratedFile(routeMetadata),
		/\/atproto\/actor\/\[did\]\/observations\/\[timestampMs\]\/\[source\]:AtprotoActor_Timestamp\.AtprotoActorTimestampMsSource/
	)
	assert.doesNotMatch(
		renderGeneratedFile(routeMetadata),
		/\/atproto\/actor\/\[did\]\/observations\/\[timestampMs\]:AtprotoActor_Timestamp/
	)
	const mutatedApp = structuredClone(app)
	const didMapping = mutatedApp.routes.children['(social)']?.children['(atproto)']?.children.atproto?.children?.actor?.children?.['[did]']?.selectors?.[EntityType.AtprotoActor]?.Did
	assert.ok(didMapping)
	didMapping.href = {
		entityHref: false,
	}
	assert.throws(
		() => compileApp(mutatedApp),
		/AtprotoActor\.Did suppresses its entity href without a canonical entity route/
	)
	const aliasWithoutSuppressedHref = structuredClone(app)
	const handleMapping = aliasWithoutSuppressedHref.routes.children['(social)']?.children['(atproto)']?.children.atproto?.children?.actor?.children?.handle?.children?.['[handle]']?.selectors?.[EntityType.AtprotoActor]?.Handle
	assert.ok(handleMapping)
	handleMapping.href = {
		canonicalize: true,
	}
	assert.throws(
		() => compileApp(aliasWithoutSuppressedHref),
		/AtprotoActor\.Handle canonicalizes without suppressing its alias entity href/
	)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== observation ? entity : {
					...entity,
					selectors: entity.selectors.map((selector) => selector.name !== 'AtprotoActorTimestampMsSource' ? selector : {
						...selector,
						name: 'AtprotoActorTimestampMs',
					}),
				}),
			},
		}),
		/references missing selector AtprotoActor_Timestamp\.AtprotoActorTimestampMsSource/
	)
})

test('derives disjoint CAIP-2 and slug domains from structured value types', () => {
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]
	const networkSchema = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/schema/Network.ts')

	assert.ok(networkMappings?.Caip2)
	assert.ok(networkMappings.Slug)
	assert.ok(networkSchema)
	assert.ok(renderGeneratedFile(networkSchema).includes("type('string').matching('^[abcdefghijklmnopqrstuvwxyz0123456789\\\\-]+$').atLeastLength(1)"))
	assert.doesNotMatch(renderGeneratedFile(networkSchema), /networkBySlug/)
	assert.doesNotThrow(
		() => compileApp({
			...app,
			routes: {
				children: {
					'(first)': {
						children: {
							network: {
								children: {
									'[network]': {
										selectors: {
											[EntityType.Network]: {
												Caip2: networkMappings.Caip2,
											},
										},
									},
								},
							},
						},
					},
					'(second)': {
						children: {
							network: {
								children: {
									'[network]': {
										selectors: {
											[EntityType.Network]: {
												Slug: networkMappings.Slug,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		})
	)
	assert.doesNotThrow(
		() => compileApp({
			...app,
			routes: {
				children: {
					network: {
						children: {
							'[network]': {
								selectors: {
									[EntityType.Network]: {
										Caip2: networkMappings.Caip2,
										Slug: networkMappings.Slug,
									},
								},
							},
						},
					},
				},
			},
		})
	)
})

test('proves structurally disjoint encoded selector domains', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]

	assert.ok(network)
	assert.ok(networkMappings?.Caip2)
	assert.ok(networkMappings.Slug)
	for (const [leftValueType, rightValueType] of [
		['NonNegativeInteger', 'SolanaPubkey'],
		['evmAddress', 'PolkadotAccountId'],
		['evmAddress', 'SolanaPubkey'],
		['EvmTxHash', 'SolanaSignature'],
		['EvmTxHash', 'UtxoTxId'],
	] as const)
		assert.doesNotThrow(
			() => compileApp({
				...app,
				schema: {
					...app.schema,
					entities: app.schema.entities.map((entity) => entity !== network ? entity : {
						...entity,
						fields: entity.fields.map((field) => field.name === 'caip2' ? {
							...field,
							valueType: leftValueType,
						} : field.name === 'slug' ? {
							...field,
							valueType: rightValueType,
						} : field),
					}),
				},
				routes: {
					children: {
						network: {
							children: {
								'[network]': {
									selectors: {
										[EntityType.Network]: {
											Caip2: networkMappings.Caip2,
											Slug: networkMappings.Slug,
										},
									},
								},
							},
						},
					},
				},
			}),
			`${leftValueType} and ${rightValueType}`
		)
})

test('fails closed for genuinely overlapping or unknown encoded domains', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]

	assert.ok(network)
	assert.ok(networkMappings?.Caip2)
	assert.ok(networkMappings.Slug)
	for (const [leftValueType, rightValueType] of [
		['string', 'ProposalRef'],
		['NonNegativeBigInt', 'UtxoTxId'],
		['string', 'UtxoTxId'],
		['SolanaSignature', 'UtxoTxId'],
		['ProposalKindSlug', 'ProposalRef'],
	] as const)
		assert.throws(
			() => compileApp({
				...app,
				schema: {
					...app.schema,
					entities: app.schema.entities.map((entity) => entity !== network ? entity : {
						...entity,
						fields: entity.fields.map((field) => field.name === 'caip2' ? {
							...field,
							valueType: leftValueType,
						} : field.name === 'slug' ? {
							...field,
							valueType: rightValueType,
						} : field),
					}),
				},
				routes: {
					children: {
						network: {
							children: {
								'[network]': {
									selectors: {
										[EntityType.Network]: {
											Caip2: networkMappings.Caip2,
											Slug: networkMappings.Slug,
										},
									},
								},
							},
						},
					},
				},
			}),
			/selector mappings Network\.Caip2 and Network\.Slug have overlapping or unknown applicability/,
			`${leftValueType} and ${rightValueType}`
		)
})

test('proves facet disjointness only on one canonical scalar path', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]

	assert.ok(network)
	assert.ok(networkMappings?.Caip2)
	assert.ok(networkMappings.Slug)
	const routes = {
		children: {
			network: {
				children: {
					'[network]': {
						selectors: {
							[EntityType.Network]: {
								Caip2: {
									...networkMappings.Caip2,
									when: undefined,
									projection: {
										entityType: EntityType.Network,
										facetPath: ['Evm'],
									},
								},
								Slug: {
									...networkMappings.Slug,
									when: undefined,
									projection: {
										entityType: EntityType.Network,
										facetPath: ['Bitcoin'],
									},
								},
							},
						},
					},
				},
			},
		},
	}
	const schemaWithFacetConditions = (bitcoinCondition: {
		path: readonly [string, ...string[]]
		is: string
	}) => ({
		...app.schema,
		entities: app.schema.entities.map((entity) => entity !== network ? entity : {
			...entity,
			fields: entity.fields.map((field) => field.name === 'slug' ? {
				...field,
				valueType: 'caip2',
			} : field),
			facets: [
				...(entity.facets ?? []).filter((facet) => facet.name !== 'Evm' && facet.name !== 'CashTokens'),
				{
					...(entity.facets ?? []).find((facet) => facet.name === 'Evm'),
					name: 'Evm',
					condition: {
						path: ['namespace'],
						is: 'Evm',
					},
				},
				{
					...(entity.facets ?? []).find((facet) => facet.name === 'CashTokens'),
					name: 'Bitcoin',
					condition: bitcoinCondition,
				},
			],
		}),
	})

	assert.doesNotThrow(() => compileApp({
		...app,
		schema: schemaWithFacetConditions({
			path: ['namespace'],
			is: 'Bitcoin',
		}),
		routes,
	}))
	assert.throws(
		() => compileApp({
			...app,
			schema: schemaWithFacetConditions({
				path: ['environment'],
				is: 'Bitcoin',
			}),
			routes,
		}),
		/\/network\/\[network\] selector mappings Network\.Caip2 and Network\.Slug have overlapping or unknown applicability/
	)
})

test('retains selector identity in generated route results and detail dispatch', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.match(generatorSource, /selectorMappings\.push\(\{ entityType: EntityType\.\$\{context\.entityType\}, selectorName:/)
	assert.match(generatorSource, /data\.selectorMapping\.entityType === EntityType\.\$\{detail\.entityType\} && data\.selectorMapping\.selectorName ===/)
})

test('groups inherited selector fields under one route mapping', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.match(generatorSource, /type SelectorAncestorBinding = \{[\s\S]*?field: string[\s\S]*?alternatives: readonly \{[\s\S]*?ancestorNodeId: string[\s\S]*?referencePath: readonly string\[\]/)
	assert.doesNotMatch(generatorSource, /hrefParamCandidates|\bhrefs\?:/)
	assert.match(generatorSource, /\.\.\.normalizedSelectorMappings\.map\(\(normalizedMapping\) => \(\{[\s\S]*?hrefAlternatives: normalizedMapping\.hrefAlternatives/)
})

test('selects nearest ancestors only after reference-path applicability', () => {
	assert.deepEqual(
		nearestApplicableSelectorAncestors([
			{
				ancestor: 'Network',
				depth: 2,
				referencePaths: [['$network']],
			},
			{
				ancestor: 'Unrelated',
				depth: 5,
				referencePaths: [],
			},
		]),
		[{
			ancestor: 'Network',
			depth: 2,
			referencePath: ['$network'],
		}]
	)
	assert.deepEqual(
		nearestApplicableSelectorAncestors([
			{
				ancestor: 'Network',
				depth: 2,
				referencePaths: [['$network']],
			},
			{
				ancestor: 'ProjectedNetwork',
				depth: 5,
				referencePaths: [['$projection', '$network']],
			},
		]),
		[{
			ancestor: 'ProjectedNetwork',
			depth: 5,
			referencePath: ['$projection', '$network'],
		}]
	)
})

test('composes and independently deduplicates inherited href alternatives', () => {
	const caip2 = {
		kind: 'field' as const,
		name: 'caip2',
	}
	const slug = {
		kind: 'field' as const,
		name: 'slug',
	}
	const owner = {
		kind: 'field' as const,
		name: 'owner',
	}
	const scope = {
		kind: 'field' as const,
		name: 'scope',
	}
	const alternatives = composeSelectorHrefAlternatives(
		'Fixture.Route',
		{},
		[
			{
				field: '$network',
				alternatives: [
					{ network: caip2 },
					{ network: caip2 },
					{ network: slug },
				],
			},
			{
				field: '$owner',
				alternatives: [
					{ owner },
					{ scope },
				],
			},
		]
	)

	assert.equal(alternatives.length, 4)
	assert.deepEqual(alternatives.map(({ network }) => network), [
		caip2,
		caip2,
		slug,
		slug,
	])
	assert.throws(
		() => composeSelectorHrefAlternatives(
			'Fixture.Ambiguous',
			{},
			[
				{
					field: '$left',
					alternatives: [{ network: caip2 }],
				},
				{
					field: '$right',
					alternatives: [{ network: slug }],
				},
			]
		),
		/Fixture\.Ambiguous inherited field groups ambiguously bind href parameter network/
	)
})

test('keeps deep inherited href chains bounded', () => {
	let alternatives = [
		{
			network: {
				kind: 'field' as const,
				name: 'caip2',
			},
		},
		{
			network: {
				kind: 'field' as const,
				name: 'slug',
			},
		},
	]
	for (let depth = 0; depth < 100; depth += 1)
		alternatives = composeSelectorHrefAlternatives(
			`Fixture.Depth${depth}`,
			{},
			[{
				field: '$network',
				alternatives,
			}]
		)

	assert.equal(alternatives.length, 2)
})

test('bounds duplicate-heavy href composition before Cartesian growth', () => {
	const wideAlternatives = Array.from({ length: 256 }, (_, index) => ({
		route: {
			kind: 'field' as const,
			name: `route${index}`,
		},
	}))
	const alternatives = composeSelectorHrefAlternatives(
		'Fixture.DuplicateHeavy',
		{},
		[
			{
				field: '$route',
				alternatives: wideAlternatives,
			},
			{
				field: '$scope',
				alternatives: Array.from({ length: 100_000 }, () => ({
					scope: {
						kind: 'field' as const,
						name: 'scope',
					},
				})),
			},
		]
	)

	assert.equal(alternatives.length, 256)
	assert.equal(new Set(alternatives.map(({ scope }) => JSON.stringify(scope))).size, 1)
	assert.throws(
		() => composeSelectorHrefAlternatives(
			'Fixture.TooWide',
			{},
			[{
				field: '$route',
				alternatives: [
					...wideAlternatives,
					{
						route: {
							kind: 'field',
							name: 'route256',
						},
					},
				],
			}]
		),
		/Fixture\.TooWide produces more than 256 structurally distinct href alternatives/
	)
})

test('keeps complex route selectors, inverse href metadata, and projected-route parity complete', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-route-metadata-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const serviceAgentPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]/+page.svelte'),
			'utf8'
		)
		assert.match(serviceAgentPage, /\$contract: \{[\s\S]*?reference: Number\(params\.chainId\),[\s\S]*?address: params\.contractAddress,/)

		const ipfsResourcePage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/+page.svelte'),
			'utf8'
		)
		assert.match(ipfsResourcePage, /select\(EntityType\.IpfsResource, data\.selector, \{/)
		const ipfsResourceLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/+layout.ts'),
			'utf8'
		)
		assert.match(ipfsResourceLayout, /namespace: params\.namespace,[\s\S]*?target: params\.target,[\s\S]*?contentPath: '',/)

		const coinInstancePage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]/+page.ts'),
			'utf8'
		)
		assert.match(coinInstancePage, /if \([^\n]*matchNativeCurrencySlug\(params\.coinInstanceSlug\)[^\n]*\) \{[\s\S]*?type: 'NativeCurrency'/)
		assert.match(coinInstancePage, /if \([^\n]*matchEvmAddress\(params\.coinInstanceSlug\)[^\n]*\) \{[\s\S]*?type: 'Erc20Token',[\s\S]*?\$contract: \{[\s\S]*?address: params\.coinInstanceSlug,/)

		const networkTransactionLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/+layout.ts'),
			'utf8'
		)
		assert.match(networkTransactionLayout, /matchEvmTxHash\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /matchSolanaSignature\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /matchUtxoTxId\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /projectionNetwork\.executionModels[\s\S]*?'Evm'/)
		assert.match(networkTransactionLayout, /projectionNetwork\.ledgerModels[\s\S]*?'Utxo'/)

		const evmTokenTransferPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]/+page.svelte'),
			'utf8'
		)
		assert.match(evmTokenTransferPage, /let \{[\s\S]*?data,[\s\S]*?params,[\s\S]*?\}: PageProps = \$props\(\)/)
		assert.match(evmTokenTransferPage, /\$log: data\.selector/)

		const utxoOutputPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]/+page.svelte'),
			'utf8'
		)
		assert.match(
			utxoOutputPage,
			/select\(EntityType\.UtxoOutput, \{[\s\S]*?\$transaction: data\.selector,[\s\S]*?indexInTransaction: Number\(params\.outputIndex\),[\s\S]*?\}, \{/
		)

		const activityPubActorLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/+layout.ts'),
			'utf8'
		)
		assert.match(activityPubActorLayout, /matchAbsoluteUrl\(params\.instanceOrigin\)/)
		assert.match(activityPubActorLayout, /instanceOrigin: decodeURIComponent\(params\.instanceOrigin\)/)
		const activityPubParentLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/+layout.svelte'),
			'utf8'
		)
		assert.match(activityPubParentLayout, /selection=\{select\(EntityType\._GlobalActivityPubNetwork, data\.selector, \{ sources: \[[\s\S]*?Source\.Constants_Internal,[\s\S]*?Source\.Mastodon_Rest,[\s\S]*?\] \}\)\}/)
		assert.doesNotMatch(activityPubParentLayout, /data\.selectorMapping/)

		const proposalView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/SpecificationProposalView.svelte'),
			'utf8'
		)
		assert.match(proposalView, /resolve\('\/proposals\/\[specificationRealmSlug=specificationRealmSlug\]\/\[proposalKindSlug=proposalKindSlug\]\/\[proposalRef=proposalRef\]'/)
		assert.doesNotMatch(proposalView, /\/observations\//)
		assert.doesNotMatch(proposalView, /pendingEntity\.category !== undefined && pendingEntity\.category !== undefined/)

		const evmContractsView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/EvmContractsView.svelte'),
			'utf8'
		)
		assert.match(evmContractsView, /evmContractHrefFields\.\$network\.caip2 !== undefined[\s\S]*?network: String\(caip2StringFromValue\(evmContractHrefFields\.\$network\.caip2\) \?\? ''\)/)
		assert.match(evmContractsView, /evmContractHrefFields\.\$network\.slug !== undefined[\s\S]*?network: String\(evmContractHrefFields\.\$network\.slug \?\? ''\)/)
		const evmContractLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/+layout.ts'),
			'utf8'
		)
		assert.match(evmContractLayout, /networkByCaip2[\s\S]*?networkBySlug/)
		assert.match(evmContractLayout, /projectionNetwork\.executionModels[\s\S]*?'Evm'/)
		assert.match(evmContractLayout, /\$network: parentData\.selector/)
		assert.equal(
			existsSync(path.join(
				generatedOutputRoot,
				'src/routes/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]/+page.svelte'
			)),
			true
		)

		const routeFixtureMetadata = readFileSync(
			path.join(generatedOutputRoot, 'tests/e2e/_generatedRouteFixtureMetadata.ts'),
			'utf8'
		)
		assert.doesNotMatch(routeFixtureMetadata, /from '\$app\/paths'/)
		assert.match(routeFixtureMetadata, /const requiredE2eRouteParam = \(/)
		assert.match(routeFixtureMetadata, /contract\/\[address\]\/verification'[\s\S]*?routeKind: 'projection'/)
		assert.match(routeFixtureMetadata, /coin-instance\/\[chainId\]\/\[coinInstanceSlug\]'[\s\S]*?EvmCoinInstance\.NetworkType'[\s\S]*?NativeCurrency[\s\S]*?EvmCoinInstance\.NetworkTypeContract'[\s\S]*?Erc20Token/)
		assert.match(routeFixtureMetadata, /\/~\/accounts\/allowance\/\[chainId=eip155ChainId\]\/\[owner=evmAddress\]\/\[coin=evmAddress\]\/\[spender=evmAddress\]/)

	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('compiles selector-owned IPFS and Swarm path variants without duplicate mappings or parent chrome', () => {
	const exploreRoutes = app.routes.children['(explore)']
	const ipfsRoutes = exploreRoutes?.children?.['(ipfs)']
	const swarmRoutes = app.routes.children['(swarm)']

	assert.ok(ipfsRoutes)
	assert.ok(swarmRoutes)

	const compiledApp = compileApp({
		...app,
		routes: {
			children: {
				'(explore)': {
					children: {
						'(ipfs)': ipfsRoutes,
					},
				},
				'(swarm)': swarmRoutes,
			},
		},
	})
	const renderedFileByPath = new Map(compiledApp.generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))
	const ipfsBasePath = 'src/routes/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]'
	const ipfsContentPath = `${ipfsBasePath}/path/[...contentPath=stringSegment]`
	const swarmBasePath = 'src/routes/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]'
	const swarmContentPath = `${swarmBasePath}/path/[...contentPath=stringSegment]`
	const routeFixtureMetadata = renderedFileByPath.get('tests/e2e/_generatedRouteFixtureMetadata.ts')

	assert.ok(renderedFileByPath.has(`${ipfsBasePath}/+page.svelte`))
	assert.ok(renderedFileByPath.has(`${ipfsBasePath}/(ipfsResource)/+layout.svelte`))
	assert.ok(renderedFileByPath.has(`${ipfsContentPath}/+page.svelte`))
	assert.ok(renderedFileByPath.has(`${swarmBasePath}/+page.svelte`))
	assert.ok(renderedFileByPath.has(`${swarmBasePath}/(swarmResource)/+layout.svelte`))
	assert.ok(
		renderedFileByPath.has(`${swarmContentPath}/+page.svelte`),
		[...renderedFileByPath.keys()].filter((filePath) => filePath.includes('swarm')).join('\n')
	)
	assert.equal([...renderedFileByPath.keys()].some((filePath) => filePath.includes('(ipfsResource)/path/')), false)
	assert.equal([...renderedFileByPath.keys()].some((filePath) => filePath.includes('(swarmResource)/path/')), false)
	assert.match(
		renderedFileByPath.get(`${ipfsContentPath}/+page.svelte`) ?? '',
		/contentPath: params\.contentPath/,
		renderedFileByPath.get(`${ipfsContentPath}/+page.svelte`)
	)
	assert.match(renderedFileByPath.get(`${swarmContentPath}/+page.svelte`) ?? '', /swarmResourceContentPathFromRouteParam\(params\.contentPath\)/)
	assert.match(renderedFileByPath.get('src/views/IpfsResourceView.svelte') ?? '', /contentPath === ''[\s\S]*?\/\[namespace=ipfsNamespace\]\/\[target=stringSegment\]'[\s\S]*?contentPath !== ''[\s\S]*?\/path\/\[\.\.\.contentPath=stringSegment\]'/)
	assert.match(renderedFileByPath.get('src/views/SwarmResourceView.svelte') ?? '', /contentPath === ''[\s\S]*?\/swarm\/\[reference=stringSegment\]'[\s\S]*?contentPath !== ''[\s\S]*?\/path\/\[\.\.\.contentPath=stringSegment\]'/)
	assert.match(routeFixtureMetadata ?? '', /IpfsResource\.ResourceAddress[\s\S]*?id: 'base'[\s\S]*?id: 'path'/)
	assert.match(routeFixtureMetadata ?? '', /id: 'path'[\s\S]*?namespace: '\/\[namespace\]\/\[target\]:IpfsResource\.ResourceAddress\.1\.namespace'/)
	assert.match(routeFixtureMetadata ?? '', /id: 'path'[\s\S]*?target: '\/\[namespace\]\/\[target\]:IpfsResource\.ResourceAddress\.1\.target'/)
	assert.match(routeFixtureMetadata ?? '', /id: 'path'[\s\S]*?contentPath: '\/\[namespace\]\/\[target\]\/path\/\[\.\.\.contentPath\]:IpfsResource\.ResourceAddress\.path\.1\.contentPath'/)
	assert.match(routeFixtureMetadata ?? '', /SwarmResource\.ResourceAddress[\s\S]*?id: 'base'[\s\S]*?id: 'path'/)
	assert.match(routeFixtureMetadata ?? '', /probeOwnerNodeId: '\/\(explore\)\/\(ipfs\)\/\[namespace\]\/\[target\]'[\s\S]*?publicPath: '\/\[namespace\]\/\[target\]\/path\/\[\.\.\.contentPath\]'/)
	assert.match(routeFixtureMetadata ?? '', /probeOwnerNodeId: '\/\(swarm\)\/swarm\/\[reference\]'[\s\S]*?publicPath: '\/swarm\/\[reference\]\/path\/\[\.\.\.contentPath\]'/)

	const selectorMappingCount = (
		nodes: typeof app.routes.children,
		entityType: EntityType
	): number => Object.values(nodes).reduce((count, node) => (
		count
		+ Object.entries(node.selectors ?? {}).reduce((entityCount, [mappedEntityType, selectors]) => (
			entityCount + (mappedEntityType === entityType && Object.hasOwn(selectors, 'ResourceAddress') ? 1 : 0)
		), 0)
		+ selectorMappingCount(node.children ?? {}, entityType)
	), 0)
	assert.equal(selectorMappingCount({ ipfs: ipfsRoutes }, EntityType.IpfsResource), 1)
	assert.equal(selectorMappingCount({ swarm: swarmRoutes }, EntityType.SwarmResource), 1)

	const ipfsNamespaceRoute = ipfsRoutes.children?.['[namespace]']
	const ipfsTargetRoute = ipfsNamespaceRoute?.children?.['[target]']
	const ipfsPathRoute = ipfsTargetRoute?.children?.path
	const ipfsContentPathRoute = ipfsPathRoute?.children?.['[...contentPath]']
	assert.ok(ipfsNamespaceRoute)
	assert.ok(ipfsTargetRoute)
	assert.ok(ipfsPathRoute)
	assert.ok(ipfsContentPathRoute?.selectorVariant)
	assert.throws(
		() => compileApp({
			...app,
			routes: {
				children: {
					'(explore)': {
						children: {
							'(ipfs)': {
								...ipfsRoutes,
								children: {
									'[namespace]': {
										...ipfsNamespaceRoute,
										children: {
											'[target]': {
												...ipfsTargetRoute,
												children: {
													path: {
														...ipfsPathRoute,
														children: {
															'[...contentPath]': {
																...ipfsContentPathRoute,
																selectorVariant: {
																	...ipfsContentPathRoute.selectorVariant,
																	probeCases: [{
																		id: 'missing-content-path',
																		params: {
																			namespace: 'ipfs',
																			target: 'bafybeigdyrzt',
																		},
																	}],
																},
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		}),
		/mapping IpfsResource\.ResourceAddress probe case missing-content-path is missing contentPath/
	)
})

test('keeps calldata navigation on the explicit decoder while Hex remains owned by [hex]', () => {
	const evmRoutes = app.routes.children['(explore)']?.children?.['(protocols)']?.children?.evm
	const calldataRoute = evmRoutes?.children?.calldata
	const calldataNavigation = app.navigation.items
		.flatMap((item) => [item, ...(item.children ?? [])])
		.flatMap((item) => [item, ...(item.children ?? [])])
		.find((item) => item.id === 'explore-evm-calldata')

	assert.ok(calldataRoute)
	assert.equal(calldataRoute.page, undefined)
	assert.equal(calldataRoute.selectors, undefined)
	assert.deepEqual(Object.keys(calldataRoute.children?.['[hex]']?.selectors?.[EntityType.EvmCalldata] ?? {}), ['Hex'])
	assert.equal(calldataNavigation?.href, '/evm/calldata-decoder')
	assert.equal(app.navigation.items
		.flatMap((item) => [item, ...(item.children ?? [])])
		.flatMap((item) => [item, ...(item.children ?? [])])
		.some((item) => item.href === '/evm/calldata'), false)
})

test('derives reusable entity hrefs from selector detail pages without empty href declarations', () => {
	const youtubeVideoMapping = app.routes.children['(social)']?.children?.['(youtube)']?.children?.youtube?.children?.video?.children?.['[videoId]']?.selectors?.[EntityType.YoutubeVideo]?.VideoId

	assert.ok(youtubeVideoMapping)
	assert.equal(youtubeVideoMapping.href, undefined)
	assert.deepEqual(youtubeVideoMapping.page, {})

	const compiledApp = baselineCompiledApp
	const youtubeVideoView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/YoutubeVideoView.svelte')
	const youtubeVideosView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/YoutubeVideosView.svelte')

	assert.ok(youtubeVideoView)
	assert.ok(youtubeVideosView)
	const renderedYoutubeVideosView = renderGeneratedFile(youtubeVideosView)
	assert.match(
		renderGeneratedFile(youtubeVideoView),
		/resolve\('\/youtube\/video\/\[videoId=stringSegment\]'[\s\S]*?videoId: encodeURIComponent\(String\(pendingEntity\.videoId \?\? ''\)\)/
	)
	assert.match(
		renderedYoutubeVideosView,
		/resolve\('\/youtube\/video\/\[videoId=stringSegment\]'[\s\S]*?videoId: encodeURIComponent\(String\(youtubeVideoHrefFields\.videoId \?\? ''\)\)/
	)
	assert.match(renderedYoutubeVideosView, /const collectionSelection = \$derived\(selection\)/)
	assert.match(renderedYoutubeVideosView, /sources: collectionSelection\.sources/)
})

test('derives inverse ancestor and local href parameters from normalized selector mappings', () => {
	const evmContractMapping = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.children?.['(contracts)']?.children?.contract?.children?.['[address]']?.selectors?.[EntityType.EvmContract]?.EvmNetworkAddress

	assert.ok(evmContractMapping)
	assert.equal(evmContractMapping.href, undefined)

	const evmContractsView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmContractsView.svelte')
	assert.ok(evmContractsView)
	const renderedEvmContractsView = renderGeneratedFile(evmContractsView)

	assert.match(renderedEvmContractsView, /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/contract\/\[address=evmAddress\]'/)
	assert.match(renderedEvmContractsView, /network: String\(caip2StringFromValue\(evmContractHrefFields\.\$network\.caip2\) \?\? ''\)/)
	assert.match(renderedEvmContractsView, /address: String\(evmContractHrefFields\.address \?\? ''\)/)
})

test('suppresses selector detail entity hrefs only when explicitly disabled', () => {
	const compiledApp = baselineCompiledApp
	const utxoBlockView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UtxoBlockView.svelte')
	const utxoBlocksView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UtxoBlocksView.svelte')

	assert.ok(utxoBlockView)
	assert.ok(utxoBlocksView)
	assert.doesNotMatch(renderGeneratedFile(utxoBlockView), /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/block\/\[blockNumber=nonNegativeBigInt\]'/)
	assert.doesNotMatch(renderGeneratedFile(utxoBlocksView), /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/block\/\[blockNumber=nonNegativeBigInt\]'/)
})

test('emits Node-safe route metadata with compiler-owned descendant probe cases', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-route-metadata-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const routeFixtureMetadata = readFileSync(
			path.join(generatedOutputRoot, 'tests/e2e/_generatedRouteFixtureMetadata.ts'),
			'utf8'
		)
		assert.doesNotMatch(routeFixtureMetadata, /from '\$app\/paths'/)
		assert.match(routeFixtureMetadata, /const requiredE2eRouteParam = \(/)
		assert.match(routeFixtureMetadata, /probeOwnerNodeId: '\/\(explore\)\/\(ens\)\/ens\/name\/\[ensName\]'/)

		const routeMetadataNodeImportTest = path.join(generatedOutputRoot, 'route-metadata-node-import.test.ts')
		writeFileSync(routeMetadataNodeImportTest, `import assert from 'node:assert/strict'
import { e2eRouteFixtureMetadataByNodeId } from './tests/e2e/_generatedRouteFixtureMetadata.ts'

const deepGroupedMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]']
assert.equal(
\tdeepGroupedMetadata.resolve({
\t\tnetwork: 'eip155:1',
\t\ttransactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
\t\tindexInTransaction: '2',
\t\ttransferIndex: '1',
\t}),
\t'/network/eip155:1/tx/0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca/log/2/token-transfer/1'
)
assert.throws(
\t() => deepGroupedMetadata.resolve({
\t\tnetwork: 'eip155:1',
\t\ttransactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
\t\tindexInTransaction: '2',
\t}),
\t/missing required route parameter transferIndex/
)

const ensRecordsMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ens)/ens/name/[ensName]/records']
assert.equal(ensRecordsMetadata.probeOwnerNodeId, '/(explore)/(ens)/ens/name/[ensName]')
assert.deepEqual(ensRecordsMetadata.mappings.map(({ id }) => id), ['EnsName.NormalizedName'])
assert.equal(
\tensRecordsMetadata.resolve({
\t\tensName: 'vitalik.eth',
\t}),
\t'/ens/name/vitalik.eth/records'
)

const activityPubActorMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]']
assert.equal(
\tactivityPubActorMetadata.resolve({
\t\tinstanceOrigin: 'https://mastodon.social',
\t\tlocalAccountId: '13179',
\t}),
\t'/activitypub/actor/https%3A%2F%2Fmastodon.social/13179'
)

const atprotoPostMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(atproto)/atproto/post/[...uri]']
assert.equal(
\tatprotoPostMetadata.resolve({
\t\turi: 'at://did:plc:ewvi7nxzyoun6zhxrhs64oiz/app.bsky.feed.post/3jt4fd2a4xk2p',
\t}),
\t'/atproto/post/at%3A%2F%2Fdid%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz%2Fapp.bsky.feed.post%2F3jt4fd2a4xk2p'
)

const rssItemMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]']
assert.equal(
\trssItemMetadata.resolve({
\t\tfeedUrl: 'https://hnrss.org/frontpage',
\t\titemIdentityKind: 'Guid',
\t\titemIdentity: 'discount%20off',
\t}),
\t'/rss/feed/https%3A%2F%2Fhnrss.org%2Ffrontpage/item/Guid/discount%2520off'
)

const ipfsPathMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]']
assert.equal(ipfsPathMetadata.probeOwnerNodeId, '/(explore)/(ipfs)/[namespace]/[target]')
assert.equal(
\tipfsPathMetadata.resolve({
\t\tnamespace: 'ipfs',
\t\ttarget: 'bafybeigdyrzt',
\t\tcontentPath: 'docs/index.html',
\t}),
\t'/ipfs/bafybeigdyrzt/path/docs/index.html'
)
assert.throws(
\t() => ipfsPathMetadata.resolve({
\t\tnamespace: 'ipfs',
\t\ttarget: 'bafybeigdyrzt',
\t}),
\t/missing required route parameter contentPath/
)

const inheritedMetadata = Object.values(e2eRouteFixtureMetadataByNodeId).filter((metadata) => (
\tmetadata.probeOwnerNodeId !== undefined
\t&& metadata.probeOwnerNodeId !== metadata.nodeId
))
assert.ok(inheritedMetadata.length > 0)
for (const metadata of inheritedMetadata) {
\tassert.ok(metadata.mappings.length > 0, metadata.nodeId)
\tconst routeParams = Object.keys(metadata.parameterMatchers).toSorted()
\tfor (const mapping of metadata.mappings)
\t\tfor (const probeCase of mapping.probeCases)
\t\t\tassert.deepEqual(Object.keys(probeCase.params).toSorted(), routeParams, \`\${metadata.nodeId} \${mapping.id} \${probeCase.id}\`)
}
`)
		const routeMetadataNodeImportResult = runTestProcess(
			'route-metadata:runtime-import',
			process.execPath,
			[
				'--import',
				'tsx',
				routeMetadataNodeImportTest,
			],
			{}
		)
		assert.equal(
			routeMetadataNodeImportResult.status,
			0,
			routeMetadataNodeImportResult.failure
		)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('typechecks generated E2eRouteProbeAtom as a distributive probe-value union', () => {
	const servicesRoutes = app.routes.children.services
	const typeTestRoot = createFreshRoot('blockhead-route-metadata-types-test-')

	assert.ok(servicesRoutes)

	try {
		const routeFixtureMetadata = compileApp({
			...app,
			routes: {
				children: {
					services: servicesRoutes,
				},
			},
		}).generatedFiles.find((generatedFile) => generatedFile.path === 'tests/e2e/_generatedRouteFixtureMetadata.ts')
		assert.ok(routeFixtureMetadata)
		mkdirSync(path.join(typeTestRoot, 'tests/e2e'), {
			recursive: true,
		})
		writeFileSync(
			path.join(typeTestRoot, routeFixtureMetadata.path),
			renderGeneratedFile(routeFixtureMetadata)
		)
		const routeMetadataTypeTest = path.join(typeTestRoot, 'route-metadata.type-test.ts')
		writeFileSync(routeMetadataTypeTest, `import type { E2eRouteProbeAtom } from './tests/e2e/_generatedRouteFixtureMetadata.ts'

const serviceAgentAtom: E2eRouteProbeAtom = '/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId.1.chainId'
// @ts-expect-error Unknown probe atoms must not widen to string.
const unknownAtom: E2eRouteProbeAtom = '/services/agent/unknown'

void serviceAgentAtom
void unknownAtom
`)
		const routeMetadataTypeTestConfig = path.join(typeTestRoot, 'route-metadata.type-test.json')
		writeFileSync(routeMetadataTypeTestConfig, JSON.stringify({
			compilerOptions: {
				allowImportingTsExtensions: true,
				baseUrl: root,
				ignoreDeprecations: '6.0',
				module: 'preserve',
				moduleResolution: 'bundler',
				noEmit: true,
				paths: {
					'$/*': ['src/*'],
				},
				skipLibCheck: true,
				target: 'esnext',
			},
			files: [routeMetadataTypeTest],
		}, null, '\t'))
		const routeMetadataTypeTestResult = runTestProcess(
			'route-metadata:typecheck',
			path.join(root, 'node_modules/.bin/tsc'),
			[
				'--project',
				routeMetadataTypeTestConfig,
			],
			{}
		)
		assert.equal(
			routeMetadataTypeTestResult.status,
			0,
			routeMetadataTypeTestResult.failure
		)
	} finally {
		removeFreshRoot(typeTestRoot)
	}
})

test('rejects mapping-local decoders that disagree with normalized route metadata', () => {
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				valueTypes: app.schema.valueTypes.map((valueType) => (
					valueType.id === 'opaqueRouteIdentifier' ?
						{
							...valueType,
							routeParam: {
								...valueType.routeParam,
								decode: _ExpressionDecode.Number,
							},
						}
					:
						valueType
				)),
			},
		}),
		/decoder disagrees with normalized route metadata/
	)
})

test('requires named source selection defaults before generation', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const sourceSelectionFixtureMatchesCompiler: (
		SourceSelectionFixture extends _SourceSelection ?
			_SourceSelection extends SourceSelectionFixture ?
				true
			:
				false
		:
			false
	) = true

	// @ts-expect-error Named source selections must provide a default source array.
	const omittedDefault: SourceSelectionFixture = {
		name: 'missingDefault',
	}

	assert.equal(sourceSelectionFixtureMatchesCompiler, true)
	assert.equal(omittedDefault.name, 'missingDefault')
	assert.match(generatorSource, /if \(!\('default' in value\) \|\| !Array\.isArray\(value\.default\)\)[\s\S]*?throw new Error\(`Named source selection \$\{value\.name\} must provide a default source array`\)/)
	assert.match(generatorSource, /lowerSourceSelectionsFile[\s\S]*?sourceSelections[\s\S]*?lowerSourceArray\(selection\.default\)/)
})

test('carries field-conditioned view sources into initial route selections', () => {
	const proposalPage = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/routes/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]/+page.svelte'
	))

	assert.ok(proposalPage)
	const renderedProposalPage = renderGeneratedFile(proposalPage)
	assert.match(renderedProposalPage, /const pageEntitySelector = \$derived\(\{[\s\S]*?realm:[\s\S]*?category:/)
	assert.match(renderedProposalPage, /import \{ defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey \} from '\$\/sources\/\$sourceSelections\.ts'/)
	assert.match(renderedProposalPage, /sources: specificationProposalSourceSelectionByKey\[\[String\(pageEntitySelector\.realm\), String\(pageEntitySelector\.category\)\]\.join\(':'\)\] \?\? defaultSpecificationProposalSources/)
	assert.match(renderedProposalPage, /select\(EntityType\.SpecificationProposal, pageEntitySelector, \{/)
	assert.doesNotMatch(renderedProposalPage, /sources: \[\s*Source\.BitcoinBips_Github,[\s\S]*?Source\.ZcashZips_Github,?\s*\],/)
})

test('rejects conditional route source keys that could fall through to a broad default', () => {
	const specificationProposal = app.schema.entities.find((entity) => entity.entityType === EntityType.SpecificationProposal)

	assert.ok(specificationProposal)
	assert.throws(
		() => compileApp({
			...app,
			schema: {
				...app.schema,
				entities: app.schema.entities.map((entity) => entity !== specificationProposal ? entity : {
					...entity,
					views: {
						...entity.views,
						singular: {
							...entity.views.singular,
							query: {
								...entity.views.singular?.query,
								sources: {
									name: 'adversarialProposalSources',
									default: [Source.BitcoinBips_Github],
									cases: [
										{
											when: [
												{
													field: 'realm',
													equals: 'Ethereum',
												},
												{
													field: 'category',
													equals: 'Eip',
												},
											],
											sources: [Source.EthereumEips_Github],
										},
										{
											when: [
												{
													field: 'category',
													equals: 'Erc',
												},
												{
													field: 'realm',
													equals: 'Ethereum',
												},
											],
											sources: [Source.EthereumEips_Github],
										},
									],
								},
							},
						},
					},
				}),
			},
		}),
		/Field-conditioned source selection adversarialProposalSources must use the same ordered fields in every case/
	)
})

test('rejects invalid entity view field references at every captured view level', () => {
	const typeTestRoot = createFreshRoot('blockhead-app-view-types-test-')
	const appSource = readFileSync(path.join(root, 'APP.ts'), 'utf8')
	const appSourceFile = ts.createSourceFile('APP.ts', appSource, ts.ScriptTarget.Latest, true)
	const facetStatement = appSourceFile.statements.find((statement) => (
		ts.isVariableStatement(statement)
		&& statement.declarationList.declarations.some((declaration) => (
			ts.isIdentifier(declaration.name)
			&& declaration.name.text === 'facet'
		))
	))
	const fixtureSource = readFileSync(path.join(root, 'scripts/app/entity-view-field-references.types.ts'), 'utf8')
	const fixtureSourceFile = ts.createSourceFile(
		'entity-view-field-references.types.ts',
		fixtureSource,
		ts.ScriptTarget.Latest,
		true
	)
	const fixtureImport = fixtureSourceFile.statements.find(ts.isImportDeclaration)

	assert.ok(facetStatement)
	assert.ok(fixtureImport)

	try {
		const typeTestPath = path.join(typeTestRoot, 'entity-view-field-references.types.ts')
		mkdirSync(path.join(typeTestRoot, 'scripts/app/inputs'), { recursive: true })
		copyFileSync(
			path.join(root, 'scripts/app/inputs/source-target.ts'),
			path.join(typeTestRoot, 'scripts/app/inputs/source-target.ts')
		)
		copyFileSync(
			path.join(root, 'scripts/app/inputs/Network.ts'),
			path.join(typeTestRoot, 'scripts/app/inputs/Network.ts')
		)
		writeFileSync(typeTestPath, `${appSource.slice(0, facetStatement.end)}\n${fixtureSource.slice(fixtureImport.end)}`)
		const typeTestResult = runTestProcess(
			'entity-view-field-references:typecheck',
			path.join(root, 'node_modules/.bin/tsc'),
			[
				'--noEmit',
				'--ignoreConfig',
				'--allowImportingTsExtensions',
				'--skipLibCheck',
				'--module',
				'preserve',
				'--moduleResolution',
				'bundler',
				'--target',
				'esnext',
				typeTestPath,
			],
			{}
		)

		assert.equal(typeTestResult.status, 0, typeTestResult.failure)
	} finally {
		removeFreshRoot(typeTestRoot)
	}
})

test('isolates replacement-managed output from checked-in provider roots', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-test-')
	const checkedInProviderRoot = path.join(generatedOutputRoot, 'src/sources/Fixture/index.ts')
	const staleRoute = path.join(generatedOutputRoot, 'src/routes/stale/+page.svelte')
	const staleSourceProjection = path.join(generatedOutputRoot, 'src/sources/$staleGeneratedRegistry.ts')

	try {
		mkdirSync(path.dirname(checkedInProviderRoot), {
			recursive: true,
		})
		writeFileSync(checkedInProviderRoot, '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')

		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.failure)
		assert.equal(existsSync(path.join(generatedOutputRoot, 'src/schema/EntityType.ts')), true)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')

		mkdirSync(path.dirname(staleRoute), {
			recursive: true,
		})
		writeFileSync(staleRoute, '<!-- Generated from APP.ts. Do not edit by hand. -->\n<p>stale</p>\n')
		writeFileSync(staleSourceProjection, '// Generated from APP.ts. Do not edit by hand.\nexport const stale = true\n')

		const checkResult = runGenerator('check', generatedOutputRoot)
		assert.notEqual(checkResult.status, 0)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/routes\/stale\/\+page\.svelte/)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/sources\/\$staleGeneratedRegistry\.ts/)

		const regenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(regenerateResult.status, 0, regenerateResult.failure)
		assert.equal(existsSync(staleRoute), false)
		assert.equal(existsSync(staleSourceProjection), false)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('does not rewrite unchanged generated files', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-idempotence-test-')
	const generatedSchema = path.join(generatedOutputRoot, 'src/schema/BitTorrentAnnounce_Timestamp.ts')
	const preservedTimestamp = new Date('2000-01-01T00:00:00.000Z')

	try {
		const firstGenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(firstGenerateResult.status, 0, firstGenerateResult.failure)
		utimesSync(generatedSchema, preservedTimestamp, preservedTimestamp)

		const secondGenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(secondGenerateResult.status, 0, secondGenerateResult.failure)
		assert.equal(statSync(generatedSchema).mtimeMs, preservedTimestamp.getTime())
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('renders empty public env schemas with the shared string index contract', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-public-env-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const sourceProviderDefinitions = readFileSync(
			path.join(generatedOutputRoot, 'src/sources/$sourceProviders.ts'),
			'utf8'
		)
		assert.equal(
			[...sourceProviderDefinitions.matchAll(/env: arktype\(\{\n\s+'\[string\]': 'string',\n\s+\}\)/g)].length,
			app.sources.providers.filter((provider) => provider.env?.keys.length === 0).length
				+ app.sources.sources.filter((source) => source.env?.keys.length === 0).length
				+ app.sources.sources.flatMap((source) => [
					...(source.binding == null ? [] : [source.binding]),
					...(source.bindings ?? []),
				]).flatMap((binding) => binding.credentials).filter((credential) => credential.env?.keys.length === 0).length
		)
		assert.doesNotMatch(sourceProviderDefinitions, /env: arktype\(\{\n\s*\}\)/)
		assert.match(sourceProviderDefinitions, /'PUBLIC_ALLIUM_API_KEY': 'string > 0'/)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('keeps runtime secret configuration in one server projection', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-server-credentials-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const publicBindings = readFileSync(
			path.join(generatedOutputRoot, 'src/sources/$sourceProviders.ts'),
			'utf8'
		)
		const serverCredentials = readFileSync(
			path.join(generatedOutputRoot, 'src/sources/$sourceServerCredentials.server.ts'),
			'utf8'
		)

		const goldRushBindingIds = publicBindings.match(/source: Source\.GoldRushFoundational_Rest[\s\S]*?proxyId: '(GoldRushFoundational_Rest-[0-9]+)'[\s\S]*?serverCredentialId: '\1'/)

		assert.ok(goldRushBindingIds)
		assert.doesNotMatch(publicBindings, /COVALENT_API_KEY|injection:/)
		assert.ok(serverCredentials.includes(`'${goldRushBindingIds[1]}': {`))
		assert.match(serverCredentials, /COVALENT_API_KEY/)
		assert.match(serverCredentials, /header: \{[\s\S]*?name: 'authorization'[\s\S]*?prefix: 'Bearer '/)
		assert.doesNotMatch(serverCredentials, /endpoints:|header-secret|literal-secret/)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('roots sibling route groups without leaking internal segments', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-routes-test-')
	const socialRouteRoots = [
		['activitypub', 'activitypub'],
		['atproto', 'atproto'],
		['farcaster', 'farcaster'],
		['lens', 'lens'],
		['nostr', 'nostr'],
		['reddit', 'reddit'],
		['rss', 'rss'],
		['x', 'x'],
		['xmtp', 'xmtp'],
		['youtube', 'youtube'],
	] as const

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		for (const [routeGroup, routeRoot] of socialRouteRoots) {
			assert.equal(
				existsSync(path.join(generatedOutputRoot, `src/routes/(social)/(${routeGroup})/${routeRoot}`)),
				true,
				`${routeGroup} must be generated as a direct social route group`
			)
			for (const [siblingRouteGroup, siblingRouteRoot] of socialRouteRoots) {
				if (siblingRouteGroup === routeGroup)
					continue

				assert.equal(
					existsSync(path.join(generatedOutputRoot, `src/routes/(social)/(${routeGroup})/${routeRoot}/(${siblingRouteGroup})/${siblingRouteRoot}`)),
					false,
					`${siblingRouteGroup} must not be generated beneath ${routeGroup}`
				)
			}
		}

		assert.equal(
			existsSync(path.join(generatedOutputRoot, 'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/videos/+page.svelte')),
			true
		)

		const publicPaths = [...readFileSync(
			path.join(generatedOutputRoot, 'tests/e2e/_generatedRouteFixtureMetadata.ts'),
			'utf8'
		).matchAll(/publicPath: '([^']+)'/g)].map((match) => match[1])
		assert.equal(publicPaths.some((publicPath) => /[()]/.test(publicPath)), false)

		const networkEntity = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
		assert.notEqual(networkEntity, undefined)
		const networkFacetSegments = new Set((networkEntity?.facets ?? []).flatMap((facet) => [
			facet.name.toLowerCase(),
			facet.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
		]))
		assert.equal(publicPaths.some((publicPath) => {
			const segments = publicPath.split('/').filter(Boolean)
			return (
				segments[0] === 'network'
				&& segments.slice(2).some((segment) => networkFacetSegments.has(decodeURIComponent(segment).toLowerCase()))
			)
		}), false)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('derives EVM signature-family parent chrome from hidden semantic groups', () => {
	const generatedFileByPath = new Map(baselineCompiledApp.generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))

	for (const [group, title, href] of [
		['topics', 'Topics', '/evm/topics'],
		['selectors', 'Selectors', '/evm/selectors'],
		['calldata', 'Calldata', '/evm/calldata-decoder'],
		['errors', 'Errors', '/evm/errors'],
	] as const) {
		const layout = generatedFileByPath.get(
			`src/routes/(explore)/(protocols)/evm/(evmProtocol)/(${group})/+layout.svelte`
		)

		assert.notEqual(layout, undefined)
		assert.match(layout, new RegExp(`title='${title}'`))
		assert.match(layout, new RegExp(`resolve\\('${href}'\\)`))
	}

	const metadata = generatedFileByPath.get('tests/e2e/_generatedRouteFixtureMetadata.ts')

	assert.notEqual(metadata, undefined)
	for (const routePath of [
		'src/routes/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topics/+page.svelte',
		'src/routes/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selectors/+page.svelte',
		'src/routes/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata-decoder/+page.svelte',
		'src/routes/(explore)/(protocols)/evm/(evmProtocol)/(errors)/errors/+page.svelte',
	])
		assert.equal(generatedFileByPath.has(routePath), true)
	for (const publicPath of [
		'/evm/topic/[hex]',
		'/evm/selector/[hex]',
		'/evm/calldata/[hex]',
		'/evm/error/[hex]',
	])
		assert.equal(metadata.includes(`publicPath: '${publicPath}'`), true)
	assert.doesNotMatch(metadata, /\/(?:topics|selectors|calldata|errors)\)\//)
})

test('loads sibling facet row fields only after eligibility without per-field resource fan-out', () => {
	const compiled = baselineCompiledApp
	const singularFile = compiled.generatedFiles.find((file) => file.path === 'src/views/EvmCoinInstanceView.svelte')
	const pluralFile = compiled.generatedFiles.find((file) => file.path === 'src/views/EvmCoinInstancesView.svelte')
	assert.ok(singularFile)
	assert.ok(pluralFile)
	const singularView = renderGeneratedFile(singularFile)
	const pluralView = renderGeneratedFile(pluralFile)
	const rootResource = singularView.slice(
		singularView.indexOf('const evmCoinInstance = $derived('),
		singularView.indexOf('const titleFallback = $derived(')
	)

	for (const generatedView of [singularView, pluralView]) {
		assert.match(generatedView, /<ProjectionBoundary\s+resource=\{selection\.NativeCurrency\}/)
		assert.match(generatedView, /<ProjectionBoundary\s+resource=\{selection\.Erc20Token\}/)
		assert.doesNotMatch(generatedView, /resolvedEntity\.symbol/)
		assert.doesNotMatch(generatedView, /selection\.symbol/)
	}
	assert.match(singularView, /projection\.symbol\(\{[\s\S]*?Source\.Constants_Internal/)
	assert.match(singularView, /projection\.symbol\(\{[\s\S]*?Source\.Blockscout_Rest/)
	assert.match(pluralView, /NativeCurrency: \{[\s\S]*?symbol: true,[\s\S]*?name: true/)
	assert.match(pluralView, /Erc20Token: \{[\s\S]*?symbol: true,[\s\S]*?name: true/)
	assert.match(singularView, /pendingEntity\.NativeCurrency\?\.fields\.symbol/)
	assert.match(singularView, /pendingEntity\.Erc20Token\?\.fields\.symbol/)
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.symbol/)
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.Erc20Token\}[\s\S]*?projection\.symbol/)
	assert.match(singularView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.NativeCurrency\.\$icon/)
	assert.match(singularView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.Erc20Token\.\$icon/)
	assert.match(singularView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.\$\$marketsWithInstanceAsBase/)
	assert.match(singularView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.\$\$marketsWithInstanceAsBase/)
	assert.doesNotMatch(rootResource, /NativeCurrency|Erc20Token|Blockscout_Rest|Constants_Internal|symbol|name/)
})

test('keeps Network base sources selector-neutral and protocol sources facet-scoped', () => {
	const compiled = baselineCompiledApp
	const generatedFile = compiled.generatedFiles.find((file) => file.path === 'src/views/NetworkView.svelte')

	assert.ok(generatedFile)
	for (const path of [
		'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/+page.svelte',
		'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/+layout.svelte',
	]) {
		const routeProduct = compiled.generatedFiles.find((file) => file.path === path)
		assert.ok(routeProduct)
		const generatedRouteProduct = renderGeneratedFile(routeProduct)
		assert.match(
			generatedRouteProduct,
			/sources:\s*\[\s*Source\.Constants_Internal,?\s*\]/
		)
		assert.doesNotMatch(
			generatedRouteProduct,
			/select\(data\.selectorMapping\.entityType, data\.selectorMapping\.selector\)/
		)
		assert.doesNotMatch(
			generatedRouteProduct,
			/sources:\s*\[[\s\S]*?Source\.(?:Blockscout_Rest|CosmosChainRegistry_Github|Superchain_Github)/
		)
	}
	const generatedView = renderGeneratedFile(generatedFile)
	const rootResource = generatedView.slice(
		generatedView.indexOf('const network = $derived('),
		generatedView.indexOf('const titleFallback = $derived(')
	)
	const evmProjection = generatedView.slice(
		generatedView.indexOf('resource={selection.Evm}'),
		generatedView.indexOf('resource={selection.Cosmos}')
	)
	const cosmosProjection = generatedView.slice(generatedView.indexOf('resource={selection.Cosmos}'))

	assert.match(rootResource, /sources: selection\.sources/)
	assert.doesNotMatch(
		rootResource,
		/Source\.(?:Chainlist_Rest|CosmosChainRegistry_Github|EthereumLists_Rest|Superchain_Github)/
	)
	for (const [field, label] of [
		['name', 'Name'],
		['namespace', 'Namespace'],
		['environment', 'Environment'],
	] as const)
		assert.equal(
			[...generatedView.matchAll(new RegExp(`<dt>${label}</dt>[\\s\\S]{0,900}`, 'g'))].some(([markup]) => (
				new RegExp(`selection\\(\\{\\s*sources: selection\\.sources,\\s*fields: \\{\\s*${field}: true,`).test(markup)
			)),
			true,
			`${field} must inherit the Network view source selection`
		)
	const namespaceQueries = [...generatedView.matchAll(/namespace: true,/g)].map((match) => (
		generatedView.slice(Math.max(0, match.index - 300), match.index + match[0].length)
	))
	assert.equal(namespaceQueries.length, 2)
	for (const namespaceQuery of namespaceQueries) {
		assert.match(namespaceQuery, /sources: selection\.sources/)
		assert.doesNotMatch(namespaceQuery, /Source\.(?:Chainlist_Rest|CosmosChainRegistry_Github|EthereumLists_Rest|Superchain_Github)/)
	}
	const utxoTransactions = generatedView.slice(
		generatedView.indexOf("id={viewDomId + '-carousel-utxo-transaction-graph'}"),
		generatedView.indexOf("id={viewDomId + '-carousel-utxo-assets'}")
	)
	assert.match(utxoTransactions, /Source\.Blockchair_Rest/)
	assert.match(evmProjection, /Source\.Chainlist_Rest/)
	assert.doesNotMatch(evmProjection, /Source\.CosmosChainRegistry_Github/)
	assert.match(evmProjection, /id: 'evm-execution-transactions'/)
	assert.match(
		evmProjection,
		/SectionEvmExecutionTransactions[\s\S]*?sources: networkApplicableSources\(\[[\s\S]*?Source\.Blockscout_Rest,[\s\S]*?\], pendingEntity\)/
	)
	assert.match(cosmosProjection, /resource=\{selection\.Cosmos\}/)
	assert.doesNotMatch(
		generatedView,
		/'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',\s*'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'/
	)
})

test('keeps audited source truth mutation-complete', () => {
	const sourceTruthErrors = (
		candidateApp: typeof app,
		family: 'X' | 'Solana' | 'Cosmos' | 'Cardano' | 'Polkadot' | 'Ton' | 'Lightning' | 'Youtube'
	) => {
		const entity = (entityType: EntityType) => {
			const definition = candidateApp.schema.entities.find((candidate) => candidate.entityType === entityType)
			assert.ok(definition)
			return definition
		}
		const field = (
			entityType: EntityType,
			fieldName: string,
			facetPath: string[] = []
		) => (
			facetPath.length === 0 ?
				entity(entityType).fields.find((candidate) => candidate.name === fieldName)
			:
				entity(entityType).facets.find((facet) => facet.name === facetPath[0])?.fields.find((candidate) => candidate.name === fieldName)
		)
		const renderedEntity = (entityType: EntityType) => JSON.stringify(entity(entityType))

		if (family === 'X')
			return JSON.stringify(field(EntityType.XUser, '$$posts')?.defaultSources) === JSON.stringify([Source.X_Rest, Source.X_FxEmbed_Rest]) ? [] : ['XUser.$$posts fallback']
		if (family === 'Solana')
			return [
				[EntityType.SolanaBlock, '$$transactions'],
				[EntityType.SolanaTransaction, '$$timestamps'],
				[EntityType.SolanaTransaction, '$$instructions'],
				[EntityType.SolanaInstruction, '$$accounts'],
			].flatMap(([entityType, fieldName]) => field(entityType as EntityType, fieldName as string)?.defaultSources?.includes(Source.Solana_JsonRpc) ? [] : [`${entityType}.${fieldName}`]).concat(
				field(EntityType.SolanaAccount, '$$tokenAccounts') == null && field(EntityType.SolanaTokenMint, '$$tokenAccounts') == null
					&& !renderedEntity(EntityType.SolanaAccount).includes('solana-account-token-accounts')
					&& !renderedEntity(EntityType.SolanaTokenMint).includes('solana-token-mint-token-accounts') ? [] : ['unsupported Solana tokenAccounts']
			)
		if (family === 'Cosmos')
			return [
				[EntityType.CosmosAccount, '$$timestamps'],
				[EntityType.CosmosValidator, '$$timestamps'],
				[EntityType.CosmosGovernanceProposal, '$$timestamps'],
				[EntityType.CosmosTransaction, '$$messages'],
			].flatMap(([entityType, fieldName]) => field(entityType as EntityType, fieldName as string)?.defaultSources?.includes(Source.CosmosSdk_Rest) ? [] : [`${entityType}.${fieldName}`]).concat(
				field(EntityType.CosmosAccount, '$$transactions') == null && field(EntityType.CosmosBlock, '$$transactions') == null
					&& !renderedEntity(EntityType.CosmosAccount).includes('CosmosTransactionsView')
					&& !renderedEntity(EntityType.CosmosBlock).includes('CosmosTransactionsView') ? [] : ['unsupported Cosmos transactions']
			)
		if (family === 'Polkadot')
			return (
				JSON.stringify(field(EntityType.Network, '$$blocks', ['Polkadot'])?.defaultSources) === JSON.stringify([Source.Polkadot_JsonRpc])
				&& JSON.stringify(field(EntityType.PolkadotBlock, '$$extrinsics')?.defaultSources) === JSON.stringify([Source.Polkadot_JsonRpc, Source.SubstrateSidecar_Rest])
				&& JSON.stringify(field(EntityType.PolkadotBlock, '$$events')?.defaultSources) === JSON.stringify([Source.SubstrateSidecar_Rest])
			) ? [] : ['Polkadot source truth']
		if (family === 'Ton')
			return (
				JSON.stringify(field(EntityType.TonAccount, '$$timestamps')?.defaultSources) === JSON.stringify([Source.TonApi_Rest])
				&& ['$$transactions', '$$messages', '$$jettonBalanceTimestamps', '$$nftItems'].every((fieldName) => field(EntityType.TonAccount, fieldName) == null)
				&& field(EntityType.TonAccount_Timestamp, 'lastActivityTimestampMs') != null
			) ? [] : ['Ton account source truth']
		if (family === 'Lightning')
			return (
				field(EntityType.Network, '$$channels', ['Lightning']) == null
				&& field(EntityType.Network, '$$invoices', ['Lightning']) == null
				&& field(EntityType.Network, '$$payments', ['Lightning']) == null
				&& field(EntityType.Network, '$$localNodeStates', ['Lightning']) == null
				&& !renderedEntity(EntityType.Network).includes('lightning-network-channels')
				&& !renderedEntity(EntityType.Network).includes('lightning-local-')
			) ? [] : ['public Lightning channel source truth']
		if (family === 'Youtube')
			return [
				EntityType.YoutubeChannel,
				EntityType.YoutubePlaylist,
				EntityType.YoutubeVideo,
			].flatMap((entityType) => {
				const definition = entity(entityType)
				const expectedSources = JSON.stringify([
					Source.Youtube_Rest,
					Source.Piped_Rest,
					Source.Constants_Internal,
				])
				return (
					JSON.stringify(definition.views.singular?.query?.sources) === expectedSources
					&& definition.views.plural.query?.sources == null
				) ? [] : [`${entityType} live summary sources`]
			})

		return field(EntityType.CardanoGovernanceProposal, '$$timestamps')?.defaultSources?.includes(Source.Blockfrost_Rest)
			&& field(EntityType.CardanoGovernanceProposal_Timestamp, 'expirationEpoch') != null
			&& field(EntityType.CardanoCommittee_Epoch, '$seatingProposal')?.defaultSources?.includes(Source.Blockfrost_Rest)
			&& field(EntityType.CardanoCommittee_Epoch, 'dissolved')?.defaultSources?.includes(Source.Blockfrost_Rest) ? [] : ['Cardano lifecycle/committee source truth']
	}

	for (const [family, mutate] of [
		['X', (candidateApp: typeof app) => {
			const xUser = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.XUser)
			assert.ok(xUser)
			xUser.fields = xUser.fields.map((field) => field.name !== '$$posts' ? field : { ...field, defaultSources: [Source.X_Rest] })
		}],
		['Solana', (candidateApp: typeof app) => {
			const block = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.SolanaBlock)
			assert.ok(block)
			block.fields = block.fields.map((field) => field.name !== '$$transactions' ? field : { ...field, defaultSources: undefined })
		}],
		['Cosmos', (candidateApp: typeof app) => {
			const transaction = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.CosmosTransaction)
			assert.ok(transaction)
			transaction.fields = transaction.fields.map((field) => field.name !== '$$messages' ? field : { ...field, defaultSources: undefined })
		}],
		['Cardano', (candidateApp: typeof app) => {
			const observation = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.CardanoGovernanceProposal_Timestamp)
			assert.ok(observation)
			observation.fields = observation.fields.filter((field) => field.name !== 'expirationEpoch')
		}],
		['Polkadot', (candidateApp: typeof app) => {
			const network = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.Network)
			assert.ok(network)
			const blocks = network.facets.find((facet) => facet.name === 'Polkadot')?.fields.find((field) => field.name === '$$blocks')
			assert.ok(blocks)
			blocks.defaultSources = [Source.Polkadot_JsonRpc, Source.SubstrateSidecar_Rest]
		}],
		['Ton', (candidateApp: typeof app) => {
			const account = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.TonAccount)
			assert.ok(account)
			account.fields = account.fields.map((field) => field.name !== '$$timestamps' ? field : { ...field, defaultSources: undefined })
		}],
		['Lightning', (candidateApp: typeof app) => {
			const network = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.Network)
			assert.ok(network)
			const lightning = network.facets.find((facet) => facet.name === 'Lightning')
			assert.ok(lightning)
			lightning.fields.push({
				name: '$$invoices',
				label: 'Invoices',
				type: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
				entityType: EntityType.BlockheadLightningInvoice,
			})
		}],
		['Youtube', (candidateApp: typeof app) => {
			const channel = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.YoutubeChannel)
			assert.ok(channel)
			assert.ok(channel.views.singular?.query)
			channel.views.singular.query.sources = [Source.Constants_Internal]
		}],
	] as const) {
		assert.deepEqual(sourceTruthErrors(app, family), [])
		const mutatedApp = structuredClone(app)
		mutate(mutatedApp)
		assert.notDeepEqual(sourceTruthErrors(mutatedApp, family), [])
	}

	for (const path of [
		'src/views/YoutubeChannelsView.svelte',
		'src/views/YoutubePlaylistsView.svelte',
		'src/views/YoutubeVideosView.svelte',
	]) {
		const generatedFile = baselineCompiledApp.generatedFiles.find((file) => file.path === path)
		assert.ok(generatedFile)
		const generatedView = renderGeneratedFile(generatedFile)
		assert.match(generatedView, /sources: selection\.sources/)
		assert.doesNotMatch(generatedView, /sources: \[\s*Source\.(?:Youtube_Rest|Piped_Rest|Constants_Internal)/)
	}
	for (const path of [
		'src/views/YoutubePlaylistView.svelte',
		'src/views/YoutubeVideoView.svelte',
	]) {
		const generatedFile = baselineCompiledApp.generatedFiles.find((file) => file.path === path)
		assert.ok(generatedFile)
		const generatedView = renderGeneratedFile(generatedFile)
		assert.match(generatedView, /import MediaView from '\$\/views\/MediaView\.svelte'/)
		assert.match(generatedView, /selection\.sources/)
		assert.match(generatedView, /layout=\{EntityLayout\.Value\}/)
	}
})

test('keeps plural rows on their caller source selection and detail fields on their owning source selection', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const farcasterCast = app.schema.entities.find((entity) => entity.entityType === EntityType.FarcasterCast)
	const castsFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterCastsView.svelte')
	const castFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterCastView.svelte')

	assert.ok(farcasterCast)
	assert.ok(castsFile)
	assert.ok(castFile)
	const castsView = renderGeneratedFile(castsFile)
	const castView = renderGeneratedFile(castFile)
	assert.match(
		castsView,
		/selection\(\{\s*sources: selection\.sources,\s*fields: \{[\s\S]*?text: true,[\s\S]*?timestamp: true,[\s\S]*?username: true,/
	)
	assert.doesNotMatch(castsView, /sources: \[\s*Source\.Snapchain_Rest/)
	for (const field of ['text', 'timestamp']) {
		const detailQueries = [...castView.matchAll(new RegExp(`${field}: true,`, 'g'))].map((match) => (
			castView.slice(Math.max(0, match.index - 300), match.index + match[0].length)
		))
		assert.ok(detailQueries.length > 0)
		for (const detailQuery of detailQueries) {
			assert.match(detailQuery, /sources: selection\.sources/)
			assert.doesNotMatch(detailQuery, /sources: \[\s*Source\.(?:Snapchain_Rest|Farcaster_Rest|Neynar_Rest)/)
		}
	}
	const explicitPluralSources = compileApp({
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => entity !== farcasterCast ? entity : {
				...entity,
				views: {
					...entity.views,
					plural: {
						...entity.views.plural,
						query: {
							sources: [Source.Neynar_Rest],
						},
					},
				},
			}),
		},
	}).generatedFiles.find((file) => file.path === 'src/views/FarcasterCastsView.svelte')
	assert.ok(explicitPluralSources)
	const explicitPluralSourcesView = renderGeneratedFile(explicitPluralSources)
	assert.match(explicitPluralSourcesView, /sources: \[\s*Source\.Neynar_Rest,?\s*\]/)
	assert.doesNotMatch(explicitPluralSourcesView, /sources: selection\.sources/)
})

test('keeps YouTube hierarchy, observation provenance, and bounded discovery truthful', () => {
	const entity = (entityType: EntityType) => {
		const definition = app.schema.entities.find((candidate) => candidate.entityType === entityType)
		assert.ok(definition)
		return definition
	}
	const field = (entityType: EntityType, fieldName: string) => (
		entity(entityType).fields.find((candidate) => candidate.name === fieldName)
	)

	assert.deepEqual(
		field(EntityType.YoutubeComment, '$$replies')?.defaultSources,
		[Source.Youtube_Rest]
	)
	assert.deepEqual(
		field(EntityType.YoutubePlaylist, '$$videos')?.defaultSources,
		[
			Source.Youtube_Rest,
			Source.Piped_Rest,
		]
	)
	for (const [entityType, selectorName] of [
		[EntityType.YoutubeChannel_Timestamp, 'YoutubeChannelTimestampMsSource'],
		[EntityType.YoutubeComment_Timestamp, 'YoutubeCommentTimestampMsSource'],
		[EntityType.YoutubePlaylist_Timestamp, 'YoutubePlaylistTimestampMsSource'],
		[EntityType.YoutubeVideo_Timestamp, 'YoutubeVideoTimestampMsSource'],
	] as const) {
		const observation = entity(entityType)
		assert.deepEqual(
			observation.selectors.find((selector) => selector.name === selectorName)?.fields,
			[
				observation.fields[0].name,
				'timestampMs',
				'source',
			]
		)
	}

	const youtubeHubView = baselineCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/views/_GlobalYoutubeNetworkView.svelte'
	))
	assert.ok(youtubeHubView)
	assert.match(renderGeneratedFile(youtubeHubView), /Bounded discovery/)
	assert.match(renderGeneratedFile(youtubeHubView), /Popular videos \(provider-default region and category; Piped US\)/)
	assert.doesNotMatch(renderGeneratedFile(youtubeHubView), /sources: \[\s*Source\.Constants_Internal,\s*\]/)

	for (const path of [
		'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]/+page.svelte',
		'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]/+page.svelte',
		'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]/+page.svelte',
		'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]/+page.svelte',
	])
		assert.ok(baselineCompiledApp.generatedFiles.some((generatedFile) => generatedFile.path === path), path)
})

test('preserves facet syntax and paths and unwraps primitive-list resources', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-facet-list-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const networkView = readFileSync(path.join(generatedOutputRoot, 'src/views/NetworkView.svelte'), 'utf8')
		assert.match(networkView, /<ProjectionBoundary\s+resource=\{selection\.Evm\}/)
		assert.match(networkView, /\{#snippet Applicable\(projection\)\}/)
		assert.match(networkView, /resource=\{\s+selection\.Evm\.consensusEndpoints\(/)
		assert.doesNotMatch(networkView, /projection\.Evm\.consensusEndpoints/)
		assert.doesNotMatch(
			networkView,
			/selection\.Evm\.consensusEndpoints\(\{[\s\S]*?fields:\s*\{\s*Evm:/
		)
		assert.match(networkView, /\{#snippet children\(consensusEndpoints\)\}/)
		assert.doesNotMatch(networkView, /entity\.consensusEndpoints(?:\.values)?/)

		const networkBlocksPage = readFileSync(path.join(
			generatedOutputRoot,
			'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks/+page.svelte'
		), 'utf8')
		assert.match(networkBlocksPage, /projection\.\$\$blocks\(\{[\s\S]+?count: true,/)

		const evmTransactionSchema = readFileSync(path.join(generatedOutputRoot, 'src/schema/EvmTransaction.ts'), 'utf8')
		assert.match(evmTransactionSchema, /FeeMarket: facet\([\s\S]+?\}\),\n\s+Blob: facet/)
		assert.doesNotMatch(evmTransactionSchema, /facets: \{\},/)
		const generatedEvmTransactionView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTransactionView.svelte'), 'utf8')
		assert.doesNotMatch(
			generatedEvmTransactionView,
			/projection\.(?:maxFeePerGas|maxPriorityFeePerGas|maxFeePerBlobGas|blobGasUsed)\(\{[\s\S]*?fields:/
		)

		const evmLogSchema = readFileSync(path.join(generatedOutputRoot, 'src/schema/EvmLog.ts'), 'utf8')
		assert.match(evmLogSchema, /Event: facet\([\s\S]+?\}\)\(\{\n\s+facets: \{\n\s+TokenTransfer: facet/)
		assert.doesNotMatch(evmLogSchema, /facets: \{\},/)

		const evmTransactionView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTransactionView.svelte'), 'utf8')
			assert.match(evmTransactionView, /resource=\{selection\.Blob\}[\s\S]+?projection\.\$\$blobs/)
			assert.doesNotMatch(evmTransactionView, /projection\.Blob\.\$\$blobs/)
		assert.doesNotMatch(
			evmTransactionView.slice(
				evmTransactionView.indexOf('const evmTransaction = $derived('),
				evmTransactionView.indexOf('const titleFallback = $derived(')
			),
			/ContractCreation/
		)

		const evmTokenTransfersView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTokenTransfersView.svelte'), 'utf8')
		assert.match(evmTokenTransfersView, /resource=\{selection\.Nft\}/)

		const evmLogView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmLogView.svelte'), 'utf8')
			assert.match(evmLogView, /resource=\{selection\.Event\.TokenTransfer\}[\s\S]+?projection\.\$\$tokenTransfers\(\{[\s\S]+?count: true,/)
			assert.doesNotMatch(evmLogView, /projection\.Event\.TokenTransfer\.\$\$tokenTransfers/)

		const networkTimestampView = readFileSync(path.join(generatedOutputRoot, 'src/views/Network_TimestampView.svelte'), 'utf8')
		assert.equal(
			[...networkTimestampView.matchAll(/resource=\{selection\.Cosmos\}/g)].length,
			2,
			'projection fields in each modeled <dl> row must share one boundary'
		)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('guards generated entity references when field resources complete without a value', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-entity-reference-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const farcasterVerifiedAddressView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/FarcasterVerifiedAddressView.svelte'),
			'utf8'
		)
		assert.match(
			farcasterVerifiedAddressView,
			/\{#snippet children\(farcasterUser\)\}\s+\{#if farcasterUser != null && farcasterUser\[EntityMetaKey\.Selector\] != null\}/
		)
		assert.match(
			farcasterVerifiedAddressView,
			/\{#snippet children\(evmAccount\)\}\s+\{#if evmAccount != null && evmAccount\[EntityMetaKey\.Selector\] != null\}/
		)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})
