import assert from 'node:assert/strict'
import {
	copyFileSync,
	existsSync,
	globSync,
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
import { type as arktype } from 'arktype'
import { compile as compileSvelte } from 'svelte/compiler'

import {
	ApiFamily,
	app,
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	rawSnippetReference,
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
	sourceBindingDeliveryCompatibility,
	_ExpressionDecode,
	type _SourceSelection,
} from '../../APP.ts'
import {
	compileApp,
	composeSelectorRouteParamAlternatives,
	nearestApplicableSelectorAncestors,
	sourceBindingId,
	validateSourceBindingCompatibility,
	validateSourceBindingDeliveryCompatibility,
} from './generate.ts'
import {
	generatedHeader,
	renderGeneratedFile as renderGeneratedFileUncached,
} from './render.ts'
import sourceProviders, { sourceBindings } from '../../src/sources/$sourceProviders.ts'
import sourceServerCredentialsById from '../../src/sources/$sourceServerCredentials.server.ts'
import specificationProposalSources from '../../src/sources/specificationProposalSources.ts'


const root = process.cwd()
const subprocessTimeoutMs = 300_000
const authoredListTargetRouteFixtures = {
	'(assets)': {
		children: {
			markets: {},
		},
	},
	'(proposals)': {
		children: {
			proposals: {},
		},
	},
} as const
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
const generatedSourceByFile = new WeakMap<
	Parameters<typeof renderGeneratedFileUncached>[0],
	string
>()
let testStartedAt = 0
let testSubprocessElapsedMs = 0
let testFixtureElapsedMs = 0

const renderGeneratedFile = (
	generatedFile: Parameters<typeof renderGeneratedFileUncached>[0]
) => {
	const source = generatedSourceByFile.get(generatedFile)

	if (source != null)
		return source

	const renderedSource = renderGeneratedFileUncached(generatedFile)
	generatedSourceByFile.set(generatedFile, renderedSource)
	return renderedSource
}

const alphabetizeSourceDefinitions = (sourceApp: typeof app) => {
	sourceApp.sources.sources.sort((left, right) => left.source.localeCompare(right.source, 'en'))
}

test('entity hrefs compile directly from routes without a parallel artifact family', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.equal(generatedFiles.some(({ path }) => path.endsWith('.href.ts')), false)
	assert.equal(generatedFiles.some(({ path }) => path === 'src/constants/Network.ts'), false)
	assert.doesNotMatch(generatorSource, /JSON\.stringify\(\{\s*path: existingLink/)
	const generatedSvelteSources = generatedFiles
		.filter(({ path }) => path.endsWith('.svelte'))
		.map(renderGeneratedFile)
	const singularHrefFieldBindingCount = generatedSvelteSources.reduce((count, source) => (
		count + (source.match(/const [A-Za-z_$][A-Za-z0-9_$]* = \$derived\(selection\.entitySelector\.\$[A-Za-z0-9_$]+\)/g) ?? []).length
	), 0)
	const pluralHrefFieldBindingCount = generatedSvelteSources.reduce((count, source) => (
		count + (source.match(/\{@const [A-Za-z_$][A-Za-z0-9_$]* = [A-Za-z0-9_$]+Selector\.\$[A-Za-z0-9_$]+\}/g) ?? []).length
	), 0)
	assert.equal(singularHrefFieldBindingCount, 121)
	assert.equal(pluralHrefFieldBindingCount, 119)
	assert.equal(singularHrefFieldBindingCount + pluralHrefFieldBindingCount, 240)
	for (const source of generatedSvelteSources)
		assert.doesNotMatch(source, /__BLOCKHEAD_COMPILED_HREF_FIELD_/)
	for (const [viewPath, route] of [
		['src/views/LightningNetworksView.svelte', '/(explore)/(networks)/network/[network]'],
		['src/views/MarketPricesView.svelte', '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]'],
	] as const) {
		const view = generatedFiles.find(({ path }) => path === viewPath)

		assert.ok(view)
		const source = renderGeneratedFile(view)
		assert.equal(source.split(`'${route}'`).length - 1, 1, viewPath)
		assert.equal((source.match(/\bresolve\(/g) ?? []).length, 1, viewPath)
	}

	const detailLayouts = generatedFiles
		.filter(({ path }) => path.endsWith('/+layout.svelte'))
		.map((generatedFile) => ({
			path: generatedFile.path,
			source: renderGeneratedFile(generatedFile),
		}))
		.filter(({ source }) => source.includes('href={detailHref}'))
	assert.ok(detailLayouts.length > 0)
	assert.ok(detailLayouts.some(({ source }) => source.includes('const detailHref = resolve(')))
	assert.ok(detailLayouts.some(({ source }) => source.includes('const detailHref = $derived(')))
	for (const { path: layoutPath, source } of detailLayouts) {
		assert.equal((source.match(/href=\{detailHref\}/g) ?? []).length, 2, layoutPath)
		assert.equal((source.match(/const detailHref = /g) ?? []).length, 1, layoutPath)
		assert.equal((source.match(/\bresolve\(/g) ?? []).length, 1, layoutPath)
	}

	const youtubeVideoView = generatedFiles.find(({ path }) => path === 'src/views/YoutubeVideoView.svelte')
	assert(youtubeVideoView)
	const youtubeVideoSource = renderGeneratedFile(youtubeVideoView)
	assert.match(
		youtubeVideoSource,
		/href=\{[\s\S]*?href === undefined \?[\s\S]*?resolve\([\s\S]*?'\/\(social\)\/\(youtube\)\/youtube\/\(globalYoutubeNetwork\)\/video\/\[videoId=stringSegment\]',[\s\S]*?videoId: encodeURIComponent\(selection\.entitySelector\.videoId\),[\s\S]*?:\s*href \?\? undefined[\s\S]*?\}/
	)
	assert.doesNotMatch(youtubeVideoSource, /resolve\(`/)

	const youtubeVideoPage = generatedFiles.find(({ path }) => (
		path === 'src/routes/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/+page.svelte'
	))
	assert(youtubeVideoPage)
	assert.doesNotMatch(renderGeneratedFile(youtubeVideoPage), /import \{ resolve \} from '\$app\/paths'|\bhref=\{|resolve\(/)

	const marketView = generatedFiles.find(({ path }) => path === 'src/views/MarketView.svelte')
	assert(marketView)
	const marketViewSource = renderGeneratedFile(marketView)
	assert.match(
		marketViewSource,
		/const base = \$derived\(selection\.entitySelector\.\$base\)[\s\S]*?const quote = \$derived\(selection\.entitySelector\.\$quote\)[\s\S]*?marketVenue: selection\.entitySelector\.\$marketVenue\.marketVenueId,[\s\S]*?baseKind: marketAssetRouteLabelByKind\[base\.kind\],[\s\S]*?base: base\.assetKey,[\s\S]*?quoteKind: marketAssetRouteLabelByKind\[quote\.kind\],[\s\S]*?quote: quote\.assetKey,[\s\S]*?marketKind: selection\.entitySelector\.marketKind,/
	)
	assert.doesNotMatch(marketViewSource, /marketVenue: String\(|baseKind: String\(|quoteKind: String\(|marketKind: String\(/)

	const evmTransactionView = generatedFiles.find(({ path }) => path === 'src/views/EvmTransactionView.svelte')
	assert(evmTransactionView)
	const evmTransactionSource = renderGeneratedFile(evmTransactionView)
	assert.equal(
		(evmTransactionSource.match(/\/\(transactions\)\/tx\/\[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId\]/g) ?? []).length,
		1
	)
	assert.match(
		evmTransactionSource,
		/const network = \$derived\(selection\.entitySelector\.\$network\)[\s\S]*?network: \(\s*'caip2' in network \?[\s\S]*?network\.slug/
	)
	assert.doesNotMatch(
		evmTransactionSource,
		/\('caip2' in network\s+\|\| 'slug' in network\) \?/
	)
	assert.doesNotMatch(evmTransactionSource, /String\(\(\s*'caip2' in network/)

	const evmBlockView = generatedFiles.find(({ path }) => path === 'src/views/EvmBlockView.svelte')
	assert(evmBlockView)
	assert.match(renderGeneratedFile(evmBlockView), /\bid='transactions'/)
	assert.doesNotMatch(renderGeneratedFile(evmBlockView), /\bid='EvmTransactionsView-transactions'/)
	const evmBlocksPage = generatedFiles.find(({ path }) => path.endsWith('/(network)/blocks/+page.svelte'))
	assert(evmBlocksPage)
	assert.match(renderGeneratedFile(evmBlocksPage), /\bid='blocks'/)
	assert.doesNotMatch(renderGeneratedFile(evmBlocksPage), /\bid='account-evm-block'/)

	const evmCoinInstanceView = generatedFiles.find(({ path }) => path === 'src/views/EvmCoinInstanceView.svelte')
	const evmCoinInstancesView = generatedFiles.find(({ path }) => path === 'src/views/EvmCoinInstancesView.svelte')
	assert(evmCoinInstanceView)
	assert(evmCoinInstancesView)
	for (const source of [
		renderGeneratedFile(evmCoinInstanceView),
		renderGeneratedFile(evmCoinInstancesView),
	])
		assert.equal(
			(source.match(/\/\(assets\)\/coin-instance\/\[chainId=eip155ChainId\]\/\[coinInstanceSlug=nativeCurrencySlugOrEvmAddress\]/g) ?? []).length,
			1
		)
	const evmCoinInstancesSource = renderGeneratedFile(evmCoinInstancesView)
	assert.match(evmCoinInstancesSource, /\{@const evmCoinInstanceHref = 'caip2' in network/)
	assert.equal((evmCoinInstancesSource.match(/href=\{evmCoinInstanceHref\}/g) ?? []).length, 2)

	const tonTransactionView = generatedFiles.find(({ path }) => path === 'src/views/TonTransactionView.svelte')
	assert(tonTransactionView)
	assert.doesNotMatch(
		renderGeneratedFile(tonTransactionView),
		/<TonAccountView[\s\S]*?\bhref=/
	)

	assert.equal(
		generatedFiles.some(({ path }) => path.includes('/$hrefs') || path.includes('/$entityHrefs')),
		false
	)
	assert.equal(
		generatedFiles.some((generatedFile) => (
			generatedFile.kind !== 'text'
			&& JSON.stringify(generatedFile.ast).includes('entityHrefs.')
		)),
		false
	)
	for (const entity of app.schema.entities) {
		const schemaFile = generatedFiles.find(({ path }) => path === `src/schema/${entity.entityType}.ts`)
		assert.ok(schemaFile)
		const schemaSource = renderGeneratedFile(schemaFile)
		assert.match(schemaSource, /export default entity\(/, schemaFile.path)
		assert.doesNotMatch(schemaSource, new RegExp(`export const ${entity.entityType}\\b`), schemaFile.path)
	}
	const navigationItemsFile = generatedFiles.find(({ path }) => path === 'src/routes/navigationItems.svelte.ts')
	assert.ok(navigationItemsFile)
	assert.match(
		renderGeneratedFile(navigationItemsFile),
		/export default \[/,
		'generated navigation data has one primary export'
	)
	assert.doesNotMatch(renderGeneratedFile(navigationItemsFile), /children: \[\]/)
	assert.doesNotMatch(renderGeneratedFile(navigationItemsFile), /defaultIsOpen: false/)
	const schemaIndex = generatedFiles.find(({ path }) => path === 'src/schema/index.ts')
	assert.ok(schemaIndex)
	assert.doesNotMatch(renderGeneratedFile(schemaIndex), /import \{ [A-Za-z0-9_]+ as [A-Za-z0-9_]+Schema \} from '\$\/schema\//)
	const routeModules = generatedFiles.filter(({ path }) => /src\/routes\/.*\/\+(?:layout|page)\.ts$/.test(path))
	for (const routeModule of routeModules)
		assert.doesNotMatch(
			renderGeneratedFile(routeModule),
			/import \{ [A-Za-z0-9_]+ as [A-Za-z0-9_]+Schema \} from '\$\/schema\//,
			routeModule.path
		)
	const networkCatalogRouteModules = routeModules.filter((routeModule) => (
		renderGeneratedFile(routeModule).includes('networkByCaip2')
		|| renderGeneratedFile(routeModule).includes('networkBySlug')
	))
	assert.deepEqual(
		networkCatalogRouteModules.map((routeModule) => routeModule.path),
		['src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/+layout.ts']
	)
	const networkCatalogRouteModule = networkCatalogRouteModules[0]
	assert(networkCatalogRouteModule)
	assert.match(
		renderGeneratedFile(networkCatalogRouteModule),
		/return \{ \.\.\.routeCandidates\[0\], projectionNetwork \}/
	)
	for (const generatedFile of generatedFiles.filter(({ path }) => path.endsWith('.svelte')))
		assert.doesNotMatch(
			renderGeneratedFile(generatedFile),
			/resolve\(\s*`|\.map\(String\)\.join|\.map\(\([^)]*\) => String\([^)]*\)\)\.filter\(Boolean\)\.join/,
			generatedFile.path
		)
	for (const generatedFile of generatedFiles.filter(({ path }) => path.endsWith('.svelte')))
		assert.doesNotMatch(
			renderGeneratedFile(generatedFile),
			/\[EntityMetaKey\.Selector\] (?:!== undefined|!= null)/,
			generatedFile.path
		)
	for (const generatedFile of generatedFiles.filter(({ path }) => path.startsWith('src/schema/')))
		assert.doesNotMatch(
			renderGeneratedFile(generatedFile),
			/primitiveType: \([A-Za-z_$][A-Za-z0-9_$.]*\),/,
			generatedFile.path
		)

	const xPostTimestampView = generatedFiles.find(({ path }) => path === 'src/views/XPost_TimestampsView.svelte')
	assert(xPostTimestampView)
	assert.doesNotMatch(
		renderGeneratedFile(xPostTimestampView),
		/\|\| 'X post' \|\| 'X post observation'/
	)

	const stateChannelView = generatedFiles.find(({ path }) => path === 'src/views/BlockheadStateChannelStateView.svelte')
	assert(stateChannelView)
	assert.doesNotMatch(
		renderGeneratedFile(stateChannelView),
		/String\(\(\(allocations\)\.map/
	)

	const marketAssetView = generatedFiles.find(({ path }) => path === 'src/views/MarketAssetView.svelte')
	assert(marketAssetView)
	const renderedMarketAssetView = renderGeneratedFile(marketAssetView)
	assert.match(renderedMarketAssetView, /\{#if selection\.entitySelector\.kind === 'Coin'\}[\s\S]*?resource=\{selection\.Coin\}/)
	assert.match(renderedMarketAssetView, /\{#if selection\.entitySelector\.kind === 'Currency'\}[\s\S]*?resource=\{selection\.Currency\}/)
	assert.doesNotMatch(renderedMarketAssetView, /'\$coin' in|'\$currency' in/)
	assert.doesNotMatch(renderedMarketAssetView, /const marketAsset =|resource=\{marketAsset\}/)
	assert.doesNotMatch(renderedMarketAssetView, /fields: \{\s*(?:kind|assetKey): true/)
	assert.match(renderedMarketAssetView, /title=\{title \?\? \(selection\.entitySelector\.assetKey \|\| 'Market asset'\)\}/)
	assert.doesNotMatch(renderedMarketAssetView, /\{#snippet Title\(\)\}/)

	const networkView = generatedFiles.find(({ path }) => path === 'src/views/NetworkView.svelte')
	assert(networkView)
	const renderedNetworkView = renderGeneratedFile(networkView)
	assert.match(renderedNetworkView, /-carousel-network-assets/)
	assert.match(renderedNetworkView, /-carousel-network-resources/)
	assert.equal(renderedNetworkView.match(/native-assets'/g)?.length, 1)
	assert.doesNotMatch(renderedNetworkView, /(?:evm|polkadot|solana|utxo)-assets-native-assets/)
	assert.doesNotMatch(
		renderedNetworkView,
		/<ProjectionBoundary\s+resource=\{selection\.Evm\}>[\s\S]{0,250}<ProjectionBoundary\s+resource=\{selection\.Evm\}>/
	)
	assert.match(renderedNetworkView, /<AssetInstancesView[\s\S]*?selection[\s\S]*?\.\$\$nativeAssets\(\{[\s\S]*?sources: \[\s*Source\.Constants_Internal,/)
	assert.doesNotMatch(renderedNetworkView, /constantsInternalSources/)

	const evmAccountView = generatedFiles.find(({ path }) => path === 'src/views/EvmAccountView.svelte')
	const mediaView = generatedFiles.find(({ path }) => path === 'src/views/MediaView.svelte')
	const atprotoRepoCommitView = generatedFiles.find(({ path }) => path === 'src/views/AtprotoRepoCommitView.svelte')
	assert(evmAccountView && mediaView && atprotoRepoCommitView)
	assert.doesNotMatch(renderGeneratedFile(evmAccountView), /const evmAccount =/)
	assert.match(
		renderGeneratedFile(evmAccountView),
		/<ResourceBoundary\s+resource=\{\s*selection\(\{\s*sources: selection\.sources \?\? \[\s*Source\.Constants_Internal,/
	)
	assert.match(renderGeneratedFile(evmAccountView), /<TruncatedValue value=\{selection\.entitySelector\.address\} \/>/)
	assert.doesNotMatch(renderGeneratedFile(evmAccountView), /<TruncatedValue value=\{String\(selection\.entitySelector\.address\)\} \/>/)
	assert.doesNotMatch(renderGeneratedFile(evmAccountView), /\{@const address\d* = selection\.entitySelector\.address\}/)
	assert.match(renderGeneratedFile(mediaView), /const media = \$derived\(selection\)/)
	assert.match(renderGeneratedFile(atprotoRepoCommitView), /fields: \{\s*rev: true,\s*commitCid: true,/)
})

test('prints detail layout source options as structured TypeScript expressions', () => {
	assert.match(
		generatedSource('src/routes/(explore)/(protocols)/evm/(evmProtocol)/+layout.svelte'),
		/selection=\{\n\t+select\(EntityType\.EvmProtocol, data\.selector, \{\n\t+sources: \[\n\t+Source\.Constants_Internal,\n\t+\],\n\t+\}\)\n\t+\}/
	)
	for (const detailLayout of generatedSvelteFiles.filter(({ path: filePath }) => filePath.endsWith('/+layout.svelte')))
		assert.doesNotMatch(
			renderGeneratedFile(detailLayout),
			/select\([^\n]*, \{ sources: \[/,
			detailLayout.path
		)
})

test('generated views import runtime schema symbols used by raw snippets', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	assert.doesNotMatch(generatorSource, /rawSnippetSources/)
	assert.doesNotMatch(generatorSource, /svelteComponentNames|viewMarkupLines|raw\.includes/)
	assert.doesNotMatch(
		generatorSource,
		/__PENDING_ENTITY_STATE__|line\.replace|concreteExpression|expression\.replace\(\(\?<\!\\\.\)|pending\.expression\.replace|renderPresentRouteParamExpression[\s\S]{0,250}\.replaceAll|replaceAll\(projectionResourceExpression|directSummaryRowLines\.map/
	)
	for (const sourceHeuristic of [
		'condition.includes(\'(\')',
		'condition.includes(\'&&\')',
		'condition.includes(\'||\')',
		'condition.split(\' && \')',
		'query.includes(\'Source.\')',
		'selection.includes(\'Source.\')',
		'selection.includes(\'EntityProxyField\')',
		'selectorExpression.includes(\'data.\')',
		'snippet.raw.includes(`<${component}`)',
		'snippet.raw.includes(\'<NumberValue\')',
		'snippet.raw.includes(\'<Tooltip\')',
		'snippet.raw.includes(\'<TruncatedValue\')',
		'snippet.raw.includes(\'resolve(\')',
		'/\\bhref\\b/.test(snippet.raw)',
		'line.includes(\'<IconComponent\')',
		'line.includes(\'<Projection \')',
		'contentMarkup.some((line) => line.includes(\'contentOpen\'))',
		'svelteMarkupReferencesOpen',
		'/\\?\\s/.test(expression)',
	])
		assert.equal(generatorSource.includes(sourceHeuristic), false)
	assert.match(generatedSource('src/views/MarketView.svelte'), /\{#snippet Content\(\{ open: contentOpen \}\)\}/)
	assert.match(generatedSource('src/views/BlockheadSessionView.svelte'), /\{#snippet SectionBlockheadSessionActions\(\{ id, label, open \}\)\}/)

	for (const generatedFile of baselineCompiledApp.generatedFiles) {
		if (!generatedFile.path.endsWith('.svelte'))
			continue

		const source = renderGeneratedFile(generatedFile)
		assert.doesNotMatch(source, /<title>\{\(data\.title \?\?/)
		assert.doesNotMatch(source, /data\.title \?\? \('[^']+'\)/)
		assert.doesNotMatch(source, /\?\? \([^()\n]* \?\?/)
		if (!source.includes('EntityMetaKey.'))
			continue

		assert.match(
			source,
			/import \{ EntityMetaKey \} from '\$\/schema\/\$schema\.ts'/,
			generatedFile.path
		)
	}

	const coinView = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/views/CoinView.svelte')
	assert.ok(coinView)
	assert.doesNotMatch(
		renderGeneratedFile(coinView),
		/import (?:Tooltip|MarketPricesView|Market_TimeInterval_TimestampsView) /
	)
	const coinsView = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/views/CoinsView.svelte')
	assert.ok(coinsView)
	assert.doesNotMatch(
		renderGeneratedFile(coinsView),
		/import (?:CollapsibleTabs|Heading|Tooltip|EvmCoinInstancesView|MarketPricesView|Market_TimeInterval_TimestampsView|MarketsView) /
	)
})

test('raw snippet imports are declarative rather than inferred from rendered text', () => {
	const textOnlyApp = structuredClone(app)
	const textOnlyCctpFee = textOnlyApp.schema.entities.find(({ entityType }) => entityType === EntityType.CctpFee)
	assert.ok(textOnlyCctpFee?.views.singular?.summary)
	textOnlyCctpFee.views.singular.summary.Title = {
		raw: [
			'<p>{\'ResourceBoundary TruncatedValue\'}</p>',
			'<!-- <ResourceBoundary><TruncatedValue /></ResourceBoundary> -->',
		].join('\n'),
	}
	const textOnlyView = compileApp(textOnlyApp).generatedFiles.find(({ path: filePath }) => (
		filePath === 'src/views/CctpFeeView.svelte'
	))
	assert.ok(textOnlyView)
	assert.doesNotMatch(
		renderGeneratedFile(textOnlyView),
		/import (?:ResourceBoundary|TruncatedValue) /
	)

	const referencedApp = structuredClone(textOnlyApp)
	const referencedCctpFee = referencedApp.schema.entities.find(({ entityType }) => entityType === EntityType.CctpFee)
	assert.ok(referencedCctpFee?.views.singular?.summary)
	referencedCctpFee.views.singular.summary.Title = {
		raw: [
			'<ResourceBoundary resource={selection}>',
			'\t{#snippet children()}',
			'\t\t<TruncatedValue value={selection.entitySelector.apiHost} />',
			'\t{/snippet}',
			'</ResourceBoundary>',
		].join('\n'),
		imports: [
			{
				from: '$/components/ResourceBoundary.svelte',
				default: 'ResourceBoundary',
			},
			{
				from: '$/components/TruncatedValue.svelte',
				default: 'TruncatedValue',
			},
		],
	}
	const referencedView = compileApp(referencedApp).generatedFiles.find(({ path: filePath }) => (
		filePath === 'src/views/CctpFeeView.svelte'
	))
	assert.ok(referencedView)
	assert.match(
		renderGeneratedFile(referencedView),
		/import ResourceBoundary from '\$\/components\/ResourceBoundary\.svelte'[\s\S]*import TruncatedValue from '\$\/components\/TruncatedValue\.svelte'/
	)

	const evmNftView = generatedSource('src/views/EvmNftView.svelte')
	assert.match(
		evmNftView,
		/\{#snippet Icon\(\)\}\n\t\t<ResourceBoundary resource=\{evmNft\}>\n\t\t\t\{#snippet children\(entity\)\}[\s\S]*?\n\t\t\t\{\/snippet\}\n\t\t<\/ResourceBoundary>\n\t\{\/snippet\}/
	)

	const specificationProposalView = generatedSource('src/views/SpecificationProposalView.svelte')
	assert.match(
		specificationProposalView,
		/\t\t\{:else\}\n\t\t\t<ResourceBoundary resource=\{specificationProposal\}>[\s\S]*?\n\t\t\t<\/ResourceBoundary>\n\t\t\{\/if\}\n\t\{\/snippet\}/
	)
	assert.match(
		specificationProposalView,
		/<p>\n\t\t\tCatalog entries capture stewarded specification text[\s\S]*?\n\t\t<\/p>/
	)
})

test('places complete leading raw-carousel constants before the generated article', () => {
	const leadingConstApp = structuredClone(app)
	const blockheadSession = leadingConstApp.schema.entities.find(({ entityType }) => entityType === EntityType.BlockheadSession)
	const actionsSection = blockheadSession?.views.singular?.carousels
		?.find(({ id }) => id === 'blockhead-session-work')
		?.sections.find(({ id }) => id === 'blockhead-session-actions')
	assert.ok(actionsSection)
	actionsSection.Content = {
		raw: [
			'<!-- Derived section state stays in the section snippet. -->',
			'{@const state = (',
			'\topen ?',
			"\t\t'open'",
			'\t:',
			"\t\t'closed'",
			')}',
			'<p>{label}: {state}</p>',
		].join('\n'),
		references: ['open'],
	}
	const leadingConstView = compileApp(leadingConstApp).generatedFiles.find(({ path: filePath }) => (
		filePath === 'src/views/BlockheadSessionView.svelte'
	))
	assert.ok(leadingConstView)
	const leadingConstSource = renderGeneratedFile(leadingConstView)
	assert.match(
		leadingConstSource,
		/<!-- Derived section state stays in the section snippet\. -->[\s\S]*?\{@const state = \([\s\S]*?\)\}[\s\S]*?<article[\s\S]*?<p>\{label\}: \{state\}<\/p>/
	)
	assert.doesNotThrow(() => compileSvelte(leadingConstSource, {
		filename: leadingConstView.path,
		generate: false,
	}))

	const nonLeadingConstApp = structuredClone(app)
	const nonLeadingBlockheadSession = nonLeadingConstApp.schema.entities.find(({ entityType }) => entityType === EntityType.BlockheadSession)
	const nonLeadingActionsSection = nonLeadingBlockheadSession?.views.singular?.carousels
		?.find(({ id }) => id === 'blockhead-session-work')
		?.sections.find(({ id }) => id === 'blockhead-session-actions')
	assert.ok(nonLeadingActionsSection)
	nonLeadingActionsSection.Content = {
		raw: '<p>Rendered first.</p>\n{@const state = open}',
		references: ['open'],
	}
	assert.throws(
		() => compileApp(nonLeadingConstApp),
		/BlockheadSession carousel section blockhead-session-actions raw Content has a top-level \{@const\} after rendered content/
	)
})

test('rejects entity-list fields in scalar summaries', () => {
	const mutatedApp = structuredClone(app)
	const icpNetwork = mutatedApp.schema.entities.find(({ entityType }) => entityType === EntityType.IcpNetwork)

	assert.ok(icpNetwork)
	assert.ok(icpNetwork.views.singular?.summary)
	icpNetwork.views.singular.summary.value = [{
		field: '$$timestamps',
		format: 'monospace',
	}]

	assert.throws(
		() => compileApp(mutatedApp),
		/IcpNetwork\.\$\$timestamps cannot render an entity list in a scalar summary/
	)
})

test('renders schema-owned primitive lists and rejects non-list fields', () => {
	for (const [
		entityType,
		emptyText,
	] of [
		[EntityType.EvmError, 'No catalog matches for this revert/error selector.'],
		[EntityType.EvmError_Timestamp, 'No catalog matches for this revert/error selector.'],
		[EntityType.EvmSelector, 'No catalog signatures matched this function selector.'],
		[EntityType.EvmSelector_Timestamp, 'No catalog signatures matched this function selector.'],
		[EntityType.EvmTopic, 'No catalog signatures matched this log topic hash.'],
		[EntityType.EvmTopic_Timestamp, 'No catalog signatures matched this log topic hash.'],
	] as const) {
		const source = generatedSource(`src/views/${entityType}View.svelte`)
		assert.match(source, /<dt>Signatures<\/dt>/)
		assert.match(source, /\{#each entity\.signatures\.values as signature \(signature\)\}/)
		assert.ok(source.includes(`<p data-text="muted">${emptyText}</p>`))
	}

	const mutatedApp = structuredClone(app)
	const evmError = mutatedApp.schema.entities.find(({ entityType }) => entityType === EntityType.EvmError)
	assert.ok(evmError?.views.singular?.content)
	evmError.views.singular.content.dl = [[{
		field: 'hex',
		primitiveList: 'No signatures.',
	}]]

	assert.throws(
		() => compileApp(mutatedApp),
		/EvmError\.hex primitive list requires a Many or ZeroOrMany primitive field/
	)
})

test('derives many-cardinality emitter branches from one predicate', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.equal(
		(generatorSource.match(/cardinality === EntityFieldCardinality\.Many\s*\|\| [^\n]+cardinality === EntityFieldCardinality\.ZeroOrMany/g) ?? []).length,
		1
	)
})

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

const assertTypeChecks = (
	phase: string,
	files: readonly string[],
	strict = false
) => {
	const configPath = `${files[0]}.json`
	writeFileSync(configPath, JSON.stringify({
		compilerOptions: {
			allowImportingTsExtensions: true,
			module: 'preserve',
			moduleResolution: 'bundler',
			noEmit: true,
			paths: {
				'$/*': [`${root}/src/*`],
			},
			skipLibCheck: true,
			strict,
			target: 'esnext',
		},
		files,
	}))
	const result = runTestProcess(
		phase,
		process.execPath,
		[
			'--max-old-space-size=2048',
			process.env.TSC_PATH ?? path.join(root, 'node_modules/@typescript/native/bin/tsc'),
			'--project',
			configPath,
		],
		{}
	)
	assert.equal(result.status, 0, result.failure)
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
const generatedFileByPath = new Map(baselineCompiledApp.generatedFiles.map((generatedFile) => [generatedFile.path, generatedFile]))
const generatedSource = (filePath: string) => {
	const generatedFile = generatedFileByPath.get(filePath)
	assert.ok(generatedFile)
	return renderGeneratedFile(generatedFile)
}
const generatedSvelteFiles = baselineCompiledApp.generatedFiles.filter(({ kind }) => kind === 'svelte')
const generatedRouteSvelteFiles = generatedSvelteFiles.filter(({ path: filePath }) => filePath.startsWith('src/routes/'))
const generatedViewSources = generatedSvelteFiles
	.filter(({ path: filePath }) => filePath.startsWith('src/views/'))
	.map((generatedFile) => [generatedFile.path, renderGeneratedFile(generatedFile)] as const)
const pluralComponentNames = new Set(app.schema.entities.flatMap((entity) => entity.views?.plural?.component == null ? [] : [entity.views.plural.component]))
const generatedPaths = new Set(baselineCompiledApp.generatedFiles.map(({ path: filePath }) => filePath))
const omittedPluralEntities = app.schema.entities.filter((entity) => (
	!generatedPaths.has(`src/views/${entity.views.plural.component}.svelte`)
))
const retainedPluralEntities = app.schema.entities.filter((entity) => (
	generatedPaths.has(`src/views/${entity.views.plural.component}.svelte`)
))

test('preserves explicit view source selections independently of field defaults', () => {
	const filecoinActorView = generatedSource('src/views/FilecoinActorView.svelte')
	const filecoinParentQuery = filecoinActorView.slice(
		filecoinActorView.indexOf('.$$timestamps({'),
		filecoinActorView.indexOf('<FilecoinActor_TimestampView')
	)
	assert.match(filecoinParentQuery, /sources: \[\s+Source\.Lotus_JsonRpc,\s+\]/)
	assert.match(
		filecoinActorView.slice(filecoinActorView.indexOf('<FilecoinActor_TimestampView')),
		/sources: \[\s+Source\.Lotus_JsonRpc,\s+\]/
	)
	assert.match(
		generatedSource('src/views/EvmCoinInstanceView.svelte'),
		/\.\$\$outboundBridgeCapabilities\(\{\s+sources: \[\s+Source\.Lifi_Rest,\s+\]/
	)
	assert.match(
		generatedSource('src/views/NetworkView.svelte'),
		/\.\$\$consensusUpgrades\(\{\s+sources: \[\s+Source\.Constants_Internal,\s+\]/
	)
	assert.match(
		generatedSource('src/views/TonAccountView.svelte'),
		/\.\$\$timestamps\(\{\s+sources: \[\s+Source\.TonApi_Rest,\s+\]/
	)
	assert.match(
		generatedSource('src/views/YoutubeCommentView.svelte'),
		/\.\$\$replies\(\{\s+sources: \[\s+Source\.Youtube_Rest,\s+\]/
	)

	const mutatedApp = structuredClone(app)
	const filecoinActor = mutatedApp.schema.entities.find(({ entityType }) => entityType === EntityType.FilecoinActor)
	assert.ok(filecoinActor)
	const timestamps = filecoinActor.fields.find(({ name }) => name === '$$timestamps')
	assert.ok(timestamps)
	timestamps.defaultSources = [Source.Constants_Internal]
	const mutatedCompiledApp = compileApp(mutatedApp)
	const mutatedFilecoinActorView = mutatedCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/views/FilecoinActorView.svelte'
	))
	assert.ok(mutatedFilecoinActorView)
	assert.equal(
		(renderGeneratedFile(mutatedFilecoinActorView).match(/sources: \[\s+Source\.Lotus_JsonRpc,\s+\]/g) ?? []).length,
		2
	)
	const mutatedFilecoinActorSchema = mutatedCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/schema/FilecoinActor.ts'
	))
	assert.ok(mutatedFilecoinActorSchema)
	assert.match(
		renderGeneratedFile(mutatedFilecoinActorSchema),
		/defaultSources: \[\s+Source\.Constants_Internal,\s+\]/
	)

	const fallbackApp = structuredClone(app)
	const fallbackFilecoinActor = fallbackApp.schema.entities.find(({ entityType }) => entityType === EntityType.FilecoinActor)
	assert.ok(fallbackFilecoinActor)
	const latest = fallbackFilecoinActor.views.singular.latest?.[0]
	assert.ok(latest)
	delete latest.query?.sources
	const fallbackCompiledApp = compileApp(fallbackApp)
	const fallbackFilecoinActorView = fallbackCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/views/FilecoinActorView.svelte'
	))
	assert.ok(fallbackFilecoinActorView)
	const fallbackFilecoinActorViewSource = renderGeneratedFile(fallbackFilecoinActorView)
	assert.doesNotMatch(
		fallbackFilecoinActorViewSource.slice(
			fallbackFilecoinActorViewSource.indexOf('.$$timestamps({'),
			fallbackFilecoinActorViewSource.indexOf('<FilecoinActor_TimestampView')
		),
		/sources:/
	)
	const fallbackFilecoinActorSchema = fallbackCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/schema/FilecoinActor.ts'
	))
	assert.ok(fallbackFilecoinActorSchema)
	assert.match(
		renderGeneratedFile(fallbackFilecoinActorSchema),
		/defaultSources: \[\s+Source\.Lotus_JsonRpc,\s+\]/
	)
})

test('generated views and pages import exactly the dependencies they use', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const importPlanningStart = generatorSource.indexOf('const scriptBeforePendingEntity =')
	const importPlanningSource = generatorSource.slice(
		importPlanningStart,
		generatorSource.indexOf('\n\tconst markup =', importPlanningStart)
	)
	assert.match(importPlanningSource, /viewCollectionRoutes\.length > 0/)
	assert.doesNotMatch(importPlanningSource, /renderedCollectionRouteExpressions/)
	assert.doesNotMatch(importPlanningSource, /renderCollectionRouteValueExpression\(/)

	const dependencyContracts = [
		['ResourceBoundary', /^\s*import ResourceBoundary from '\$\/components\/ResourceBoundary\.svelte'$/m, /<ResourceBoundary\b/],
		['resolve', /^\s*import \{ resolve \} from '\$app\/paths'$/m, /\bresolve\(/],
		['EntityType', /^\s*import \{ EntityType \} from '\$\/schema\/EntityType\.ts'$/m, /\bEntityType\./],
		['Source', /^\s*import \{ Source \} from '\$\/sources\/Source\.ts'$/m, /\bSource\./],
		['select', /^\s*import \{ select \} from '\$\/routes\/\+layout\.svelte'$/m, /\bselect\(/],
	] as const
	const mismatches = baselineCompiledApp.generatedFiles
		.filter(({ path }) => (
			path.startsWith('src/views/')
			|| path.endsWith('/+page.svelte')
		))
		.flatMap((generatedFile) => {
			const source = renderGeneratedFile(generatedFile)

			return dependencyContracts.flatMap(([
				name,
				importPattern,
				usagePattern,
			]) => {
				const imported = importPattern.test(source)
				const used = usagePattern.test(source.replace(importPattern, ''))

				return imported === used ? [] : [
					`${generatedFile.path}: ${name} is ${imported ? 'imported but unused' : 'used but not imported'}`,
				]
			})
		})

	assert.deepEqual(mismatches, [])
})

test('accepts and passes prefetched rows only where pending display consumes them', () => {
	const prefetchedConsumers = generatedViewSources.filter(([_filePath, source]) => (
		/prefetched\.|\.\.\.prefetched/.test(source)
	))
	const prefetchedAcceptors = generatedViewSources.filter(([_filePath, source]) => (
		/prefetched = \{\}/.test(source)
	))

	assert.deepEqual(
		prefetchedAcceptors.map(([filePath]) => filePath),
		prefetchedConsumers.map(([filePath]) => filePath)
	)
	assert.equal(prefetchedConsumers.length, 229)
	assert.equal(generatedViewSources.reduce((count, [_filePath, source]) => (
		count + (source.match(/prefetched=\{/g)?.length ?? 0)
	), 0), 341)
	assert.match(generatedSource('src/views/A2aMessageView.svelte'), /Omit<EntitySelectionViewProps<EntityType\.A2aMessage>, 'prefetched'>/)
	assert.doesNotMatch(generatedSource('src/views/A2aMessagePartView.svelte'), /<A2aMessageView[^>]*prefetched=/)
	assert.match(generatedSource('src/views/MediaView.svelte'), /prefetched = \{\}/)
	assert.match(generatedSource('src/views/NetworkView.svelte'), /prefetched = \{\}/)
})

test('compiles exact default plural wrappers into their generated consumers', () => {
	assert.equal(omittedPluralEntities.length, 149)
	assert.equal(retainedPluralEntities.length, 846)
	assert.ok(omittedPluralEntities.some(({ entityType }) => entityType === EntityType.AlgorandNetwork))
	assert.ok(omittedPluralEntities.some(({ entityType }) => entityType === EntityType.HyperliquidBlock))
	assert.ok(retainedPluralEntities.some(({ entityType }) => entityType === EntityType.EvmError))

	const unresolvedViewImports = generatedSvelteFiles.flatMap((generatedFile) => (
		[...renderGeneratedFile(generatedFile).matchAll(/from '\$\/views\/([^']+)\.svelte'/g)]
			.flatMap((match) => (
				match[1] == null
				|| generatedPaths.has(`src/views/${match[1]}.svelte`)
				|| existsSync(path.join(root, `src/views/${match[1]}.svelte`)) ?
					[]
				:
					[`${generatedFile.path}: ${match[1]}`]
			))
	))
	assert.deepEqual(unresolvedViewImports, [])

	const omittedEntityTypes = new Set(omittedPluralEntities.map(({ entityType }) => String(entityType)))
	const inlinedDefaultLists = generatedSvelteFiles.flatMap((generatedFile) => (
		[...renderGeneratedFile(generatedFile).matchAll(/<EntitiesList\s+entityType=\{EntityType\.([A-Za-z0-9_]+)\}/g)]
			.flatMap((match) => (
				match[1] != null && omittedEntityTypes.has(match[1]) ?
					[`${generatedFile.path}: ${match[1]}`]
				:
					[]
			))
	))
	assert.equal(inlinedDefaultLists.length, 129)

	const algorandBoxView = generatedSource('src/views/AlgorandBoxView.svelte')
	assert.doesNotMatch(algorandBoxView, /AlgorandBox_RoundsView/)
	assert.match(algorandBoxView, /<EntitiesList\s+entityType=\{EntityType\.AlgorandBox_Round\}[\s\S]*?countResource=\{roundsResource\.count\}[\s\S]*?title='rounds'[\s\S]*?open=\{true\}[\s\S]*?id='rounds'[\s\S]*?resource=\{roundsResource\(\)\}/)
	assert.match(algorandBoxView, /<EntityView\s+entityType=\{EntityType\.AlgorandBox_Round\}\s+entitySelector=\{algorandBoxRound\[EntityMetaKey\.Selector\]\}\s*\/>/)

	const algorandNetworkView = generatedSource('src/views/AlgorandNetworkView.svelte')
	assert.doesNotMatch(algorandNetworkView, /AlgorandNetworksView|AlgorandRoundsView/)
	assert.match(algorandNetworkView, /<EntitiesList\s+entityType=\{EntityType\.AlgorandRound\}[\s\S]*?collapsible=\{false\}[\s\S]*?title=\{label\}[\s\S]*?emptyText='No Algorand rounds\.'[\s\S]*?open=\{true\}[\s\S]*?resource=\{selection\.\$\$rounds\(\)\}/)

	for (const routePath of [
		'src/routes_/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks/+page.svelte',
		'src/routes_/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/+page.svelte',
	]) {
		const source = readFileSync(path.join(root, routePath), 'utf8')
		assert.doesNotMatch(source, /from '\$\/views\/(?:HyperliquidBlocks|HyperliquidTransactions|TronBlocks)View\.svelte'/)
		assert.match(source, /<EntitiesList[\s\S]*?<EntityView/)
	}
})

test('inlines generated resource selections with one consumer', () => {
	const singleUseBindings = [
		...generatedViewSources.flatMap(([filePath, source]) => (
			[...source.matchAll(/const (\w+) = \$derived\((?:selection|viewSelection)(?=[(\n)])/g)]
				.flatMap((match) => (
					match[1] != null
					&& (source.match(new RegExp(`\\b${match[1]}\\b`, 'g')) ?? []).length === 2 ?
						[`${filePath}: ${match[1]}`]
					:
						[]
				))
		)),
		...generatedRouteSvelteFiles.flatMap((generatedFile) => {
			const source = renderGeneratedFile(generatedFile)
			return (
				source.includes('const pageSelection = $derived')
				&& (source.match(/\bpageSelection\b/g) ?? []).length === 2 ?
					[`${generatedFile.path}: pageSelection`]
				:
					[]
			)
		}),
	]
	assert.deepEqual(singleUseBindings, [])

	const assetClassView = generatedSource('src/views/AssetClassView.svelte')
	assert.doesNotMatch(assetClassView, /const assetClass =/)
	assert.match(assetClassView, /<ResourceBoundary\s+resource=\{\s+selection\(\{/)

	const sourceSelectedView = generatedSource('src/views/Eip8004CrossRegistrationView.svelte')
	assert.doesNotMatch(sourceSelectedView, /const viewSelection =/)
	assert.match(sourceSelectedView, /resource=\{\s+selection\(\{\s+sources: selection\.sources/)

	const oneConsumerPage = generatedSource(
		'src/routes/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/+page.svelte'
	)
	assert.doesNotMatch(oneConsumerPage, /const pageSelection =/)
	assert.match(oneConsumerPage, /selection=\{\s+select\(EntityType\.EvmError/)

	const sharedPageSelection = generatedSource('src/routes/(explore)/url/[url=absoluteUrl]/+page.svelte')
	assert.match(sharedPageSelection, /const pageSelection = \$derived/)
	assert.match(sharedPageSelection, /pageSelection\.entitySelector\.url/)
	assert.match(sharedPageSelection, /selection=\{pageSelection\}/)
})

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

test('emits each route projection predicate once', () => {
	for (const generatedFile of baselineCompiledApp.generatedFiles) {
		if (!/src\/routes\/.*\/\+(?:page|layout)\.ts$/.test(generatedFile.path))
			continue

		assert.doesNotMatch(
			renderGeneratedFile(generatedFile),
			/(\bprojection[A-Za-z0-9_]+\.[A-Za-z0-9_$]+ === (?:'[^']+'|[0-9]+)) && \1/,
			generatedFile.path
		)
	}
})

test('generates one APP-ordered lazy resolver loader registry', () => {
	const resolverIndex = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/resolvers/index.ts')

	assert.ok(resolverIndex)
	const source = renderGeneratedFile(resolverIndex)
	assert.doesNotMatch(source, /import\.meta\.glob|eager: true|export const resolvers/)
	assert.match(source, /export const loadResolvers = async/)
	assert.doesNotMatch(source, /export default loadResolvers/)
	assert.doesNotMatch(source, /loadResolverEntries|loadAllResolvers/)
	assert.match(source, /Resolver module source mismatch/)
	assert.match(source, /type ResolverLoaderEntry = \{[\s\S]*?\[_Source in Source\]: readonly \[[\s\S]*?RegisteredSourceResolverModule<_Source>[\s\S]*?\}\[Source\]/)
	assert.match(source, /as const satisfies readonly ResolverLoaderEntry\[\]/)
	assert.doesNotMatch(source, /SourceResolverModule<typeof schema, Source>/)
	for (const loaderEntry of [
		"[Source.Nodely, () => import('./AlgorandIndexer-Rest.ts')]",
		"[Source.KaspaExplorer, () => import('./KaspaExplorer.ts')]",
		"[Source.Starkscan, () => import('./Starkscan.ts')]",
		"[Source.StellarHorizon_Rest, () => import('./StellarHorizon-Rest.ts')]",
		"[Source.Sui, () => import('./Sui.ts')]",
		"[Source.TonCenter, () => import('./TonCenter.ts')]",
	])
		assert.ok(source.includes(loaderEntry), `missing resolver loader ${loaderEntry}`)

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
				modules: [
					app.resolvers.modules[0],
					app.resolvers.modules[0],
					...app.resolvers.modules.slice(1),
				],
			},
		}),
		/Resolver module definitions contains duplicate/
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

test('derives schema condition plans from the generated schema instead of emitting them twice', () => {
	const schemaIndex = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/schema/index.ts')

	assert.ok(schemaIndex)
	const source = renderGeneratedFile(schemaIndex)
	assert.match(source, /export const schemaMeta = indexSchema\(schema\)/)
	assert.match(source, /export type RegisteredEntityDefinitionByType = typeof entityDefinitionByType/)
	assert.doesNotMatch(source, /interface RegisteredEntityDefinitionByType|\[EntityType\./)
	assert.doesNotMatch(source, /projectionConditionPlanByEntityTypeAndPath|conditionPlan:/)
})

test('keeps APP field presentation metadata out of runtime schema modules', () => {
	const presentationPropertyNames = new Set([
		'label',
		'labelPlural',
		'description',
	])
	const violations = app.schema.entities.flatMap((entity) => {
		const filePath = `src/schema/${entity.entityType}.ts`
		const source = generatedSource(filePath)
		const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)
		const fieldViolations: string[] = []
		const visit = (node: ts.Node) => {
			if (ts.isObjectLiteralExpression(node)) {
				const propertyNames = node.properties.flatMap((property) => (
					ts.isPropertyAssignment(property) ?
						[property.name.getText(sourceFile).replace(/^['"]|['"]$/g, '')]
					:
						[]
				))
				if (propertyNames.includes('cardinality'))
					fieldViolations.push(...propertyNames.filter((propertyName) => (
						presentationPropertyNames.has(propertyName)
					)).map((propertyName) => `${filePath}:${propertyName}`))
			}

			ts.forEachChild(node, visit)
		}
		visit(sourceFile)

		return fieldViolations
	})

	assert.deepEqual(violations, [])
	assert.equal(
		app.schema.entities
			.find(({ entityType }) => entityType === EntityType.Market_TimeInterval_Timestamp)
			?.fields.find(({ name }) => name === 'quoteVolume')
			?.description,
		'Quote-leg candle volume, scaled by 1e8 like quote prices.'
	)
	assert.match(generatedSource('src/schema/Network.ts'), /labels: \{[\s\S]*?singular: 'Network',[\s\S]*?plural: 'networks',[\s\S]*?\}/)
	assert.match(generatedSource('src/schema/Network.ts'), /description: 'A blockchain, ledger, or protocol network with its own identity and supporting metadata\.'/)
})

test('projects APP field enums and navigation structure into runtime modules', () => {
	const generatedFileByPath = new Map(baselineCompiledApp.generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))
	assert.equal(generatedFileByPath.has('src/views/index.ts'), false)
	const polymorphicPages = [...generatedFileByPath.entries()].filter(([, source]) => (
		source.includes('const entityViewByType = {')
	))
	assert.equal(polymorphicPages.length, 7)
	for (const [, source] of polymorphicPages) {
		assert.doesNotMatch(source, /from '\$\/views\/index\.ts'/)
		assert.match(source, /import [A-Za-z0-9_]+View from '\$\/views\/[A-Za-z0-9_]+View\.svelte'/)
		assert.ok((source.match(/\[EntityType\.[A-Za-z0-9_]+\]: [A-Za-z0-9_]+View,/g) ?? []).length > 1)
		assert.doesNotMatch(source, /entityViewByType[\s\S]*?label:/)
	}

	for (const [name, members] of [
		['EntityFieldCardinality', Object.values(EntityFieldCardinality)],
		['EntityFieldType', Object.values(EntityFieldType)],
	] as const)
		assert.equal(
			generatedFileByPath.get(`src/schema/${name}.ts`),
			`// Generated from APP.ts.

export enum ${name} {
${members.map((member) => `\t${member} = '${member}',`).join('\n')}
}
`
		)
	for (const [path, name] of [
		['src/schema/EntityType.ts', 'EntityType'],
		['src/sources/Source.ts', 'Source'],
	] as const) {
		const generatedEnum = generatedFileByPath.get(path) ?? ''
		assert.match(generatedEnum, new RegExp(`\\nexport enum ${name} \\{`))
		assert.doesNotMatch(generatedEnum, new RegExp(`\\nexport default ${name}\\n$`))
	}
	const sourceProviderSource = generatedFileByPath.get('src/sources/SourceProvider.ts') ?? ''
	assert.match(sourceProviderSource, /\nexport enum SourceProvider \{/)
	assert.doesNotMatch(sourceProviderSource, /\nexport default SourceProvider\n$/)
	assert.equal(generatedFileByPath.has('src/routes/NavigationItem.ts'), false)
	assert.equal(generatedFileByPath.has('src/sources/index.ts'), false)
	assert.equal(generatedFileByPath.has('src/sources/index.server.ts'), false)
	assert.match(
		generatedFileByPath.get('src/schema/Account.ts') ?? '',
		/import \{ entity, facet \} from '\$\/schema\/\$schema\.ts'[\s\S]*?import \{ EntityFieldCardinality \} from '\$\/schema\/EntityFieldCardinality\.ts'/
	)
	for (const entity of app.schema.entities) {
		const entitySchema = generatedFileByPath.get(`src/schema/${entity.entityType}.ts`) ?? ''
		assert.doesNotMatch(entitySchema, /EntityFieldType/)
		assert.doesNotMatch(entitySchema, /\btype: EntityFieldType\./)
	}
})

test('keeps APP compiler registries internally aligned', () => {
	const appEntityTypes = app.schema.entities.map((entity) => entity.entityType)
	const appValueTypeIds = app.schema.valueTypes.map((valueType) => valueType.id)
	const appSourceProviders = app.sources.providers.map((provider) => provider.provider)
	const appSources = app.sources.sources.map((source) => source.source)
	const appResolverModulePaths = app.resolvers.modules.map((resolverModule) => resolverModule.path)

	assert.equal(appEntityTypes.length, new Set(appEntityTypes).size)
	assert.deepEqual(
		Object.values(EntityType),
		Object.values(EntityType).toSorted((left, right) => left.localeCompare(right, 'en', {
			sensitivity: 'base',
			numeric: true,
		}))
	)
	assert.deepEqual(appEntityTypes, Object.values(EntityType))
	assert.deepEqual(
		appValueTypeIds,
		appValueTypeIds.toSorted((left, right) => left.localeCompare(right, 'en'))
	)
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

test('rejects unordered schema registries before generation', () => {
	const unorderedEntitiesApp = structuredClone(app)
	Object.defineProperty(unorderedEntitiesApp.schema, 'entities', {
		value: [
			unorderedEntitiesApp.schema.entities[1],
			unorderedEntitiesApp.schema.entities[0],
			...unorderedEntitiesApp.schema.entities.slice(2),
		],
	})
	assert.throws(() => compileApp(unorderedEntitiesApp), /schema.entities must be alphabetized/)

	const unorderedValueTypesApp = structuredClone(app)
	Object.defineProperty(unorderedValueTypesApp.schema, 'valueTypes', {
		value: [
			unorderedValueTypesApp.schema.valueTypes[1],
			unorderedValueTypesApp.schema.valueTypes[0],
			...unorderedValueTypesApp.schema.valueTypes.slice(2),
		],
	})
	assert.throws(() => compileApp(unorderedValueTypesApp), /schema.valueTypes must be alphabetized/)

	const unorderedResolverModulesApp = structuredClone(app)
	Object.defineProperty(unorderedResolverModulesApp.resolvers, 'modules', {
		value: [
			unorderedResolverModulesApp.resolvers.modules[1],
			unorderedResolverModulesApp.resolvers.modules[0],
			...unorderedResolverModulesApp.resolvers.modules.slice(2),
		],
	})
	assert.throws(() => compileApp(unorderedResolverModulesApp), /Resolver module definitions must be alphabetized/)
})

test('rejects duplicate resolver module paths during compilation', () => {
	const duplicatePathApp = structuredClone(app)
	const [firstResolverModule, secondResolverModule] = duplicatePathApp.resolvers.modules

	assert.ok(firstResolverModule && secondResolverModule)
	Object.defineProperty(secondResolverModule, 'path', {
		value: firstResolverModule.path,
	})
	assert.throws(() => compileApp(duplicatePathApp), /duplicate resolver module path/)
})

test('retains only consumed generation indexes', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.doesNotMatch(generatorSource, /routeNodesByPublicPath/)
})

test('renders compiled source documentation with one ordered section table each', () => {
	const source = generatedSource('SOURCES.md')
	assert.equal(source, readFileSync(path.join(root, 'SOURCES.md'), 'utf8'))
	assert.deepEqual(
		[...source.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
		[
			'Providers',
			'Sources',
			'Bindings',
			'Endpoints',
			'Credentials',
			'Artifacts',
		]
	)
	assert.equal(source.endsWith('\n'), true)
})

test('loads one complete singular-view query while plural rows render direct summaries', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const singularRootQuery = (source: string) => (
		source.match(/const \w+ = \$derived\(selection\(([\s\S]*?)\)\)\n\tconst titleFallback = \$derived\(/)?.[1]
	)
	const evmBalanceView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmNetworkActorCoinBalanceView.svelte')
	const filecoinMessageView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/FilecoinMessageView.svelte')
	const cardanoTxInputView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoTxInputView.svelte')
	const cardanoGovernancePage = generatedFiles.find((generatedFile) => generatedFile.path.endsWith('/governance/+page.svelte'))
	const cardanoTxOutputView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoTxOutputView.svelte')
	const cardanoTxOutputAssetView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoTxOutputAssetView.svelte')
	const cardanoCertificateView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoCertificateView.svelte')
	const cardanoScriptWitnessView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoScriptWitnessView.svelte')
	const cardanoGovernanceProposalView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoGovernanceProposalView.svelte')
	const cardanoGovernanceVoteView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoGovernanceVoteView.svelte')
	const cardanoNativeAssetView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoNativeAssetView.svelte')

	assert.ok(evmBalanceView)
	assert.ok(filecoinMessageView)
	assert.ok(cardanoTxInputView)
	assert.ok(cardanoTxOutputView)
	assert.ok(cardanoTxOutputAssetView)
	assert.ok(cardanoCertificateView)
	assert.ok(cardanoScriptWitnessView)
	assert.ok(cardanoGovernanceProposalView)
	assert.ok(cardanoGovernanceVoteView)
	assert.ok(cardanoNativeAssetView)
	const evmBalanceSource = renderGeneratedFile(evmBalanceView)
	const evmBalanceQuery = singularRootQuery(evmBalanceSource) ?? ''
	assert.match(evmBalanceQuery, /fields: \{\s*symbol: true,\s*decimals: true,\s*\}/)
	assert.doesNotMatch(evmBalanceSource, /prefetched\[EntityMetaKey\.Selector\][\s\S]*?layout !== EntityLayout\.SummaryDetails \?/)
	assert.match(
		evmBalanceSource,
		/\{#snippet Title\(\)\}\s*<ResourceBoundary resource=\{evmNetworkActorCoinBalance\}>[\s\S]*?entity\.symbol/
	)
	assert.match(
		evmBalanceSource,
		/\{#snippet Value\(\)\}\s*<EvmAccountView[\s\S]*?selection=\{select\(EntityType\.EvmAccount, selection\.entitySelector\.\$actor\)\}/
	)
	for (const path of [
		'src/views/YoutubeChannelView.svelte',
		'src/views/YoutubePlaylistView.svelte',
		'src/views/YoutubeVideoView.svelte',
	]) {
		const generatedView = generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(generatedView)
		const renderedView = renderGeneratedFile(generatedView)
		assert.match(renderedView, /\{#snippet Title\(\)\}\s*<ResourceBoundary resource=\{youtube(?:Channel|Playlist|Video)\}>/)
		assert.doesNotMatch(renderedView, /\{#if layout !== EntityLayout\.SummaryDetails/)
		if (path === 'src/views/YoutubeVideoView.svelte')
			assert.match(renderedView, /resource=\{selection\.\$author\}/)
	}
	assert.match(renderGeneratedFile(filecoinMessageView), /resource=\{selection\.\$from\}[\s\S]*?resource=\{selection\.\$to\}[\s\S]*?<ResourceBoundary resource=\{filecoinMessage\}>/)
	assert.match(renderGeneratedFile(cardanoTxInputView), /entity\.inputKind[\s\S]*?selection\.entitySelector\.inputIndex[\s\S]*?spent transaction hash[\s\S]*?spent output[\s\S]*?redeemer index/)
	const cardanoTxOutputAssets = (
		renderGeneratedFile(cardanoTxOutputView).match(/<CardanoTxOutputAssetsView[\s\S]*?\n\s*\/>/)?.[0] ?? ''
	)
	assert.match(cardanoTxOutputAssets, /selection=\{selection\.\$\$assets\}/)
	assert.doesNotMatch(
		cardanoTxOutputAssets,
		/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m
	)
	assert.doesNotMatch(renderGeneratedFile(cardanoTxOutputView), /const cardanoTransactionOutputAssetsListResource/)
	assert.doesNotMatch(renderGeneratedFile(cardanoTxOutputView), /\$\$assets\(\{[\s\S]*?Source\.Blockfrost_Rest/)
	assert.match(renderGeneratedFile(cardanoTxOutputAssetView), /CardanoNativeAssetView[\s\S]*?entity\.quantity/)
	assert.match(renderGeneratedFile(cardanoCertificateView), /entity\.certificateKind[\s\S]*?Certificate #[\s\S]*?selection\.entitySelector\.certificateIndex/)
	assert.match(renderGeneratedFile(cardanoScriptWitnessView), /entity\.scriptKind[\s\S]*?Script #[\s\S]*?selection\.entitySelector\.witnessIndex[\s\S]*?entity\.scriptHash/)
	assert.match(renderGeneratedFile(cardanoGovernanceProposalView), /previous action[\s\S]*?policy hash[\s\S]*?hard fork major version[\s\S]*?treasury withdrawals[\s\S]*?committee additions[\s\S]*?constitution anchor URL/)
	assert.doesNotMatch(renderGeneratedFile(cardanoGovernanceProposalView), /proposalPayload|JSON\.stringify/)
	assert.match(
		renderGeneratedFile(cardanoGovernanceVoteView),
		/fields: \{\s*vote: true,\s*\}[\s\S]*?entity\.vote[\s\S]*?selection\.entitySelector\.voterKind[\s\S]*?selection\.entitySelector\.voterCredential/
	)
	assert.match(renderGeneratedFile(cardanoNativeAssetView), /selection\.entitySelector\.policyId[\s\S]*?selection\.entitySelector\.assetName[\s\S]*?entity\.fingerprint/)
	assert.ok(cardanoGovernancePage)
	assert.match(
		renderGeneratedFile(cardanoGovernancePage),
		/const collection\d+Selection = \$derived\(select\(EntityType\.Network, data\.selector\)\.Cardano\.\$\$governanceProposals\)/
	)
	assert.doesNotMatch(renderGeneratedFile(cardanoGovernancePage), /ProjectionBoundary|Applicable\(projection\)/)
	assert.deepEqual(
		app.schema.entities
			.find((entity) => entity.entityType === EntityType.CardanoTransaction)
			?.fields
			.filter((field) => [
				'$$certificates',
				'$$scripts',
				'$$governanceProposals',
				'$$governanceVotes',
			].includes(field.name))
			.map((field) => field.defaultSources),
		Array.from({ length: 4 }, () => [Source.CardanoKoios_Rest])
	)
})

test('renders plural rows as direct declarative EntityView summaries without registries', () => {
	const cardanoGovernanceProposalsView = generatedFileByPath.get('src/views/CardanoGovernanceProposalsView.svelte')
	const aptosTransactionsView = generatedFileByPath.get('src/views/AptosTransactionsView.svelte')
	const networkActivityDaysView = generatedFileByPath.get('src/views/Network_Activity_DaysView.svelte')
	assert.ok(cardanoGovernanceProposalsView && aptosTransactionsView && networkActivityDaysView)

	const renderedPluralView = renderGeneratedFile(cardanoGovernanceProposalsView)
	assert.doesNotMatch(renderedPluralView, /import CardanoGovernanceProposalView from/)
	assert.match(renderedPluralView, /import EntityView from '\$\/components\/EntityView\.svelte'/)
	assert.match(renderedPluralView, /<EntityView[\s\S]*?entityType=\{EntityType\.CardanoGovernanceProposal\}[\s\S]*?\{#snippet Title\(\)\}/)
	assert.doesNotMatch(renderedPluralView, /layout=\{EntityLayout\.Summary\}|open=\{false\}|showTypeAnnotation=\{false\}/)
	assert.doesNotMatch(renderedPluralView, /getContext|entityViewComponentContext|installEntityViewComponents/)
	const renderedAptosTransactionsView = renderGeneratedFile(aptosTransactionsView)
	assert.match(renderedAptosTransactionsView, /aptosTransactionSelector\.hash \|\| String\(aptosTransactionSelector\.version\)/)
	assert.doesNotMatch(renderedAptosTransactionsView, /aptosTransaction\.(?:hash|version)/)
	const renderedNetworkActivityDaysView = renderGeneratedFile(networkActivityDaysView)
	assert.match(renderedNetworkActivityDaysView, /\{networkActivityDay\.transactionCount\}/)
	assert.doesNotMatch(renderedNetworkActivityDaysView, /\{String\(networkActivityDay\.transactionCount\)\}/)
	let compiledAwaySchemaLabelCount = 0
	for (const entity of app.schema.entities) {
		const pluralComponent = entity.views?.plural?.component
		if (pluralComponent == null)
			continue

		const pluralView = generatedFileByPath.get(`src/views/${pluralComponent}.svelte`)
		if (pluralView == null) {
			assert.ok(omittedPluralEntities.includes(entity))
			continue
		}

		const renderedView = renderGeneratedFile(pluralView)
		assert.doesNotMatch(
			renderedView,
			new RegExp(`\\{#snippet Title\\(\\)\\}\\s*${entity.labels.singular.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{/snippet\\}`),
			`${pluralView.path} repeats its schema label in a Title snippet`
		)
		if (
			renderedView.includes('<EntityView')
			&& !renderedView.includes('{#snippet Title()}')
		)
			compiledAwaySchemaLabelCount++
	}
	assert.ok(compiledAwaySchemaLabelCount + omittedPluralEntities.length > 100)
	const globalActivityPubNetworksView = generatedFileByPath.get('src/views/_GlobalActivityPubNetworksView.svelte')
	const icpLedgerAccountTimestampsView = generatedFileByPath.get('src/views/IcpLedgerAccount_TimestampsView.svelte')
	const tezosTokenTransfersView = generatedFileByPath.get('src/views/TezosTokenTransfersView.svelte')
	assert.ok(globalActivityPubNetworksView && icpLedgerAccountTimestampsView)
	assert.equal(tezosTokenTransfersView, undefined)
	assert.ok(omittedPluralEntities.some(({ entityType }) => entityType === EntityType.TezosTokenTransfer))
	assert.doesNotMatch(renderGeneratedFile(globalActivityPubNetworksView), /\{#snippet Title\(\)\}/)
	assert.match(renderGeneratedFile(globalActivityPubNetworksView), /\{#snippet Value\(\)\}/)
	assert.match(renderGeneratedFile(icpLedgerAccountTimestampsView), /\{#snippet Title\(\)\}\s*ICP ledger account timestamp/)
	const singularComponentNames = new Set(app.schema.entities.map((entity) => `${entity.entityType}View`))
	for (const generatedView of baselineCompiledApp.generatedFiles.filter((file) => (
		file.path.startsWith('src/views/')
		&& file.kind === 'svelte'
		&& file.ast.markup?.find((line) => line.trim() !== '')?.trim() === '<EntitiesList'
	)))
		assert.deepEqual(
			[...renderGeneratedFile(generatedView).matchAll(/from '\$\/views\/([^']+\.svelte)'/g)]
				.map((match) => path.basename(match[1] ?? '', '.svelte'))
				.filter((componentName) => singularComponentNames.has(componentName)),
			[],
			`${generatedView.path} retains a generated singular-view import edge`
		)

	assert.deepEqual(
		baselineCompiledApp.generatedFiles
			.map((file) => file.path)
			.filter((filePath) => filePath.startsWith('src/views/_entityViewRegistries/')),
		[]
	)
	assert.equal(
		baselineCompiledApp.generatedFiles
			.filter((file) => file.kind === 'svelte')
			.map(renderGeneratedFile)
			.some((source) => /entityViewComponentContext|installEntityViewComponents/.test(source)),
		false
	)
})

test('leaves plural schema descriptions to EntitiesList', () => {
	let schemaDescriptionCount = 0
	for (const entity of app.schema.entities) {
		const pluralComponent = entity.views?.plural?.component
		if (pluralComponent == null || entity.description == null)
			continue

		assert.doesNotMatch(generatedSource(`src/views/${pluralComponent}.svelte`), /typeAnnotationParagraphs/)
		schemaDescriptionCount++
	}
	assert.ok(schemaDescriptionCount > 50)

	assert.match(generatedSource('src/views/EvmBlobsView.svelte'), /\{#snippet ModelTypeAnnotationTooltip\(\)\}/)
	assert.match(
		readFileSync(path.join(root, 'src/components/EntitiesList.svelte'), 'utf8'),
		/TypeAnnotationTooltip == null && entityDefinitionByType\[entityType\]\.description != null/
	)
})

test('leaves singular schema descriptions to EntityView', () => {
	let schemaDescriptionCount = 0
	for (const entity of app.schema.entities) {
		if (
			entity.description == null
			|| entity.views?.singular?.TypeAnnotationTooltip != null
		)
			continue

		assert.doesNotMatch(generatedSource(`src/views/${entity.entityType}View.svelte`), /\{#snippet TypeAnnotationTooltip\(\)\}/)
		schemaDescriptionCount++
	}
	assert.ok(schemaDescriptionCount > 50)

	assert.match(generatedSource('src/views/CoinView.svelte'), /\{#snippet TypeAnnotationTooltip\(\)\}/)
	assert.match(
		readFileSync(path.join(root, 'src/components/EntityView.svelte'), 'utf8'),
		/Content=\{TypeAnnotationTooltip \?\? SchemaTypeAnnotationTooltip\}/
	)
})

test('omits collection page titles already owned by plural views', () => {
	let defaultTitlePageCount = 0
	for (const generatedPage of generatedRouteSvelteFiles) {
		for (const component of renderGeneratedFile(generatedPage).matchAll(/<([A-Za-z0-9_]+View)\n([\s\S]*?)\n\s*\/>/g)) {
			if (
				pluralComponentNames.has(component[1] ?? '')
				&& !/^\s+title=/m.test(component[2] ?? '')
			)
				defaultTitlePageCount++
		}
	}
	assert.ok(defaultTitlePageCount > 50)

	assert.match(generatedSource('src/routes/~/accounts/balances/+page.svelte'), /<EvmNetworkActorCoinBalancesView[\s\S]*?\n\s+title='EVM balances'/)
	assert.match(generatedSource('src/routes/~/accounts/+page.svelte'), /<title>Accounts • Blockhead<\/title>/)
})

test('leaves collection container defaults to EntitiesList', () => {
	let collectionPageCount = 0
	for (const generatedPage of generatedRouteSvelteFiles) {
		for (const component of renderGeneratedFile(generatedPage).matchAll(/<([A-Za-z0-9_]+View)\n([\s\S]*?)\n\s*\/>/g)) {
			if (!pluralComponentNames.has(component[1] ?? ''))
				continue

			assert.doesNotMatch(
				component[2] ?? '',
				/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m,
				generatedPage.path
			)
			collectionPageCount++
		}
	}
	assert.ok(collectionPageCount > 100)

	const entitiesList = readFileSync(path.join(root, 'src/components/EntitiesList.svelte'), 'utf8')
	assert.match(entitiesList, /data-column-item=\{articleElementProps\['data-column-item'\] \?\? 'flexible'\}/)
	assert.match(entitiesList, /\n\tdata-card\n\tdata-scroll-container\n/)
})

test('leaves singular relationship-list container defaults to their list owner', () => {
	let relationshipListCount = 0
	for (const [filePath, source] of generatedViewSources) {
		if (!source.includes('\n<EntityView\n'))
			continue

		for (const component of source.matchAll(/<([A-Za-z0-9_]+View)\n([\s\S]*?)\n\s*\/>/g)) {
			if (
				!pluralComponentNames.has(component[1] ?? '')
				|| !/^\s+collapsible=\{false\}$/m.test(component[2] ?? '')
				|| !/^\s+title=\{label\}$/m.test(component[2] ?? '')
				|| !/^\s+id=\{`\$\{id\}-list`\}$/m.test(component[2] ?? '')
			)
				continue

			assert.doesNotMatch(
				component[2] ?? '',
				/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m,
				filePath
			)
			relationshipListCount++
		}
		for (const entitiesList of source.matchAll(/<EntitiesList\n([\s\S]*?)\n\s*>/g)) {
			if (
				!/^\s+collapsible=\{false\}$/m.test(entitiesList[1] ?? '')
				|| !/^\s+title=\{label\}$/m.test(entitiesList[1] ?? '')
				|| !/^\s+id=\{`\$\{id\}-list`\}$/m.test(entitiesList[1] ?? '')
			)
				continue

			assert.doesNotMatch(
				entitiesList[1] ?? '',
				/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m,
				filePath
			)
			relationshipListCount++
		}
	}
	assert.ok(relationshipListCount > 500)

	const mutatedApp = structuredClone(app)
	const rssNetwork = mutatedApp.schema.entities.find(({ entityType }) => entityType === EntityType.RssNetwork)
	const rssFeedsSection = rssNetwork?.views.singular?.carousels?.[0]?.sections[0]
	assert.ok(rssFeedsSection)
	rssFeedsSection.List = 'CustomRssFeedsView'
	const rssNetworkView = compileApp(mutatedApp).generatedFiles.find(({ path }) => (
		path === 'src/views/RssNetworkView.svelte'
	))
	assert.ok(rssNetworkView)
	assert.match(
		renderGeneratedFile(rssNetworkView),
		/<CustomRssFeedsView[\s\S]*?data-column-item="flexible"[\s\S]*?data-card[\s\S]*?data-scroll-container/
	)
})

test('leaves generated display defaults to their component contracts', () => {
	const generatedSvelteSource = generatedSvelteFiles
		.map(renderGeneratedFile)
		.join('\n')
	assert.equal((generatedSvelteSource.match(/\n\s+open=\{true\}/g) ?? []).length, 140)
	assert.doesNotMatch(generatedSvelteSource, /TruncatedValueFormat\.Visual/)
	assert.doesNotMatch(generatedSvelteSource, /<Tooltip contentProps=\{\{ side: 'top' \}\}>/)

	assert.match(generatedSource('src/views/YoutubeCommentView.svelte'), /<TruncatedValue\n\s+value=\{[^]*?\n\s+startLength=\{64\}\n\s+endLength=\{16\}\n\s+\/>/)

	for (const [
		filePath,
		pattern,
	] of [
		['src/components/Tooltip.svelte', /position-area: top;/],
		['src/components/TruncatedValue.svelte', /format = TruncatedValueFormat\.Visual,/],
		['src/routes/(social)/(nostr)/nostr/open-relay/+page.svelte', /<ParentPageCollapsible open=\{true\}>/],
		['src/routes/~/accounts/WalletConnectionsControl.svelte', /open=\{false\}/],
	] as const)
		assert.match(readFileSync(path.join(root, filePath), 'utf8'), pattern)
})

test('renders selector summary values from indexed declarative fields', () => {
	for (const [
		entityType,
		fieldName,
		format,
	] of [
		[EntityType.EvmCalldata, 'hex', 'monospace'],
		[EntityType.EvmError, 'hex', 'monospace'],
		[EntityType.EvmNft, 'tokenId', 'monospace'],
		[EntityType.EvmSelector, 'hex', 'monospace'],
		[EntityType.EvmTopic, 'hex', 'monospace'],
		[EntityType.NostrReaction, 'eventId', 'truncated'],
		[EntityType.NostrRepost, 'eventId', 'truncated'],
		[EntityType.YoutubeComment, 'commentId', 'truncated'],
	] as const) {
		const entity = app.schema.entities.find((candidate) => candidate.entityType === entityType)
		assert.ok(entity?.views.singular?.summary)
		assert.equal(entity.views.singular.summary.Value, undefined)
		if (format === 'monospace')
			assert.deepEqual(entity.views.singular.summary.value, [{
				field: fieldName,
				format,
			}])
		assert.match(
			generatedSource(`src/views/${entityType}View.svelte`),
			format === 'monospace' ?
				new RegExp(`<span data-text="font-monospace">\\{selection\\.entitySelector\\.${fieldName}\\}</span>`)
			:
				new RegExp(`<TruncatedValue value=\\{selection\\.entitySelector\\.${fieldName}\\} />`)
		)
	}

	assert.match(
		app.schema.entities.find(({ entityType }) => entityType === EntityType.Coin)
			?.views.singular?.summary?.Value?.raw ?? '',
		/selection\.entitySelector\.coinId/
	)
})

test('leaves singular schema-default titles to EntityView', () => {
	let compiledAwayFallbackTitleCount = 0
	for (const generatedView of baselineCompiledApp.generatedFiles.filter((file) => (
		file.path.startsWith('src/views/')
		&& file.path.endsWith('View.svelte')
		&& !file.path.endsWith('sView.svelte')
	))) {
		const renderedView = renderGeneratedFile(generatedView)
		if (
			renderedView.includes('<EntityView')
			&& !renderedView.includes('\t\ttitle,')
			&& !/\n\ttitle=/.test(renderedView)
			&& !renderedView.includes('{#snippet Title()}')
		) {
			assert.doesNotMatch(renderedView, /const titleFallback =/)
			compiledAwayFallbackTitleCount++
		}
	}
	assert.ok(compiledAwayFallbackTitleCount > 100)

	const tezosTokenTransferView = generatedSource('src/views/TezosTokenTransferView.svelte')
	const icpLedgerAccountTimestampView = generatedSource('src/views/IcpLedgerAccount_TimestampView.svelte')
	const atprotoActorView = generatedSource('src/views/AtprotoActorView.svelte')
	assert.doesNotMatch(tezosTokenTransferView, /\n\t+title(?:,|=)/)
	assert.doesNotMatch(tezosTokenTransferView, /\{#snippet Title\(\)\}/)
	assert.match(tezosTokenTransferView, /\{#snippet Content\(\)\}/)
	assert.match(icpLedgerAccountTimestampView, /title=\{title \?\? 'ICP ledger account timestamp'\}/)
	assert.doesNotMatch(icpLedgerAccountTimestampView, /\{#snippet Title\(\)\}/)
	assert.match(atprotoActorView, /title=\{title \?\?/)
	assert.match(atprotoActorView, /\{#snippet Title\(\)\}[\s\S]*?<ResourceBoundary/)
	assert.match(generatedSource('src/views/MarketAssetView.svelte'), /title=\{title \?\? \(selection\.entitySelector\.assetKey \|\| 'Market asset'\)\}/)
})

test('uses one resource-owned declarative summary path', () => {
	const mutatedApp = structuredClone(app)
	const blockheadWallet = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.BlockheadWallet)
	const xrplLedger = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.XrplLedger)
	const filecoinMessage = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.FilecoinMessage)
	const network = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const xrplTransaction = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.XrplTransaction)
	assert.ok(blockheadWallet && xrplLedger && filecoinMessage && network && xrplTransaction)
	xrplLedger.views.singular = {
		summary: {
			title: ['closeTimeMs'],
		},
	}
	filecoinMessage.views.singular = {
		summary: {
			title: ['$from'],
		},
	}
	network.views.singular = {
		summary: {
			title: [['Evm', 'shortName']],
		},
	}
	xrplTransaction.views.singular = {
		query: {
			fields: ['transactionType'],
		},
		summary: {
			Title: {
				raw: [
					`<ResourceBoundary resource={${rawSnippetReference.resolvedEntity.source}}>`,
					'\t{#snippet children()}',
					'\t\t{titleFallback}',
					'\t{/snippet}',
					'</ResourceBoundary>',
				].join('\n'),
				imports: [
					{
						from: '$/components/ResourceBoundary.svelte',
						default: 'ResourceBoundary',
					},
				],
				references: [
					'resolvedEntity',
					'titleFallback',
				],
			},
		},
	}
	const generatedFiles = compileApp(mutatedApp).generatedFiles
	const renderedViewByPath = Object.fromEntries([
		'src/views/BlockheadWalletConnectionView.svelte',
		'src/views/BlockheadWalletConnectionsView.svelte',
		'src/views/XrplLedgerView.svelte',
		'src/views/FilecoinMessageView.svelte',
		'src/views/NetworkView.svelte',
		'src/views/XrplTransactionView.svelte',
		'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]/+page.svelte',
	].map((path) => {
		const generatedView = generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(generatedView)
		return [path, renderGeneratedFile(generatedView)]
	}))

	assert.match(renderedViewByPath['src/views/XrplLedgerView.svelte'], /fields: \{\s*closeTimeMs: true,\s*\}/)
	assert.match(renderedViewByPath['src/views/XrplLedgerView.svelte'], /\{#snippet Title\(\)\}\s*<ResourceBoundary\s+resource=\{\s*selection\(\{[\s\S]*?closeTimeMs: true,[\s\S]*?entity\.closeTimeMs/)
	assert.doesNotMatch(renderedViewByPath['src/views/XrplLedgerView.svelte'], /const xrplLedger =|resource=\{xrplLedger\}/)
	assert.match(renderedViewByPath['src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]/+page.svelte'], /fields: \{[\s\S]*?closeTimeMs: true,[\s\S]*?<title>\{data\.title \?\? \(pageSelection\.entity == null \? 'XRPL ledger' : String\(pageSelection\.entity\.closeTimeMs \?\? ''\) \|\| 'XRPL ledger'\)\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/XrplLedgerView.svelte'], /Object\.hasOwn\(prefetched|layout !== EntityLayout\.SummaryDetails/)
	assert.match(renderedViewByPath['src/views/FilecoinMessageView.svelte'], /\{#snippet Title\(\)\}\s*<ResourceBoundary[\s\S]*?resource=\{[\s\S]*?selection\s*\.\$from/)
	assert.doesNotMatch(renderedViewByPath['src/views/FilecoinMessageView.svelte'], /const filecoinMessage =|resource=\{filecoinMessage\}/)
	assert.match(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /\{#snippet Title\(\)\}\s*<ResourceBoundary[\s\S]*?resource=\{selection\.\$wallet\}/)
	assert.match(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /\{entity\.status\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /String\(entity\.status\)/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /Object\.hasOwn\(prefetched|layout !== EntityLayout\.SummaryDetails/)
	assert.match(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /selection=\{select\(EntityType\.Account, account\[EntityMetaKey\.Selector\]\)\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionView.svelte'], /select\(EntityType\.Account, account\[EntityMetaKey\.Selector\], \{ sources: selection\.sources \}\)/)
	assert.match(renderedViewByPath['src/views/BlockheadWalletConnectionsView.svelte'], /\$wallet: \{[\s\S]*?fields: \{[\s\S]*?name: true,[\s\S]*?protocol: true,[\s\S]*?\}/)
	assert.match(renderedViewByPath['src/views/BlockheadWalletConnectionsView.svelte'], /\{blockheadWalletConnection\.status\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionsView.svelte'], /String\(blockheadWalletConnection\.status\)/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionsView.svelte'], /sources: selection\.sources/)
	assert.doesNotMatch(renderedViewByPath['src/views/BlockheadWalletConnectionsView.svelte'], /\$wallet: true/)
	assert.match(renderedViewByPath['src/views/NetworkView.svelte'], /\{#snippet Title\(\)\}\s*<ProjectionBoundary[\s\S]*?resource=\{selection\s*\.Evm\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/NetworkView.svelte'], /const network =|resource=\{network\}/)
	assert.match(renderedViewByPath['src/views/XrplTransactionView.svelte'], /<ResourceBoundary[\s\S]*?resource=\{\s*selection\(\{[\s\S]*?fields: \{\s*transactionType: true,\s*\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/XrplTransactionView.svelte'], /const xrplTransaction =|resource=\{xrplTransaction\}/)
	assert.doesNotMatch(renderedViewByPath['src/views/XrplTransactionView.svelte'], /prefetched\[EntityMetaKey\.Selector\][\s\S]*?layout !== EntityLayout\.SummaryDetails \?/)
	assert.doesNotMatch(renderedViewByPath['src/views/NetworkView.svelte'], /\{#if layout !== EntityLayout\.SummaryDetails/)
	assert.doesNotMatch(renderedViewByPath['src/views/XrplTransactionView.svelte'], /\{#if layout !== EntityLayout\.SummaryDetails/)

	blockheadWallet.views.singular.summary.value = ['discoveryKind']
	const walletConnectionWithChangedChildSummary = compileApp(mutatedApp).generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/BlockheadWalletConnectionsView.svelte'
	))
	assert.ok(walletConnectionWithChangedChildSummary)
	const changedChildSummary = renderGeneratedFile(walletConnectionWithChangedChildSummary)
	assert.match(changedChildSummary, /\$wallet: \{[\s\S]*?fields: \{[\s\S]*?name: true,[\s\S]*?discoveryKind: true,[\s\S]*?\}/)
	assert.doesNotMatch(changedChildSummary, /\$wallet: \{[\s\S]*?protocol: true/)
	blockheadWallet.views.singular.summary.value = ['protocol']

	blockheadWallet.views.singular = {
		...blockheadWallet.views.singular,
		summary: {
			Title: {
				raw: '{titleFallback}',
			},
		},
	}
	const walletConnectionWithOpaqueChildSummary = compileApp(mutatedApp).generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/BlockheadWalletConnectionView.svelte'
	))
	assert.ok(walletConnectionWithOpaqueChildSummary)
	assert.doesNotMatch(renderGeneratedFile(walletConnectionWithOpaqueChildSummary), /\{#if layout !== EntityLayout\.SummaryDetails/)
})

test('keeps projection fields resolved when their terminal name matches a selector field', () => {
	const collisionApp = structuredClone(app)
	const account = collisionApp.schema.entities.find((entity) => entity.entityType === EntityType.Account)
	const evm = account?.facets?.find((facet) => facet.name === 'Evm')
	const caip10 = account?.fields.find((field) => field.name === 'caip10')
	assert.ok(account?.views.singular && evm?.fields && caip10)
	Object.defineProperty(evm, 'fields', {
		enumerable: true,
		value: [
			...evm.fields,
			structuredClone(caip10),
		],
	})
	account.views.singular.summary = {
		title: [['Evm', 'caip10']],
		HeadingAfter: [['Evm', 'caip10']],
	}

	const accountView = compileApp(collisionApp).generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/AccountView.svelte'
	))
	assert.ok(accountView)
	const renderedAccountView = renderGeneratedFile(accountView)
	assert.match(renderedAccountView, /<ProjectionBoundary[\s\S]*?resource=\{selection\.Evm\}[\s\S]*?projection\.caip10/)
	assert.doesNotMatch(renderedAccountView, /selection\.entitySelector\.Evm\.caip10/)

	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const summaryItemSource = generatorSource.slice(
		generatorSource.indexOf('const renderSummaryItemMarkup ='),
		generatorSource.indexOf('const renderSummaryItemsMarkup =')
	)
	assert.equal(
		(summaryItemSource.match(/entitySelectorOwnsField\(entity, fieldReference\)/g) ?? []).length,
		2
	)
	assert.doesNotMatch(summaryItemSource, /entitySelectorOwnsField\(entity, fieldName\)/)
	for (const functionName of [
		'const renderSummaryAfterItem =',
		'const renderEntityReferenceDlItem =',
	]) {
		const functionSource = generatorSource.slice(
			generatorSource.indexOf(functionName),
			generatorSource.indexOf('\nconst ', generatorSource.indexOf(functionName) + functionName.length)
		)
		assert.match(functionSource, /entitySelectorOwnsField\(entity, fieldReference\)/)
		assert.doesNotMatch(functionSource, /entitySelectorOwnsField\(entity, fieldName\)/)
	}
})

test('validates facet fields through the canonical facet traversal', () => {
	const invalidFacetListApp = structuredClone(app)
	const account = invalidFacetListApp.schema.entities.find((entity) => entity.entityType === EntityType.Account)
	const evm = account?.facets?.find((facet) => facet.name === 'Evm')
	assert.ok(evm)
	Object.defineProperty(evm, 'singularView', {
		enumerable: true,
		value: {
			lists: [{ field: 'missing' }],
		},
	})

	assert.throws(
		() => compileApp(invalidFacetListApp),
		/Account facet list references missing field missing/
	)
	assert.doesNotMatch(
		readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8'),
		/const entityFields =/
	)
})

test('renders value display facts and their query dependencies in definition lists', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const beaconValidatorView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BeaconValidatorView.svelte')
	const cashuProofView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadCashuProofView.svelte')
	const cashuWalletTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadCashuWalletState_TimestampView.svelte')
	const assetSupplyView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AssetSupply_LedgerCoordinateView.svelte')
	const assetClassView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AssetClassView.svelte')
	const evmBalanceTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmNetworkActorCoinBalance_TimestampView.svelte')
	const algorandAssetTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AlgorandAsset_TimestampView.svelte')
	const evmCoinInstanceView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmCoinInstanceView.svelte')
	const networkTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/Network_TimestampView.svelte')

	assert.ok(beaconValidatorView)
	assert.ok(cashuProofView)
	assert.ok(cashuWalletTimestampView)
	assert.ok(assetSupplyView)
	assert.ok(assetClassView)
	assert.ok(evmBalanceTimestampView)
	assert.ok(algorandAssetTimestampView)
	assert.ok(evmCoinInstanceView)
	assert.ok(networkTimestampView)

	assert.match(
		renderGeneratedFile(beaconValidatorView),
		/<dt>Balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balanceGwei\}[\s\S]*?<span> gwei<\/span>/
	)
	assert.match(
		renderGeneratedFile(cashuProofView),
		/fields: \{[\s\S]*?amount: true,[\s\S]*?unit: true,[\s\S]*?\}[\s\S]*?<dt>amount<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{entity\.amount\}[\s\S]*?<span>\{entity\.unit == null \? '' : ` \$\{entity\.unit\}`\}<\/span>/
	)
	assert.match(
		renderGeneratedFile(cashuWalletTimestampView),
		/fields: \{[\s\S]*?balance: true,[\s\S]*?\$walletState: \{[\s\S]*?unit: true,[\s\S]*?\}[\s\S]*?<dt>balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balance\}[\s\S]*?<span>\{selection\.entitySelector\.\$walletState\.unit == null/
	)
	assert.match(
		renderGeneratedFile(assetSupplyView),
		/fields: \{[\s\S]*?totalSupply: true,[\s\S]*?\$assetInstance: \{[\s\S]*?decimals: true,[\s\S]*?symbol: true,[\s\S]*?\}[\s\S]*?<dt>total supply<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{totalSupply\}[\s\S]*?decimalPlaces=\{selection\.entitySelector\.\$assetInstance\.decimals\}[\s\S]*?<span>\{selection\.entitySelector\.\$assetInstance\.symbol == null/
	)
	assert.doesNotMatch(renderGeneratedFile(assetClassView), /href=\{String\(maturityMs\)\}/)
	assert.match(
		renderGeneratedFile(evmBalanceTimestampView),
		/fields: \{[\s\S]*?balance: true,[\s\S]*?\$actorCoin: \{[\s\S]*?decimals: true,[\s\S]*?symbol: true,[\s\S]*?\}[\s\S]*?<dt>Balance<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{balance\}[\s\S]*?decimalPlaces=\{selection\.entitySelector\.\$actorCoin\.decimals\}[\s\S]*?<span>\{selection\.entitySelector\.\$actorCoin\.symbol == null/
	)
	assert.match(
		renderGeneratedFile(algorandAssetTimestampView),
		/fields: \{[\s\S]*?total: true,[\s\S]*?decimals: true,[\s\S]*?unitName: true,[\s\S]*?\}[\s\S]*?<dt>total<\/dt>[\s\S]*?<NumberValue[\s\S]*?value=\{total\}[\s\S]*?decimalPlaces=\{entity\.decimals\}[\s\S]*?<span>\{entity\.unitName == null/
	)
	assert.match(renderGeneratedFile(evmCoinInstanceView), /\{#snippet children\(symbol\)\}\s*\{symbol\}/)
	assert.doesNotMatch(renderGeneratedFile(evmCoinInstanceView), /\{String\((?:symbol|coinId|decimals)\)\}/)
	assert.match(renderGeneratedFile(networkTimestampView), /<Timestamp timestamp=\{selection\.entitySelector\.timestampMs\} \/>/)
	assert.doesNotMatch(renderGeneratedFile(networkTimestampView), /Timestamp timestamp=\{Number\(/)
})

test('requires declared display expressions for every non-scalar value type', () => {
	const arweaveApp = structuredClone(app)
	const arweaveTransaction = arweaveApp.schema.entities.find((entity) => entity.entityType === EntityType.ArweaveTransaction)
	assert.ok(arweaveTransaction?.views.singular?.summary)
	arweaveTransaction.views.singular.summary.value = ['tags']
	assert.throws(
		() => compileApp(arweaveApp),
		/ArweaveTransaction\.tags needs a valueType displayExpression/
	)

	const agentCardApp = structuredClone(app)
	const agentCardSnapshot = agentCardApp.schema.entities.find((entity) => entity.entityType === EntityType.A2aAgentCard_Snapshot)
	assert.ok(agentCardSnapshot?.views.singular?.summary)
	agentCardSnapshot.views.singular.summary.value = ['capabilities']
	assert.throws(
		() => compileApp(agentCardApp),
		/A2aAgentCard_Snapshot\.capabilities needs a valueType displayExpression/
	)

	const arweaveTransactionView = generatedSource('src/views/ArweaveTransactionView.svelte')
	assert.doesNotMatch(arweaveTransactionView, /<dt>tags<\/dt>/)
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	assert.equal((generatorSource.match(/valueTypeTypeRequiresDisplayExpression\(/g) ?? []).length, 2)
	assert.doesNotMatch(generatorSource, /valueTypeTypeIsStructured/)
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

test('renders source-backed social hub lists as carousel cards', () => {
	for (const [viewPath, listName] of [
		['src/views/RssNetworkView.svelte', 'RssFeedsView'],
		['src/views/XNetworkView.svelte', 'XUsersView'],
		['src/views/XNetworkView.svelte', 'XPostsView'],
	] as const) {
		const generatedView = baselineCompiledApp.generatedFiles.find(({ path }) => path === viewPath)

		assert.ok(generatedView)
		const list = renderGeneratedFile(generatedView).match(new RegExp(`<${listName}[\\s\\S]*?\\n\\s*/>`))?.[0] ?? ''
		assert.match(
			list,
			new RegExp(`<${listName}[\\s\\S]*?collapsible=\\{false\\}[\\s\\S]*?title=\\{label\\}`)
		)
		assert.doesNotMatch(
			list,
			/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m
		)
	}
	const rssFeedsView = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/views/RssFeedsView.svelte')
	assert.ok(rssFeedsView)
	assert.match(renderGeneratedFile(rssFeedsView), /EntityListViewProps<EntityType\.RssFeed>/)
	assert.doesNotMatch(renderGeneratedFile(rssFeedsView), /RegisteredEntityProxyEntitiesResource/)
	assert.match(renderGeneratedFile(rssFeedsView), /import EntitiesList, \{ type EntityListViewProps \} from '\$\/components\/EntitiesList\.svelte'/)
	assert.match(renderGeneratedFile(rssFeedsView), /}: EntityListViewProps<EntityType\.RssFeed> = \$props\(\)/)
	assert.doesNotMatch(renderGeneratedFile(rssFeedsView), /ComponentProps<typeof EntitiesList>|Pick<[\s\S]*?ComponentProps<typeof EntitiesList>/)
})

test('keeps entity-list selection props distinct from projection boundary props', () => {
	const nostrRelayView = baselineCompiledApp.generatedFiles.find(({ path }) => (
		path === 'src/views/NostrRelayView.svelte'
	))

	assert.ok(nostrRelayView)
	const renderedNostrRelayView = renderGeneratedFile(nostrRelayView)
	assert.match(
		renderedNostrRelayView,
		/<NostrNotesView[\s\S]*?selection=\{selection\.\$\$notes\}/
	)
	assert.doesNotMatch(renderedNostrRelayView, /const nostrRelayLiveNotesResource/)
	assert.doesNotMatch(renderedNostrRelayView, /<NostrNotesView[\s\S]{0,500}?\bprojection=\{/)
	assert.doesNotMatch(
		baselineCompiledApp.generatedFiles
			.filter(({ path }) => /\/[^/]+sView\.svelte$/.test(path))
			.map(renderGeneratedFile)
			.join('\n'),
		/<[A-Za-z0-9_]+sView[\s\S]{0,160}?\bprojection=\{/
	)
})

test('does not emit one-use Svelte const aliases', () => {
	for (const generatedView of baselineCompiledApp.generatedFiles.filter(({ path }) => (
		path.startsWith('src/views/')
		&& path.endsWith('.svelte')
	))) {
		const source = renderGeneratedFile(generatedView)
		for (const match of source.matchAll(/\{@const ([A-Za-z][A-Za-z0-9]*) =/g)) {
			const name = match[1] ?? ''
			assert.ok(
				(source.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length > 2,
				`${generatedView.path} emits one-use {@const ${name}}`
			)
		}
	}
})

test('emits declarative Network enrichment and stable carousel article boundaries', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const aptosAccount = app.schema.entities.find((entity) => entity.entityType === EntityType.AptosAccount)
	const generatedFiles = baselineCompiledApp.generatedFiles
	const networkView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	const coinView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CoinView.svelte')
	const marketsView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/MarketsView.svelte')
	const evmBlocksView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmBlocksView.svelte')
	const xrplLedgersView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/XrplLedgersView.svelte')
	const urlsView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UrlsView.svelte')
	const evmUserOperationView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmUserOperationView.svelte')
	const accountView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/AccountView.svelte')
	const blockheadAccountView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadAccountView.svelte')
	const blockheadAccountBalancesView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadAccountsBalancesView.svelte')
	const blockheadAccountTransactionsView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BlockheadAccountsTransactionsView.svelte')
	const blockheadAccountBalancesPage = generatedFiles.find((generatedFile) => generatedFile.path === 'src/routes/~/accounts/balances/+page.svelte')
	const blockheadAccountTransactionsPage = generatedFiles.find((generatedFile) => generatedFile.path === 'src/routes/~/accounts/transactions/+page.svelte')
	const networksPage = generatedFiles.find((generatedFile) => generatedFile.path === 'src/routes/(explore)/networks/+page.svelte')
	const collapsibleTabs = readFileSync(path.join(root, 'src/components/CollapsibleTabs.svelte'), 'utf8')

	assert.ok(network?.views.singular?.pending)
	assert.ok(aptosAccount)
	assert.ok(networkView)
	assert.ok(coinView)
	assert.ok(marketsView)
	assert.ok(evmBlocksView)
	assert.ok(xrplLedgersView)
	assert.ok(urlsView)
	assert.ok(evmUserOperationView)
	assert.ok(accountView)
	assert.ok(blockheadAccountView)
	assert.equal(blockheadAccountBalancesView, undefined)
	assert.equal(blockheadAccountTransactionsView, undefined)
	assert.ok(blockheadAccountBalancesPage)
	assert.ok(blockheadAccountTransactionsPage)
	assert.ok(networksPage)
	for (const [page, route] of [
		[blockheadAccountBalancesPage, '/~/accounts/balances'],
		[blockheadAccountTransactionsPage, '/~/accounts/transactions'],
	] as const) {
		const source = renderGeneratedFile(page)
		assert.match(source, new RegExp(`const collectionHref = resolve\\('${route}'\\)`))
		assert.equal((source.match(new RegExp(`resolve\\('${route}'\\)`, 'g')) ?? []).length, 1)
		assert.doesNotMatch(source, new RegExp(`href=\\{resolve\\('${route}'\\)\\}`))
	}
	assert.match(collapsibleTabs, /\{#each sections as section \(section\.id\)\}[\s\S]*?\{@const Marker = markerSnippetForSection\(section\)\}[\s\S]*?\{@render Marker\([\s\S]*?MarkerContent/)
	assert.match(collapsibleTabs, /\{#each sections as section \(section\.id\)\}[\s\S]*?\{@const Section = sectionSnippetForSection\(section\)\}[\s\S]*?\{#if section\.ownsSection\}[\s\S]*?\{@render Section\(/)
	assert.match(collapsibleTabs, /sections\[0\]\.ownsSection \? undefined : sections\[0\]\.id/)
	assert.doesNotMatch(collapsibleTabs, /\{#if Section\}|loadedSectionIds|Section &&|section\.id === activeSectionId \|\|/)
	assert.doesNotMatch(collapsibleTabs, /availableSection|visibleSection|sectionPresence|\$effect/)

	const renderedNetworkView = renderGeneratedFile(networkView)
	const renderedCoinView = renderGeneratedFile(coinView)
	const renderedMarketsView = renderGeneratedFile(marketsView)
	const pendingNetworkEntity = renderedNetworkView.slice(
		renderedNetworkView.indexOf('const pendingEntity = $derived('),
		renderedNetworkView.indexOf('const voltaireJsonRpcSources = $derived(')
	)
	assert.match(renderedCoinView, /SectionCatalogUsdMarket[\s\S]*?<MarketsView[\s\S]*?selection=\{[\s\S]*?selection\s*\.\$\$marketsWithCoinAsBase\([\s\S]*?Source\.Constants_Internal[\s\S]*?limit: 1/)
	assert.match(renderedCoinView, /SectionMarketsWithCoinAsBase[\s\S]*?\$\$marketsWithCoinAsBase\(\{[\s\S]*?limit: 16/)
	assert.match(renderedCoinView, /SectionMarketsWithCoinAsQuote[\s\S]*?\$\$marketsWithCoinAsQuote\(\{[\s\S]*?limit: 16/)
	assert.doesNotMatch(renderedCoinView, /catalogUsdMarketResource/)
	assert.doesNotMatch(renderedCoinView, /seededCoinSpotUsdMarkets|catalogUsdMarket/)
	assert.doesNotMatch(renderedMarketsView, /limit: 8192/)
	const networkRootQuery = renderedNetworkView.slice(
		renderedNetworkView.indexOf('const network = $derived('),
		renderedNetworkView.indexOf('const titleFallback = $derived(')
	)

	assert.doesNotMatch(renderedNetworkView, /import .*BeaconConsensus\.ts|beaconRestBaseByExecutionChainId/)
	assert.match(renderedNetworkView, /import \{[^}]*networkByCaip2, networkBySlug[^}]*\} from '\$\/constants\/Network\.ts'/)
	assert.match(renderedNetworkView, /import \{ networkApplicableSources \} from '\$\/sources\/index\.ts'/)
	assert.doesNotMatch(renderedNetworkView, /SourceTargetKind|const networkApplicableSources/)
	assert.doesNotMatch(renderedNetworkView, /\{#if entity\.executionModels\.values\.includes\('Evm'\)\}/)
	assert.match(pendingNetworkEntity, /networkByCaip2\[caip2Key\][\s\S]*?networkBySlug\[base\.slug\]/)
	assert.doesNotMatch(pendingNetworkEntity, /beacon|consensusProtocol|consensusEndpoints/)
	assert.doesNotMatch(networkRootQuery, /\$networkStack|\$icon|\$\$nativeAssets|\$\$blockExplorerUrls|\$\$faucetUrls/)
	assert.match(renderedNetworkView, /\{#snippet Icon\(\)\}\s*<IconComponent \/>/)
	assert.match(renderedNetworkView, /\{#snippet Title\(\)\}\s*<ResourceBoundary resource=\{network\}>[\s\S]*?entity\.name/)
	assert.match(renderedNetworkView, /\{#snippet Value\(\)\}\s*<ResourceBoundary resource=\{network\}>[\s\S]*?entity\.caip2/)
	assert.match(renderedNetworkView, /MarkerEvmAssetsNativeCoin[\s\S]*?<ResourceBoundary[\s\S]*?\{#snippet children\(_resolved\)\}[\s\S]*?\{@render Content\(\)\}/)
	assert.match(
		renderedNetworkView,
		/\.\.\.\(\s*[A-Za-z0-9]+Sources\.length > 0 \?\s*\[\s*\{[\s\S]*?\},\s*\]\s*:\s*\[\]\s*\)/
	)
	assert.doesNotMatch(renderedNetworkView, /\{#snippet (?:Marker|Section)[\s\S]{0,200}?\{#if [A-Za-z0-9]+Resource != null\}/)
	const nativeCoinCarousel = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet MarkerEvmAssetsNativeCoin'),
		renderedNetworkView.indexOf('{#snippet MarkerEvmAssetsNativeInstance')
	)
	assert.match(nativeCoinCarousel, /\{#snippet children\(_resolved\)\}[\s\S]*?\{#if _resolved != null\}[\s\S]*?\{@render Content\(\)[\s\S]*?\{\/if\}/)
	assert.match(nativeCoinCarousel, /\{#snippet children\(coin\)\}[\s\S]*?\{#if coin != null\}[\s\S]*?<section[\s\S]*?<article[\s\S]*?data-card[\s\S]*?data-scroll-container[\s\S]*?layout=\{EntityLayout\.SummaryInline\}/)
	assert.doesNotMatch(nativeCoinCarousel, /No native coin available/)
	assert.match(renderedNetworkView, /SectionEvmConsensusEndpoints[\s\S]*?<ResourceBoundary[\s\S]*?\{#snippet children\(consensusEndpointsField\)\}[\s\S]*?Consensus endpoints are not listed for this network\.[\s\S]*?<ul data-column="gap-2" data-section-state="resolved-nonempty">[\s\S]*?\{#each consensusEndpointsField\.values as consensusEndpoint/)
	assert.match(renderedNetworkView, /href=\{consensusEndpoint\.restBaseUrl\}/)
	assert.doesNotMatch(renderedNetworkView, /restBaseUrlValue|String\(consensusEndpoint\.restBaseUrl\)|\{#if consensusEndpoint\.restBaseUrl != null\}/)
	assert.match(renderedNetworkView, /import ProjectionBoundary from '\$\/components\/ProjectionBoundary\.svelte'/)
	const evmTopologyCarouselIndex = renderedNetworkView.indexOf("id={viewDomId + '-carousel-evm-network-topology'}")
	const evmDetailsCarousels = renderedNetworkView.slice(
		renderedNetworkView.lastIndexOf(
			"{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}",
			evmTopologyCarouselIndex
		),
		renderedNetworkView.indexOf(
			"{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('CosmosSdk')}",
			evmTopologyCarouselIndex
		)
	)
	assert.equal(evmDetailsCarousels.match(/resource=\{selection\.Evm\}/g)?.length, 1)
	assert.equal(evmDetailsCarousels.match(/<ProjectionBoundary/g)?.length, 2)
	assert.equal(evmDetailsCarousels.match(/\{#snippet Applicable\(projection\)\}/g)?.length, 2)
	assert.match(evmDetailsCarousels, /<HeadingComponent>Topology<\/HeadingComponent>[\s\S]*?<HeadingComponent>Execution<\/HeadingComponent>[\s\S]*?resource=\{projection\.EthereumBeacon\}[\s\S]*?<HeadingComponent>Consensus and block production<\/HeadingComponent>[\s\S]*?<HeadingComponent>Contracts and accounts<\/HeadingComponent>[\s\S]*?<HeadingComponent>Assets<\/HeadingComponent>/)
	assert.doesNotMatch(evmDetailsCarousels, /resource=\{selection\.Evm\.EthereumBeacon\}/)
	assert.doesNotMatch(renderedNetworkView, /<ResourceBoundary[\s\S]{0,300}?<Projection projection=\{projectionValue\}>/)
	assert.doesNotMatch(renderedNetworkView, /\{#snippet NotApplicable\(/)
	assert.doesNotMatch(renderedNetworkView, /\{#snippet (?:Blocked|Unsupported)\(\)\}|data-section-state="projection-(?:blocked|unsupported)"/)
	assert.match(renderedNetworkView, /\.\.\.\(\s*voltaireJsonRpcSources\.length > 0 \?\s*\[\s*\{[\s\S]*?\},\s*\]\s*:\s*\[\]\s*\)[\s\S]*?SectionEvmExecutionBlocks/)
	assert.doesNotMatch(renderedNetworkView, /MarkerEvmExecutionBlocks/)
	assert.doesNotMatch(renderedNetworkView, /CarouselSectionBoundary/)
	assert.match(renderedNetworkView, /SectionEvmExecutionBlocks[\s\S]*?<EvmBlocksView[\s\S]*?\/>/)
	const executionBlocksCarousel = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionBlocks'),
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionTransactions')
	)
	assert.match(
		executionBlocksCarousel,
		/SectionEvmExecutionBlocks[\s\S]*?<EvmBlocksView[\s\S]*?selection=\{[\s\S]*?projection[\s\S]*?\.\$\$blocks\(\{[\s\S]*?sources: voltaireJsonRpcSources/
	)
	assert.match(
		renderedNetworkView,
		/\{@const ([A-Za-z0-9]+Sources) = networkApplicableSources\([\s\S]*?\)\}[\s\S]*?(?:selection|[A-Za-z0-9]+Projection)[\s\S]*?sources: \1/
	)
	assert.doesNotMatch(renderedNetworkView, /Sources\.length === 0 \? undefined : (?:selection|projection)/)
	assert.match(renderedNetworkView, /Consensus endpoints are not listed for this network\.|emptyText='No blocks available\.'/)
	assert.doesNotMatch(renderedNetworkView, /\{#if detailsOpen\}/)
	assert.doesNotMatch(renderedNetworkView, /\{:else if pendingEntity\./)
	for (const [collapsibleTabs] of renderedNetworkView.matchAll(/<CollapsibleTabs[\s\S]*?>/g))
		assert.doesNotMatch(collapsibleTabs, /networkApplicableSources/)
	const executionBlocksSection = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionBlocks'),
		renderedNetworkView.indexOf('{#snippet SectionEvmExecutionTransactions')
	)
	assert.doesNotMatch(executionBlocksSection, /\{#if (?:open|!open)|\{#if [^}]*\bopen\b/)
	assert.doesNotMatch(executionBlocksSection, /\{#snippet (?:Pending|Failed)/)
	assert.doesNotMatch(executionBlocksSection.match(/<EvmBlocksView[\s\S]*?\n\s*\/>/)?.[0] ?? '', /^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m)
	assert.doesNotMatch(executionBlocksSection, /<section/)
	assert.match(renderGeneratedFile(evmBlocksView), /<EntitiesList[\s\S]*?resource=\{/)
	assert.match(renderedNetworkView, /<XrplLedgersView[\s\S]*?collapsible=\{false\}/)
	assert.doesNotMatch(renderedNetworkView, /CollapsibleProps=\{\{ canToggle: false \}\}/)
	assert.doesNotMatch(renderedNetworkView, /count: true/)
	assert.match(renderGeneratedFile(xrplLedgersView), /<EntitiesList[\s\S]*?resource=\{/)
	assert.doesNotMatch(renderGeneratedFile(xrplLedgersView), /getKey=/)
	assert.doesNotMatch(renderGeneratedFile(xrplLedgersView), /getResourceItems=/)
	assert.doesNotMatch(renderGeneratedFile(xrplLedgersView), /\{#if open \|\| !collapsible\}|\{#snippet Pending\(\)\}/)
	assert.match(
		renderGeneratedFile(urlsView),
		/href=\{[\s\S]*?resolve\([\s\S]*?'\/\(explore\)\/url\/\[url=absoluteUrl\]',[\s\S]*?url: encodeURIComponent\(urlSelector\.url\),/
	)
	assert.doesNotMatch(renderGeneratedFile(urlsView), /urlHrefFields/)
	assert.doesNotMatch(renderGeneratedFile(networksPage), /^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m)
	assert.match(renderGeneratedFile(networksPage), /\.\$\$networks\(\{[\s\S]*?Source\.Constants_Internal/)
	assert.match(
		renderGeneratedFile(accountView),
		/title=\{title \?\? \(`\$\{selection\.entitySelector\.caip10\.namespace\}/
	)
	assert.match(
		renderGeneratedFile(accountView),
		/`\$\{selection\.entitySelector\.caip10\.namespace\}:\$\{selection\.entitySelector\.caip10\.reference\}:\$\{selection\.entitySelector\.caip10\.accountAddress\}`/
	)
	assert.doesNotMatch(renderGeneratedFile(accountView), /\bpendingEntity\b/)
	assert.doesNotMatch(renderGeneratedFile(accountView), /String\(\(`[^`]+`\) \?\? ''\)/)
	assert.doesNotMatch(renderedNetworkView, /\?\? \(consensusProtocol\) \?\?/)
	for (const generatedPath of [
		'src/views/CardanoNetwork_TimestampView.svelte',
		'src/views/TonNetwork_TimestampView.svelte',
		'src/views/TronBlockView.svelte',
		'src/views/TronNetwork_TimestampView.svelte',
	]) {
		const generatedTimestampView = generatedFiles.find((generatedFile) => generatedFile.path === generatedPath)
		assert.ok(generatedTimestampView)
		assert.match(
			renderGeneratedFile(generatedTimestampView),
			/import Timestamp from '\$\/components\/Timestamp\.svelte'/
		)
	}
	const bittensorNeuronView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BittensorNeuronView.svelte')
	assert.ok(bittensorNeuronView)
	assert.match(
		renderGeneratedFile(bittensorNeuronView),
		/selection=\{select\(EntityType\.BittensorSubnet, selection\.entitySelector\.\$subnet\)\}/
	)
	assert.doesNotMatch(
		renderGeneratedFile(bittensorNeuronView),
		/prefetched\.\$subnet\[EntityMetaKey\.Selector\]/
	)
	const coinBridgeCapabilityView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CoinBridgeCapabilityView.svelte')
	const coinBridgeCapabilitiesView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CoinBridgeCapabilitiesView.svelte')
	const coinBridgeCapabilityPage = generatedFiles.find((generatedFile) => generatedFile.path.endsWith('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]/+page.svelte'))
	assert.ok(coinBridgeCapabilityView)
	assert.ok(coinBridgeCapabilitiesView)
	assert.ok(coinBridgeCapabilityPage)
	assert.match(
		renderGeneratedFile(coinBridgeCapabilityView),
		/href === undefined \?[\s\S]*?resolve\([\s\S]*?href \?\? undefined/
	)
	assert.match(
		renderGeneratedFile(coinBridgeCapabilityView),
		/const fromInstance = \$derived\(selection\.entitySelector\.\$fromInstance\)[\s\S]*?const toInstance = \$derived\(selection\.entitySelector\.\$toInstance\)[\s\S]*?'caip2' in fromInstance\.\$network[\s\S]*?'caip2' in toInstance\.\$network/
	)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityView), /caip2\.reference != null/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityView), /href \?\? \(pendingEntity/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilitiesView), /coinBridgeCapabilityHrefFields/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityView), /String\('native' \?\? ''\)/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityView), /String\(\(/)
	assert.match(
		renderGeneratedFile(coinBridgeCapabilityView),
		/type === 'NativeCurrency' \? 'native' : fromInstance\.\$contract\.address/
	)
	assert.match(renderGeneratedFile(coinBridgeCapabilityView), /fromInstance\.type === 'NativeCurrency' \|\| '\$contract' in fromInstance/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityView), /\? true :/)
	assert.match(renderGeneratedFile(coinBridgeCapabilityPage), /<title>\{pageSelection\.entitySelector\.toolKey/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityPage), /\.\.\.pageSelection\.entitySelector, \.\.\.pageSelection\.entity/)
	assert.doesNotMatch(renderGeneratedFile(coinBridgeCapabilityPage), /\.\.\.\{\s*\$fromInstance:/)
	for (const generatedPath of [
		'src/views/BeaconCommitteeView.svelte',
		'src/views/BeaconSyncCommitteeView.svelte',
	]) {
		const generatedCommitteeView = generatedFiles.find((generatedFile) => generatedFile.path === generatedPath)
		assert.ok(generatedCommitteeView)
		assert.match(
			renderGeneratedFile(generatedCommitteeView),
			/validatorIndices\.join\(', '\)/
		)
		assert.doesNotMatch(renderGeneratedFile(generatedCommitteeView), /<NumberValue\s+value=\{validatorIndices\}/)
	}
	const beaconEpochView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/BeaconEpochView.svelte')
	assert.ok(beaconEpochView)
	for (const label of [
		'Start slot',
		'End slot',
		'Attester slashings',
		'Proposer slashings',
	])
		assert.match(renderGeneratedFile(beaconEpochView), new RegExp(`<dt>${label}</dt>`))
	assert.doesNotMatch(renderGeneratedFile(beaconEpochView), /Slot range|resolvedEntity/)
	assert.match(renderGeneratedFile(beaconEpochView), /\{@const attesterSlashingsCount = entity\.attesterSlashingsCount\}/)
	assert.match(renderGeneratedFile(beaconEpochView), /\{@const proposerSlashingsCount = entity\.proposerSlashingsCount\}/)
	assert.doesNotMatch(
		renderGeneratedFile(blockheadAccountView),
		/select\(EntityType\.Account, selection\.entitySelector\.\$account, \{\s*sources: \[\s*Source\.Local_Internal/
	)
	const renderedBlockheadAccountBalancesPage = renderGeneratedFile(blockheadAccountBalancesPage)
	const renderedBlockheadAccountTransactionsPage = renderGeneratedFile(blockheadAccountTransactionsPage)
	assert.deepEqual(
		Object.fromEntries(aptosAccount.fields
			.filter((field) => field.name.startsWith('$$'))
			.map((field) => [field.name, field.defaultSources])),
		{
			'$$timestamps': [Source.AptosFullnode_Rest],
			'$$balances': [Source.AptosIndexer_Graphql],
			'$$resources': [Source.AptosFullnode_Rest],
			'$$transactions': [Source.AptosIndexer_Graphql],
		}
	)
	assert.match(
		renderedBlockheadAccountTransactionsPage,
		/collectionRoot0Selection\.Aptos\.\$account\s*\.\$\$transactions\(\{\s*sources: \[\s*Source\.AptosIndexer_Graphql,\s*Source\.AptosFullnode_Rest,/
	)
	for (const [
		renderedPage,
		components,
	] of [
		[
			renderedBlockheadAccountBalancesPage,
				[
					'EvmNetworkActorCoinBalancesView',
					'AptosCoinBalance_TimestampsView',
					'CardanoAddress_TimestampsView',
					'PolkadotAccount_TimestampsView',
					'SolanaAccount_TimestampsView',
					'TronAccount_TimestampsView',
					'TronAccountTokenBalance_TimestampsView',
					'TonAccount_TimestampsView',
					'UtxoAddress_TimestampsView',
			],
		],
		[
			renderedBlockheadAccountTransactionsPage,
			[
				'EvmTransactionsView',
				'AptosTransactionsView',
				'CardanoTransactionsView',
				'TronTransactionsView',
				'UtxoTransactionsView',
			],
		],
		] as const) {
			assert.doesNotMatch(renderedPage, /EntityProxyPath/)
			assert.doesNotMatch(renderedPage, /BlockheadAccounts(?:Balances|Transactions)View|relationshipSurface/)
			assert.match(
				renderedPage,
				/const collectionRoot0Selection = \$derived\(select\(EntityType\._Global, \{\s*scope: '\$\$blockheadAccounts',\s*\}\)\.\$\$blockheadAccounts\.\$account\)/
			)
			assert.doesNotMatch(renderedPage, /collectionRoot0Selection[\s\S]*?Source\.Local_Internal/)
			assert.match(
				renderedPage,
				/collectionRoot0Selection\s*\.Evm\s*\.\$account\s*\.\$\$(?:ownedCoins|transactions)\(\{/
			)
		assert.doesNotMatch(renderedPage, /<ProjectionBoundary/)
		assert.doesNotMatch(renderedPage, /countResource=/)
		assert.match(renderedPage, /<ResourceBoundary resource=\{[\s\S]*?\{#snippet children\(entities\)\}[\s\S]*?\{#if entities\.values\.length > 0\}/)
		for (const component of components)
			assert.doesNotMatch(
				renderedPage.match(new RegExp(`<${component}[\\s\\S]*?\\n\\s*/>`))?.[0] ?? '',
				/^\s+data-column-item="flexible"\n\s+data-card\n\s+data-scroll-container$/m
			)
	}
	const renderedEvmUserOperationView = renderGeneratedFile(evmUserOperationView)
	for (const tab of ['participants', 'gas-fees', 'payloads'])
		assert.match(renderedEvmUserOperationView, new RegExp(`id=\\{\\\`\\$\\{id\\}-${tab}-fields\\\`\\} data-column-item="flexible" data-card data-scroll-container`))
	assert.match(renderedNetworkView, /<dt>Name<\/dt>[\s\S]*?<dt>Namespace<\/dt>[\s\S]*?<dt>Ledger models<\/dt>[\s\S]*?<dt>Execution models<\/dt>[\s\S]*?<dt>Network stack<\/dt>[\s\S]*?<dt>Environment<\/dt>[\s\S]*?<dt>CAIP-2<\/dt>/)
	const networkLatest = renderedNetworkView.slice(
		renderedNetworkView.indexOf("<dl class='network-summary-head'"),
		renderedNetworkView.indexOf('<dl data-column-item="center">')
	)
	assert.match(networkLatest, /<dt>Upgrade<\/dt>[\s\S]*?<dt>Block<\/dt>[\s\S]*?<dt>Fee market<\/dt>[\s\S]*?<dt>Mempool<\/dt>[\s\S]*?<dt>Epoch<\/dt>[\s\S]*?<dt>Slot<\/dt>/)
	assert.equal(networkLatest.match(/pendingEntity\.executionModels != null && pendingEntity\.executionModels\.values\.includes\('Evm'\)/g)?.length, 1)
	assert.equal(networkLatest.match(/resource=\{selection\.Evm\}/g)?.length, 1)
	assert.equal(networkLatest.match(/<ResourceBoundary/g)?.length, 6)
	assert.match(networkLatest, /\{#snippet Applicable\(projection\)\}[\s\S]*?<dt>Mempool<\/dt>[\s\S]*?\{#if pendingEntity\.consensusProtocol === 'EthereumBeacon'\}[\s\S]*?resource=\{projection\.EthereumBeacon\}[\s\S]*?<dt>Epoch<\/dt>[\s\S]*?selection\.Evm\s*\.\$\$beaconEpochs\([\s\S]*?<dt>Slot<\/dt>[\s\S]*?selection\.Evm\s*\.\$\$beaconSlots\(/)
	const ethereumBeaconCarousel = renderedNetworkView.slice(
		renderedNetworkView.indexOf('{#snippet SectionEvmConsensusUpgrades'),
		renderedNetworkView.indexOf('{#snippet SectionEvmContractsPrecompiles')
	)
	assert.match(renderedNetworkView, /\{@const [A-Za-z0-9]+Resource = [\s\S]*?selection\.Evm\s*\.\$\$consensusUpgrades\(/)
	assert.match(
		renderedNetworkView,
		/resource=\{\s*selection\.Evm\s*\.consensusEndpoints\(\{\s*sources: beaconRestSources,\s*\}\)\s*\}/
	)
	assert.match(renderedNetworkView, /selection=\{\s*projection\s*\.\$\$upgrades\s*\}/)
	assert.doesNotMatch(renderedNetworkView, /constantsInternalSources/)
	assert.doesNotMatch(ethereumBeaconCarousel, /projection\.Evm/)
	assert.doesNotMatch(
		ethereumBeaconCarousel,
		/selection\.Evm\.consensusEndpoints\(\{[\s\S]*?fields:\s*\{\s*Evm:/
	)
	assert.doesNotMatch(renderedNetworkView, /carousel-evm-data-availability|selection\.Evm\.\$\$blobs\(/)
	assert.match(renderedNetworkView, /<dt>Native currency<\/dt>[\s\S]*?<dt>Native coin<\/dt>[\s\S]*?<dt>Parent<\/dt>[\s\S]*?<dt>Mainnet<\/dt>/)
	assert.ok(renderedNetworkView.indexOf('SectionNetworkAssetsNativeAssets') < renderedNetworkView.indexOf('SectionEvmAssetsNativeCoin'))
	assert.ok(renderedNetworkView.indexOf('SectionEvmAssetsNativeCoin') < renderedNetworkView.indexOf('SectionEvmAssetsNativeInstance'))
	const pendingNetworkFacets = [...network.facets]
	const networkCarousels = [...(network.views.singular?.carousels ?? [])]
	for (const facet of pendingNetworkFacets) {
		networkCarousels.push(...(facet.singularView?.carousels ?? []))
		pendingNetworkFacets.push(...(facet.facets ?? []))
	}
	assert.equal(
		[...renderedNetworkView.matchAll(/<CollapsibleTabs\b/g)].length,
		networkCarousels.length
	)
	for (const carousel of networkCarousels) {
		assert.equal(renderedNetworkView.match(new RegExp(`id=\\{viewDomId \\+ '-carousel-${carousel.id}'\\}`, 'g'))?.length, 1, carousel.id)
		assert.ok(renderedNetworkView.includes(`<HeadingComponent>${carousel.label}</HeadingComponent>`), carousel.id)
		for (const section of carousel.sections) {
			const sectionSnippetPattern = new RegExp(
				`\\{#snippet Section${section.id.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`).join('')}\\(`,
				'g'
			)
			assert.equal(renderedNetworkView.match(sectionSnippetPattern)?.length, 1, section.id)
		}
	}
	for (const carouselLabel of [
		'Topology',
		'Execution',
		'Consensus and block production',
		'Contracts and accounts',
		'Assets',
		'Resources',
	])
		assert.notEqual(renderedNetworkView.indexOf(`<HeadingComponent>${carouselLabel}</HeadingComponent>`), -1)
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Topology</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Execution</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Execution</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Consensus and block production</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Consensus and block production</HeadingComponent>') < renderedNetworkView.indexOf('<HeadingComponent>Contracts and accounts</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('-carousel-network-assets') < renderedNetworkView.indexOf('-carousel-network-resources'))
	assert.ok(renderedNetworkView.indexOf('-carousel-network-resources') < renderedNetworkView.indexOf('<HeadingComponent>Topology</HeadingComponent>'))
	assert.ok(renderedNetworkView.indexOf('<HeadingComponent>Contracts and accounts</HeadingComponent>') < renderedNetworkView.indexOf('-carousel-evm-assets'))

	const hederaFacet = network.facets.find((facet) => facet.name === 'Hedera')
	const xrplFacet = network.facets.find((facet) => facet.name === 'Xrpl')
	const tonFacet = network.facets.find((facet) => facet.name === 'Ton')
	const cardanoFacet = network.facets.find((facet) => facet.name === 'Cardano')

	assert.ok(hederaFacet?.singularView)
	assert.ok(xrplFacet?.singularView)
	assert.ok(tonFacet?.singularView)
	assert.ok(cardanoFacet?.singularView)
	assert.deepEqual(
		tonFacet.fields.find((field) => field.name === '$$timestamps')?.defaultSources,
		[Source.TonApi_Rest]
	)
	assert.deepEqual(
		tonFacet.singularView.carousels?.flatMap((carousel) => carousel.sections.map((section) => section.id)),
		['ton-chain-observations']
	)
	assert.deepEqual(
		cardanoFacet.fields
			.filter((field) => field.name.startsWith('$$'))
			.map((field) => [field.name, field.defaultSources]),
		[
			['$$timestamps', [Source.CardanoKoios_Rest]],
			['$$blocks', [Source.CardanoKoios_Rest]],
			['$$transactions', [Source.CardanoKoios_Rest]],
			['$$stakePools', [Source.CardanoKoios_Rest]],
			['$$dReps', [Source.CardanoKoios_Rest]],
			['$$governanceProposals', [Source.CardanoKoios_Rest]],
			['$$assets', [Source.CardanoKoios_Rest]],
			['$$protocolParameterEpochs', [Source.CardanoKoios_Rest]],
			['$$committeeEpochs', [Source.CardanoKoios_Rest]],
		]
	)
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

test('renders cardinality-one carousel references as singular card sections', () => {
	const generatedFiles = compileApp({
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => (
				entity.entityType !== EntityType.Network ?
					entity
				:
					{
						...entity,
						facets: (entity.facets ?? []).map((facet) => (
							facet.name !== 'Evm' ?
								facet
							:
								{
									...facet,
									fields: facet.fields.map((field) => (
										field.name === '$nativeCoin' ?
											{
												...field,
												cardinality: EntityFieldCardinality.One,
											}
										:
											field
									))
								}
						))
					}
			))
		}
	}).generatedFiles
	const networkView = generatedFiles.find((file) => file.path === 'src/views/NetworkView.svelte')
	assert.ok(networkView)
	const nativeCoinSection = renderGeneratedFile(networkView).slice(
		renderGeneratedFile(networkView).indexOf('{#snippet SectionEvmAssetsNativeCoin'),
		renderGeneratedFile(networkView).indexOf('{#snippet SectionEvmAssetsNativeInstance')
	)
	assert.match(nativeCoinSection, /<CoinView[\s\S]*?layout=\{EntityLayout\.SummaryInline\}/)
	assert.doesNotMatch(nativeCoinSection, /<EntitiesList/)
})

test('emits field-existence checks only for schema-optional resolved values', () => {
	let optionalFieldGuardCount = 0
	for (const entity of app.schema.entities) {
		const viewPath = `src/views/${entity.entityType}View.svelte`
		const view = generatedFileByPath.get(viewPath)
		if (view == null)
			continue

		const renderedView = renderGeneratedFile(view)
		for (const match of renderedView.matchAll(
			/\{@const ([A-Za-z_$][\w$]*) = entity\.([A-Za-z_$][\w$]*)\}\s*\{#if \1 != null/g
		)) {
			const field = entity.fields.find((candidate) => candidate.name === match[2])
			assert.equal(
				field?.cardinality,
				EntityFieldCardinality.ZeroOrOne,
				`${viewPath} guards non-optional ${entity.entityType}.${match[2]}`
			)
			optionalFieldGuardCount++
		}

		for (const field of entity.fields.filter((candidate) => (
			candidate.cardinality === EntityFieldCardinality.ZeroOrOne
			&& entity.selectors.every((selector) => selector.fields.includes(candidate.name))
		)))
			assert.doesNotMatch(
				renderedView,
				new RegExp(`${field.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} != null`),
				`${viewPath} guards selector-owned ${entity.entityType}.${field.name}`
			)
	}

	assert.ok(optionalFieldGuardCount > 0)
	assert.doesNotMatch(generatedSource('src/views/NetworkView.svelte'), /pendingEntity\.namespace != null && pendingEntity\.namespace ===/)
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
				assert.ok(
					fieldFacetPath.length <= carousel.projectionPath.length
					&& fieldFacetPath.every((facetName, index) => carousel.projectionPath?.[index] === facetName),
					`${entity.entityType}.${snippetName} must remain at its field owner or a descendant facet`
				)
				if (fieldFacetPath.length === carousel.projectionPath.length && fieldFacetPath.every((facetName, index) => carousel.projectionPath[index] === facetName)) {
					assert.match(snippet, new RegExp(`projection\\.${section.field.at(-1)}`), `${entity.entityType}.${snippetName} must read a current-projection field directly`)
					assert.doesNotMatch(snippet, new RegExp(`selection\\.${section.field.join('\\.')}`), `${entity.entityType}.${snippetName} must not escape its current projection`)
				} else if (fieldFacetPath.length < carousel.projectionPath.length && fieldFacetPath.every((facetName, index) => carousel.projectionPath[index] === facetName)) {
					assert.match(snippet, new RegExp(`selection\\.${section.field.join('\\.')}`), `${entity.entityType}.${snippetName} must retain its ancestor field owner`)
					assert.doesNotMatch(snippet, new RegExp(`projection\\.${fieldFacetPath[0]}`), `${entity.entityType}.${snippetName} must not reinterpret an ancestor facet through the current projection`)
				}
				assert.doesNotMatch(snippet, /<ProjectionBoundary|<Projection projection=|resource=\{selection\.[A-Z][\s\S]*?\{#snippet children\(projectionValue\)/)
			}
		}
	}
})

test('rejects carousel sections owned by incompatible facets', () => {
	const mutatedApp = structuredClone(app)
	const transaction = mutatedApp.schema.entities.find((entity) => entity.entityType === EntityType.EvmTransaction)
	const blobFacet = transaction?.facets?.find((facet) => facet.name === 'Blob')
	const carousel = blobFacet?.singularView?.carousels?.[0]
	assert.ok(carousel)
	carousel.sections[0].field = ['SetCode', '$$authorizations']

	assert.throws(
		() => compileApp(mutatedApp),
		/EvmTransaction carousel evm-tx-blobs section evm-tx-blobs field SetCode\.\$\$authorizations is not owned by carousel facet Blob/
	)
})

test('keeps proposal catalog relationships on explicit Constants authority', () => {
	const global = app.schema.entities.find((entity) => entity.entityType === EntityType._Global)
	const specificationProposalsView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/SpecificationProposalsView.svelte'
	))
	const specificationProposalKindView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/SpecificationProposalKindView.svelte'
	))
	const specificationProposalSourcesFile = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/sources/specificationProposalSources.ts'
	))
	assert.ok(specificationProposalsView)
	assert.ok(specificationProposalKindView)
	assert.ok(specificationProposalSourcesFile)
	assert.deepEqual(
		global?.fields
			.filter((field) => ['$$proposals', '$$specificationRealms', '$$proposalKinds'].includes(field.name))
			.map((field) => field.defaultSources),
		Array.from({ length: 3 }, () => [Source.Constants_Internal])
	)
	assert.match(renderGeneratedFile(specificationProposalsView), /sources: specificationProposalSources\(\{\s*realm: filterRealm,\s*category: filterCategory,\s*\}\)/)
	assert.doesNotMatch(renderGeneratedFile(specificationProposalsView), /selection\.sources \?\?/)
	assert.match(renderGeneratedFile(specificationProposalsView), /import specificationProposalSources from '\$\/sources\/specificationProposalSources\.ts'/)
	assert.match(renderGeneratedFile(specificationProposalsView), /filterRealm\?: RegisteredEntitySelector<EntityType\.SpecificationProposal>\['realm'\]/)
	assert.match(renderGeneratedFile(specificationProposalsView), /filterCategory\?: RegisteredEntitySelector<EntityType\.SpecificationProposal>\['category'\]/)
	assert.doesNotMatch(renderGeneratedFile(specificationProposalsView), /const selectedSources =/)
	assert.match(renderGeneratedFile(specificationProposalKindView), /sources: specificationProposalSources\(\{\s*realm: pendingEntity\.realm,\s*category: pendingEntity\.category,\s*\}\)/)
	assert.match(renderGeneratedFile(specificationProposalKindView), /import specificationProposalSources from '\$\/sources\/specificationProposalSources\.ts'/)
	assert.doesNotMatch(renderGeneratedFile(specificationProposalKindView), /sources: \[\s*Source\.BitcoinBips_Github,[\s\S]*?Source\.ZcashZips_Github/)
	assert.doesNotMatch(renderGeneratedFile(specificationProposalKindView), /String\([^)]*\)\]\.join\(':'\)/)
	const renderedSpecificationProposalSources = renderGeneratedFile(specificationProposalSourcesFile)
	assert.match(renderedSpecificationProposalSources, /type Case = typeof cases\[number\]/)
	assert.match(renderedSpecificationProposalSources, /realm\?: Case\[0\]/)
	assert.match(renderedSpecificationProposalSources, /category\?: Case\[1\]\[number\]/)
	assert.equal((renderedSpecificationProposalSources.match(/Source\.EthereumEips_Github/g) ?? []).length, 1)
	assert.doesNotMatch(renderedSpecificationProposalSources, /if \(realm ===/)
	assert.deepEqual(specificationProposalSources({ realm: 'Ethereum', category: 'Eip' }), [Source.EthereumEips_Github])
	assert.deepEqual(specificationProposalSources({ realm: 'Ethereum', category: 'Erc' }), [Source.EthereumEips_Github])
	const defaultSpecificationProposalSources = specificationProposalSources({})
	assert.equal(defaultSpecificationProposalSources.length, 15)
	assert.equal(new Set(defaultSpecificationProposalSources).size, 15)
	assert.notEqual(defaultSpecificationProposalSources, specificationProposalSources({}))
})

test('renders entity references without scalar display formatting inferred from their names', () => {
	const accountTimestampView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/AlgorandAccount_TimestampView.svelte'
	))

	assert.ok(accountTimestampView)
	const source = renderGeneratedFile(accountTimestampView)
	assert.match(source, /<AlgorandAccountView[\s\S]*?selection=\{select\(EntityType\.AlgorandAccount, selection\.entitySelector\.\$account\)\}/)
	assert.doesNotMatch(source, /TruncatedValue/)
})

test('renders every generated entity-list item through a card-backed singular summary', () => {
	const entityView = readFileSync(path.join(root, 'src/components/EntityView.svelte'), 'utf8')
	const generatedViews = baselineCompiledApp.generatedFiles
		.filter((generatedFile) => (
			generatedFile.kind === 'svelte'
			&& generatedFile.path.startsWith('src/views/')
		))
	const pluralViews = generatedViews
		.filter((generatedFile) => (
			generatedFile.ast.markup?.find((line) => line.trim() !== '')?.trim() === '<EntitiesList'
		))
		.map((generatedFile) => ({
			path: generatedFile.path,
			lines: generatedFile.ast.markup ?? [],
		}))

	assert.ok(pluralViews.length > 0)
	for (const pluralView of pluralViews) {
		assert.equal(pluralView.lines.filter((line) => line.includes('<EntitiesList')).length, 1, pluralView.path)
		const itemSnippetIndex = pluralView.lines.findIndex((line) => line.includes('{#snippet Item'))
		const rowEntityViewIndex = pluralView.lines.findIndex((line, index) => (
			index > itemSnippetIndex
			&& line.trim() === '<EntityView'
		))
		const rowEntityViewEndIndex = pluralView.lines.findIndex((line, index) => (
			index > rowEntityViewIndex
			&& (
				line.trim() === '>'
				|| line.trim() === '/>'
			)
		))
		assert.ok(itemSnippetIndex >= 0, pluralView.path)
		assert.ok(rowEntityViewIndex > itemSnippetIndex, pluralView.path)
		assert.ok(rowEntityViewEndIndex > rowEntityViewIndex, pluralView.path)
		assert.doesNotMatch(
			pluralView.lines.slice(rowEntityViewIndex + 1, rowEntityViewEndIndex).join('\n'),
			/layout=\{EntityLayout\.\w+\}|open=\{false\}|showTypeAnnotation=\{false\}/,
			pluralView.path
		)
		assert.equal(pluralView.lines.findLast((line) => line.trim() !== '')?.trim(), '</EntitiesList>', pluralView.path)
	}
	assert.match(entityView, /showTypeAnnotation = !\(isInsideEntityList \?\? false\)/)
	assert.match(entityView, /layout === EntityLayout\.SummaryDetails\s*&& !\(isInsideEntityList \?\? false\)/)
	assert.match(entityView, /<article[\s\S]*?data-card=\{articleProps\['data-card'\] \?\? true\}[\s\S]*?data-scroll-container=\{articleProps\['data-scroll-container'\] \?\? true\}/)
	assert.match(entityView, /<Collapsible[\s\S]*?\{\.\.\.CollapsibleProps\}[\s\S]*?data-card=\{undefined\}[\s\S]*?data-scroll-container=\{undefined\}/)
	assert.equal(
		generatedViews.some((generatedFile) => (
			generatedFile.ast.markup?.some((line) => line.includes('>Unavailable</span>')) === true
		)),
		false
	)
})

test('renders selected entity titles on every multi-selector detail page', () => {
	for (const generatedPage of baselineCompiledApp.generatedFiles.filter((file) => file.path.endsWith('/+page.svelte'))) {
		const source = renderGeneratedFile(generatedPage)
		assert.doesNotMatch(source, /const pageEntity =/)
		assert.doesNotMatch(source, /\{ \.\.\.[^,]+\.entitySelector, \.\.\.[^}]+\.entity \}/)
	}

	const multiSelectorPages = baselineCompiledApp.generatedFiles.flatMap((generatedFile) => {
		const source = renderGeneratedFile(generatedFile)

		return generatedFile.path.endsWith('/+page.svelte')
			&& source.includes('data.entityType')
			&& source.includes('const entityViewByType') ?
			[{
				path: generatedFile.path,
				source,
			}]
		:
			[]
	})

	assert.ok(multiSelectorPages.length > 0)
	for (const page of multiSelectorPages) {
		const pageSelectionOccurrences = page.source.match(/\bpageSelection\b/g)?.length ?? 0
		if (page.source.includes('const pageSelection = $derived')) {
			assert.ok(pageSelectionOccurrences > 2, page.path)
			assert.match(page.source, /selection=\{pageSelection\}/, page.path)
		} else {
			assert.equal(pageSelectionOccurrences, 0, page.path)
			assert.match(page.source, /<EntityView[\s\S]*?selection=\{[\s\S]*?select\(EntityType\./, page.path)
		}
		assert.match(page.source, /const documentTitle = \$derived\([\s\S]*?data\.entityType/, page.path)
		assert.match(page.source, /<svelte:head>\s*<title>\{documentTitle\}<\/title>\s*<\/svelte:head>/, page.path)
		assert.doesNotMatch(page.source, /const pageTitle = |data\.selectorName|<title>[^<]*data\.entityType/, page.path)
		assert.ok((page.source.match(/ • [^']+ • Blockhead'/g) ?? []).length > 1, page.path)
		assert.doesNotMatch(page.source, /entityDefinitionByType/, page.path)
		assert.doesNotMatch(page.source, /entityViewByType[\s\S]*?label:/, page.path)
		assert.doesNotMatch(page.source, /pageEntity(?:Title|TypeLabel)|entityViewComponentByType/, page.path)
		assert.doesNotMatch(page.source, /^\s*[A-Za-z_$][A-Za-z0-9_$]*,[A-Za-z_$][A-Za-z0-9_$]*:\s*true,/m, page.path)
	}

	const networkGeneratedPage = baselineCompiledApp.generatedFiles.find((file) => (
		file.path.endsWith('/network/[network=networkCaip2OrNetworkSlug]/+page.svelte')
	))
	assert.ok(networkGeneratedPage)
	const networkPage = {
		path: networkGeneratedPage.path,
		source: renderGeneratedFile(networkGeneratedPage),
	}
	assert.ok(networkPage)
	assert.match(networkPage.source, /Evm: \{[\s\S]*?consensusProtocol: true,[\s\S]*?registryStatus: true,[\s\S]*?\}/)
	assert.match(networkPage.source, /fields: \{[\s\S]*?caip2: true,/)
	assert.match(networkPage.source, /data\.selector\.caip2/)
	assert.doesNotMatch(networkPage.source, /const entityViewByType =/)
	assert.doesNotMatch(networkPage.source, /\{@const EntityView =/)
	assert.match(networkPage.source, /<title>\{pageTitle\} • Network • Blockhead<\/title>/)
	assert.match(networkPage.source, /data\.entityType === EntityType\.Network\s*&& data\.selectorName === 'Caip2'/)
	assert.equal((networkPage.source.match(/data\.selectorName/g) ?? []).length, 1)
	assert.doesNotMatch(networkPage.source, /const documentTitle =/)
	assert.match(networkPage.source, /<NetworkView\s+selection=\{pageSelection\}/)
	assert.doesNotMatch(networkPage.source, /pageSelection\.entitySelector\.(?:name|caip2)/)
	assert.doesNotMatch(networkPage.source, /\.\.\.pageSelection\.entitySelector/)
	assert.doesNotMatch(networkPage.source, /const pageSelection = \$derived\([\s\S]*? : undefined\)/)
	assert.equal(
		(networkPage.source.match(/select\(EntityType\.Network, data\.selector/g) ?? []).length,
		1
	)
	assert.equal((networkPage.source.match(/\bcaip2: true,/g) ?? []).length, 1)
	assert.equal((networkPage.source.match(/\bconsensusProtocol: true,/g) ?? []).length, 1)
	assert.equal((networkPage.source.match(/\bSource\.Constants_Internal,/g) ?? []).length, 1)
	const evmCoinInstancePage = baselineCompiledApp.generatedFiles.find((file) => (
		file.path.endsWith('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]/+page.svelte')
	))
	assert.ok(evmCoinInstancePage)
	const evmCoinInstancePageSource = renderGeneratedFile(evmCoinInstancePage)
	assert.equal(
		(evmCoinInstancePageSource.match(/select\(EntityType\.EvmCoinInstance, data\.selector/g) ?? []).length,
		1
	)
	assert.equal((evmCoinInstancePageSource.match(/\bNativeCurrency: \{/g) ?? []).length, 1)
	assert.equal((evmCoinInstancePageSource.match(/\bErc20Token: \{/g) ?? []).length, 1)
	assert.equal((evmCoinInstancePageSource.match(/\$contract: true,/g) ?? []).length, 1)
	const networkLayout = baselineCompiledApp.generatedFiles.find((file) => (
		file.path.endsWith('/network/[network=networkCaip2OrNetworkSlug]/+layout.ts')
	))
	assert.ok(networkLayout)
	assert.match(renderGeneratedFile(networkLayout), /readonly selectorName: 'Caip2'[\s\S]*?EntitySelectorForSelectorName<[\s\S]*?EntityType\.Network,[\s\S]*?'Caip2'[\s\S]*?readonly selectorName: 'Slug'[\s\S]*?'Slug'/)
	assert.doesNotMatch(renderGeneratedFile(networkLayout), /selectorName: string|EntitySelector<typeof schema/)
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

	assert.ok(sourceBinding)

	const renderedSourceBinding = renderGeneratedFile(sourceBinding)
	assert.doesNotMatch(renderedSourceBinding, /\bprovider: SourceProvider\b/)
	assert.doesNotMatch(renderedSourceBinding, /\bNone\s*=\s*'None'/)
	assert.match(renderedSourceBinding, /generated\?: true/)
	assert.match(renderedSourceBinding, /_Scope extends SourceCredentialScope\.PublicConfig \? \{[\s\S]*?keys\?: never/)
	assert.equal((renderedSourceBinding.match(/^\t\| SourceBindingCompatibilityRow</gm) ?? []).length, sourceBindingCompatibility.length)
	assert.doesNotMatch(renderedSourceBinding, /SourceBindingDelivery(?:Endpoint|Credential)Layout/)
	assert.doesNotMatch(renderedSourceBinding, /endpoints: readonly SourceEndpoint\[\][\s\S]*?wireProtocol: WireProtocol[\s\S]*?apiFamily: ApiFamily[\s\S]*?operationGroups: readonly SourceOperationGroup\[\]/)
	assert.match(renderedSourceBinding, /export const genericReadOperationGroups = \[SourceOperationGroup\.GenericRead\] as const/)
	assert.match(renderedSourceBinding, /export const walletReadAndSignOperationGroups = \[\n\tSourceOperationGroup\.WalletAccountRead,\n\tSourceOperationGroup\.WalletSign,\n\] as const/)
	assert.match(
		renderedSourceBinding,
		/export const sourceBindingId = \(\{[\s\S]*?\) => JSON\.stringify\(\[\n\tsource,\n\ttarget\.kind,\n\ttarget\.key,\n\tdelivery,\n\tapiFamily,\n\]\)/
	)
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
	for (const [enumName, sourceAxis] of Object.entries({
		...sourceAxes,
		Source,
		SourceProvider,
	}))
		assert.deepEqual(
			Object.values(sourceAxis),
			Object.values(sourceAxis).toSorted((left, right) => left.localeCompare(right, 'en')),
			`${enumName} must remain alphabetized`
		)

	for (const [enumName, sourceAxis] of Object.entries(sourceAxes)) {
		const enumBody = renderedSourceBinding.match(new RegExp(`export enum ${enumName} \\{([\\s\\S]*?)\\n\\}`))?.[1]

		assert.ok(enumBody)
		for (const enumValue of Object.values(sourceAxis))
			assert.match(enumBody, new RegExp(`\\b${enumValue}\\s*=\\s*'${enumValue}'`))
	}
	assert.match(renderedSourceBinding, /return Object\.groupBy\(bindings, \(\{ source \}\) => source\)/)
	assert.match(renderedSourceBinding, /if \(bindings\.length === 0\)/)
	assert.doesNotMatch(renderedSourceBinding, /sourceBindings\.length === 1|Object\.fromEntries\(/)

	for (const providerBindingPath of [
		'src/sources/Envio/bindings.ts',
		'src/sources/Covalent/bindings.ts',
		'src/sources/Sqd/bindings.ts',
	]) {
		const providerBindings = readFileSync(path.join(root, providerBindingPath), 'utf8')

		assert.doesNotMatch(providerBindings, /\bSourceProvider\b|\bprovider:/)
		for (const enumReference of providerBindings.matchAll(/\b(ApiFamily|SourceArtifactKind|SourceCredentialScope|SourceDelivery|SourceEndpointKind|SourceOperationGroup|SourceTargetKind|WireProtocol)\.([A-Za-z0-9_]+)/g))
			assert.match(renderedSourceBinding, new RegExp(`\\b${enumReference[2]}\\s*=\\s*'${enumReference[2]}'`), `${enumReference[0]} in ${providerBindingPath} must be emitted by SourceBinding.ts`)
	}

	const generatedProviderBindingFiles = generatedFiles.filter(({ path }) => (
		/^src\/sources\/[^/]+\/bindings\.ts$/.test(path)
	))
	assert.equal(generatedProviderBindingFiles.length, app.sources.providers.length)
	for (const generatedBindings of generatedProviderBindingFiles) {
		const source = renderGeneratedFile(generatedBindings)
		const sourceFile = ts.createSourceFile(generatedBindings.path, source, ts.ScriptTarget.Latest, true)
		const sourceBindingImportNames = new Set(sourceFile.statements.flatMap((statement) => (
			ts.isImportDeclaration(statement)
			&& ts.isStringLiteral(statement.moduleSpecifier)
			&& statement.moduleSpecifier.text === '$/sources/SourceBinding.ts'
			&& statement.importClause?.namedBindings != null
			&& ts.isNamedImports(statement.importClause.namedBindings) ?
				statement.importClause.namedBindings.elements.map(({ name }) => name.text)
			:
				[]
		)))
		assert.equal(
			sourceBindingImportNames.has('genericReadOperationGroups'),
			source.includes('operationGroups: genericReadOperationGroups')
		)
		assert.equal(
			sourceBindingImportNames.has('walletReadAndSignOperationGroups'),
			source.includes('operationGroups: walletReadAndSignOperationGroups')
		)
		assert.equal(sourceBindingImportNames.has('SourceOperationGroup'), /SourceOperationGroup\./.test(source))
		assert.equal(sourceFile.statements.filter((statement) => (
			ts.isVariableStatement(statement)
			&& statement.declarationList.declarations.some((declaration) => (
				ts.isIdentifier(declaration.name)
				&& declaration.name.text === 'bindings'
			))
		)).length, 0)
		assert.equal(sourceFile.statements.filter((statement) => (
			ts.isExportAssignment(statement)
			&& ts.isCallExpression(statement.expression)
			&& ts.isIdentifier(statement.expression.expression)
			&& statement.expression.expression.text === 'indexSourceBindings'
		)).length, 1)
		if (source.includes('.flatMap(({'))
			assert.match(source, /\] satisfies readonly SourceBinding\[\]\)\)/)
		else if (source.includes('.map(({'))
			assert.match(source, /\} satisfies SourceBinding\)\)/)
		else
			assert.match(source, /export default indexSourceBindings\(\[[\s\S]*?satisfies readonly SourceBinding\[\]\)/)
		assert.match(source, /export default indexSourceBindings\(/)
		assert.doesNotMatch(source, /SourceCredentialScope\.None|generated: false/)
		assert.doesNotMatch(source, /^\s*\[Source\.[A-Za-z0-9_]+\]: \{/m)
		assert.doesNotMatch(source, /^const [A-Za-z0-9_$]+Credentials = \[\] as const$/m)
		assert.doesNotMatch(source, /^const [A-Za-z0-9_$]*GenericReadOperationGroups =/m)
		assert.doesNotMatch(source, /operationGroups: \[\n\s*SourceOperationGroup\.GenericRead,\n\s*\]/)
		assert.doesNotMatch(source, /operationGroups: \[\n\s*SourceOperationGroup\.WalletAccountRead,\n\s*SourceOperationGroup\.WalletSign,\n\s*\]/)
		for (const declaration of source.matchAll(/^const ([A-Za-z_$][\w$]*) =/gm))
			assert.ok(
				(source.match(new RegExp(`\\b${declaration[1]}\\b`, 'g')) ?? []).length >= (
					source.includes('.flatMap(({') || source.includes('.map(({') ? 2 : 3
				),
				`${generatedBindings.path}: ${declaration[1]} must replace at least two repeated values`
			)
	}

	const blockscoutBindings = generatedFiles.find(({ path }) => path === 'src/sources/Blockscout/bindings.ts')
	const blockscoutSource = app.sources.sources.find(({ source }) => source === Source.Blockscout_Rest)
	assert.ok(blockscoutBindings && blockscoutSource?.bindings)
	const renderedBlockscoutBindings = renderGeneratedFile(blockscoutBindings)
	assert.match(renderedBlockscoutBindings, /const blockscoutRestTargets = \[/)
	assert.match(renderedBlockscoutBindings, /export default indexSourceBindings\(blockscoutRestTargets\.flatMap/)
	assert.match(renderedBlockscoutBindings, /locator: `\$\{locator\}\/api\/eth-rpc`/)
	assert.equal(
		(renderedBlockscoutBindings.match(/^\s*key: '[0-9]+',$/gm) ?? []).length,
		blockscoutSource.bindings.length / 2
	)
	assert.equal((renderedBlockscoutBindings.match(/\.\.\.blockscoutRest[^,]+BindingAxes/g) ?? []).length, 2)
	assert.match(renderedBlockscoutBindings, /const blockscoutRestV2BindingAxes =/)
	assert.match(renderedBlockscoutBindings, /const blockscoutRestEvmExecutionJsonRpcBindingAxes =/)
	assert.doesNotMatch(renderedBlockscoutBindings, /blockscoutRest(?:V2|EvmExecutionJsonRpc)HttpProxyBindingAxes/)
	assert.match(renderedBlockscoutBindings, /\.flatMap\(/)

	const easScanBindings = generatedFiles.find(({ path }) => path === 'src/sources/EasScan/bindings.ts')
	assert.ok(easScanBindings)
	const renderedEasScanBindings = renderGeneratedFile(easScanBindings)
	assert.match(renderedEasScanBindings, /const easScanGraphqlBindingAxes =/)
	assert.match(renderedEasScanBindings, /export default indexSourceBindings\(easScanGraphqlTargets\.map\(/)
	assert.doesNotMatch(renderedEasScanBindings, /\.flatMap\(/)

	const mastodonBindings = generatedFiles.find(({ path }) => path === 'src/sources/Mastodon/bindings.ts')
	const esploraBindings = generatedFiles.find(({ path }) => path === 'src/sources/Esplora/bindings.ts')
	assert.ok(mastodonBindings && esploraBindings)
	const renderedMastodonBindings = renderGeneratedFile(mastodonBindings)
	const renderedEsploraBindings = renderGeneratedFile(esploraBindings)
	assert.doesNotMatch(renderedMastodonBindings, /mastodonRestTargets/)
	assert.match(renderedMastodonBindings, /kind: SourceTargetKind\.Feed,\n\s+key: 'mastodon-public-timeline:https:\/\/fosstodon\.org'/)
	assert.doesNotMatch(renderedEsploraBindings, /esploraRestTargets/)
	assert.match(renderedEsploraBindings, /kind: SourceTargetKind\.NetworkSlug,\n\s+key: 'liquid'/)

	const nostrRelayBindings = generatedFiles.find(({ path }) => path === 'src/sources/NostrRelay/bindings.ts')
	assert.ok(nostrRelayBindings)
	const renderedNostrRelayBindings = renderGeneratedFile(nostrRelayBindings)
	assert.equal((renderedNostrRelayBindings.match(/Targets\.map\(/g) ?? []).length, 2)
	assert.match(renderedNostrRelayBindings, /export default indexSourceBindings\(\[\n\t\.\.\.nostrRelayNip11HttpTargets\.map/)
	assert.match(renderedNostrRelayBindings, /\n\t\.\.\.nostrRelayWebSocketTargets\.map/)
	assert.doesNotMatch(
		readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8'),
		/bindingRows\.length\s*[<>]=?\s*[0-9]+/
	)

	const voltaireBindings = generatedFiles.find(({ path }) => path === 'src/sources/Voltaire/bindings.ts')
	assert.ok(voltaireBindings)
	const renderedVoltaireBindings = renderGeneratedFile(voltaireBindings)
	const voltaireBindingCount = (renderedVoltaireBindings.match(/source: Source\.Voltaire_JsonRpc/g) ?? []).length
	assert.ok(voltaireBindingCount > 0)
	assert.doesNotMatch(renderedVoltaireBindings, /const voltaireJsonRpcCredentials =/)
	assert.match(renderedVoltaireBindings, /const voltaireJsonRpcRemoteLiveBindingAxes =/)
	assert.match(renderedVoltaireBindings, /const voltaireJsonRpcHttpProxyBindingAxes =/)
	assert.match(renderedVoltaireBindings, /const voltaireJsonRpcBrowserDirectBindingAxes =/)
	assert.doesNotMatch(renderedVoltaireBindings, /voltaireJsonRpcEvmExecutionJsonRpc(?:RemoteLive|HttpProxy|BrowserDirect)BindingAxes/)
	assert.match(renderedVoltaireBindings, /credentials: \[\]/)
	assert.equal((renderedVoltaireBindings.match(/artifacts: voltaireJsonRpcArtifacts/g) ?? []).length, voltaireBindingCount)
	assert.equal((renderedVoltaireBindings.match(/Targets[0-9]+Through[0-9]+\.flatMap/g) ?? []).length, 4)
	for (const targetRange of [
		'10Through480',
		'998Through999',
		'1301Through4801',
		'10143Through11155420',
	])
		assert.match(renderedVoltaireBindings, new RegExp(`const voltaireJsonRpcTargets${targetRange} =`))
	assert.equal((renderedVoltaireBindings.match(/^\t\tkey: '[0-9]+',$/gm) ?? []).length, 38)
	assert.equal((renderedVoltaireBindings.match(/^\t\t\tkey: '1',$/gm) ?? []).length, 2)
	assert.equal((renderedVoltaireBindings.match(/^\t\t\tkey: '8453',$/gm) ?? []).length, 2)
	assert.match(renderedVoltaireBindings, /httpProxyLocator: 'https:\/\/mainnet\.optimism\.io',[\s\S]*?remoteLiveLocator: 'wss:\/\/mainnet\.optimism\.io'/)
	assert.doesNotMatch(renderedVoltaireBindings, /locator: `\$\{/)
	assert.ok(renderedVoltaireBindings.split('\n').length < 600)
	assert.doesNotMatch(
		readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8'),
		/Source\.Voltaire|provider\.provider\s*===?\s*['"]Voltaire['"]/
	)

	const forgejoBindings = generatedFiles.find(({ path }) => path === 'src/sources/Forgejo/bindings.ts')
	const coingeckoBindings = generatedFiles.find(({ path }) => path === 'src/sources/Coingecko/bindings.ts')
	const bitTorrentBindings = generatedFiles.find(({ path }) => path === 'src/sources/BitTorrent/bindings.ts')
	const getBlockBindings = generatedFiles.find(({ path }) => path === 'src/sources/GetBlock/bindings.ts')
	assert.ok(forgejoBindings && coingeckoBindings && bitTorrentBindings && getBlockBindings)
	const renderedForgejoBindings = renderGeneratedFile(forgejoBindings)
	const renderedCoingeckoBindings = renderGeneratedFile(coingeckoBindings)
	const renderedBitTorrentBindings = renderGeneratedFile(bitTorrentBindings)
	const renderedGetBlockBindings = renderGeneratedFile(getBlockBindings)
	assert.equal((renderedForgejoBindings.match(/source: Source\.Forgejo_Rest/g) ?? []).length, 1)
	assert.equal((renderedForgejoBindings.match(/locator: 'https:\/\/\{forgejo-host\}\/api\/v1'/g) ?? []).length, 1)
	for (const operationGroup of [
		'GitRepositoryContents',
		'IssueTracking',
		'PullRequestReview',
		'ReleaseMetadata',
		'RepositoryMetadata',
	])
		assert.match(renderedForgejoBindings, new RegExp(`SourceOperationGroup\\.${operationGroup}`))
	assert.equal((renderedCoingeckoBindings.match(/source: Source\.Coingecko_Rest/g) ?? []).length, 2)
	assert.equal((renderedCoingeckoBindings.match(/kind: SourceArtifactKind\.OpenApiSpec/g) ?? []).length, 2)
	assert.match(renderedCoingeckoBindings, /key: 'coingecko-demo'/)
	assert.match(renderedCoingeckoBindings, /key: 'coingecko-pro'/)
	assert.doesNotMatch(renderedCoingeckoBindings, /Coingecko_OpenApi/)
	assert.match(renderedBitTorrentBindings, /^const bitTorrentAnnounceOperationGroups = \[$/m)
	assert.doesNotMatch(renderedBitTorrentBindings, /bitTorrentBitTorrentAnnounceOperationGroups|bitTorrentCredentials/)
	assert.equal((renderedBitTorrentBindings.match(/credentials: \[\]/g) ?? []).length, 6)
	assert.match(renderedGetBlockBindings, /^const getBlockCredentials = \[$/m)
	assert.equal((renderedGetBlockBindings.match(/credentials: getBlockCredentials/g) ?? []).length, 2)
})

test('compacts source binding matrices only when their complete semantic order is unchanged', () => {
	const shuffledApp = structuredClone(app)
	const blockscout = shuffledApp.sources.sources.find(({ source }) => source === Source.Blockscout_Rest)
	assert.ok(blockscout?.bindings)
	Object.defineProperty(blockscout, 'bindings', {
		value: blockscout.bindings.toSorted((left, right) => (
			left.apiFamily.localeCompare(right.apiFamily)
			|| left.target.key.localeCompare(right.target.key, 'en', {
				numeric: true,
			})
		)),
	})

	const generatedBindings = compileApp(shuffledApp).generatedFiles.find(({ path }) => (
		path === 'src/sources/Blockscout/bindings.ts'
	))
	assert.ok(generatedBindings)
	const source = renderGeneratedFile(generatedBindings)
	assert.doesNotMatch(source, /blockscoutRestTargets/)
	assert.deepEqual(
		[...source.matchAll(/^\s*key: '([0-9]+)',$/gm)].map((match) => match[1]),
		blockscout.bindings.map(({ target }) => target.key)
	)
})

test('keeps ordered generated provider bindings semantically equal to APP', () => {
	const generatedProviderFiles = baselineCompiledApp.generatedFiles.filter(({ path: generatedPath }) => (
		/^src\/sources\/[^/]+\/index\.ts$/.test(generatedPath)
	))
	assert.equal(generatedProviderFiles.length, app.sources.providers.length)
	for (const generatedProviderFile of generatedProviderFiles)
		assert.match(
			renderGeneratedFile(generatedProviderFile),
			/\tbindings,\n} satisfies SourceProviderDefinition<typeof bindings>\n$/
		)
	const flattenedProviderBindings = sourceProviders.flatMap(({ bindings }) => Object.values(bindings).flat())
	assert.equal(sourceBindings.length, 424)
	assert.deepEqual(sourceBindings, flattenedProviderBindings)
	for (const [bindingIndex, binding] of sourceBindings.entries())
		assert.equal(binding, flattenedProviderBindings[bindingIndex])
	for (const { sources, bindings } of sourceProviders)
		assert.deepEqual(Object.keys(sources), Object.keys(bindings))

	assert.deepEqual(
		sourceProviders.map(({ provider, sources }) => ({
			provider,
			sources: Object.entries(sources).map(([source, definition]) => ({
				source,
				label: definition.label,
			})),
		})),
		app.sources.providers.map(({ provider }) => ({
			provider,
			sources: app.sources.sources
				.filter((source) => source.provider === provider)
				.map((source) => ({
					source: source.source,
					label: source.label,
				})),
		}))
	)

	assert.deepEqual(
		sourceProviders.map(({ provider, bindings }) => ({
			provider,
			bindings: Object.values(bindings).flat().map((binding) => ({
				source: binding.source,
				target: binding.target,
				endpoints: binding.endpoints,
				wireProtocol: binding.wireProtocol,
				apiFamily: binding.apiFamily,
				operationGroups: binding.operationGroups,
				delivery: binding.delivery,
				credentials: binding.credentials.map((credential) => ({
					scope: credential.scope,
					...(credential.env == null ? {} : {
						env: credential.env.json,
					}),
					...(credential.keys == null ? {} : {
						keys: credential.keys,
					}),
				})),
				artifacts: binding.artifacts ?? [],
			})),
		})),
		app.sources.providers.map(({ provider }) => ({
			provider,
			bindings: app.sources.sources
				.filter((source) => source.provider === provider)
				.flatMap((source) => (
					(source.bindings ?? (source.binding == null ? [] : [source.binding]))
						.map((binding) => ({
							source: source.source,
							target: binding.target,
							endpoints: binding.endpoints,
							wireProtocol: binding.wireProtocol,
							apiFamily: binding.apiFamily,
							operationGroups: binding.operationGroups,
							delivery: binding.delivery,
							credentials: binding.credentials.map((credential) => ({
								scope: credential.scope,
								...('envKey' in credential || credential.env == null ? {} : {
									env: arktype(credential.env.keys.length === 0 ? {
										'[string]': 'string',
									} : Object.fromEntries(credential.env.keys.map(({ name, type }) => [
										name,
										type,
									]))).json,
								}),
								...(
									'envKey' in credential
									|| credential.scope === SourceCredentialScope.PublicConfig
									|| credential.keys == null ?
										{}
									:
										{
											keys: credential.keys,
										}
								),
							})),
							artifacts: binding.artifacts ?? [],
						}))
				)),
		}))
	)
})

test('keeps scope-prefix reduction collision-safe for shared binding values', () => {
	const collisionApp = structuredClone(app)
	const arweaveRest = collisionApp.sources.sources.find(({ source }) => source === Source.Arweave_Rest)
	const arweaveGraphql = collisionApp.sources.sources.find(({ source }) => source === Source.Arweave_Graphql)
	assert.ok(arweaveRest?.binding?.artifacts && arweaveGraphql?.binding?.artifacts)

	const collisionRest = structuredClone(arweaveRest)
	Object.defineProperty(collisionRest, 'source', {
		value: 'ArweaveArweave',
	})
	const secondRestBinding = structuredClone(collisionRest.binding)
	secondRestBinding.target.key = 'arweave-alternate'
	secondRestBinding.endpoints[0].locator = 'https://arweave-alternate.example'
	Object.defineProperty(secondRestBinding, 'operationGroups', {
		value: [SourceOperationGroup.GenericRead],
	})
	Object.defineProperty(collisionRest, 'bindings', {
		value: [secondRestBinding],
	})
	Object.defineProperty(collisionRest, 'binding', {
		value: undefined,
	})

	const collisionGraphql = structuredClone(arweaveGraphql)
	Object.defineProperty(collisionGraphql, 'source', {
		value: 'Arweave',
	})
	const secondGraphqlBinding = structuredClone(collisionGraphql.binding)
	secondGraphqlBinding.target.key = 'arweave-graphql-alternate'
	secondGraphqlBinding.endpoints[0].locator = 'https://arweave-graphql-alternate.example/graphql'
	Object.defineProperty(secondGraphqlBinding, 'delivery', {
		value: SourceDelivery.RemoteQuery,
	})
	Object.defineProperty(collisionGraphql, 'bindings', {
		value: [secondGraphqlBinding],
	})
	Object.defineProperty(collisionGraphql, 'binding', {
		value: undefined,
	})
	collisionApp.sources.sources.push(collisionRest, collisionGraphql)
	alphabetizeSourceDefinitions(collisionApp)

	const generatedArweaveBindings = compileApp(collisionApp).generatedFiles.find(({ path }) => (
		path === 'src/sources/Arweave/bindings.ts'
	))
	assert.ok(generatedArweaveBindings)
	const source = renderGeneratedFile(generatedArweaveBindings)
	assert.match(source, /^const arweaveArtifacts1 = \[$/m)
	assert.match(source, /^const arweaveArtifacts2 = \[$/m)
	const declarationNames = [...source.matchAll(/^const ([A-Za-z_$][\w$]*) =/gm)].map((match) => match[1])
	assert.equal(declarationNames.length, new Set(declarationNames).size)
})

test('keeps source binding compatibility in the compiler instead of re-encoding it at runtime', () => {
	assert.equal(
		baselineCompiledApp.generatedFiles.some(({ path }) => path === 'src/sources/$sourceBindingCompatibility.ts'),
		false
	)
	assert.equal(
		baselineCompiledApp.generatedFiles.some(({ path }) => path === 'src/sources/officialArtifacts.ts'),
		false
	)
	let generatedSourceMetadataCount = 0
	for (const generatedProvider of baselineCompiledApp.generatedFiles.filter(({ path }) => (
		/^src\/sources\/[^/]+\/index\.ts$/.test(path)
	))) {
		const source = renderGeneratedFile(generatedProvider)
		assert.match(source, /\tsources: \{/, generatedProvider.path)
		assert.match(source, /\tbindings,/, generatedProvider.path)
		assert.doesNotMatch(source, /\bsource: Source\./, generatedProvider.path)
		generatedSourceMetadataCount += (source.match(/^\t\t\[Source\./gm) ?? []).length
		assert.doesNotMatch(source, /bindings\[Source\./, generatedProvider.path)
		assert.equal((source.match(/\bprovider:/g) ?? []).length, 1, generatedProvider.path)
	}
	assert.equal(generatedSourceMetadataCount, app.sources.sources.length)
	const etherscanProvider = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/sources/Etherscan/index.ts')
	const voltaireProvider = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/sources/Voltaire/index.ts')
	const sourceProviders = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/sources/$sourceProviders.ts')
	assert.ok(etherscanProvider && voltaireProvider && sourceProviders)
	assert.match(renderGeneratedFile(etherscanProvider), /\[Source\.Etherscan_Rest\]: \{[\s\S]*?\tbindings,/)
	assert.match(renderGeneratedFile(voltaireProvider), /\[Source\.Voltaire_JsonRpc\]: \{[\s\S]*?\tbindings,/)
	assert.match(renderGeneratedFile(sourceProviders), /from '\.\/Etherscan\/index\.ts'/)
	assert.match(renderGeneratedFile(sourceProviders), /from '\.\/Voltaire\/index\.ts'/)
	for (const path of [
		'src/sources/index.ts',
		'src/sources/index.server.ts',
	])
		assert.equal(
			baselineCompiledApp.generatedFiles.some((candidate) => candidate.path === path),
			false
		)
})

test('keeps Bsky Social transport in its provider-owned proxy binding', () => {
	const source = app.sources.sources.find((candidate) => (
		candidate.source === Source.Atproto_BskySocial_Xrpc
	))
	const publicAppViewSource = app.sources.sources.find((candidate) => (
		candidate.source === Source.Atproto_Xrpc
	))

	assert.ok(source?.binding)
	assert.ok(publicAppViewSource?.binding)
	assert.equal(source.binding.delivery, SourceDelivery.HttpProxy)
	assert.deepEqual(source.binding.endpoints.map((endpoint) => endpoint.corsEnabled), [false])
	assert.deepEqual(source.binding.artifacts, [
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/_shared/interfaces/BskyAppViewXrpc/Lexicon/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.Lexicon,
			path: 'src/sources/_shared/interfaces/BskyAppViewXrpc/Lexicon',
		},
	])
	assert.deepEqual(source.binding.artifacts, publicAppViewSource.binding.artifacts)
	assert.equal(existsSync(path.join(root, 'src/sources/_shared/interfaces/BskyAppViewXrpc/Lexicon/schema-source.ts')), true)
	assert.equal(existsSync(path.join(root, 'src/sources/AtprotoBsky/Lexicon')), false)
	assert.equal(existsSync(path.join(root, 'src/sources/AtprotoBskySocial/Lexicon')), false)

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
	assert.doesNotMatch(renderGeneratedFile(generatedSourceProviders), /corsEnabled:|SourceDelivery\./)
	assert.match(
		readFileSync(path.join(root, 'src/sources/AtprotoBskySocial/bindings.ts'), 'utf8'),
		/Source\.Atproto_BskySocial_Xrpc,[\s\S]*?corsEnabled: false,[\s\S]*?delivery: SourceDelivery\.HttpProxy/
	)
})

test('keeps binding identity independent from unrelated APP row order', () => {
	const source = app.sources.sources.find((candidate) => candidate.source === Source.Ipfs_Rest)
	assert.ok(source?.binding)

	const reorderedApp = structuredClone(app)
	const movedSource = reorderedApp.sources.sources.pop()
	assert.ok(movedSource)
	reorderedApp.sources.sources.unshift(movedSource)
	const reorderedSource = reorderedApp.sources.sources.find((candidate) => candidate.source === Source.Ipfs_Rest)
	assert.ok(reorderedSource?.binding)

	assert.equal(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(reorderedSource.source),
			...reorderedSource.binding,
		})
	)
	for (const file of globSync('src/{resolvers,sources}/**/*.ts'))
		assert.doesNotMatch(
			readFileSync(file, 'utf8'),
			/(?:proxyId|serverCredentialId) === '[A-Za-z0-9_]+-[0-9]+'/
		)
})

test('derives binding identity only from the stable semantic tuple', () => {
	const source = app.sources.sources.find((candidate) => candidate.source === Source.Ipfs_Rest)
	assert.ok(source?.binding)

	const reorderedBinding = structuredClone(source.binding)
	reorderedBinding.endpoints.reverse()
	reorderedBinding.operationGroups.reverse()
	reorderedBinding.credentials.reverse()
	reorderedBinding.artifacts?.reverse()
	assert.equal(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(source.source),
			...reorderedBinding,
		})
	)

	const changedTarget = structuredClone(source.binding)
	changedTarget.target.key = `${changedTarget.target.key}-other`
	assert.notEqual(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(source.source),
			...changedTarget,
		})
	)

	const changedWireProtocol = structuredClone(source.binding)
	changedWireProtocol.wireProtocol = WireProtocol.RawHttp
	assert.equal(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(source.source),
			...changedWireProtocol,
		})
	)

	const changedDelivery = structuredClone(source.binding)
	changedDelivery.delivery = SourceDelivery.ServerOnly
	assert.notEqual(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(source.source),
			...changedDelivery,
		})
	)

	const changedApiFamily = structuredClone(source.binding)
	changedApiFamily.apiFamily = ApiFamily.RestJson
	assert.notEqual(
		sourceBindingId({
			source: String(source.source),
			...source.binding,
		}),
		sourceBindingId({
			source: String(source.source),
			...changedApiFamily,
		})
	)
})

test('rejects duplicate stable source binding identities', () => {
	const duplicateBindingApp = structuredClone(app)
	const source = duplicateBindingApp.sources.sources.find((candidate) => (
		candidate.source === Source.Ipfs_Rest
	))
	assert.ok(source?.binding)
	Object.defineProperty(source, 'bindings', {
		value: [
			structuredClone(source.binding),
			structuredClone(source.binding),
		],
	})
	Object.defineProperty(source, 'binding', {
		value: undefined,
	})

	assert.throws(
		() => compileApp(duplicateBindingApp),
		/Duplicate source binding identity/
	)
})

test('rejects operation groups split across indistinguishable provider sources', () => {
	const splitForgejoApp = structuredClone(app)
	const forgejoSourceIndex = splitForgejoApp.sources.sources.findIndex(({ source }) => (
		source === Source.Forgejo_Rest
	))
	const forgejoSource = splitForgejoApp.sources.sources[forgejoSourceIndex]
	assert.ok(forgejoSource?.binding)

	splitForgejoApp.sources.sources.push(
		...([
			{
				source: 'ForgejoRepos_Rest',
				label: 'Forgejo repositories REST',
				targetKey: 'forgejo-repositories',
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
			},
			{
				source: 'ForgejoIssues_Rest',
				label: 'Forgejo issues REST',
				targetKey: 'forgejo-issues',
				operationGroups: [SourceOperationGroup.IssueTracking],
			},
			{
				source: 'ForgejoPulls_Rest',
				label: 'Forgejo pulls REST',
				targetKey: 'forgejo-pulls',
				operationGroups: [SourceOperationGroup.PullRequestReview],
			},
			{
				source: 'ForgejoReleases_Rest',
				label: 'Forgejo releases REST',
				targetKey: 'forgejo-releases',
				operationGroups: [SourceOperationGroup.ReleaseMetadata],
			},
		] as const).map(({ source, label, targetKey, operationGroups }) => {
			const splitSource = structuredClone(forgejoSource)
			assert.ok(splitSource.binding)
			Object.defineProperty(splitSource, 'source', {
				value: source,
			})
			splitSource.label = label
			splitSource.binding.target.key = targetKey
			Object.defineProperty(splitSource.binding, 'operationGroups', {
				value: operationGroups,
			})

			return splitSource
		})
	)
	alphabetizeSourceDefinitions(splitForgejoApp)

	assert.throws(
		() => compileApp(splitForgejoApp),
		/Forgejo: source identities Forgejo_Rest, ForgejoIssues_Rest, ForgejoPulls_Rest, ForgejoReleases_Rest, ForgejoRepos_Rest share one transport and provenance; combine their operation groups on one source binding/
	)
})

test('allows same-provider sources with distinct transport or provenance', () => {
	const distinctEndpointApp = structuredClone(app)
	const forgejoSource = distinctEndpointApp.sources.sources.find(({ source }) => (
		source === Source.Forgejo_Rest
	))
	assert.ok(forgejoSource?.binding)
	const distinctEndpointSource = structuredClone(forgejoSource)
	assert.ok(distinctEndpointSource.binding)
	Object.defineProperty(distinctEndpointSource, 'source', {
		value: 'ForgejoMirror_Rest',
	})
	distinctEndpointSource.binding.endpoints[0].locator = 'https://{forgejo-mirror-host}/api/v1'
	distinctEndpointApp.sources.sources.push(distinctEndpointSource)
	alphabetizeSourceDefinitions(distinctEndpointApp)
	assert.doesNotThrow(() => compileApp(distinctEndpointApp))

	const distinctProtocolApp = structuredClone(app)
	const distinctProtocolSource = structuredClone(forgejoSource)
	assert.ok(distinctProtocolSource.binding)
	Object.defineProperty(distinctProtocolSource, 'source', {
		value: 'ForgejoRawHttp',
	})
	Object.defineProperty(distinctProtocolSource.binding, 'wireProtocol', {
		value: WireProtocol.RawHttp,
	})
	Object.defineProperty(distinctProtocolSource.binding, 'apiFamily', {
		value: ApiFamily.RestJson,
	})
	distinctProtocolApp.sources.sources.push(distinctProtocolSource)
	alphabetizeSourceDefinitions(distinctProtocolApp)
	assert.doesNotThrow(() => compileApp(distinctProtocolApp))

	const distinctProvenanceApp = structuredClone(app)
	const distinctRepositorySources = [
		'owner/repository-one@main',
		'owner/repository-two@main',
	].map((repository, index) => {
		const repositorySource = structuredClone(forgejoSource)
		assert.ok(repositorySource.binding)
		Object.defineProperty(repositorySource, 'source', {
			value: `ForgejoRepository${index + 1}_Rest`,
		})
		Object.defineProperty(repositorySource.binding, 'target', {
			value: {
				kind: SourceTargetKind.GitRepository,
				key: repository,
			},
		})

		return repositorySource
	})
	distinctProvenanceApp.sources.sources.push(...distinctRepositorySources)
	alphabetizeSourceDefinitions(distinctProvenanceApp)
	assert.doesNotThrow(() => compileApp(distinctProvenanceApp))
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

test('rejects malformed source binding compatibility rows before compilation', () => {
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
		/endpoint kind contains duplicate/
	)
	assert.throws(
		() => validateSourceBindingCompatibility([{
			...sourceBindingCompatibility[0],
			endpointKinds: [
				SourceEndpointKind.WebSocketUrl,
				SourceEndpointKind.HttpUrl,
			],
		}]),
		/endpoint kind must be alphabetized/
	)
})

test('rejects ambiguous source binding delivery compatibility rows before compilation', () => {
	assert.throws(
		() => validateSourceBindingDeliveryCompatibility([
			sourceBindingDeliveryCompatibility[0],
			{
				...sourceBindingDeliveryCompatibility[0],
				endpointLayout: sourceBindingDeliveryCompatibility[4].endpointLayout,
			},
			...sourceBindingDeliveryCompatibility.slice(1),
		]),
		/contains duplicate/
	)
	const reversedCompatibility = [...sourceBindingDeliveryCompatibility].reverse()
	assert.throws(
		() => validateSourceBindingDeliveryCompatibility(reversedCompatibility),
		/must be alphabetized/
	)
	assert.throws(
		() => validateSourceBindingDeliveryCompatibility(sourceBindingDeliveryCompatibility.slice(1)),
		/BrowserDirect has no compatibility row/
	)
	const simultaneousIncludeExclude = structuredClone(sourceBindingDeliveryCompatibility)

	Object.defineProperty(simultaneousIncludeExclude[4].wireProtocols, 'exclude', {
		value: [WireProtocol.JsonRpc2],
	})
	assert.throws(
		() => validateSourceBindingDeliveryCompatibility(simultaneousIncludeExclude),
		/cannot include and exclude simultaneously/
	)
})

test('rejects incompatible and empty authored bindings before compilation', () => {
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

	const browserCorsApp = structuredClone(app)
	const browserCorsSource = browserCorsApp.sources.sources.find((source) => source.source === Source.Blockscout_Rest)
	const browserCorsBinding = browserCorsSource?.binding ?? browserCorsSource?.bindings?.[0]

	assert.ok(browserCorsBinding)
	Object.defineProperty(browserCorsBinding, 'delivery', {
		value: SourceDelivery.BrowserDirect,
	})
	assert.throws(() => compileApp(browserCorsApp), /BrowserDirect HTTP endpoint requires corsEnabled true/)

	const templatedProxyApp = structuredClone(app)
	const templatedProxySource = templatedProxyApp.sources.sources.find((source) => source.source === Source.Blockscout_Rest)
	const templatedProxyBinding = templatedProxySource?.binding ?? templatedProxySource?.bindings?.[0]

	assert.ok(templatedProxyBinding?.endpoints[0])
	Object.defineProperty(templatedProxyBinding.endpoints[0], 'locator', {
		value: 'https://{origin}/api/v2',
	})
	assert.throws(() => compileApp(templatedProxyApp), /HttpProxy requires a concrete HTTP origin/)
})

test('rejects unordered source registries and binding membership sets without sorting priority axes', () => {
	const duplicateProviderRegistryApp = structuredClone(app)
	Object.defineProperty(duplicateProviderRegistryApp.sources, 'providers', {
		value: [
			duplicateProviderRegistryApp.sources.providers[0],
			duplicateProviderRegistryApp.sources.providers[0],
			...duplicateProviderRegistryApp.sources.providers.slice(1),
		],
	})
	assert.throws(() => compileApp(duplicateProviderRegistryApp), /Source provider definitions contains duplicate/)

	const duplicateSourceRegistryApp = structuredClone(app)
	Object.defineProperty(duplicateSourceRegistryApp.sources, 'sources', {
		value: [
			duplicateSourceRegistryApp.sources.sources[0],
			duplicateSourceRegistryApp.sources.sources[0],
			...duplicateSourceRegistryApp.sources.sources.slice(1),
		],
	})
	assert.throws(() => compileApp(duplicateSourceRegistryApp), /Source definitions contains duplicate/)

	const providerRegistryApp = structuredClone(app)
	Object.defineProperty(providerRegistryApp.sources, 'providers', {
		value: providerRegistryApp.sources.providers.toReversed(),
	})
	assert.throws(() => compileApp(providerRegistryApp), /Source provider definitions must be alphabetized/)

	const sourceRegistryApp = structuredClone(app)
	Object.defineProperty(sourceRegistryApp.sources, 'sources', {
		value: sourceRegistryApp.sources.sources.toReversed(),
	})
	assert.throws(() => compileApp(sourceRegistryApp), /Source definitions must be alphabetized/)

	const operationGroupApp = structuredClone(app)
	const operationGroupBinding = operationGroupApp.sources.sources
		.flatMap((source) => source.bindings ?? (source.binding == null ? [] : [source.binding]))
		.find((binding) => binding.operationGroups.length > 1)

	assert.ok(operationGroupBinding)
	operationGroupBinding.operationGroups.reverse()
	assert.throws(() => compileApp(operationGroupApp), /operation groups must be alphabetized/)

	const artifactApp = structuredClone(app)
	const artifactBinding = artifactApp.sources.sources
		.flatMap((source) => source.bindings ?? (source.binding == null ? [] : [source.binding]))
		.find((binding) => (binding.artifacts?.length ?? 0) > 1)

	assert.ok(artifactBinding?.artifacts)
	artifactBinding.artifacts.reverse()
	assert.throws(() => compileApp(artifactApp), /artifacts must be alphabetized/)

	const credentialKeyApp = structuredClone(app)
	const credentialKeyBinding = credentialKeyApp.sources.sources
		.flatMap((source) => source.bindings ?? (source.binding == null ? [] : [source.binding]))
		.find((binding) => binding.credentials.some((credential) => !('envKey' in credential) && (credential.keys?.length ?? 0) > 1))
	const credential = credentialKeyBinding?.credentials.find((candidate) => !('envKey' in candidate) && (candidate.keys?.length ?? 0) > 1)

	assert.ok(credential && !('envKey' in credential) && credential.keys)
	credential.keys.reverse()
	assert.throws(() => compileApp(credentialKeyApp), /credential keys must be alphabetized/)
})

test('enforces canonical delivery endpoint and credential layouts during compilation', () => {
	const mixedProxyCredentialsApp = structuredClone(app)
	const mixedProxyCredentialsSource = mixedProxyCredentialsApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const mixedProxyCredentialsBinding = mixedProxyCredentialsSource?.binding ?? mixedProxyCredentialsSource?.bindings?.[0]

	assert.ok(mixedProxyCredentialsBinding?.credentials[0])
	Object.defineProperty(mixedProxyCredentialsBinding, 'credentials', {
		value: [
			{ scope: SourceCredentialScope.PublicConfig },
			mixedProxyCredentialsBinding.credentials[0],
		],
	})
	assert.doesNotThrow(() => compileApp(mixedProxyCredentialsApp))

	const misplacedRuntimeSecretApp = structuredClone(mixedProxyCredentialsApp)
	const misplacedRuntimeSecretSource = misplacedRuntimeSecretApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const misplacedRuntimeSecretBinding = misplacedRuntimeSecretSource?.binding ?? misplacedRuntimeSecretSource?.bindings?.[0]

	assert.ok(misplacedRuntimeSecretBinding)
	misplacedRuntimeSecretBinding.credentials.reverse()
	assert.throws(() => compileApp(misplacedRuntimeSecretApp), /at most one trailing runtime secret/)

	const repeatedRuntimeSecretApp = structuredClone(app)
	const repeatedRuntimeSecretSource = repeatedRuntimeSecretApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const repeatedRuntimeSecretBinding = repeatedRuntimeSecretSource?.binding ?? repeatedRuntimeSecretSource?.bindings?.[0]

	assert.ok(repeatedRuntimeSecretBinding?.credentials[0])
	repeatedRuntimeSecretBinding.credentials.push(repeatedRuntimeSecretBinding.credentials[0])
	assert.throws(() => compileApp(repeatedRuntimeSecretApp), /at most one trailing runtime secret/)

	const localProxyCredentialApp = structuredClone(app)
	const localProxyCredentialSource = localProxyCredentialApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const localProxyCredentialBinding = localProxyCredentialSource?.binding ?? localProxyCredentialSource?.bindings?.[0]

	assert.ok(localProxyCredentialBinding)
	Object.defineProperty(localProxyCredentialBinding, 'credentials', {
		value: [{ scope: SourceCredentialScope.LocalSecret }],
	})
	assert.throws(() => compileApp(localProxyCredentialApp), /cannot require local secrets/)

	const invalidGrpcEndpointApp = structuredClone(app)
	const invalidGrpcEndpointSource = invalidGrpcEndpointApp.sources.sources.find((source) => source.source === Source.GetBlockYellowstone_Grpc)
	const invalidGrpcEndpointBinding = invalidGrpcEndpointSource?.binding ?? invalidGrpcEndpointSource?.bindings?.[0]

	assert.ok(invalidGrpcEndpointBinding?.endpoints[0])
	Object.defineProperties(invalidGrpcEndpointBinding.endpoints[0], {
		endpointKind: { value: SourceEndpointKind.TcpAddress },
		corsEnabled: { value: undefined },
	})
	assert.throws(() => compileApp(invalidGrpcEndpointApp), /RemoteLive requires HTTP endpoints/)

	const invalidRemoteSecretApp = structuredClone(app)
	const invalidRemoteSecretSource = invalidRemoteSecretApp.sources.sources.find((source) => source.source === Source.GetBlockYellowstone_Grpc)
	const invalidRemoteSecretBinding = invalidRemoteSecretSource?.binding ?? invalidRemoteSecretSource?.bindings?.[0]

	assert.ok(invalidRemoteSecretBinding?.credentials[0])
	Object.defineProperty(invalidRemoteSecretBinding.credentials[0], 'envKey', {
		value: '',
	})
	assert.throws(() => compileApp(invalidRemoteSecretApp), /RemoteLive runtime secret requires envKey/)

	const reversedLiveEndpointsApp = structuredClone(app)
	const reversedLiveEndpointsSource = reversedLiveEndpointsApp.sources.sources.find((source) => source.source === Source.AtprotoSync_Xrpc)
	const reversedLiveEndpointsBinding = reversedLiveEndpointsSource?.binding ?? reversedLiveEndpointsSource?.bindings?.[0]

	assert.ok(reversedLiveEndpointsBinding)
	reversedLiveEndpointsBinding.endpoints.reverse()
	assert.throws(() => compileApp(reversedLiveEndpointsApp), /at most one leading HTTP endpoint/)

	const missingLiveWebSocketApp = structuredClone(app)
	const missingLiveWebSocketSource = missingLiveWebSocketApp.sources.sources.find((source) => source.source === Source.AtprotoSync_Xrpc)
	const missingLiveWebSocketBinding = missingLiveWebSocketSource?.binding ?? missingLiveWebSocketSource?.bindings?.[0]

	assert.ok(missingLiveWebSocketBinding?.endpoints[1])
	Object.defineProperties(missingLiveWebSocketBinding.endpoints[1], {
		endpointKind: { value: SourceEndpointKind.HttpUrl },
		locator: { value: 'https://example.com' },
	})
	assert.throws(() => compileApp(missingLiveWebSocketApp), /at most one leading HTTP endpoint/)

	const browserLocalEndpointApp = structuredClone(app)
	const browserLocalEndpointSource = browserLocalEndpointApp.sources.sources.find((source) => source.source === Source.Git_Local)
	const browserLocalEndpointBinding = browserLocalEndpointSource?.binding ?? browserLocalEndpointSource?.bindings?.[0]

	assert.ok(browserLocalEndpointBinding)
	Object.defineProperty(browserLocalEndpointBinding, 'delivery', {
		value: SourceDelivery.BrowserDirect,
	})
	assert.throws(() => compileApp(browserLocalEndpointApp), /BrowserDirect requires browser-addressable endpoints/)

	const remoteQueryLocalCredentialApp = structuredClone(app)
	const remoteQueryLocalCredentialSource = remoteQueryLocalCredentialApp.sources.sources.find((source) => source.source === Source.Avail)
	const remoteQueryLocalCredentialBinding = remoteQueryLocalCredentialSource?.binding ?? remoteQueryLocalCredentialSource?.bindings?.[0]

	assert.ok(remoteQueryLocalCredentialBinding)
	Object.defineProperty(remoteQueryLocalCredentialBinding, 'credentials', {
		value: [{ scope: SourceCredentialScope.LocalSecret }],
	})
	assert.doesNotThrow(() => compileApp(remoteQueryLocalCredentialApp))

	const publicConfigKeysApp = structuredClone(app)
	const publicConfigKeysSource = publicConfigKeysApp.sources.sources.find((source) => source.source === Source.Avail)
	const publicConfigKeysBinding = publicConfigKeysSource?.binding ?? publicConfigKeysSource?.bindings?.[0]

	assert.ok(publicConfigKeysBinding?.credentials[0])
	Object.defineProperty(publicConfigKeysBinding.credentials[0], 'keys', {
		value: [],
	})
	assert.throws(() => compileApp(publicConfigKeysApp), /PublicConfig credentials derive keys from env/)

	const requirementInjectionApp = structuredClone(app)
	const requirementInjectionSource = requirementInjectionApp.sources.sources.find((source) => source.source === Source.Avail)
	const requirementInjectionBinding = requirementInjectionSource?.binding ?? requirementInjectionSource?.bindings?.[0]

	assert.ok(requirementInjectionBinding?.credentials[0])
	Object.defineProperties(requirementInjectionBinding.credentials[0], {
		envKey: { value: 'INVALID' },
		injection: { value: { header: { name: 'x-invalid' } } },
	})
	assert.throws(() => compileApp(requirementInjectionApp), /credential requirements cannot declare server-secret injection/)

	const managedSecretKeysApp = structuredClone(app)
	const managedSecretKeysSource = managedSecretKeysApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const managedSecretKeysBinding = managedSecretKeysSource?.binding ?? managedSecretKeysSource?.bindings?.[0]

	assert.ok(managedSecretKeysBinding?.credentials[0])
	Object.defineProperty(managedSecretKeysBinding.credentials[0], 'keys', {
		value: ['GETBLOCK_API_KEY'],
	})
	assert.throws(() => compileApp(managedSecretKeysApp), /managed runtime secrets cannot declare env or keys/)

	const missingSecretInjectionApp = structuredClone(app)
	const missingSecretInjectionSource = missingSecretInjectionApp.sources.sources.find((source) => source.source === Source.GetBlockRpc_JsonRpc)
	const missingSecretInjectionBinding = missingSecretInjectionSource?.binding ?? missingSecretInjectionSource?.bindings?.[0]

	assert.ok(missingSecretInjectionBinding?.credentials[0])
	Reflect.deleteProperty(missingSecretInjectionBinding.credentials[0], 'injection')
	assert.throws(() => compileApp(missingSecretInjectionApp), /runtime secret requires injection/)
})

test('consumes authored singular lists and plural query presentation defaults', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const ensNetworkView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/_GlobalEnsNetworkView.svelte')
	const marketCandlesView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/Market_TimeInterval_TimestampsView.svelte')
	const specificationRealmView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/SpecificationRealmView.svelte')

	assert.ok(ensNetworkView)
	assert.ok(marketCandlesView)
	assert.ok(specificationRealmView)
	assert.match(renderGeneratedFile(ensNetworkView), /_GlobalEnsNetwork_TimestampsView/)
	assert.match(renderGeneratedFile(marketCandlesView), /placeholderText = 'Loading OHLC candles\.\.\.'/)
	assert.match(renderGeneratedFile(marketCandlesView), /limit: 4096/)
	assert.match(renderGeneratedFile(specificationRealmView), /href=\{resolve\('\/\(proposals\)\/proposals'\)\}/)

	const invalidListRouteApp = structuredClone(app)
	const specificationRealm = invalidListRouteApp.schema.entities.find((entity) => entity.entityType === EntityType.SpecificationRealm)
	assert.ok(specificationRealm?.views.singular?.lists?.[0])
	specificationRealm.views.singular.lists[0].href = '/(missing)/missing'
	assert.throws(
		() => compileApp(invalidListRouteApp),
		/SpecificationRealm\.\$\$proposalKinds list references missing internal route \/\(missing\)\/missing/
	)
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

test('validates one canonical entity type list', () => {
	const duplicateEntityApp = structuredClone(app)
	const network = duplicateEntityApp.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	assert.ok(network)
	duplicateEntityApp.schema.entities.push(structuredClone(network))

	assert.throws(
		() => compileApp(duplicateEntityApp),
		/Duplicate entity type: Network/
	)
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	assert.match(generatorSource, /const entityTypes = Object\.freeze\(activeEntities\.map/)
	assert.equal((generatorSource.match(/expectUnique\('entity type'/g) ?? []).length, 1)
	assert.doesNotMatch(generatorSource, /expectUnique\('active entity type'/)
	assert.equal((generatorSource.match(/selector references missing field/g) ?? []).length, 1)
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

test('rejects underivable route projection subjects', () => {
	const underivableProjectionApp = structuredClone(app)
	const networkMapping = underivableProjectionApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]?.Caip2

	assert.ok(networkMapping)
	Object.defineProperty(networkMapping, 'projection', {
		enumerable: true,
		value: {
			entityType: EntityType.EvmCoinInstance,
			facetPath: ['NativeCurrency'],
		},
	})
	assert.throws(
		() => compileApp(underivableProjectionApp),
		/\/\(explore\)\/\(networks\)\/network\/\[network\] Network\.Caip2 cannot derive projection subject EvmCoinInstance/
	)
})

test('rejects duplicate selector route mappings before indexing', () => {
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]

	assert.ok(networkMappings?.Caip2)
	assert.throws(
		() => compileApp({
			...app,
			routes: {
				children: {
					...authoredListTargetRouteFixtures,
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
	const generatedFiles = compileApp({
		...app,
		routes: {
			children: {
				...authoredListTargetRouteFixtures,
				'(explore)': {
					children: {
						account: accountRoute,
					},
				},
			},
		},
	}).generatedFiles
	const evmAccountsView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmAccountsView.svelte')

	assert.ok(evmAccountsView)
	assert.match(
		renderGeneratedFile(evmAccountsView),
		/href=\{[\s\S]*?resolve\([\s\S]*?'\/\(explore\)\/account\/\[address=evmAddress\]',[\s\S]*?address: evmAccountSelector\.address,/
	)
	assert.doesNotMatch(renderGeneratedFile(evmAccountsView), /\/xmtp\/account/)
})

test('keeps ActivityPub relation list hrefs scoped to their owning entity', () => {
	const activityPubActorView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))
	const activityPubNoteView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubNoteView.svelte'
	))

	assert.ok(activityPubActorView)
	assert.ok(activityPubNoteView)
	const activityPubActorSource = renderGeneratedFile(activityPubActorView)
	const activityPubNoteSource = renderGeneratedFile(activityPubNoteView)
	assert.match(
		activityPubActorSource,
		/'instanceOrigin' in selection\.entitySelector\s*&& 'localAccountId' in selection\.entitySelector \?\s*resolve\([\s\S]*?'\/\(social\)\/\(activitypub\)\/activitypub\/\(globalActivityPubNetwork\)\/actor\/\[instanceOrigin=absoluteUrl\]\/\[localAccountId=stringSegment\]\/\(activityPubActor\)\/notes',[\s\S]*?instanceOrigin: encodeURIComponent\(selection\.entitySelector\.instanceOrigin\),[\s\S]*?localAccountId: selection\.entitySelector\.localAccountId,[\s\S]*?\)\s*:\s*undefined/
	)
	assert.doesNotMatch(activityPubActorSource, /href=\{resolve\('\/activitypub\/notes'\)\}/)
	assert.doesNotMatch(activityPubActorSource, /resolve\(\s*`/)
	assert.match(
		activityPubNoteSource,
		/'instanceOrigin' in selection\.entitySelector\s*&& 'localStatusId' in selection\.entitySelector \?\s*resolve\([\s\S]*?'\/\(social\)\/\(activitypub\)\/activitypub\/\(globalActivityPubNetwork\)\/note\/\[instanceOrigin=absoluteUrl\]\/\[localStatusId=stringSegment\]\/\(activityPubNote\)\/thread',[\s\S]*?instanceOrigin: encodeURIComponent\(selection\.entitySelector\.instanceOrigin\),[\s\S]*?localStatusId: selection\.entitySelector\.localStatusId,[\s\S]*?\)\s*:\s*undefined/
	)
	assert.doesNotMatch(activityPubNoteSource, /href=\{resolve\('\/activitypub\/notes'\)\}/)
	assert.doesNotMatch(activityPubNoteSource, /resolve\(\s*`/)

	const routeMutationApp = structuredClone(app)
	const actorChildren = routeMutationApp.routes.children['(social)']?.children?.['(activitypub)']?.children?.activitypub
		?.children?.actor?.children?.['[instanceOrigin]']
		?.children?.['[localAccountId]']?.children

	assert.ok(actorChildren?.notes)
	actorChildren['actor-posts'] = actorChildren.notes
	delete actorChildren.notes
	const mutatedGeneratedFiles = compileApp(routeMutationApp).generatedFiles
	const mutatedActivityPubActorView = mutatedGeneratedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))

	assert.ok(mutatedActivityPubActorView)
	assert.match(renderGeneratedFile(mutatedActivityPubActorView), /\[localAccountId=stringSegment\]\/\(activityPubActor\)\/actor-posts'/)
	assert.doesNotMatch(renderGeneratedFile(mutatedActivityPubActorView), /\[localAccountId=stringSegment\]\/\(activityPubActor\)\/notes'/)
})

test('renders ActivityPub syndication HTML through one safe rich-body mode and plain summaries', () => {
	const actorView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubActorView.svelte'
	))
	const noteView = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/ActivityPubNoteView.svelte'
	))

	assert.ok(actorView)
	assert.ok(noteView)
	for (const generatedView of [actorView, noteView].map(renderGeneratedFile)) {
		assert.match(generatedView, /import \{ htmlToPlainText \} from '\$\/lib\/html\.ts'/)
		assert.match(generatedView, /<Markdown content=\{htmlToPlainText\([^)]+\)\} mode="syndication" \/>/)
		assert.doesNotMatch(generatedView, /<Markdown content=\{String\(/)
		assert.doesNotMatch(generatedView, /\{@html/)
	}
	assert.match(renderGeneratedFile(noteView), /htmlToPlainText/)
	assert.doesNotMatch(renderGeneratedFile(noteView), /String\(\(htmlToPlainText/)
	const notesView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNotesView.svelte')
	const noteTimestampsView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNote_TimestampsView.svelte')
	assert.ok(notesView)
	assert.ok(noteTimestampsView)
	for (const generatedView of [notesView, noteTimestampsView].map(renderGeneratedFile))
		assert.match(generatedView, /import \{ htmlToPlainText \} from '\$\/lib\/html\.ts'/)

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
	assert.match(renderGeneratedFile(mutatedNoteView), /prefetched\.content\.toUpperCase\(\)/)
	assert.doesNotMatch(renderGeneratedFile(mutatedNoteView), /\(prefetched\.content\)\.toUpperCase\(\)/)
})

test('classifies display-expression bindings from TypeScript syntax', () => {
	const proposalView = compileApp({
		...app,
		schema: {
			...app.schema,
			valueTypes: app.schema.valueTypes.map((valueType) => (
				valueType.id === 'CardanoGovernanceTreasuryWithdrawal' ?
					{
						...valueType,
						displayExpression: "'value'",
					}
				:
					valueType
			)),
		},
	}).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/CardanoGovernanceProposalView.svelte')

	assert.ok(proposalView)
	const proposalViewSource = renderGeneratedFile(proposalView)
	assert.match(proposalViewSource, /<dt>treasury withdrawals<\/dt>[\s\S]*?\{#snippet children\(entity\)\}\s+value\s+\{\/snippet\}/)
	assert.doesNotMatch(proposalViewSource, /\.values\.map\(\(value\) => 'value'\)/)
})

test('keeps schema-construction imports out of generated view display dependencies', () => {
	for (const path of [
		'src/views/BridgeRouteView.svelte',
		'src/views/BridgeRouteQuote_TimestampView.svelte',
	]) {
		const generatedView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(generatedView)
		const source = renderGeneratedFile(generatedView)
		assert.match(source, /import \{ bridgeRouteTagByTag \} from '\$\/constants\/Bridge\.ts'/)
		assert.doesNotMatch(source, /from '\$\/schema\/BridgeRouteTag\.ts'/)
	}
})

test('imports every enum referenced by generated schema construction', () => {
	const mismatches = baselineCompiledApp.generatedFiles
		.filter(({ path: filePath }) => filePath.startsWith('src/schema/') && filePath.endsWith('.ts'))
		.flatMap((generatedFile) => {
			const source = renderGeneratedFile(generatedFile)
			return [...source.matchAll(/Object\.values\(([A-Za-z_$][\w$]*)\)/g)].flatMap((match) => {
				const enumName = match[1]
				return enumName != null && !new RegExp(`import \\{[^}]*\\b${enumName}\\b[^}]*\\} from`).test(source) ?
					[`${generatedFile.path}: ${enumName}`]
				:
					[]
			})
		})

	assert.deepEqual(mismatches, [])
})

test('imports ArkType only when generated schema construction references it', () => {
	const schemaImportContracts = app.schema.entities.map((entity) => {
		const filePath = `src/schema/${entity.entityType}.ts`
		const sourceFile = ts.createSourceFile(
			filePath,
			generatedSource(filePath),
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS
		)
		const imported = sourceFile.statements.some((statement) => (
			ts.isImportDeclaration(statement)
			&& ts.isStringLiteral(statement.moduleSpecifier)
			&& statement.moduleSpecifier.text === 'arktype'
			&& statement.importClause?.namedBindings != null
			&& ts.isNamedImports(statement.importClause.namedBindings)
			&& statement.importClause.namedBindings.elements.some(({ name }) => name.text === 'type')
		))
		let referenced = false
		const visit = (node: ts.Node) => {
			if (
				ts.isIdentifier(node)
				&& node.text === 'type'
				&& !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
				&& !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
			)
				referenced = true
			else
				ts.forEachChild(node, visit)
		}
		for (const statement of sourceFile.statements)
			if (!ts.isImportDeclaration(statement))
				visit(statement)

		return {
			filePath,
			imported,
			referenced,
		}
	})

	assert.deepEqual(schemaImportContracts.flatMap(({ filePath, imported, referenced }) => (
		imported === referenced ? [] : [`${filePath}: imported=${imported} referenced=${referenced}`]
	)), [])
	assert.equal(schemaImportContracts.filter(({ imported }) => !imported).length, 36)
	assert.match(generatedSource('src/schema/A2aAgentCard.ts'), /import \{ UrlString \} from '\$\/schema\/UrlString\.ts'/)
	assert.doesNotMatch(generatedSource('src/schema/A2aAgentCard.ts'), /from 'arktype'/)
	assert.match(generatedSource('src/schema/FarcasterVerifiedAddress.ts'), /import \{ type \} from 'arktype'[\s\S]*?primitiveType: type\(/)
	assert.match(generatedSource('src/schema/EthereumConsensusUpgrade.ts'), /import \{ type \} from 'arktype'[\s\S]*?primitiveType: type\.enumerated\(/)
})

test('renders ActivityPub content warnings as selector-scoped native disclosure', () => {
	const noteView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNoteView.svelte')
	const notesView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/ActivityPubNotesView.svelte')

	assert.ok(noteView)
	assert.ok(notesView)
	const noteSource = renderGeneratedFile(noteView)
	const notesSource = renderGeneratedFile(notesView)
	assert.match(noteSource, /const contentWarningSelectorKey = \$derived\(stringify\(/)
	assert.match(noteSource, /open=\{revealedContentWarningSelectorKey === contentWarningSelectorKey\}/)
	assert.match(noteSource, /\{#if revealedContentWarningSelectorKey === contentWarningSelectorKey\}\s+\{@render ContentWarningContent\(content\)\}\s+\{\/if\}/)
	assert.match(noteSource, /<Collapsible[\s\S]*?<header[^>]*>[\s\S]*?Show content/)
	assert.match(noteSource, /<Collapsible\n\s+open=\{revealedContentWarningSelectorKey[\s\S]{0,500}\{#snippet Summary\(\)\}/)
	assert.doesNotMatch(noteSource, /<Collapsible\n\s+open=\{revealedContentWarningSelectorKey[\s\S]{0,500}\{#snippet Summary\(\{\}\)\}/)
	assert.doesNotMatch(noteSource, /\{#snippet Summary\(\{\}\)\}/)
	assert.match(noteSource, /\{#if entity\.sensitive === true \|\| contentWarningText !== ''\}/)
	assert.doesNotMatch(noteSource, /\{@const hasContentWarning/)
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
	for (const path of ['src/views/NostrNoteView.svelte']) {
		const nostrView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === path)
		assert.ok(nostrView)
		const nostrSource = renderGeneratedFile(nostrView)
		assert.match(nostrSource, /entity\.sensitive === true \|\| \(entity\.contentWarning \?\? ''\)\.trim\(\) !== ''/)
		assert.equal((nostrSource.match(/<Collapsible\n/g) ?? []).length, 1)
		assert.equal((nostrSource.match(/<Markdown content=/g) ?? []).length, 0)
		assert.doesNotMatch(nostrSource, /\.ready|\.loading|\.error|\{@html/)
		if (path.includes('Note')) {
			assert.match(nostrSource, /resource=\{selection\.\$replyToNote\}[\s\S]*?<NostrNoteView/)
			assert.match(nostrSource, /resource=\{selection\.\$rootNote\}[\s\S]*?<NostrNoteView/)
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
	const actorView = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/views/AtprotoActorView.svelte')

	assert.ok(actor)
	assert.ok(observation)
	assert.ok(routeMetadata)
	assert.ok(didPage)
	assert.ok(handlePage)
	assert.ok(actorView)
	assert.deepEqual(actor.selectors.map(({ name }) => name), ['Did', 'Handle'])
	assert.match(renderGeneratedFile(didPage), /<AtprotoActorView\n\t\tselection=\{pageSelection\}/)
	assert.doesNotMatch(renderGeneratedFile(didPage), /fields: \{[\s\S]*?handle: true/)
	assert.doesNotMatch(renderGeneratedFile(didPage), /href=|resolve\(/)
	assert.match(renderGeneratedFile(actorView), /<EntityView[\s\S]*?\thref=\{[\s\S]*?resolve\([\s\S]*?\[did=stringSegment\]/)
	assert.doesNotMatch(renderGeneratedFile(didPage), /globalThis\.location\.replace/)
	assert.doesNotMatch(renderGeneratedFile(handlePage), /<AtprotoActorView/)
	assert.match(renderGeneratedFile(handlePage), /<ResourceBoundary resource=\{pageSelection\.did\}>/)
	assert.match(renderGeneratedFile(handlePage), /fields: \{[\s\S]*?did: true/)
	assert.match(renderGeneratedFile(handlePage), /\{#snippet children\(resolvedField\)\}/)
	assert.match(renderGeneratedFile(handlePage), /globalThis\.location\.replace\(canonicalEntityHref\)/)
	assert.match(
		renderGeneratedFile(handlePage),
		/resolve\([\s\S]*?'\/\(social\)\/\(atproto\)\/atproto\/\(globalAtprotoNetwork\)\/actor\/\[did=stringSegment\]',[\s\S]*?did: encodeURIComponent\(\{ \.\.\.pageSelection\.entitySelector, did: resolvedField \}\.did\),/
	)
	assert.doesNotMatch(renderGeneratedFile(handlePage), /resolve\(`/)
	assert.doesNotMatch(renderGeneratedFile(handlePage), /`\$\{base\}/)
	assert.doesNotMatch(renderGeneratedFile(handlePage), /\$effect/)
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

test('keeps arbitrary ATProto entities on appview authority without catalog fallback', () => {
	const actor = app.schema.entities.find(({ entityType }) => entityType === EntityType.AtprotoActor)
	const globalNetwork = app.schema.entities.find(({ entityType }) => entityType === EntityType._GlobalAtprotoNetwork)
	const post = app.schema.entities.find(({ entityType }) => entityType === EntityType.AtprotoPost)
	const postPage = baselineCompiledApp.generatedFiles.find(({ path }) => path === 'src/routes/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/+page.svelte')

	assert.ok(actor?.views.singular?.query)
	assert.ok(globalNetwork?.views.singular?.query)
	assert.ok(post?.views.singular?.query)
	assert.ok(postPage)
	assert.deepEqual(actor.views.singular.query.sources, [Source.Atproto_Xrpc])
	assert.deepEqual(post.views.singular.query.sources, [Source.Atproto_Xrpc])
	assert.deepEqual(globalNetwork.views.singular.query.sources, [Source.Constants_Internal])
	for (const fieldName of ['$$thread', '$$timestamps'])
		assert.deepEqual(
			post.fields.find(({ name }) => name === fieldName)?.defaultSources,
			[Source.Atproto_Xrpc]
		)
	assert.match(renderGeneratedFile(postPage), /sources: \[\s*Source\.Atproto_Xrpc,?\s*\]/)
	assert.doesNotMatch(renderGeneratedFile(postPage), /Source\.Constants_Internal/)
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
					...authoredListTargetRouteFixtures,
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
					...authoredListTargetRouteFixtures,
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

test('emits selector names only in each entity schema selector definition', () => {
	const entitySchemaFiles = baselineCompiledApp.generatedFiles.filter(({ path }) => (
		path.startsWith('src/schema/')
		&& path !== 'src/schema/EntityType.ts'
	))
	const networkSchema = entitySchemaFiles.find(({ path }) => path === 'src/schema/Network.ts')

	assert.ok(networkSchema)
	for (const generatedFile of entitySchemaFiles)
		assert.doesNotMatch(
			renderGeneratedFile(generatedFile),
			/export enum [A-Za-z_$][A-Za-z0-9_$]*Selector \{/,
			generatedFile.path
		)
	assert.match(
		renderGeneratedFile(networkSchema),
		/selectors: \{\s*Caip2: \[\s*'caip2',\s*\],\s*Slug: \[\s*'slug',\s*\],\s*\}/
	)
	for (const entity of app.schema.entities) {
		const entitySchema = entitySchemaFiles.find(({ path }) => path === `src/schema/${entity.entityType}.ts`)
		assert.ok(entitySchema)
		const entitySchemaSource = renderGeneratedFile(entitySchema)
		for (const appEnum of entity.enums ?? []) {
			const enumFile = entitySchemaFiles.find(({ path }) => path === `src/schema/${appEnum.name}.ts`)
			assert.ok(enumFile)
			const enumSource = renderGeneratedFile(enumFile)
			assert.equal(enumSource.startsWith(`${generatedHeader}\n\nexport enum ${appEnum.name} {\n`), true)
			assert.equal(enumSource.endsWith('\n}\n'), true)
			assert.match(
				entitySchemaSource,
				new RegExp(`import \\{ ${appEnum.name} \\} from '\\$/schema/${appEnum.name}\\.ts'`)
			)
			assert.doesNotMatch(entitySchemaSource, new RegExp(`export enum ${appEnum.name} \\{`))
		}
	}
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
						...authoredListTargetRouteFixtures,
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

test('uses indexed selector mappings to distinguish shared public route shapes', () => {
	const disjointRouteApp = structuredClone(app)
	const caip2Node = disjointRouteApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']
	const networkMappings = caip2Node?.selectors?.[EntityType.Network]
	assert.ok(caip2Node)
	assert.ok(networkMappings?.Caip2)
	assert.ok(networkMappings.Slug)
	const slugNode = structuredClone(caip2Node)
	Object.defineProperties(caip2Node, {
		children: {
			enumerable: true,
			value: {},
		},
		params: {
			enumerable: true,
			value: {
				network: ['NetworkSlug'],
			},
		},
		selectors: {
			enumerable: true,
			value: {
				[EntityType.Network]: {
					Caip2: networkMappings.Caip2,
				},
			},
		},
	})
	Object.defineProperties(slugNode, {
		children: {
			enumerable: true,
			value: {},
		},
		params: {
			enumerable: true,
			value: {
				network: ['caip2'],
			},
		},
		selectors: {
			enumerable: true,
			value: {
				[EntityType.Network]: {
					Slug: networkMappings.Slug,
				},
			},
		},
	})
	disjointRouteApp.routes.outcomes = undefined
	Object.defineProperty(disjointRouteApp.routes.children, '(network-slug-overlap)', {
		enumerable: true,
		value: {
			children: {
				network: {
					children: {
						'[network]': slugNode,
					},
				},
			},
		},
	})

	assert.doesNotThrow(() => compileApp(disjointRouteApp))
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	assert.match(generatorSource, /routeProbeMappingsByNode\.get\(left\.internalPath\) \?\? \[\]/)
	assert.doesNotMatch(generatorSource, /routeProbeMappingsByNode\.get\([^\n]+\)\?\.mappings/)
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
						...authoredListTargetRouteFixtures,
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
			...authoredListTargetRouteFixtures,
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

test('returns discriminated route identity for detail dispatch', () => {
	const routePath = 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]'
	const routeModule = baselineCompiledApp.generatedFiles.find(({ path }) => path === `${routePath}/+layout.ts`)
	const detailPage = baselineCompiledApp.generatedFiles.find(({ path }) => path === `${routePath}/+page.svelte`)
	const detailLayout = baselineCompiledApp.generatedFiles.find(({ path }) => path === `${routePath}/(selection)/+layout.svelte`)
	assert(routeModule)
	assert(detailPage)
	assert(detailLayout)
	const routeModuleSource = renderGeneratedFile(routeModule)
	const detailPageSource = renderGeneratedFile(detailPage)
	const detailLayoutSource = renderGeneratedFile(detailLayout)

	assert.match(
		routeModuleSource,
		/routeCandidates\.push\(\{[\s\S]*?entityType: EntityType\.EvmTransaction,[\s\S]*?selectorName: 'EvmNetworkTxHash'/
	)
	assert.match(routeModuleSource, /parseEntitySelector\([\s\S]*?'EvmNetworkTxHash'\s*\)/)
	assert.doesNotMatch(routeModuleSource, /'(?:\$network|txHash)' in [A-Za-z0-9]+Selector/)
	assert.match(detailPageSource, /data\.entityType === EntityType\.EvmTransaction \?/)
	assert.doesNotMatch(detailPageSource, /data\.selectorName/)
	assert.match(detailLayoutSource, /data\.entityType === EntityType\.EvmTransaction \? EvmTransactionView/)
	assert.doesNotMatch(detailLayoutSource, /data\.selectorName/)
})

test('groups inherited selector fields under one route mapping', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.match(generatorSource, /type SelectorAncestorBinding = \{[\s\S]*?field: string[\s\S]*?alternatives: readonly \{[\s\S]*?ancestorNodeId: string[\s\S]*?referencePath: readonly string\[\]/)
	assert.doesNotMatch(generatorSource, /hrefParamCandidates|\bhrefs\?:/)
	assert.match(generatorSource, /\.\.\.normalizedSelectorMappings\.map\(\(normalizedMapping\) => \(\{[\s\S]*?routeParamAlternatives: normalizedMapping\.routeParamAlternatives/)
	assert.match(generatorSource, /const compiledRouteNodes = compileRouteTree\(/)
	assert.doesNotMatch(generatorSource, /\b(?:compiledRoutes|compiledNodes)\b|children\.nodes/)
	assert.match(generatorSource, /type RouteParam = \{[\s\S]*?encoding\?: _RouteParamEncoding\n\}\ntype RouteParamCompilationContext = RouteParam & \{\n\texplicitValueTypes: readonly string\[\]/)
	assert.match(generatorSource, /params: routeParams\.map\(\(\{\n\s+explicitValueTypes: _explicitValueTypes,\n\s+\.\.\.routeParam/)
	assert.match(generatorSource, /const validateRouteParamAlternativeCoverage =/)
	assert.doesNotMatch(generatorSource, /SelectorRouteVariant|ownerNodeId|validateNormalizedRouteNodes|validateCompiledRoutes|detail layout requires one shared href/)
	assert.match(generatorSource, /type RouteDetailLayoutPlan = \{\n\tcomponents:/)
	assert.doesNotMatch(generatorSource, /type RouteDetail =/)
	assert.doesNotMatch(generatorSource, /duplicate detail selector plans/)
})

test('retains only physical route file facts consumed by route emitters', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const physicalRoutePlanSource = generatorSource.slice(
		generatorSource.indexOf('type CompiledPhysicalRouteFileFacts ='),
		generatorSource.indexOf('const routeProjectionKey =')
	)
	const physicalRouteFiles = baselineCompiledApp.generatedFiles.filter(({ path: filePath }) => (
		filePath.startsWith('src/routes/')
		&& /\/(?:\+page\.svelte|\+page\.ts|\+layout\.svelte|\+layout\.ts)$/.test(filePath)
	))

	assert.equal(physicalRouteFiles.length, 565)
	assert.doesNotMatch(physicalRoutePlanSource, /\bplacement:|\binheritedMappings,|\bprojectionOwnedByAncestor\b|\bpageModuleOwnership:/)
	assert.match(physicalRoutePlanSource, /const inheritedMappings = [^\n]+[\s\S]*?routeFile: inheritedMappings \? \{[\s\S]*?mappings: pageModule\?\.mappings/)
	assert.match(physicalRoutePlanSource, /const generatedPageModule = [\s\S]*?plan\.generatedPageModule === true/)
	assert.match(physicalRoutePlanSource, /routeNeedsPageModule[\s\S]*?!routeProjectionOwnedByAncestor/)
})

test('compiles each collection reference path once into its canonical route mapping', () => {
	const routeNodes = [...Object.values(app.routes.children)]
	let collectionCount = 0
	for (const routeNode of routeNodes) {
		collectionCount += routeNode.collections?.length ?? 0
		routeNodes.push(...Object.values(routeNode.children ?? {}))
	}
	assert.equal(collectionCount, 158)

	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const collectionMappingTypeSource = generatorSource.slice(
		generatorSource.indexOf('type CollectionRouteMapping ='),
		generatorSource.indexOf('type RouteFile =')
	)
	const routeNodeSource = generatorSource.slice(
		generatorSource.indexOf('type RouteNode ='),
		generatorSource.indexOf('type RelationshipSection =')
	)
	const collectionEmitterSource = generatorSource.slice(
		generatorSource.indexOf('type CollectionMapping ='),
		generatorSource.indexOf('const pageContextSection =')
	)

	assert.match(collectionMappingTypeSource, /referencePath: CollectionReferencePath\['fields'\]/)
	assert.doesNotMatch(collectionMappingTypeSource, /\n\t\t(?:field|path):/)
	assert.match(routeNodeSource, /collectionMappings: readonly CollectionRouteMapping\[\]/)
	assert.doesNotMatch(routeNodeSource, /targetEntityType|\n\t\t(?:entityType|field|path|selector):/)
	assert.match(generatorSource, /const compileCollectionReferencePath = \(/)
	assert.equal((generatorSource.match(/compileCollectionReferencePath\(/g) ?? []).length, 1)
	assert.doesNotMatch(collectionEmitterSource, /compileCollectionReferencePath\(/)
	assert.doesNotMatch(generatorSource, /collectionMappings: collectionMappings\.map|const collections = node\.collectionMappings\.map/)
})

test('retains only rendered detail layout facts', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')
	const detailPlanSource = generatorSource.slice(
		generatorSource.indexOf('type RouteDetailLayoutPlan ='),
		generatorSource.indexOf('type RouteAncestorSelector =')
	)
	const routeNodeSource = generatorSource.slice(
		generatorSource.indexOf('type RouteNode ='),
		generatorSource.indexOf('type RelationshipSection =')
	)

	assert.doesNotMatch(detailPlanSource, /\n\tselector:/)
	assert.doesNotMatch(detailPlanSource, /\n\tdetails:/)
	assert.match(routeNodeSource, /\n\tselectorMappings: readonly SelectorRouteMapping\[\]/)
	assert.doesNotMatch(routeNodeSource, /\n\tdetail\??:/)
	assert.doesNotMatch(generatorSource, /duplicate detail selector plans|ownDetailMappings|node\.detail/)
	assert.match(generatorSource, /const ownDetails = node\.selectorMappings\.flatMap/)
})

test('retains one keyed route parameter representation through href compilation', () => {
	const appSource = readFileSync(path.join(root, 'APP.ts'), 'utf8')
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.doesNotMatch(appSource, /params\?: \{\n\s+param: string\n\s+value: _Expression/)
	assert.doesNotMatch(appSource, /params:\s*\[\s*\{\s*param:/)
	assert.match(generatorSource, /type RouteParamValues = Readonly<Record<string, \{\n\tvalue: _Expression\n\tdecode\?: _ExpressionDecode\n\}>>/)
	assert.match(generatorSource, /type RouteLink = \{\n\tpath: string\n\tparams: RouteParamValues\n\}/)
	assert.match(generatorSource, /routeParamAlternatives: readonly RouteParamValues\[\]/)
	assert.match(generatorSource, /routeParamAlternatives: normalizedMapping\.routeParamAlternatives/)
	assert.match(generatorSource, /Object\.hasOwn\(routeParams, name\)/)
	assert.match(generatorSource, /params: Readonly<Record<string, string>> = \{\}/)
	assert.doesNotMatch(
		generatorSource,
		/routeParamAlternativesWithDecodes|alternative\.map\(\(\{ param, value \}\)|routeParams\.some\(\(\{ param \}\)|candidate\.params\.find|params\.map\(\(\{ param, value \}\): \[string, string\]/
	)
	assert.doesNotMatch(generatorSource, /const renderResolveExpression = \(path: string, params: readonly \[string, string\]\[\]/)
})

test('rejects undeclared regular and selector-variant route parameters upstream', () => {
	const regularParamApp = structuredClone(app)
	const networkMapping = regularParamApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]?.Caip2

	assert.ok(networkMapping?.params)
	Object.defineProperty(networkMapping.params, 'undeclared', {
		enumerable: true,
		value: ['slug'],
	})
	assert.throws(
		() => compileApp(regularParamApp),
		/\/\(explore\)\/\(networks\)\/network\/\[network\] Network\.Caip2 binds undeclared route parameter undeclared/
	)

	const variantParamApp = structuredClone(app)
	const selectorVariant = variantParamApp.routes.children['(explore)']?.children?.['(ipfs)']?.children?.['[namespace]']?.children?.['[target]']?.children?.path?.children?.['[...contentPath]']?.selectorVariant

	assert.ok(selectorVariant?.params)
	Object.defineProperty(selectorVariant.params, 'undeclared', {
		enumerable: true,
		value: ['contentPath'],
	})
	assert.throws(
		() => compileApp(variantParamApp),
		/\/\(explore\)\/\(ipfs\)\/\[namespace\]\/\[target\]\/path\/\[\.\.\.contentPath\] IpfsResource\.ResourceAddress selector variant binds missing route parameter undeclared/
	)
})

test('rejects regular detail href alternatives missing declared route parameters', () => {
	const mutatedApp = structuredClone(app)
	const networkNode = mutatedApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']
	const networkChildren = networkNode?.children
	const caip2Mapping = networkNode?.selectors?.[EntityType.Network]?.Caip2

	assert.ok(networkChildren)
	assert.ok(caip2Mapping)
	Object.defineProperty(networkChildren, '[unused]', {
		enumerable: true,
		value: {
			params: {
				unused: ['string'],
			},
			selectors: {
				[EntityType.Network]: {
					Caip2: caip2Mapping,
				},
			},
		},
	})
	assert.throws(
		() => compileApp(mutatedApp),
		/\/\(explore\)\/\(networks\)\/network\/\[network\]\/\[unused\] Network\.Caip2 href is missing route parameter unused/
	)
})

test('rejects selector-variant href alternatives missing declared route parameters', () => {
	const mutatedApp = structuredClone(app)
	const pathChildren = mutatedApp.routes.children['(explore)']?.children?.['(ipfs)']?.children?.['[namespace]']?.children?.['[target]']?.children?.path?.children
	const variantNode = pathChildren?.['[...contentPath]']

	assert.ok(pathChildren)
	assert.ok(variantNode)
	Object.defineProperty(pathChildren, '[...contentPath]-[unused]', {
		enumerable: true,
		value: {
			...variantNode,
			params: {
				...variantNode.params,
				unused: ['string'],
			},
		},
	})
	assert.throws(
		() => compileApp(mutatedApp),
		/\/\(explore\)\/\(ipfs\)\/\[namespace\]\/\[target\]\/path\/\[\.\.\.contentPath\]-\[unused\] IpfsResource\.ResourceAddress selector variant href is missing route parameter unused/
	)
})

test('rejects ambiguous same-entity detail components', () => {
	const mutatedApp = structuredClone(app)
	const slugPage = mutatedApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]?.Slug?.page

	assert.ok(slugPage)
	Object.defineProperty(slugPage, 'view', {
		enumerable: true,
		value: {
			component: 'CoinView',
		},
	})
	assert.throws(
		() => compileApp(mutatedApp),
		/\/\(explore\)\/\(networks\)\/network\/\[network\] detail layout assigns ambiguous components to Network/
	)
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

test('composes and independently deduplicates inherited route parameter alternatives', () => {
	const caip2 = {
		value: {
			kind: 'field' as const,
			name: 'caip2',
		},
	}
	const slug = {
		value: {
			kind: 'field' as const,
			name: 'slug',
		},
	}
	const owner = {
		value: {
			kind: 'field' as const,
			name: 'owner',
		},
	}
	const scope = {
		value: {
			kind: 'field' as const,
			name: 'scope',
		},
	}
	const alternatives = composeSelectorRouteParamAlternatives(
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
		() => composeSelectorRouteParamAlternatives(
			'Fixture.Decoder',
			{},
			[{
				field: '$network',
				alternatives: [
					{ network: caip2 },
					{
						network: {
							...caip2,
							decode: _ExpressionDecode.Number,
						},
					},
				],
			}]
		),
		/inherited field \$network alternatives disagree on decoder for route parameter network/
	)
	assert.throws(
		() => composeSelectorRouteParamAlternatives(
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
		/Fixture\.Ambiguous inherited field groups ambiguously bind route parameter network/
	)
})

test('keeps deep inherited href chains bounded', () => {
	let alternatives = [
		{
			network: {
				value: {
					kind: 'field' as const,
					name: 'caip2',
				},
			},
		},
		{
			network: {
				value: {
					kind: 'field' as const,
					name: 'slug',
				},
			},
		},
	]
	for (let depth = 0; depth < 100; depth += 1)
		alternatives = composeSelectorRouteParamAlternatives(
			`Fixture.Depth${depth}`,
			{},
			[{
				field: '$network',
				alternatives,
			}]
		)

	assert.equal(alternatives.length, 2)
})

test('bounds duplicate-heavy route parameter composition before Cartesian growth', () => {
	const wideAlternatives = Array.from({ length: 256 }, (_, index) => ({
		route: {
			value: {
				kind: 'field' as const,
				name: `route${index}`,
			},
		},
	}))
	const alternatives = composeSelectorRouteParamAlternatives(
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
						value: {
							kind: 'field' as const,
							name: 'scope',
						},
					},
				})),
			},
		]
	)

	assert.equal(alternatives.length, 256)
	assert.equal(new Set(alternatives.map(({ scope }) => JSON.stringify(scope))).size, 1)
	assert.throws(
		() => composeSelectorRouteParamAlternatives(
			'Fixture.TooWide',
			{},
			[{
				field: '$route',
				alternatives: [
					...wideAlternatives,
					{
						route: {
							value: {
								kind: 'field',
								name: 'route256',
							},
						},
					},
				],
			}]
		),
		/Fixture\.TooWide produces more than 256 structurally distinct route parameter alternatives/
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
		assert.match(serviceAgentPage, /\$contract: \{[\s\S]*?reference: params\.chainId,[\s\S]*?address: params\.contractAddress,/)
		assert.doesNotMatch(serviceAgentPage, /reference: Number\(params\.chainId\)/)

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
		assert.match(coinInstancePage, /reference: params\.chainId,/)
		assert.doesNotMatch(coinInstancePage, /reference: Number\(params\.chainId\)/)
		assert.match(coinInstancePage, /if \([^\n]*matchEvmAddress\(params\.coinInstanceSlug\)[^\n]*\) \{[\s\S]*?type: 'Erc20Token',[\s\S]*?\$contract: \{[\s\S]*?address: params\.coinInstanceSlug,/)

		const bridgeCapabilityPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]/+page.svelte'),
			'utf8'
		)
		assert.match(bridgeCapabilityPage, /\$fromInstance: \([\s\S]*?reference: params\.fromChainId,/)
		assert.match(bridgeCapabilityPage, /\$toInstance: \([\s\S]*?reference: params\.toChainId,/)
		assert.doesNotMatch(bridgeCapabilityPage, /reference: Number\(params\.(?:from|to)ChainId\)/)

		const networkEpochPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]/+page.ts'),
			'utf8'
		)
		assert.match(networkEpochPage, /epoch: Number\(params\.epoch\),/)

		const networkTransactionLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/+layout.ts'),
			'utf8'
		)
		assert.match(networkTransactionLayout, /matchEvmTxHash\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /matchSolanaSignature\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /matchUtxoTxId\(params\.transactionId\)/)
		assert.match(networkTransactionLayout, /parentData\.projectionNetwork\.executionModels[\s\S]*?'Evm'/)
		assert.match(networkTransactionLayout, /parentData\.projectionNetwork\.ledgerModels[\s\S]*?'Utxo'/)
		assert.match(networkTransactionLayout, /parentData\.projectionNetwork\.namespace === 'Cardano'[\s\S]*?EntityType\.CardanoTransaction/)

		const transactionInputsPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs/+page.svelte'),
			'utf8'
		)
		assert.match(transactionInputsPage, /\{#if data\.entityType === EntityType\.CardanoTransaction\}[\s\S]*?select\(EntityType\.CardanoTransaction, data\.selector\)[\s\S]*?\.\$\$inputs/)
		assert.match(transactionInputsPage, /\{#if data\.entityType === EntityType\.UtxoTransaction\}[\s\S]*?select\(EntityType\.UtxoTransaction, data\.selector\)[\s\S]*?\.\$\$inputs/)
		assert.doesNotMatch(transactionInputsPage, /const collection\d+Selection = \$derived/)

		const networkValidatorsPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators/+page.svelte'),
			'utf8'
		)
		assert.match(networkValidatorsPage, /const collection\d+Selection = \$derived\(select\(EntityType\.Network, data\.selector\)\.Evm[\s\S]*?\.\$\$beaconValidators/)
		assert.match(networkValidatorsPage, /<BeaconValidatorsView[\s\S]*?selection=\{collection\d+Selection\}/)
		assert.doesNotMatch(networkValidatorsPage, /ProjectionBoundary|Applicable\(projection\)/)
		assert.doesNotMatch(networkValidatorsPage, /\{@const collection\d+Selection =/)

		const evmTokenTransferPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]/+page.svelte'),
			'utf8'
		)
		assert.match(evmTokenTransferPage, /let \{[\s\S]*?data,[\s\S]*?params,[\s\S]*?\}: PageProps = \$props\(\)/)
		assert.match(evmTokenTransferPage, /\$log: data\.selector/)

		const transactionOutputPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]/+page.svelte'),
			'utf8'
		)
		assert.match(
			transactionOutputPage,
			/data\.entityType === EntityType\.CardanoTxOutput[\s\S]*?select\(EntityType\.CardanoTxOutput, data\.selector/
		)
		assert.match(
			transactionOutputPage,
			/:\s+select\(EntityType\.UtxoOutput, data\.selector/
		)
		assert.match(transactionOutputPage, /\[EntityType\.UtxoOutput\]: UtxoOutputView,/)
		assert.doesNotMatch(transactionOutputPage, /entityDefinitionByType/)
		assert.match(transactionOutputPage, /data\.entityType === EntityType\.CardanoTxOutput[\s\S]*?'Cardano transaction output'[\s\S]*?'UTXO output'/)

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
		assert.match(activityPubParentLayout, /selection=\{\s*select\(EntityType\._GlobalActivityPubNetwork, data\.selector, \{\s*sources: \[[\s\S]*?Source\.Constants_Internal,[\s\S]*?Source\.Mastodon_Rest,[\s\S]*?\],\s*\}\)\s*\}/)
		assert.doesNotMatch(activityPubParentLayout, /data\.entityType|data\.selectorName/)

		const proposalView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/SpecificationProposalView.svelte'),
			'utf8'
		)
		assert.match(proposalView, /specificationRealmById/)
		assert.match(proposalView, /proposalCategoryById/)
		assert.match(proposalView, /href=\{[\s\S]*?href === undefined \?[\s\S]*?resolve\([\s\S]*?'\/\(proposals\)\/proposals\/\[specificationRealmSlug=specificationRealmSlug\][\s\S]*?href \?\? undefined/)
		assert.doesNotMatch(proposalView, /\/observations\//)
		assert.doesNotMatch(proposalView, /pendingEntity\.category !== undefined && pendingEntity\.category !== undefined/)

		const evmContractsView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/EvmContractsView.svelte'),
			'utf8'
		)
		assert.match(evmContractsView, /href=\{[\s\S]*?resolve\([\s\S]*?'\/\(explore\)\/\(networks\)\/network\/\[network=networkCaip2OrNetworkSlug\]/)
		assert.match(evmContractsView, /\{@const network = evmContractSelector\.\$network\}/)
		assert.match(evmContractsView, /'caip2' in network[\s\S]*?caip2StringFromValue\(network\.caip2\)/)
		assert.match(evmContractsView, /caip2StringFromValue\(network\.caip2\)[\s\S]*?:[\s\S]*?network\.slug/)
		assert.doesNotMatch(evmContractsView, /'slug' in network/)
		const evmContractLayout = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/+layout.ts'),
			'utf8'
		)
		assert.doesNotMatch(evmContractLayout, /const projectionNetwork/)
		assert.doesNotMatch(evmContractLayout, /networkByCaip2|networkBySlug/)
		assert.match(evmContractLayout, /parentData\.projectionNetwork\.executionModels[\s\S]*?'Evm'/)
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
		assert.doesNotMatch(routeFixtureMetadata, /requiredE2eRouteParam|resolve: \(params\)/)
		assert.match(routeFixtureMetadata, /parameterEncodingByName:/)
		assert.match(routeFixtureMetadata, /contract\/\[address\]\/verification'[\s\S]*?projectionEntity: 'Network'/)
		assert.match(routeFixtureMetadata, /coin-instance\/\[chainId\]\/\[coinInstanceSlug\]'[\s\S]*?EvmCoinInstance\.NetworkType'[\s\S]*?NativeCurrency[\s\S]*?EvmCoinInstance\.NetworkTypeContract'[\s\S]*?Erc20Token/)
		assert.match(routeFixtureMetadata, /\/~\/accounts\/allowance\/\[chainId=eip155ChainId\]\/\[owner=evmAddress\]\/\[coin=evmAddress\]\/\[spender=evmAddress\]/)

		const polkadotBlocksView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/PolkadotBlocksView.svelte'),
			'utf8'
		)
		assert.match(
			polkadotBlocksView,
			/'hash' in polkadotBlockSelector \?[\s\S]*?\[hash=stringSegment\][\s\S]*?:[\s\S]*?\[blockNumber=nonNegativeBigInt\]'/
		)
		assert.doesNotMatch(polkadotBlocksView, /true \?/)

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
				...authoredListTargetRouteFixtures,
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
	const ipfsResourceView = renderedFileByPath.get('src/views/IpfsResourceView.svelte')
	const swarmResourceView = renderedFileByPath.get('src/views/SwarmResourceView.svelte')
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
	assert.match(ipfsResourceView ?? '', /contentPath === ''[\s\S]*?'\/\(explore\)\/\(ipfs\)\/\[namespace=ipfsNamespace\]\/\[target=stringSegment\]'[\s\S]*?:[\s\S]*?'\/\(explore\)\/\(ipfs\)\/\[namespace=ipfsNamespace\]\/\[target=stringSegment\]\/path\/\[\.\.\.contentPath=stringSegment\]'/)
	assert.match(swarmResourceView ?? '', /contentPath === ''[\s\S]*?'\/\(swarm\)\/swarm\/\(swarmProtocol\)\/\[reference=stringSegment\]'[\s\S]*?:[\s\S]*?'\/\(swarm\)\/swarm\/\(swarmProtocol\)\/\[reference=stringSegment\]\/path\/\[\.\.\.contentPath=stringSegment\]'/)
	assert.doesNotMatch(ipfsResourceView ?? '', /contentPath !== ''/)
	assert.doesNotMatch(swarmResourceView ?? '', /contentPath !== ''/)
	assert.doesNotMatch(ipfsResourceView ?? '', /resolve\(`|encodeURIComponent/)
	assert.doesNotMatch(swarmResourceView ?? '', /resolve\(`|encodeURIComponent/)
	assert.match(routeFixtureMetadata ?? '', /IpfsResource\.ResourceAddress[\s\S]*?probeAtomPrefixes:[\s\S]*?IpfsResource\.ResourceAddress[\s\S]*?probeCaseId: 'path'/)
	assert.match(routeFixtureMetadata ?? '', /probeAtomPrefixes:[\s\S]*?'\/\[namespace\]\/\[target\]:IpfsResource\.ResourceAddress'[\s\S]*?probeCases:[\s\S]*?'namespace'[\s\S]*?'target'/)
	assert.match(routeFixtureMetadata ?? '', /probeCaseId: 'path'[\s\S]*?probeAtomPrefixes:[\s\S]*?'\/\[namespace\]\/\[target\]\/path\/\[\.\.\.contentPath\]:IpfsResource\.ResourceAddress\.path'[\s\S]*?probeCases:[\s\S]*?'contentPath'/)
	assert.match(routeFixtureMetadata ?? '', /SwarmResource\.ResourceAddress[\s\S]*?probeAtomPrefixes:[\s\S]*?SwarmResource\.ResourceAddress[\s\S]*?probeCaseId: 'path'/)
	assert.match(routeFixtureMetadata ?? '', /routeId: '\/\(explore\)\/\(ipfs\)\/\[namespace=ipfsNamespace\]\/\[target=stringSegment\]\/path\/\[\.\.\.contentPath=stringSegment\]'/)
	assert.match(routeFixtureMetadata ?? '', /routeId: '\/\(swarm\)\/swarm\/\(swarmProtocol\)\/\[reference=stringSegment\]\/path\/\[\.\.\.contentPath=stringSegment\]'/)

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

	const numericMatcherStringTargetRoutes = structuredClone(swarmRoutes)
	const numericMatcherStringTarget = numericMatcherStringTargetRoutes.children?.swarm
		?.children?.['[reference]']
		?.children?.path
		?.children?.['[...contentPath]']
	assert.ok(numericMatcherStringTarget?.selectorVariant)
	numericMatcherStringTarget.params = {
		contentPath: ['Eip155ChainId'],
	}
	numericMatcherStringTarget.selectorVariant.derivations = {
		contentPath: {
			kind: 'param',
			name: 'contentPath',
		},
	}
	const numericMatcherStringTargetPage = compileApp({
		...app,
		routes: {
			children: {
				...authoredListTargetRouteFixtures,
				'(swarm)': numericMatcherStringTargetRoutes,
			},
		},
	}).generatedFiles.find((generatedFile) => generatedFile.path.endsWith(
		'/path/[...contentPath=eip155ChainId]/+page.svelte'
	))
	assert.ok(numericMatcherStringTargetPage)
	assert.match(renderGeneratedFile(numericMatcherStringTargetPage), /contentPath: params\.contentPath/)
	assert.doesNotMatch(renderGeneratedFile(numericMatcherStringTargetPage), /contentPath: Number\(params\.contentPath\)/)

})

test('keeps calldata navigation on the explicit decoder while Hex remains owned by [hex]', () => {
	const evmRoutes = app.routes.children['(explore)']?.children?.['(protocols)']?.children?.evm
	const calldataRoute = evmRoutes?.children?.['(calldata)']?.children?.calldata
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
	const evmBlobView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmBlobView.svelte')
	const evmBlobsView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmBlobsView.svelte')
	const evmNetworkActorCoinBalancesView = compiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/EvmNetworkActorCoinBalancesView.svelte'
	))
	const coinBridgeCapabilityViews = [
		'src/views/CoinBridgeCapabilityView.svelte',
		'src/views/CoinBridgeCapabilitiesView.svelte',
	].map((viewPath) => compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === viewPath))

	assert.ok(youtubeVideoView)
	assert.ok(youtubeVideosView)
	assert.ok(evmBlobView)
	assert.ok(evmBlobsView)
	assert.ok(evmNetworkActorCoinBalancesView)
	assert.equal(coinBridgeCapabilityViews.every(Boolean), true)
	const renderedYoutubeVideoView = renderGeneratedFile(youtubeVideoView)
	const renderedYoutubeVideosView = renderGeneratedFile(youtubeVideosView)
	const renderedEvmBlobView = renderGeneratedFile(evmBlobView)
	const renderedEvmBlobsView = renderGeneratedFile(evmBlobsView)
	const renderedEvmNetworkActorCoinBalancesView = renderGeneratedFile(evmNetworkActorCoinBalancesView)
	assert.match(
		renderedYoutubeVideoView,
		/href=\{[\s\S]*?href === undefined \?[\s\S]*?resolve\([\s\S]*?'\/\(social\)\/\(youtube\)\/youtube\/\(globalYoutubeNetwork\)\/video\/\[videoId=stringSegment\]',[\s\S]*?videoId: encodeURIComponent\(selection\.entitySelector\.videoId\),[\s\S]*?:\s*href \?\? undefined/
	)
	assert.match(
		renderedYoutubeVideosView,
		/href=\{[\s\S]*?resolve\([\s\S]*?'\/\(social\)\/\(youtube\)\/youtube\/\(globalYoutubeNetwork\)\/video\/\[videoId=stringSegment\]',[\s\S]*?videoId: encodeURIComponent\(youtubeVideoSelector\.videoId\),/
	)
	assert.doesNotMatch(renderedYoutubeVideoView, /resolve\(`/)
	assert.doesNotMatch(renderedYoutubeVideosView, /resolve\(`/)
	assert.doesNotMatch(renderedYoutubeVideoView, /href=""/)
	assert.match(renderedYoutubeVideoView, /<YoutubeChannelView[\s\S]*?href=\{null\}/)
	assert.match(renderedYoutubeVideoView, /EntitySelectionViewProps<EntityType\.YoutubeVideo>/)
	assert.doesNotMatch(renderedYoutubeVideosView, /collectionSelection/)
	assert.doesNotMatch(renderedYoutubeVideosView, /sources: selection\.sources/)
	assert.match(renderedEvmBlobView, /const transaction = \$derived\(selection\.entitySelector\.\$transaction\)/)
	assert.match(renderedEvmBlobView, /'caip2' in transaction\.\$network[\s\S]*?transactionId: transaction\.txHash/)
	assert.match(renderedEvmBlobsView, /\{@const transaction = evmBlobSelector\.\$transaction\}/)
	assert.match(renderedEvmBlobsView, /'caip2' in transaction\.\$network[\s\S]*?transactionId: transaction\.txHash/)
	assert.doesNotMatch(
		renderedEvmBlobView.slice(
			renderedEvmBlobView.indexOf('\thref={'),
			renderedEvmBlobView.indexOf('\n\t{layout}')
		),
		/selection\.entitySelector\.\$transaction/
	)
	assert.match(renderedEvmNetworkActorCoinBalancesView, /\{@const contract = evmNetworkActorCoinBalance\.\$contract\}/)
	assert.match(renderedEvmNetworkActorCoinBalancesView, /contract != null\s+&& contract\.\$network\.caip2 != null \?/)
	assert.doesNotMatch(renderedEvmNetworkActorCoinBalancesView, /contract\.\$network\.caip2\.reference != null/)
	for (const coinBridgeCapabilityView of coinBridgeCapabilityViews) {
		assert.ok(coinBridgeCapabilityView)
		const source = renderGeneratedFile(coinBridgeCapabilityView)
		assert.match(source, /&& \(fromInstance\.type === 'NativeCurrency' \|\| '\$contract' in fromInstance\)/)
		assert.match(source, /&& \(toInstance\.type === 'NativeCurrency' \|\| '\$contract' in toInstance\)/)
		assert.doesNotMatch(source, /\$fromInstance\.type|\$toInstance\.type/)
	}

	const lensPostTimestampsView = compiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/views/LensPost_TimestampsView.svelte'
	))
	assert.ok(lensPostTimestampsView)
	const renderedLensPostTimestampsView = renderGeneratedFile(lensPostTimestampsView)
	assert.match(
		renderedLensPostTimestampsView,
		/postId: lensPostTimestampSelector\.\$post\.id,[\s\S]*?timestampMs: String\(lensPostTimestampSelector\.timestampMs\),/
	)
	assert.match(
		renderedLensPostTimestampsView,
		/\(lensPostTimestamp\.\$post\.text \?\? ''\), lensPostTimestampSelector\.\$post\.id/
	)
	assert.doesNotMatch(
		renderedLensPostTimestampsView,
		/postId: String\(lensPostTimestamp\.\$post\.id\)|timestampMs: String\(lensPostTimestamp\.timestampMs\)|lensPostTimestampSelector\.\$post\.text/
	)
})

test('derives inverse ancestor and local route parameters from normalized selector mappings', () => {
	const evmContractMapping = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.children?.['(contracts)']?.children?.contract?.children?.['[address]']?.selectors?.[EntityType.EvmContract]?.EvmNetworkAddress

	assert.ok(evmContractMapping)
	assert.equal(evmContractMapping.href, undefined)

	const evmContractsView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmContractsView.svelte')
	assert.ok(evmContractsView)
	const renderedEvmContractsView = renderGeneratedFile(evmContractsView)

	assert.match(renderedEvmContractsView, /href=\{[\s\S]*?resolve\([\s\S]*?'\/\(explore\)\/\(networks\)\/network\/\[network=networkCaip2OrNetworkSlug\]/)
	assert.match(renderedEvmContractsView, /\{@const network = evmContractSelector\.\$network\}/)
	assert.match(renderedEvmContractsView, /caip2StringFromValue\(network\.caip2\)/)
	assert.match(renderedEvmContractsView, /address: evmContractSelector\.address,/)
	assert.doesNotMatch(renderedEvmContractsView, /resolve\(`|encodeURIComponent/)
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
		assert.doesNotMatch(routeFixtureMetadata, /requiredE2eRouteParam|resolve: \(params\)/)
		assert.match(routeFixtureMetadata, /parameterEncodingByName:/)

		const routeMetadataNodeImportTest = path.join(generatedOutputRoot, 'route-metadata-node-import.test.ts')
		writeFileSync(routeMetadataNodeImportTest, `import assert from 'node:assert/strict'
import { e2eRouteFixtureMetadataByNodeId } from './tests/e2e/_generatedRouteFixtureMetadata.ts'

const deepGroupedMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]']
assert.match(deepGroupedMetadata.routeId, /token-transfer/)

const ensRecordsMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ens)/ens/name/[ensName]/records']
assert.deepEqual(ensRecordsMetadata.mappings.map(({ id }) => id), ['EnsName.NormalizedName'])

const activityPubActorMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]']
assert.equal(activityPubActorMetadata.parameterEncodingByName?.instanceOrigin, 'Opaque')

const atprotoPostMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(atproto)/atproto/post/[...uri]']
assert.equal(atprotoPostMetadata.parameterEncodingByName?.uri, 'Opaque')

const rssItemMetadata = e2eRouteFixtureMetadataByNodeId['/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]']
assert.equal(rssItemMetadata.parameterEncodingByName?.feedUrl, 'Opaque')
assert.equal(rssItemMetadata.parameterEncodingByName?.itemIdentity, 'Opaque')

const ipfsPathMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]']
assert.match(ipfsPathMetadata.routeId, /\\[\\.\\.\\.contentPath=stringSegment\\]/)

for (const [nodeId, metadata] of Object.entries(e2eRouteFixtureMetadataByNodeId)) {
\tassert.ok(metadata.mappings.length > 0, nodeId)
\tconst routeParams = [...metadata.routeId.matchAll(/\\[\\[?(?:\\.\\.\\.)?([^=\\]]+)(?:=[^\\]]+)?\\]\\]?/g)].map((match) => match[1]).toSorted()
\tfor (const mapping of metadata.mappings) {
\t\tfor (const probeCase of mapping.probeCases)
\t\t\tassert.deepEqual(probeCase.flatMap(([, , fields]) => fields).toSorted(), routeParams, \`\${nodeId} \${mapping.id}\`)
\t}
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
					...authoredListTargetRouteFixtures,
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
				ignoreDeprecations: '6.0',
				module: 'preserve',
				moduleResolution: 'bundler',
				noEmit: true,
				paths: {
					'$/*': [path.relative(typeTestRoot, path.join(root, 'src/*'))],
				},
				skipLibCheck: true,
				target: 'esnext',
			},
			files: [routeMetadataTypeTest],
		}, null, '\t'))
		const routeMetadataTypeTestResult = runTestProcess(
			'route-metadata:typecheck',
			process.env.TSC_PATH ?? path.join(root, 'node_modules/@typescript/native/bin/tsc'),
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

test('indexes named source selections from typed query surfaces', () => {
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
	assert.doesNotMatch(generatorSource, /collectSourceSelections/)
	assert.match(generatorSource, /entityNamedSourceSelections[\s\S]*?singularView\?\.query[\s\S]*?singularView\?\.latest[\s\S]*?singularView\?\.carousels[\s\S]*?pluralView\?\.query/)
	assert.match(generatorSource, /generateSourceSelectionFiles[\s\S]*?sourceSelections[\s\S]*?emitSourceArray\(selection\.default\)/)
})

test('carries field-conditioned view sources into initial route selections', () => {
	const proposalPage = baselineCompiledApp.generatedFiles.find((generatedFile) => (
		generatedFile.path === 'src/routes/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]/+page.svelte'
	))

	assert.ok(proposalPage)
	const renderedProposalPage = renderGeneratedFile(proposalPage)
	assert.match(renderedProposalPage, /const pageEntitySelector = \$derived\(\{[\s\S]*?realm:[\s\S]*?category:/)
	assert.match(renderedProposalPage, /import specificationProposalSources from '\$\/sources\/specificationProposalSources\.ts'/)
	assert.match(renderedProposalPage, /sources: specificationProposalSources\(\{\s*realm: pageEntitySelector\.realm,\s*category: pageEntitySelector\.category,\s*\}\)/)
	assert.match(renderedProposalPage, /select\(EntityType\.SpecificationProposal, pageEntitySelector, \{/)
	assert.doesNotMatch(renderedProposalPage, /sources: \[\s*Source\.BitcoinBips_Github,[\s\S]*?Source\.ZcashZips_Github,?\s*\],/)
	assert.doesNotMatch(renderedProposalPage, /String\([^)]*\)\]\.join\(':'\)/)
})

test('correlates generated source, binding, and resolver selector keys at definition time', () => {
	const typeTestRoot = createFreshRoot('blockhead-generated-source-key-types-')

	try {
		const fixturePath = path.join(typeTestRoot, 'generated-source-key-types.ts')
		writeFileSync(fixturePath, `import specificationProposalSources from '${root}/src/sources/specificationProposalSources.ts'
import sourceServerCredentials from '${root}/src/sources/$sourceServerCredentials.server.ts'
import acrossBindings from '${root}/src/sources/Across/bindings.ts'
import atprotoSyncBindings from '${root}/src/sources/AtprotoSync/bindings.ts'
import arweaveBindings from '${root}/src/sources/Arweave/bindings.ts'
import blockscoutBindings from '${root}/src/sources/Blockscout/bindings.ts'
import getBlockBindings from '${root}/src/sources/GetBlock/bindings.ts'
import lightningLndBindings from '${root}/src/sources/LightningLnd/bindings.ts'
import voyagerBindings from '${root}/src/sources/Voyager/bindings.ts'
import xrplClioBindings from '${root}/src/sources/XrplClio/bindings.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '${root}/src/resolvers/defineResolver.ts'
import { EntityType } from '${root}/src/schema/EntityType.ts'
import { Source } from '${root}/src/sources/Source.ts'
import { SourceProvider } from '${root}/src/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '${root}/src/sources/SourceProviderDefinition.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	WireProtocol,
	type SourceBinding,
	type SourceBindingIndex,
	type SourceServerCredentialDefinition,
} from '${root}/src/sources/SourceBinding.ts'
type ResolverLoaderEntry = {
	[_Source in Source]: readonly [
		_Source,
		() => Promise<{
			default: RegisteredSourceResolverModule<_Source>
		}>,
	]
}[Source]
type AssertTrue<_Value extends true> = _Value
type AssertFalse<_Value extends false> = _Value
const ambossResolverModule = {
	source: Source.Amboss_Graphql,
	resolvers: [],
} satisfies RegisteredSourceResolverModule
type InferredAmbossSource = AssertTrue<
	typeof ambossResolverModule.source extends Source.Amboss_Graphql ?
		Source.Amboss_Graphql extends typeof ambossResolverModule.source ? true : false
	:
		false
>
type AmbossResolverLoader = () => Promise<{
	default: typeof ambossResolverModule
}>
type ValidResolverEntry = AssertTrue<
	readonly [Source.Amboss_Graphql, AmbossResolverLoader] extends ResolverLoaderEntry ? true : false
>
type SwappedResolverEntry = AssertFalse<
	readonly [Source.Atproto_Xrpc, AmbossResolverLoader] extends ResolverLoaderEntry ? true : false
>
specificationProposalSources({
	realm: 'Bitcoin',
	category: 'Bip',
})
// @ts-expect-error Source-selection field values accept only values represented by authored conditions.
specificationProposalSources({ realm: 'missing' })
// @ts-expect-error Source-selection inputs accept only their authored condition fields.
specificationProposalSources({ missing: 'Bitcoin' })
defineResolver({
	entityType: EntityType.Network,
	resolve: {
		Caip2: {
			resolve: async (networkSelector) => ({
				caip2: networkSelector.caip2,
				// @ts-expect-error A named resolver receives only that selector's fields.
				slug: networkSelector.slug,
			}),
		},
	},
})({})
defineResolver({
	entityType: EntityType.Network,
	resolve: {
		// @ts-expect-error Resolver keys accept only selectors declared by the entity.
		Unknown: {
			resolve: async () => ({}),
		},
	},
})({})
const validBindings = lightningLndBindings satisfies SourceBindingIndex
const typedSourceServerCredentials: Map<string, SourceServerCredentialDefinition> = sourceServerCredentials
const acrossBinding = acrossBindings[Source.Across_Rest][0]
const atprotoSyncBinding = atprotoSyncBindings[Source.AtprotoSync_Xrpc][0]
const getBlockRpcBinding = getBlockBindings[Source.GetBlockRpc_JsonRpc][0]
const voyagerBinding = voyagerBindings[Source.Voyager][0]
const mismatchedVoyagerProvider = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: {
		// @ts-expect-error Provider source metadata keys must belong to its exact binding index.
		[Source.Wormholescan]: {
			label: 'Wormholescan',
		},
	},
	bindings: voyagerBindings,
} satisfies SourceProviderDefinition<typeof voyagerBindings>
const missingVoyagerBindings = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: {
		[Source.Voyager]: {
			label: 'Voyager',
		},
	},
	// @ts-expect-error Provider definitions retain every key from their imported binding index.
	bindings: {},
} satisfies SourceProviderDefinition<typeof voyagerBindings>
const missingVoyagerSource = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	// @ts-expect-error Provider source metadata retains every imported binding source key.
	sources: {},
	bindings: voyagerBindings,
} satisfies SourceProviderDefinition<typeof voyagerBindings>
const repeatedVoyagerSource = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: {
		[Source.Voyager]: {
			label: 'Voyager',
			// @ts-expect-error Indexed source metadata does not repeat its source key.
			source: Source.Voyager,
		},
	},
	bindings: voyagerBindings,
} satisfies SourceProviderDefinition<typeof voyagerBindings>
const missingArweaveGraphqlSource = {
	provider: SourceProvider.Arweave,
	label: 'Arweave',
	// @ts-expect-error Every source in a multi-source binding index requires metadata.
	sources: {
		[Source.Arweave_Rest]: {
			label: 'Arweave REST',
		},
	},
	bindings: arweaveBindings,
} satisfies SourceProviderDefinition<typeof arweaveBindings>
const validVoyagerProvider = {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: {
		[Source.Voyager]: {
			label: 'Voyager',
		},
	},
	bindings: voyagerBindings,
} satisfies SourceProviderDefinition<typeof voyagerBindings>
const broadProviders: readonly SourceProviderDefinition[] = [validVoyagerProvider]
const acrossSource: Source.Across_Rest = acrossBinding.source
const exactAcrossBindings: readonly [typeof acrossBinding] = acrossBindings[Source.Across_Rest]
const xrplClioBindingsForSource: readonly SourceBinding<Source.XrplClio_JsonRpc>[] = xrplClioBindings[Source.XrplClio_JsonRpc]
const repeatedAcrossBindings = indexSourceBindings([
	acrossBinding,
	acrossBinding,
] as const)
const repeatedAcrossBindingsForSource: readonly [typeof acrossBinding, typeof acrossBinding] = repeatedAcrossBindings[Source.Across_Rest]
// @ts-expect-error Repeating a structurally identical binding still produces an array at runtime.
const repeatedAcrossBinding: SourceBinding<Source.Across_Rest> = repeatedAcrossBindings[Source.Across_Rest]
const computedAcrossBindings = indexSourceBindings([acrossBinding, acrossBinding].flatMap((binding) => [binding]))
const computedAcrossBindingsForSource: readonly [SourceBinding<Source.Across_Rest>, ...SourceBinding<Source.Across_Rest>[]] | undefined = computedAcrossBindings[Source.Across_Rest]
// @ts-expect-error A dynamic binding array cannot promise that its inferred source key exists.
const requiredComputedAcrossBindings: readonly SourceBinding<Source.Across_Rest>[] = computedAcrossBindings[Source.Across_Rest]
const widenedBindings: readonly SourceBinding[] = [acrossBinding]
const widenedAcrossBindings: readonly [SourceBinding<Source.Across_Rest>, ...SourceBinding<Source.Across_Rest>[]] | undefined = indexSourceBindings(widenedBindings)[Source.Across_Rest]
const unionBinding: SourceBinding<Source.Across_Rest | Source.Voyager> = acrossBinding
const unionAcrossBindings: readonly [SourceBinding<Source.Across_Rest>, ...SourceBinding<Source.Across_Rest>[]] | undefined = indexSourceBindings([unionBinding].flatMap((binding) => [binding]))[Source.Across_Rest]
const unionTupleAcrossBindings: readonly [SourceBinding<Source.Across_Rest>, ...SourceBinding<Source.Across_Rest>[]] | undefined = indexSourceBindings([unionBinding] as const)[Source.Across_Rest]
// @ts-expect-error A tuple containing a widened source cannot promise one possible source key.
const requiredUnionTupleAcrossBindings: readonly SourceBinding<Source.Across_Rest>[] = indexSourceBindings([unionBinding] as const)[Source.Across_Rest]
const emptyAcrossBindingIndex = {
	// @ts-expect-error A present source key must retain at least one binding.
	[Source.Across_Rest]: [],
} satisfies SourceBindingIndex
const mixedProxyCredentials = {
	...getBlockRpcBinding,
	credentials: [
		{ scope: SourceCredentialScope.PublicConfig },
		getBlockRpcBinding.credentials[0],
	],
} as const satisfies SourceBinding
// @ts-expect-error A wire protocol accepts only API families in its canonical compatibility row.
const invalidProtocol = { ...acrossBinding, wireProtocol: WireProtocol.Graphql } as const satisfies SourceBinding
// @ts-expect-error An API family accepts only its canonical wire protocol.
const invalidApiFamily = { ...acrossBinding, apiFamily: ApiFamily.GraphqlHttp } as const satisfies SourceBinding
// @ts-expect-error Endpoint kinds are constrained by the protocol/API compatibility row.
const invalidEndpoint = { ...acrossBinding, endpoints: [{ endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'wss://example.com' }] } as const satisfies SourceBinding
// @ts-expect-error Endpoint tuples are nonempty.
const emptyEndpoints = { ...acrossBinding, endpoints: [] } as const satisfies SourceBinding
// @ts-expect-error Operation-group tuples are nonempty.
const emptyOperationGroups = { ...acrossBinding, operationGroups: [] } as const satisfies SourceBinding
// @ts-expect-error OpenAPI bindings accept only their canonical operation groups.
const invalidOperationGroup = { ...voyagerBinding, operationGroups: [SourceOperationGroup.WalletSign] } as const satisfies SourceBinding
// @ts-expect-error OpenAPI bindings accept only their canonical artifact kinds.
const invalidArtifact = { ...voyagerBinding, artifacts: [{ kind: SourceArtifactKind.Candid, path: 'invalid.did' }] } as const satisfies SourceBinding
// @ts-expect-error BrowserDirect HTTP endpoints must explicitly enable CORS.
const invalidBrowserCors = { ...acrossBinding, delivery: SourceDelivery.BrowserDirect, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://example.com', corsEnabled: false }] } as const satisfies SourceBinding
// @ts-expect-error Non-gRPC RemoteLive requires at least one WebSocket endpoint.
const liveWithoutWebSocket = { ...atprotoSyncBinding, endpoints: [atprotoSyncBinding.endpoints[0]] } as const satisfies SourceBinding
// @ts-expect-error Non-gRPC RemoteLive permits at most one leading HTTP endpoint.
const liveWithTwoHttpEndpoints = { ...atprotoSyncBinding, endpoints: [atprotoSyncBinding.endpoints[0], atprotoSyncBinding.endpoints[0], atprotoSyncBinding.endpoints[1]] } as const satisfies SourceBinding
// @ts-expect-error HttpProxy cannot require a LocalSecret.
const localProxyCredential = { ...getBlockRpcBinding, credentials: [{ scope: SourceCredentialScope.LocalSecret }] } as const satisfies SourceBinding
// @ts-expect-error HttpProxy permits at most one trailing RuntimeSecret.
const repeatedRuntimeSecret = { ...getBlockRpcBinding, credentials: [getBlockRpcBinding.credentials[0], getBlockRpcBinding.credentials[0]] } as const satisfies SourceBinding
// @ts-expect-error Managed runtime-secret projections cannot be widened with credential keys.
const runtimeSecretWithKeys = { ...getBlockRpcBinding, credentials: [{ ...getBlockRpcBinding.credentials[0], keys: ['INVALID'] }] } as const satisfies SourceBinding
const blockscoutBindingsForSource = blockscoutBindings[Source.Blockscout_Rest]
const blockscoutTargetKey: '1' | '10' | '100' | '137' | '8453' | '42161' | '11155111' | undefined = blockscoutBindingsForSource?.[0].target.key
// @ts-expect-error Compact generated binding targets retain their authored key union.
const invalidBlockscoutTargetKey: '999' = blockscoutBindingsForSource[0].target.key
// @ts-expect-error Inferred binding indexes expose only source keys present in their row tuple.
acrossBindings[Source.Erigon_JsonRpc]
// @ts-expect-error A binding index key must equal the binding's source.
const mismatchedBindings = { [Source.LightningMempoolSpace_Rest]: lightningLndBindings[Source.LightningLnd_Rest] } satisfies SourceBindingIndex
const validResolverEntry: ValidResolverEntry = true
const swappedResolverEntry: SwappedResolverEntry = false
const inferredAmbossSource: InferredAmbossSource = true
void validResolverEntry
void swappedResolverEntry
void inferredAmbossSource
void typedSourceServerCredentials
void mixedProxyCredentials
void exactAcrossBindings
void computedAcrossBindingsForSource
void requiredComputedAcrossBindings
void widenedAcrossBindings
void unionAcrossBindings
void unionTupleAcrossBindings
void requiredUnionTupleAcrossBindings
void emptyAcrossBindingIndex
void mismatchedVoyagerProvider
void missingVoyagerBindings
void missingVoyagerSource
void repeatedVoyagerSource
void missingArweaveGraphqlSource
void broadProviders
`)
		assertTypeChecks('generated-source-keys:typecheck', [fixturePath], true)
	} finally {
		removeFreshRoot(typeTestRoot)
	}
})

test('indexes row href parameter names from the route at definition time', () => {
	const typeTestRoot = createFreshRoot('blockhead-row-href-key-types-')

	try {
		const fixturePath = path.join(typeTestRoot, 'row-href-key-types.ts')
		const appSource = readFileSync(path.join(root, 'APP.ts'), 'utf8')
		const helperStart = appSource.indexOf('type _RouteParameterName')
		const helperEnd = appSource.indexOf('\nconst routeTemplate', helperStart)
		assert.notEqual(helperStart, -1)
		assert.notEqual(helperEnd, -1)
		writeFileSync(fixturePath, `type _Expression = string

${appSource.slice(helperStart, helperEnd).replace('export const defineRowHref', 'const defineRowHref')}

defineRowHref('/items/[itemId]/[...contentPath=stringSegment]', {
	itemId: 'item',
	contentPath: 'path',
})

// @ts-expect-error Every route parameter is required.
defineRowHref('/items/[itemId]/[...contentPath=stringSegment]', { itemId: 'item' })

// @ts-expect-error Parameters not declared by the route are rejected.
defineRowHref('/items/[itemId]', { itemId: 'item', other: 'other' })
`)
		assertTypeChecks('row-href-keys:typecheck', [fixturePath], true)
	} finally {
		removeFreshRoot(typeTestRoot)
	}
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
		mkdirSync(path.join(typeTestRoot, 'src/constants'), { recursive: true })
		copyFileSync(
			path.join(root, 'scripts/app/inputs/source-target.ts'),
			path.join(typeTestRoot, 'scripts/app/inputs/source-target.ts')
		)
		copyFileSync(
			path.join(root, 'src/constants/Network.ts'),
			path.join(typeTestRoot, 'src/constants/Network.ts')
		)
		writeFileSync(typeTestPath, `${appSource.slice(0, facetStatement.end)}\n${fixtureSource.slice(fixtureImport.end)}`)
		assertTypeChecks('entity-view-field-references:typecheck', [typeTestPath])
	} finally {
		removeFreshRoot(typeTestRoot)
	}
})

test('isolates replacement-managed output and preserves unchanged generated files', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-test-')
	const checkedInProviderRoot = path.join(generatedOutputRoot, 'src/sources/Fixture/index.ts')
	const staleRoute = path.join(generatedOutputRoot, 'src/routes/stale/+page.svelte')
	const staleSourceProjection = path.join(generatedOutputRoot, 'src/sources/$staleGeneratedRegistry.ts')
	const generatedSchema = path.join(generatedOutputRoot, 'src/schema/BitTorrentAnnounce_Timestamp.ts')
	const preservedTimestamp = new Date('2000-01-01T00:00:00.000Z')

	try {
		mkdirSync(path.dirname(checkedInProviderRoot), {
			recursive: true,
		})
		writeFileSync(checkedInProviderRoot, '// Generated from APP.ts.\nexport const checkedInProvider = true\n')

		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.failure)
		assert.equal(existsSync(path.join(generatedOutputRoot, 'src/schema/EntityType.ts')), true)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts.\nexport const checkedInProvider = true\n')

		mkdirSync(path.dirname(staleRoute), {
			recursive: true,
		})
		writeFileSync(staleRoute, '<!-- Generated from APP.ts. -->\n<p>stale</p>\n')
		writeFileSync(staleSourceProjection, '// Generated from APP.ts.\nexport const stale = true\n')

		const checkResult = runGenerator('check', generatedOutputRoot)
		assert.notEqual(checkResult.status, 0)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/routes\/stale\/\+page\.svelte/)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/sources\/\$staleGeneratedRegistry\.ts/)

		utimesSync(generatedSchema, preservedTimestamp, preservedTimestamp)

		const regenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(regenerateResult.status, 0, regenerateResult.failure)
		assert.equal(existsSync(staleRoute), false)
		assert.equal(existsSync(staleSourceProjection), false)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts.\nexport const checkedInProvider = true\n')
		assert.equal(statSync(generatedSchema).mtimeMs, preservedTimestamp.getTime())
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('emits environment schemas only on binding credentials', () => {
	const sourceProviderDefinitions = globSync('src/sources/**/index.ts').map((sourceProviderPath) => readFileSync(
		path.join(root, sourceProviderPath),
		'utf8'
	)).join('\n')
	const sourceBindingDefinitions = globSync('src/sources/**/bindings.ts').map((sourceBindingPath) => readFileSync(
		path.join(root, sourceBindingPath),
		'utf8'
	)).join('\n')

	assert.doesNotMatch(sourceProviderDefinitions, /\benv:|from 'arktype'/)
	assert.doesNotMatch(sourceBindingDefinitions, /env: arktype\(\{\n\s+'\[string\]': 'string',\n\s+\}\)/)
	assert.doesNotMatch(sourceBindingDefinitions, /env: arktype\(\{\n\s*\}\)/)
	assert.match(sourceBindingDefinitions, /'PUBLIC_ALLIUM_API_KEY': 'string > 0'/)
})

test('keeps runtime secret configuration in one server projection', () => {
	const publicBindings = globSync('src/sources/**/bindings.ts').map((bindingPath) => readFileSync(
		path.join(root, bindingPath),
		'utf8'
	)).join('\n')
	const serverCredentials = readFileSync(
		path.join(root, 'src/sources/$sourceServerCredentials.server.ts'),
		'utf8'
	)
	assert.doesNotMatch(publicBindings, /(?:proxyId|serverCredentialId):/)
	assert.doesNotMatch(publicBindings, /envKey:|injection:/)
	assert.match(serverCredentials, /export default new Map<\n\tstring,\n\tSourceServerCredentialDefinition\n>/)
	assert.match(serverCredentials, /import \{ sourceBindings \} from '\$\/sources\/\$sourceProviders\.ts'/)
	assert.match(serverCredentials, /const runtimeSecretBindingCandidates = sourceBindings\.filter[\s\S]*?scope === SourceCredentialScope\.RuntimeSecret[\s\S]*?&& keys == null/)
	assert.match(serverCredentials, /const runtimeSecretCredentials = \[/)
	assert.equal((serverCredentials.match(/^\t\tSource\./gm) ?? []).length, 19)
	assert.match(serverCredentials, /sourceBindingId\(runtimeSecretBinding\(source, targetKey\)\)/)
	assert.equal((serverCredentials.match(/sourceBindingId\(/g) ?? []).length, 1)
	assert.doesNotMatch(serverCredentials, /'\["/)
	assert.doesNotMatch(serverCredentials, /from '\$\/sources\/[^']+\/bindings\.ts'/)
	assert.match(serverCredentials, /Source\.SafeTransactionService_Rest,\n\t\t'1'/)
	assert.match(serverCredentials, /Source\.TonCenter,\n\t\t'ton:-239'/)
	assert.match(serverCredentials, /COVALENT_API_KEY/)
	assert.match(serverCredentials, /header: \{[\s\S]*?name: 'authorization'[\s\S]*?prefix: 'Bearer '/)
	assert.match(serverCredentials, /\{\n\t\tenvKey,\n\t\tinjection,\n\t\},\n\] satisfies readonly \[string, SourceServerCredentialDefinition\]/)
	assert.doesNotMatch(serverCredentials, /endpoints:|header-secret|literal-secret/)
	assert.deepEqual([...sourceServerCredentialsById.keys()].sort(), app.sources.sources.flatMap((source) => [
		...(source.binding == null ? [] : [source.binding]),
		...(source.bindings ?? []),
	].flatMap((binding) => binding.credentials.some((credential) => (
		credential.scope === SourceCredentialScope.RuntimeSecret
		&& 'envKey' in credential
	)) ? [sourceBindingId({
		source: String(source.source),
		...binding,
	})] : [])).sort())
	assert.deepEqual(globSync('src/**/*.ts').filter((sourcePath) => (
		readFileSync(path.join(root, sourcePath), 'utf8')
			.includes("from '$/sources/$sourceServerCredentials.server.ts'")
	)).filter((sourcePath) => !sourcePath.endsWith('.spec.ts')).toSorted(), [
		'src/sources/_runtime/live.server.ts',
		'src/sources/_runtime/proxy.server.ts',
		'src/sources/index.server.ts',
	].toSorted())
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
	for (const routeKeySuffix of [
		'/topic/[hex]\': {',
		'/selector/[hex]\': {',
		'/calldata/[hex]\': {',
		'/error/[hex]\': {',
	])
		assert.equal(metadata.includes(routeKeySuffix), true)
	assert.doesNotMatch(metadata, /\/(?:topics|selectors|calldata|errors)\)\//)
})

test('loads sibling facet row fields only after eligibility through projection-owned resources', () => {
	const compiled = baselineCompiledApp
	const singularFile = compiled.generatedFiles.find((file) => file.path === 'src/views/EvmCoinInstanceView.svelte')
	const pluralFile = compiled.generatedFiles.find((file) => file.path === 'src/views/EvmCoinInstancesView.svelte')
	assert.ok(singularFile)
	assert.ok(pluralFile)
	const singularView = renderGeneratedFile(singularFile)
	const pluralView = renderGeneratedFile(pluralFile)
	const rootResource = singularView.slice(
		singularView.indexOf('const evmCoinInstance = $derived('),
		singularView.indexOf('const titleFallback =')
	)
	const titleMarkup = singularView.slice(
		singularView.indexOf('{#snippet Title()}'),
		singularView.indexOf('{#snippet Value()}')
	)
	const contentMarkup = singularView.slice(
		singularView.indexOf('{#snippet Content('),
		singularView.indexOf('{#snippet Details(')
	)
	const detailsMarkup = singularView.slice(singularView.indexOf('{#snippet Details('))

	for (const generatedView of [singularView, pluralView]) {
		assert.match(generatedView, /<ProjectionBoundary\s+resource=\{selection\.NativeCurrency\}/)
		assert.match(generatedView, /<ProjectionBoundary\s+resource=\{selection\.Erc20Token\}/)
		assert.doesNotMatch(generatedView, /resolvedEntity\.symbol/)
		assert.doesNotMatch(generatedView, /selection\.symbol/)
	}
	assert.equal((singularView.match(/resource=\{projection\.symbol\}/g) ?? []).length, 5)
	assert.doesNotMatch(singularView, /projection\s*\.symbol\(\{/)
	assert.match(pluralView, /resource=\{evmCoinInstanceProjection0\.symbol\}[\s\S]*?resource=\{evmCoinInstanceProjection0\.name\}/)
	assert.match(pluralView, /resource=\{evmCoinInstanceProjection1\.symbol\}[\s\S]*?resource=\{evmCoinInstanceProjection1\.name\}/)
	assert.match(pluralView, /\[nativeCurrencySymbol0, \(nativeCurrencyName1 \?\? ''\)\]\.filter\(Boolean\)/)
	assert.match(pluralView, /\[erc20TokenSymbol0, \(erc20TokenName1 \?\? ''\)\]\.filter\(Boolean\)/)
	assert.doesNotMatch(pluralView, /String\((?:nativeCurrency|erc20Token)/)
	assert.doesNotMatch(pluralView, /fields: \{\s*(?:NativeCurrency|Erc20Token): \{/)
	assert.doesNotMatch(pluralView, /\{@const evmCoinInstanceFields =/)
	assert.doesNotMatch(singularView, /pendingEntity\.(?:NativeCurrency|Erc20Token)/)
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.NativeCurrency\}[\s\S]*?projection\s*\.symbol/)
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.Erc20Token\}[\s\S]*?projection\s*\.symbol/)
	assert.match(singularView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.\$icon/)
	assert.match(singularView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.\$icon/)
	assert.equal((titleMarkup.match(/resource=\{selection\.NativeCurrency\}/g) ?? []).length, 1)
	assert.equal((titleMarkup.match(/resource=\{selection\.Erc20Token\}/g) ?? []).length, 1)
	assert.match(titleMarkup, /resource=\{selection\.NativeCurrency\}[\s\S]*?resource=\{projection\.symbol\}[\s\S]*?resource=\{projection\.name\}/)
	for (const markup of [contentMarkup, detailsMarkup])
		assert.match(markup, /resource=\{\s*selection\.entitySelector\.type === 'NativeCurrency' \?\s*selection\.NativeCurrency\s*:\s*selection\.Erc20Token\s*\}/)
	assert.equal((singularView.match(/resource=\{selection\.(?:NativeCurrency|Erc20Token)\}/g) ?? []).length, 4)
	assert.equal((singularView.match(/\.\$\$outboundBridgeCapabilities\b/g) ?? []).length, 1)
	assert.doesNotMatch(singularView.slice(0, singularView.indexOf('{#snippet Details(')), /\.\$\$outboundBridgeCapabilities\(/)
	assert.match(
		detailsMarkup,
		/\{#snippet Applicable\(projection\)\}[\s\S]*?projection\s*\.\$\$outboundBridgeCapabilities\(\{[\s\S]*?Source\.Lifi_Rest/
	)
	assert.doesNotMatch(singularView, /\{@const [^=\n]*\.[^=\n]* =/)
	assert.doesNotMatch(rootResource, /NativeCurrency|Erc20Token|Blockscout_Rest|Constants_Internal|symbol|name/)
})

test('omits props bypassed by static entity and collection layouts', () => {
	for (const [filePath, source] of generatedViewSources) {
		assert.doesNotMatch(
			source,
			/layout=\{EntityLayout\.(?:Value|Title|SummaryInline)\}\n(?:(?!\s*\/>)[^\n]*\n){0,8}\s+open=\{false\}/,
			filePath
		)
		assert.doesNotMatch(
			source,
			/CollapsibleProps=\{\{ canToggle: false \}\}\n(?:(?!\s*\/>)[^\n]*\n){0,8}\s+collapsible=\{false\}/,
			filePath
		)
		assert.doesNotMatch(
			source,
			/collapsible=\{false\}\n(?:(?!\s*\/>)[^\n]*\n){0,8}\s+open=\{open\}/,
			filePath
		)
	}

	const networksView = generatedSource('src/views/NetworksView.svelte')
	assert.match(networksView, /open = \$bindable\(true\)/)
	assert.match(networksView, /<EntitiesList[\s\S]*?\bbind:open\b/)
	const networksPageSource = generatedSource('src/routes/(explore)/networks/+page.svelte')
	const networksPageList = networksPageSource.slice(
		networksPageSource.indexOf('<NetworksView'),
		networksPageSource.indexOf('/>', networksPageSource.indexOf('<NetworksView')) + 2
	)
	assert.doesNotMatch(networksPageList, /collapsible=|open=/)

	const openLayoutApp = structuredClone(app)
	const evmTransaction = openLayoutApp.schema.entities.find((entity) => (
		entity.entityType === EntityType.EvmTransaction
	))
	assert.ok(evmTransaction?.views.singular)
	evmTransaction.views.singular.lists = [
		...(evmTransaction.views.singular.lists ?? []),
		{
			field: '$network',
			component: 'NetworkView',
			label: 'Network',
		},
	]
	const evmTransactionView = compileApp(openLayoutApp).generatedFiles.find((file) => (
		file.path === 'src/views/EvmTransactionView.svelte'
	))
	assert.ok(evmTransactionView)
	assert.match(
		renderGeneratedFile(evmTransactionView),
		/layout=\{EntityLayout\.Summary\}\n\s+open=\{false\}/
	)
})

test('emits absence guards only for schema-optional singular fields', () => {
	const renderedView = (path: string) => {
		const generatedFile = baselineCompiledApp.generatedFiles.find((file) => file.path === path)
		assert.ok(generatedFile)
		return renderGeneratedFile(generatedFile)
	}
	for (const generatedView of baselineCompiledApp.generatedFiles.filter((file) => file.path.startsWith('src/views/'))) {
		const source = renderGeneratedFile(generatedView)
		assert.doesNotMatch(source, /\{@const resolvedEntity = \{ \.\.\.pendingEntity, \.\.\.entity \}\}/)
		assert.doesNotMatch(source, /\(\{ value:/)
		assert.doesNotMatch(source, /([A-Za-z_$][\w$]*) !== undefined && \1 !== null/)
		if (source.includes('const pendingEntity = $derived'))
			assert.ok((source.match(/\bpendingEntity\b/g) ?? []).length > 2, generatedView.path)
		if (source.includes('const titleFallback = '))
			assert.ok((source.match(/\btitleFallback\b/g) ?? []).length > 2, generatedView.path)
	}

	const accountView = renderedView('src/views/EvmAccountView.svelte')
	const accountsView = renderedView('src/views/EvmAccountsView.svelte')
	const blobView = renderedView('src/views/EvmBlobView.svelte')
	const cardanoTxOutputView = renderedView('src/views/CardanoTxOutputView.svelte')
	const terminalTimestampView = renderedView('src/views/AcpTerminal_TimestampView.svelte')
	const cardanoTxOutputContent = cardanoTxOutputView.slice(
		cardanoTxOutputView.indexOf('{#snippet Content('),
		cardanoTxOutputView.indexOf('{#snippet Details(')
	)

	assert.doesNotMatch(accountView, /\{#if address\d* != null\}/)
	assert.doesNotMatch(accountView, /Object\.hasOwn\(prefetched|layout !== EntityLayout\.SummaryDetails/)
	assert.doesNotMatch(blobView, /\{#if serialValue != null\}/)
	assert.doesNotMatch(blobView, /\{@const serialValue =/)
	assert.match(blobView, /#\{selection\.entitySelector\.indexInTransaction\}/)
	assert.match(blobView, /title=\{title \?\? `Blob #\$\{selection\.entitySelector\.indexInTransaction\}`\}/)
	assert.doesNotMatch(blobView, /const titleFallback =/)
	assert.doesNotMatch(blobView, /\{#if evmTransaction != null/)
	assert.doesNotMatch(terminalTimestampView, /\{#if timestampMs\d* != null\}/)
	assert.doesNotMatch(cardanoTxOutputContent, /\{@const resolvedEntity =/)
	assert.match(cardanoTxOutputContent, /\{@const lovelace = entity\.lovelace\}/)
	assert.match(cardanoTxOutputContent, /\{#if lovelace != null\}/)
	assert.match(accountView, /\{#if entity\.\$primaryName != null\}/)
	assert.doesNotMatch(accountsView, /\{#if emptyText != null\}/)
	assert.doesNotMatch(accountsView, /No EVM accounts yet\./)
	assert.doesNotMatch(accountsView, /\{emptyText\}/)
	for (const globalViewPath of [
		'src/views/_GlobalActivityPubNetworkView.svelte',
		'src/views/_GlobalArweaveNetworkView.svelte',
		'src/views/_GlobalEvmAbiCatalogView.svelte',
		'src/views/_GlobalXNetworkView.svelte',
	]) {
		const globalView = renderedView(globalViewPath)
		assert.match(globalView, /\{selection\.entitySelector\.scope\}/)
		assert.doesNotMatch(globalView, /scope \|\||const titleFallback =/)
	}
})

test('defaults Network base sources without widening protocol facet sources', () => {
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
			/select\(data\.entityType, data\.selector\)/
		)
		assert.doesNotMatch(
			generatedRouteProduct,
			/sources:\s*\[[\s\S]*?Source\.(?:Blockscout_Rest|CosmosChainRegistry_Github|Superchain_Github)/
		)
		if (path.endsWith('/+layout.svelte')) {
			assert.doesNotMatch(generatedRouteProduct, /\{@const DetailView =/)
			assert.doesNotMatch(generatedRouteProduct, /\? NetworkView : NetworkView/)
			assert.match(generatedRouteProduct, /<NetworkView\n\t+selection=\{\n\t+select\(EntityType\.Network, data\.selector/)
			assert.match(generatedRouteProduct, /sources: \[\n\t+Source\.Constants_Internal,\n\t+\]/)
		}
	}
	const generatedView = renderGeneratedFile(generatedFile)
	assert.doesNotMatch(generatedView, /const viewSelection =/)
	const rootResource = generatedView.slice(
		generatedView.indexOf('const network = $derived('),
		generatedView.indexOf('const titleFallback = $derived(')
	)
	const evmProjection = generatedView.slice(
		generatedView.indexOf('resource={selection.Evm}'),
		generatedView.indexOf('resource={selection.Cosmos}')
	)
	const cosmosProjection = generatedView.slice(generatedView.indexOf('resource={selection.Cosmos}'))

	assert.match(rootResource, /const network = \$derived\(selection\(\{\s*sources: selection\.sources \?\? \[\s*Source\.Constants_Internal,?\s*\],\s*\}\)\(\{/)
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
				/resource=\{network\}/.test(markup)
			)),
			true,
			`${field} must reuse the Network view resource`
		)
	const namespaceQueries = [...generatedView.matchAll(/namespace: true,/g)].map((match) => (
		generatedView.slice(Math.max(0, match.index - 300), match.index + match[0].length)
	))
	assert.equal(namespaceQueries.length, 1)
	for (const namespaceQuery of namespaceQueries) {
		assert.match(namespaceQuery, /const network = \$derived\(selection\(\{/)
		assert.doesNotMatch(namespaceQuery, /Source\.(?:Chainlist_Rest|CosmosChainRegistry_Github|EthereumLists_Rest|Superchain_Github)/)
	}
	assert.match(generatedView, /const mempoolSpaceRestAndBlockchairRestSources = \$derived\([\s\S]*?Source\.Blockchair_Rest/)
	assert.match(generatedView, /SectionUtxoExecutionTransactions[\s\S]*?<UtxoTransactionsView[\s\S]*?selection=\{[\s\S]*?projection[\s\S]*?\.\$\$transactions\(\{[\s\S]*?sources: mempoolSpaceRestAndBlockchairRestSources/)
	assert.match(evmProjection, /Source\.Chainlist_Rest/)
	assert.doesNotMatch(evmProjection, /Source\.CosmosChainRegistry_Github/)
	assert.match(evmProjection, /id: 'evm-execution-transactions'/)
	assert.match(generatedView, /const blockscoutRestSources = \$derived\([\s\S]*?networkApplicableSources\(\[[\s\S]*?Source\.Blockscout_Rest,[\s\S]*?\], pendingEntity\)/)
	assert.match(evmProjection, /SectionEvmExecutionTransactions[\s\S]*?sources: blockscoutRestSources/)
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
				[EntityType.CosmosAccount, '$$transactions'],
				[EntityType.CosmosValidator, '$$timestamps'],
				[EntityType.CosmosGovernanceProposal, '$$timestamps'],
				[EntityType.CosmosTransaction, '$$messages'],
			].flatMap(([entityType, fieldName]) => field(entityType as EntityType, fieldName as string)?.defaultSources?.includes(Source.CosmosSdk_Rest) ? [] : [`${entityType}.${fieldName}`]).concat(
				field(EntityType.CosmosBlock, '$$transactions') == null
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

		const actionFields = [
			'$previousAction',
			'policyHash',
			'hardForkMajor',
			'hardForkMinor',
			'treasuryWithdrawals',
			'committeeRemovedCredentials',
			'committeeAdditions',
			'committeeQuorumNumerator',
			'committeeQuorumDenominator',
			'constitutionAnchorUrl',
			'constitutionAnchorHash',
			'constitutionScript',
		]

		return (
			[
				'proposalKind',
				'$transaction',
				'depositLovelace',
				'returnAddress',
				'anchorUrl',
				'anchorHash',
			].every((fieldName) => JSON.stringify(field(EntityType.CardanoGovernanceProposal, fieldName)?.defaultSources) === JSON.stringify([Source.CardanoKoios_Rest]))
			&& actionFields.every((fieldName) => JSON.stringify(field(EntityType.CardanoGovernanceProposal, fieldName)?.defaultSources) === JSON.stringify([
				Source.Blockfrost_Rest,
				Source.CardanoKoios_Rest,
			]))
			&& field(EntityType.CardanoGovernanceProposal, 'proposalPayload') == null
			&& [
				'governanceActionId',
				'$$timestamps',
				'$$votes',
			].every((fieldName) => JSON.stringify(field(EntityType.CardanoGovernanceProposal, fieldName)?.defaultSources) === JSON.stringify([Source.Blockfrost_Rest]))
			&& entity(EntityType.CardanoGovernanceProposal).views.singular?.query?.sources == null
			&& field(EntityType.CardanoGovernanceProposal_Timestamp, 'expirationEpoch') != null
			&& field(EntityType.CardanoCommittee_Epoch, '$seatingProposal')?.defaultSources?.includes(Source.Blockfrost_Rest)
			&& field(EntityType.CardanoCommittee_Epoch, 'dissolved')?.defaultSources?.includes(Source.Blockfrost_Rest)
		) ? [] : ['Cardano lifecycle/committee source truth']
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
			const proposal = candidateApp.schema.entities.find((entity) => entity.entityType === EntityType.CardanoGovernanceProposal)
			assert.ok(proposal)
			proposal.fields = proposal.fields.map((field) => field.name !== 'policyHash' ? field : {
				...field,
				defaultSources: [Source.CardanoKoios_Rest],
			})
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
			assert.doesNotMatch(generatedView, /sources: selection\.sources/)
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

test('keeps Cardano list identity source authority mutation-complete', () => {
	for (const [entityType, facetName, fieldName, expectedSources] of [
		[EntityType.Network, 'Cardano', '$$stakePools', [Source.CardanoKoios_Rest]],
		[EntityType.Network, 'Cardano', '$$dReps', [Source.CardanoKoios_Rest]],
		[EntityType.CardanoStakePool, undefined, 'ticker', [Source.Blockfrost_Rest]],
		[EntityType.CardanoDRep, undefined, 'displayName', [Source.Blockfrost_Rest]],
	] as const) {
		const assertSources = (candidateApp: typeof app, sources: readonly Source[]) => {
			const entity = candidateApp.schema.entities.find((candidate) => candidate.entityType === entityType)
			assert.ok(entity)
			const field = (
				facetName == null ? entity.fields : entity.facets.find((facet) => facet.name === facetName)?.fields
			)?.find((candidate) => candidate.name === fieldName)
			assert.ok(field)
			assert.deepEqual(field.defaultSources, sources)
			return field
		}

		assertSources(app, expectedSources)
		const mutatedApp = structuredClone(app)
		assertSources(mutatedApp, expectedSources).defaultSources = [Source.Constants_Internal]
		assert.throws(() => assertSources(mutatedApp, expectedSources))
	}
})

test('keeps Farcaster relationship source applicability mutation-complete', () => {
	for (const [entityType, fieldName, expectedSources] of [
		[EntityType.FarcasterCast, '$$directReplies', [Source.Neynar_Rest, Source.Farcaster_Rest]],
		[EntityType.FarcasterChannel, '$$casts', [Source.Neynar_Rest, Source.Snapchain_Rest]],
		[EntityType.FarcasterFeed, '$$entries', [Source.Neynar_Rest, Source.Snapchain_Rest]],
		[EntityType.FarcasterNetwork, '$$channels', [Source.Farcaster_Rest]],
		[EntityType.FarcasterUser, '$$casts', [Source.Neynar_Rest, Source.Snapchain_Rest]],
	] as const) {
		const assertSources = (candidateApp: typeof app, sources: readonly Source[]) => {
			const entity = candidateApp.schema.entities.find((candidate) => candidate.entityType === entityType)
			assert.ok(entity)
			const field = entity.fields.find((candidate) => candidate.name === fieldName)
			assert.ok(field)
			assert.deepEqual(field.defaultSources, sources)
			return field
		}

		assertSources(app, expectedSources)
		const mutatedApp = structuredClone(app)
		assertSources(mutatedApp, expectedSources).defaultSources = [Source.Constants_Internal]
		assert.throws(() => assertSources(mutatedApp, expectedSources))
	}
})

test('keeps list sources scoped without re-emitting relationship field defaults', () => {
	const generatedFiles = baselineCompiledApp.generatedFiles
	const farcasterCast = app.schema.entities.find((entity) => entity.entityType === EntityType.FarcasterCast)
	const castsFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterCastsView.svelte')
	const castFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterCastView.svelte')
	const channelFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterChannelView.svelte')
	const feedFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterFeedView.svelte')

	assert.ok(farcasterCast)
	assert.ok(castsFile)
	assert.ok(castFile)
	assert.ok(channelFile)
	assert.ok(feedFile)
	const castsView = renderGeneratedFile(castsFile)
	const castView = renderGeneratedFile(castFile)
	const channelView = renderGeneratedFile(channelFile)
	const feedView = renderGeneratedFile(feedFile)
	const feedDetails = feedView.slice(feedView.indexOf('{#snippet Details'))
	assert.match(
		feedDetails,
		/selection\.entitySelector\.variant === 'byUser'\s*&& 'fid' in selection\.entitySelector \?[\s\S]*?feed\/user\/\[userId=farcasterFid\]'[\s\S]*?userId: String\(selection\.entitySelector\.fid\),/
	)
	assert.match(
		feedDetails,
		/selection\.entitySelector\.variant === 'byChannel'\s*&& 'channelId' in selection\.entitySelector \?[\s\S]*?feed\/channel\/\[channelId=stringSegment\]'[\s\S]*?channelId: selection\.entitySelector\.channelId,/
	)
	assert.match(
		feedDetails,
		/selection\.entitySelector\.variant === 'following'\s*&& 'viewerFid' in selection\.entitySelector \?[\s\S]*?feed\/following\/\[userId=farcasterFid\]'[\s\S]*?userId: String\(selection\.entitySelector\.viewerFid\),/
	)
	assert.match(
		feedDetails,
		/selection\.entitySelector\.variant === 'trending' \?\s*resolve\('\/\(social\)\/\(farcaster\)\/farcaster\/\(farcasterNetwork\)\/feed\/trending'\)\s*:\s*undefined/
	)
	assert.equal((feedDetails.match(/\bresolve\(/g) ?? []).length, 4)
	assert.doesNotMatch(feedDetails, /href=\{resolve\([^)]*feed\/trending/)
	assert.doesNotMatch(feedDetails, /\bentity\.(?:variant|fid|channelId|viewerFid)\b/)
	assert.match(castView, /const directRepliesResource = selection\.\$\$directReplies/)
	assert.doesNotMatch(castView, /farcasterCastFarcasterCastsViewDirectRepliesResource/)
	assert.doesNotMatch(castView, /\$\$directReplies\(\{[\s\S]*?Source\.(?:Neynar_Rest|Farcaster_Rest)/)
	assert.match(channelView, /selection=\{selection\.\$\$casts\}/)
	assert.doesNotMatch(channelView, /\$\$casts\(\{[\s\S]*?Source\.(?:Neynar_Rest|Snapchain_Rest)/)
	assert.match(channelView, /const viewSelection = \$derived\([\s\S]*?Source\.Farcaster_Rest,[\s\S]*?\)/)
	const userViewFile = generatedFiles.find((file) => file.path === 'src/views/FarcasterUserView.svelte')
	assert.ok(userViewFile)
	const userView = renderGeneratedFile(userViewFile)
	assert.match(
		userView,
		/resolve\([\s\S]*?'\/\(social\)\/\(farcaster\)\/farcaster\/\(farcasterNetwork\)\/user\/\[userId=farcasterFid\]\/\(farcasterUser\)\/casts',[\s\S]*?userId: String\(selection\.entitySelector\.fid\),/
	)
	assert.doesNotMatch(userView, /resolve\(\s*`/)
	assert.match(userView, /\{#snippet Details\(\)\}[\s\S]*?<FarcasterCastsView[\s\S]*?selection=\{selection\.\$\$casts\}/)
	assert.doesNotMatch(userView, /\n\t{3,}<CollapsibleTabs/)
	assert.doesNotMatch(userView, /farcasterUserActivityFarcasterUserCastsResource/)
	const redditLinkTimestampViewFile = generatedFiles.find((file) => file.path === 'src/views/RedditLink_TimestampView.svelte')
	assert.ok(redditLinkTimestampViewFile)
	const redditLinkTimestampView = renderGeneratedFile(redditLinkTimestampViewFile)
	assert.match(redditLinkTimestampView, /fullname: encodeURIComponent\(selection\.entitySelector\.\$link\.fullname\),/)
	assert.doesNotMatch(redditLinkTimestampView, /resolve\(\s*`/)
	assert.doesNotMatch(redditLinkTimestampView, /String\(pendingEntity\.\$link \?\? ''\)\.fullname/)
	assert.match(castView, /FarcasterCastsView/)
	assert.doesNotMatch(castView, /\/farcaster\/feed\/trending/)
	assert.match(castsView, /selection\(\{\s*fields: \{[\s\S]*?text: true,[\s\S]*?timestamp: true,/)
	assert.doesNotMatch(castsView, /sources: selection\.sources/)
	assert.doesNotMatch(castsView, /fields: \{[\s\S]*?username: true,[\s\S]*?\}/)
	assert.doesNotMatch(castsView, /sources: \[\s*Source\.Snapchain_Rest/)
	const nostrNotesFile = generatedFiles.find((file) => file.path === 'src/views/NostrNotesView.svelte')
	assert.ok(nostrNotesFile)
	const nostrNotesView = renderGeneratedFile(nostrNotesFile)
	assert.doesNotMatch(nostrNotesView, /sources: selection\.sources/)
	assert.doesNotMatch(
		nostrNotesView,
		/sources: \[\s*Source\.Constants_Internal,?\s*\]/
	)
	const aptosAccount = app.schema.entities.find((entity) => entity.entityType === EntityType.AptosAccount)
	assert.deepEqual(
		aptosAccount?.fields.find((field) => field.name === '$$transactions')?.defaultSources,
		[Source.AptosIndexer_Graphql]
	)
	const tronTransactionsFile = generatedFiles.find((file) => file.path === 'src/views/TronTransactionsView.svelte')
	assert.ok(tronTransactionsFile)
	const tronTransactionsView = renderGeneratedFile(tronTransactionsFile)
	assert.match(tronTransactionsView, /tronTransaction\.\$owner == null \? '' :/)
	assert.match(tronTransactionsView, /tronTransaction\.\$to == null \? '' :/)
	assert.doesNotMatch(tronTransactionsView, /\{@const tronTransactionFields =/)
	const redditCommentsFile = generatedFiles.find((file) => file.path === 'src/views/RedditCommentsView.svelte')
	assert.ok(redditCommentsFile)
	const redditCommentsView = renderGeneratedFile(redditCommentsFile)
	assert.match(redditCommentsView, /sources: selection\.sources \?\? \[\s*Source\.Reddit_PublicJson,/)
	assert.doesNotMatch(redditCommentsView, /Source\.Constants_Internal/)
	assert.equal((castView.match(/const viewSelection = \$derived/g) ?? []).length, 1)
	for (const field of ['text', 'timestamp']) {
		const detailQueries = [...castView.matchAll(new RegExp(`${field}: true,`, 'g'))].map((match) => (
			castView.slice(Math.max(0, match.index - 300), match.index + match[0].length)
		))
		assert.equal(detailQueries.length, 1)
		for (const detailQuery of detailQueries) {
			assert.match(detailQuery, /viewSelection\(\{/)
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
	assert.match(explicitPluralSourcesView, /sources: selection\.sources \?\? \[\s*Source\.Neynar_Rest,?\s*\]/)
})

test('binds each collection selection once for its list and count', () => {
	const servicesPageFile = baselineCompiledApp.generatedFiles.find((file) => (
		file.path === 'src/routes/services/agents/+page.svelte'
	))
	assert.ok(servicesPageFile)
	const servicesPage = renderGeneratedFile(servicesPageFile)
	assert.match(
		servicesPage,
		/\{@const collectionSelection = select\(EntityType\._Global,[\s\S]*?\)\.\$\$eip8004Services\}[\s\S]*?selection=\{collectionSelection\}[\s\S]*?countResource=\{collectionSelection\.count\}/
	)
	assert.equal(servicesPage.match(/select\(EntityType\._Global,/g)?.length, 1)
	assert.doesNotMatch(servicesPage, /Source\.Eip8004Scan_Rest|\.\$\$eip8004Services\(\{/)
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
	]) {
		const generatedFile = baselineCompiledApp.generatedFiles.find((candidate) => candidate.path === path)
		assert.ok(generatedFile, path)
		const generatedSource = renderGeneratedFile(generatedFile)
		assert.match(generatedSource, /selection=\{pageSelection\}/)
		assert.doesNotMatch(generatedSource, /import \{ resolve \} from '\$app\/paths'|\bhref=\{|resolve\(/)
	}
	for (const path of [
		'src/views/YoutubeChannel_TimestampView.svelte',
		'src/views/YoutubeComment_TimestampView.svelte',
		'src/views/YoutubePlaylist_TimestampView.svelte',
		'src/views/YoutubeVideo_TimestampView.svelte',
	]) {
		const generatedFile = baselineCompiledApp.generatedFiles.find((candidate) => candidate.path === path)
		assert.ok(generatedFile, path)
		const generatedSource = renderGeneratedFile(generatedFile)
		assert.match(generatedSource, /resolve\([\s\S]*?\/observations\/\[timestampMs=nonNegativeInteger\]-\[source=stringSegment\]',/)
		assert.match(generatedSource, /timestampMs: String\(selection\.entitySelector\.timestampMs\),/)
		assert.match(generatedSource, /source: selection\.entitySelector\.source,/)
		assert.doesNotMatch(generatedSource, /resolve\(\s*`/)
	}
})

test('preserves facet syntax and paths and unwraps primitive-list resources', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-facet-list-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const networkView = readFileSync(path.join(generatedOutputRoot, 'src/views/NetworkView.svelte'), 'utf8')
		assert.match(networkView, /<ProjectionBoundary\s+resource=\{selection\.Evm\}/)
		assert.match(networkView, /\{#snippet Applicable\(projection\)\}/)
		assert.match(
			networkView,
			/<ResourceBoundary[\s\S]*?resource=\{\s*selection\.Evm\s*\.consensusEndpoints\(\{\s*sources: beaconRestSources,\s*\}\)\s*\}/
		)
		assert.doesNotMatch(networkView, /projection\.Evm\.consensusEndpoints/)
		assert.doesNotMatch(
			networkView,
			/selection\.Evm\.consensusEndpoints\(\{[\s\S]*?fields:\s*\{\s*Evm:/
		)
		assert.match(networkView, /\{#snippet children\(consensusEndpointsField\)\}[\s\S]*?\{#each consensusEndpointsField\.values as consensusEndpoint/)
		assert.doesNotMatch(networkView, /entity\.consensusEndpoints(?:\.values)?/)
		assert.doesNotMatch(networkView, /import .*BeaconConsensus\.ts|beaconRestBaseByExecutionChainId/)
		assert.doesNotMatch(
			networkView.slice(
				networkView.indexOf('const pendingEntity = $derived('),
				networkView.indexOf('const voltaireJsonRpcSources = $derived(')
			),
			/beacon|consensusProtocol|consensusEndpoints/
		)

		const networkBlocksPage = readFileSync(path.join(
			generatedOutputRoot,
			'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks/+page.svelte'
		), 'utf8')
		assert.match(networkBlocksPage, /selection=\{select\(EntityType\.Network, data\.selector\)\.Evm\.\$\$blocks\}/)
		assert.doesNotMatch(networkBlocksPage, /ProjectionBoundary|Applicable\(projection\)/)
		assert.doesNotMatch(networkBlocksPage, /countResource=|count:\s*true/)

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
				evmTransactionView.indexOf('const viewDomId = $derived(')
			),
			/ContractCreation/
		)
		assert.match(evmTransactionView, /resource=\{selection\.ContractCreation\}/)

		const evmTokenTransfersView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTokenTransfersView.svelte'), 'utf8')
		assert.match(evmTokenTransfersView, /resource=\{selection\.Nft\}/)

		const evmLogView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmLogView.svelte'), 'utf8')
		assert.match(evmLogView, /resource=\{selection\.Event\.TokenTransfer\}[\s\S]+?\{@const ([A-Za-z0-9]+Resource) = projection\.\$\$tokenTransfers\}[\s\S]+?selection=\{\1\}[\s\S]+?countResource=\{\1\.count\}/)
		assert.doesNotMatch(evmLogView, /projection\.Event\.TokenTransfer\.\$\$tokenTransfers/)

		const networkTimestampView = readFileSync(path.join(generatedOutputRoot, 'src/views/Network_TimestampView.svelte'), 'utf8')
		assert.equal(
			[...networkTimestampView.matchAll(/resource=\{selection\.Cosmos\}/g)].length,
			1,
			'adjacent modeled <dl> rows with one projection owner must share one boundary'
		)
	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('guards only schema-optional generated entity references', () => {
	const generatedOutputRoot = createFreshRoot('blockhead-generator-entity-reference-test-')

	try {
		stageReadOnlyGeneratedFixture(generatedOutputRoot)

		const farcasterVerifiedAddressView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/FarcasterVerifiedAddressView.svelte'),
			'utf8'
		)
		assert.doesNotMatch(
			farcasterVerifiedAddressView,
			/\{#snippet children\(farcasterUser\)\}\s+\{#if farcasterUser != null && farcasterUser\[EntityMetaKey\.Selector\] != null\}/
		)
		assert.match(
			farcasterVerifiedAddressView,
			/\{#snippet children\(evmAccount\)\}\s+\{#if evmAccount != null\}/
		)
		assert.doesNotMatch(
			farcasterVerifiedAddressView,
			/evmAccount != null && evmAccount\[EntityMetaKey\.Selector\] != null/
		)

		const blockheadWalletConnectionView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/BlockheadWalletConnectionView.svelte'),
			'utf8'
		)
		assert.doesNotMatch(
			blockheadWalletConnectionView,
			/<BlockheadWalletView(?:(?!\/>)[\s\S])*?\bhref=/,
			'relationship summaries without a target entity route must not emit a redundant href override'
		)

	} finally {
		removeFreshRoot(generatedOutputRoot)
	}
})

test('derives every view item field dependency from one canonical primitive', () => {
	const generatorSource = readFileSync(path.join(root, 'scripts/app/generate.ts'), 'utf8')

	assert.equal(
		(generatorSource.match(/\.\.\.itemFieldReferences\(viewEntry\)/g) ?? []).length,
		1
	)
	assert.equal(
		(generatorSource.match(/\.\.\.viewItemDisplayFieldReferences\(viewEntry\)/g) ?? []).length,
		1
	)
	assert.equal(
		(generatorSource.match(/viewItemEntityFieldsExpression\(entity, viewEntry, /g) ?? []).length,
		2
	)
	assert.doesNotMatch(
		generatorSource,
		/const (?:importedViewItems|rawSnippetImportSpecs|declaredViewImportSpecs|renderedFieldReferences) =/
	)
	assert.doesNotMatch(generatorSource, /\.\.\.allViewItems\(entity, indexes\),\s*\.\.\.contentRows\.flat\(\)/)
	assert.doesNotMatch(generatorSource, /viewUsesFormat\(entity, indexes,[^;]+\|\| contentRows\.some/)
})
