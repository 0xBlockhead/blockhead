import assert from 'node:assert/strict'
import {
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
import test from 'node:test'

import {
	app,
	EntityType,
	Source,
	SourceProvider,
	type _SourceSelection,
} from '../../APP.ts'
import { match as matchAbsoluteUrl } from '../../src/params/absoluteUrl.ts'


const root = process.cwd()

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

const runGenerator = (
	command: 'check' | 'generate',
	generatedOutputRoot: string
) => spawnSync(
	process.execPath,
	[
		'--import',
		'tsx',
		path.join(root, 'scripts/app/generate.ts'),
		command,
	],
	{
		cwd: root,
		encoding: 'utf8',
		env: {
			...process.env,
			APP_GENERATED_OUTPUT_ROOT: generatedOutputRoot,
		},
	}
)

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

test('matches encoded absolute URL route segments without accepting malformed encoding', () => {
	assert.equal(matchAbsoluteUrl('https%3A%2F%2Fmastodon.social'), true)
	assert.equal(matchAbsoluteUrl('mastodon.social'), false)
	assert.equal(matchAbsoluteUrl('%'), false)
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

test('keeps complex route selectors and inverse href metadata complete', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-route-metadata-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

		const serviceAgentPage = readFileSync(
			path.join(generatedOutputRoot, 'src/routes/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]/+page.svelte'),
			'utf8'
		)
		assert.match(serviceAgentPage, /\$contract: \{[\s\S]*?reference: params\.chainId,[\s\S]*?address: params\.contractAddress,/)

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
		assert.match(utxoOutputPage, /select\(EntityType\.UtxoOutput, data\.selector, \{/)
		assert.doesNotMatch(utxoOutputPage, /\$transaction: data\.selector/)

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
		assert.match(activityPubParentLayout, /selection=\{select\(EntityType\._GlobalActivityPubNetwork, data\.selector\)\}/)
		assert.doesNotMatch(activityPubParentLayout, /data\.selectorMapping/)

		const proposalView = readFileSync(
			path.join(generatedOutputRoot, 'src/views/SpecificationProposalView.svelte'),
			'utf8'
		)
		assert.match(proposalView, /resolve\('\/proposals\/\[specificationRealmSlug=specificationRealmSlug\]\/\[proposalKindSlug=proposalKindSlug\]\/\[proposalRef=proposalRef\]'/)
		assert.doesNotMatch(proposalView, /\/observations\//)
		assert.doesNotMatch(proposalView, /pendingEntity\.category !== undefined && pendingEntity\.category !== undefined/)
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
		assert.match(routeFixtureMetadata, /contract\/\[address\]\/verification'[\s\S]*?routeKind: 'projection'/)
		assert.match(routeFixtureMetadata, /coin-instance\/\[chainId\]\/\[coinInstanceSlug\]'[\s\S]*?EvmCoinInstance\.NetworkType'[\s\S]*?NativeCurrency[\s\S]*?EvmCoinInstance\.NetworkTypeContract'[\s\S]*?Erc20Token/)

	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
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
	assert.match(generatorSource, /renderSourceSelectionsFile[\s\S]*?sourceSelections[\s\S]*?renderSourceArray\(selection\.default\)/)
})

test('isolates replacement-managed output from checked-in provider roots', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-test-'))
	const checkedInProviderRoot = path.join(generatedOutputRoot, 'src/sources/Fixture/index.ts')
	const staleRoute = path.join(generatedOutputRoot, 'src/routes/stale/+page.svelte')

	try {
		mkdirSync(path.dirname(checkedInProviderRoot), {
			recursive: true,
		})
		writeFileSync(checkedInProviderRoot, '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')

		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)
		assert.equal(existsSync(path.join(generatedOutputRoot, 'src/schema/EntityType.ts')), true)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')

		mkdirSync(path.dirname(staleRoute), {
			recursive: true,
		})
		writeFileSync(staleRoute, '<!-- Generated from APP.ts. Do not edit by hand. -->\n<p>stale</p>\n')

		const checkResult = runGenerator('check', generatedOutputRoot)
		assert.notEqual(checkResult.status, 0)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/routes\/stale\/\+page\.svelte/)

		const regenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(regenerateResult.status, 0, regenerateResult.stderr || regenerateResult.stdout)
		assert.equal(existsSync(staleRoute), false)
		assert.equal(readFileSync(checkedInProviderRoot, 'utf8'), '// Generated from APP.ts. Do not edit by hand.\nexport const checkedInProvider = true\n')
	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('does not rewrite unchanged generated files', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-idempotence-test-'))
	const generatedSchema = path.join(generatedOutputRoot, 'src/schema/BitTorrentAnnounce_Timestamp.ts')
	const preservedTimestamp = new Date('2000-01-01T00:00:00.000Z')

	try {
		const firstGenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(firstGenerateResult.status, 0, firstGenerateResult.stderr || firstGenerateResult.stdout)
		utimesSync(generatedSchema, preservedTimestamp, preservedTimestamp)

		const secondGenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(secondGenerateResult.status, 0, secondGenerateResult.stderr || secondGenerateResult.stdout)
		assert.equal(statSync(generatedSchema).mtimeMs, preservedTimestamp.getTime())
	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('renders empty public env schemas with the shared string index contract', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-public-env-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

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
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('roots sibling route groups without leaking internal segments', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-routes-test-'))
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
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

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
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('preserves facet syntax and paths and unwraps primitive-list resources', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-facet-list-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

		const networkView = readFileSync(path.join(generatedOutputRoot, 'src/views/NetworkView.svelte'), 'utf8')
		assert.match(networkView, /<ProjectionBoundary\s+resource=\{selection\.Evm\}/)
		assert.match(networkView, /\{#snippet Applicable\(projection\)\}/)
		assert.match(networkView, /resource=\{\s+projection\.consensusEndpoints\(/)
		assert.match(networkView, /\{#snippet children\(consensusEndpoints\)\}/)
		assert.doesNotMatch(networkView, /entity\.consensusEndpoints(?:\.values)?/)
		assert.match(networkView, /projection\.\$\$blocks\(\{[\s\S]+?limit: 16,[\s\S]+?count: true,/)
		assert.match(networkView, /projection\.\$\$transactions\(\{[\s\S]+?count: true,/)

		const networkBlocksPage = readFileSync(path.join(
			generatedOutputRoot,
			'src/routes/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks/+page.svelte'
		), 'utf8')
		assert.match(networkBlocksPage, /projection\.\$\$blocks\(\{[\s\S]+?count: true,/)

		const evmTransactionSchema = readFileSync(path.join(generatedOutputRoot, 'src/schema/EvmTransaction.ts'), 'utf8')
		assert.match(evmTransactionSchema, /FeeMarket: facet\([\s\S]+?\}\),\n\s+Blob: facet/)
		assert.doesNotMatch(evmTransactionSchema, /facets: \{\},/)

		const evmLogSchema = readFileSync(path.join(generatedOutputRoot, 'src/schema/EvmLog.ts'), 'utf8')
		assert.match(evmLogSchema, /Event: facet\([\s\S]+?\}\)\(\{\n\s+facets: \{\n\s+TokenTransfer: facet/)
		assert.doesNotMatch(evmLogSchema, /facets: \{\},/)

		const evmTransactionView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTransactionView.svelte'), 'utf8')
		assert.match(evmTransactionView, /resource=\{selection\.Blob\}[\s\S]+?projection\.\$\$blobs\(\{[\s\S]+?count: true,/)

		const evmLogView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmLogView.svelte'), 'utf8')
		assert.match(evmLogView, /resource=\{selection\.Event\.TokenTransfer\}[\s\S]+?projection\.\$\$tokenTransfers\(\{[\s\S]+?count: true,/)

		const networkTimestampView = readFileSync(path.join(generatedOutputRoot, 'src/views/Network_TimestampView.svelte'), 'utf8')
		assert.equal(
			[...networkTimestampView.matchAll(/resource=\{selection\.Cosmos\}/g)].length,
			2,
			'projection fields in each modeled <dl> row must share one boundary'
		)
	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('guards generated entity references when field resources complete without a value', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-entity-reference-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

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
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})
