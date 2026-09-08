import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { type as arktype } from 'arktype'

import {
	app,
	Source,
} from '../../APP.ts'
import {
	SourceCredentialScope,
	SourceEndpointKind,
	SourceOperationGroup,
} from './source.ts'
import {
	compileApp,
	sourceBindingId,
} from './generate.ts'
import { renderGeneratedFile } from './render.ts'
import { sourceBindings as runtimeBindings } from '../../src/sources/$sourceProviders.ts'

const sourceBindingRows = app.sources.sources.flatMap((source) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
].map((binding) => ({
	binding,
	provider: source.provider,
	source: source.source,
})))

const sourcesMarkdown = compileApp(app).generatedFiles.find((generatedFile) => generatedFile.path === 'SOURCES.md')
assert.ok(sourcesMarkdown)
assert.equal(sourcesMarkdown.kind, 'text')
const sourcesMarkdownText = sourcesMarkdown.body.join('\n')

const domainTargetBySource = {
	[Source.ChainlinkDataFeeds_AddressCatalog]: {
		kind: 'Global',
		key: 'chainlink-data-feeds-address-catalog',
	},
	[Source.ChainlinkDataFeeds_Contracts]: {
		kind: 'Global',
		key: 'chainlink-data-feeds-contract-catalog',
	},
	[Source.CircleCctpContracts_Evm]: {
		kind: 'Global',
		key: 'circle-cctp-evm-contract-catalog',
	},
	[Source.EasContracts_Evm]: {
		kind: 'Global',
		key: 'eas-evm-contract-catalog',
	},
	[Source.EigenLayerContracts_Evm]: {
		kind: 'Global',
		key: 'eigenlayer-evm-contract-catalog',
	},
	[Source.Erigon_JsonRpc]: {
		kind: 'LocalDevice',
		key: 'erigon-node',
	},
	[Source.FedimintClient_Rpc]: {
		kind: 'LocalDevice',
		key: 'fedimint-client',
	},
	[Source.FedimintGatewayd_Rest]: {
		kind: 'LocalDevice',
		key: 'fedimint-gatewayd',
	},
	[Source.InternetComputer_Canister]: {
		kind: 'Canister',
		key: 'application-canister',
	},
	[Source.McpDeclared_Protocol]: {
		kind: 'LocalDevice',
		key: 'declared-mcp-server',
	},
	[Source.Mlflow_Rest]: {
		kind: 'Global',
		key: 'mlflow-tracking-server',
	},
	[Source.Pyth_EvmContract]: {
		kind: 'Global',
		key: 'pyth-evm-contract-catalog',
	},
	[Source.qBittorrentWebUi_Rest]: {
		kind: 'LocalDevice',
		key: 'qbittorrent-client',
	},
	[Source.QuilibriumNodeMetrics_Prometheus]: {
		kind: 'LocalDevice',
		key: 'quilibrium-node',
	},
	[Source.Radicle_Local]: {
		kind: 'GitRepository',
		key: 'radicle-repository',
	},
	[Source.Radicle_Remote]: {
		kind: 'GitRepository',
		key: 'radicle-repository',
	},
	[Source.Reth_JsonRpc]: {
		kind: 'LocalDevice',
		key: 'reth-node',
	},
	[Source.TezosDappetizer_Postgres]: {
		kind: 'SqlDataset',
		key: 'tezos-dappetizer-dataset',
	},
	[Source.TransmissionRpc_JsonRpc]: {
		kind: 'LocalDevice',
		key: 'transmission-client',
	},
} as const

const tableAfterHeading = (source: string, heading: string) => {
	const headingIndex = source.indexOf(`${heading}\n`)
	const nextHeadingIndex = source.indexOf('\n## ', headingIndex + heading.length)
	const tableLines = source.slice(
		headingIndex + heading.length,
		nextHeadingIndex < 0 ? undefined : nextHeadingIndex
	).split('\n').filter((line) => line.startsWith('| '))
	const decodeCell = (value: string) => value
		.replaceAll('<br>', '\n')
		.replaceAll('&gt;', '>')
		.replaceAll('&lt;', '<')
		.replaceAll('&#124;', '|')
		.replaceAll('&amp;', '&')

	return {
		headings: tableLines[0]?.slice(2, -2).split(' | ').map(decodeCell),
		rows: tableLines.slice(2).map((line) => line.slice(2, -2).split(' | ').map(decodeCell)),
	}
}


test('owns every provider, source, and binding in APP', () => {
	assert.ok(app.sources.providers.length > 0)
	assert.ok(app.sources.sources.length > 0)
	assert.ok(sourceBindingRows.length > 0)
	assert.equal(
		new Set(app.sources.providers.map((provider) => provider.provider)).size,
		app.sources.providers.length
	)
	assert.equal(
		new Set(app.sources.sources.map((source) => source.source)).size,
		app.sources.sources.length
	)
	for (const source of app.sources.sources) {
		assert.ok(app.sources.providers.some((provider) => provider.provider === source.provider))
		for (const binding of [
			...(source.binding == null ? [] : [source.binding]),
			...(source.bindings ?? []),
		]) {
			assert.ok(binding.endpoints.length > 0)
		}
	}
})

test('declares live resolver transport in source bindings', () => {
	assert.equal(sourceBindingRows.some(({ binding, source }) => (
		source === Source.Voltaire_JsonRpc
		&& binding.delivery === 'RemoteLive'
	)), true)
})

test('declares Cashu mint operations at the Cashu source binding', () => {
	assert.deepEqual(
		sourceBindingRows.find(({ source }) => source === Source.CashuMint_Rest)?.binding.operationGroups,
		[
			SourceOperationGroup.EcashMintOperations,
			SourceOperationGroup.GenericRead,
		]
	)
})

test('keeps server capabilities out of browser-visible binding configuration', () => {
	assert.deepEqual(
		Object.fromEntries([
			Source.CardanoDbSync_Postgres,
			Source.Conseil_Postgres,
			Source.LightningLnd_Rest,
			Source.X_Rest,
		].map((source) => [
			source,
			sourceBindingRows.find((row) => row.source === source)?.binding.credentials,
		])),
		{
			[Source.CardanoDbSync_Postgres]: [
				{
					scope: SourceCredentialScope.RuntimeSecret,
					env: {
						keys: [
							{
								name: 'CARDANO_DB_SYNC_DATABASE_URL',
								type: 'string',
							},
						],
					},
					keys: ['CARDANO_DB_SYNC_DATABASE_URL'],
				},
			],
			[Source.Conseil_Postgres]: [
				{
					scope: SourceCredentialScope.RuntimeSecret,
					env: {
						keys: [
							{
								name: 'CONSEIL_DATABASE_URL',
								type: 'string',
							},
						],
					},
					keys: ['CONSEIL_DATABASE_URL'],
				},
			],
			[Source.LightningLnd_Rest]: [
				{
					scope: SourceCredentialScope.RuntimeSecret,
					envKey: 'LND_MACAROON_HEX',
					injection: {
						header: {
							name: 'Grpc-Metadata-macaroon',
						},
					},
				},
			],
			[Source.X_Rest]: [
				{
					scope: SourceCredentialScope.RuntimeSecret,
					envKey: 'X_API_BEARER',
					injection: {
						header: {
							name: 'Authorization',
							prefix: 'Bearer ',
						},
					},
				},
			],
		}
	)
})

test('retains only canonical source binding facts in compiler rows', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')
	const sourceBindingEntry = generatorSource.slice(
		generatorSource.indexOf('type SourceBindingEntry ='),
		generatorSource.indexOf('type RouteFixturePlan =')
	)

	assert.match(sourceBindingEntry, /type SourceBindingEntry = \{\n\treadonly source: SourceDefinition\['source'\]\n\treadonly binding: SourceBinding\n\}/)
	assert.doesNotMatch(sourceBindingEntry, /provider|bindingIndex|artifact/)
	assert.doesNotMatch(generatorSource, /SourceArtifactEntry|sourceArtifacts/)
	assert.equal(
		(generatorSource.match(/const sourceDefinitionById = nullPrototypeRecord\(/g) ?? []).length,
		1
	)
	assert.match(generatorSource, /const indexes = compiledApp/)
	assert.doesNotMatch(generatorSource, /sourceDefinitionById: compiledApp\.sourceDefinitionById/)
	assert.doesNotMatch(generatorSource, /nullPrototypeRecord\(compiledApp\.sources\.map/)
	assert.doesNotMatch(generatorSource, /nullPrototypeRecord\(sourcesMarkdown\.sources\.map/)
	assert.match(generatorSource, /sourceBindingRows\.flatMap\(\(\{ binding, bindingId \}\) => \(binding\.artifacts \?\? \[\]\)\.map/)
})

test('retains one record index for each entity and value type', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')
	const routeValueTypeIndexer = generatorSource.slice(
		generatorSource.indexOf('const indexRouteParamValueTypes ='),
		generatorSource.indexOf('// Route compilation turns')
	)

	assert.equal((generatorSource.match(/const entityByType = nullPrototypeRecord\(/g) ?? []).length, 1)
	assert.equal((generatorSource.match(/const valueTypeById = nullPrototypeRecord\(/g) ?? []).length, 1)
	assert.doesNotMatch(generatorSource, /compiledEntityByType/)
	assert.doesNotMatch(generatorSource, /entityByType\.(?:get|has)\(/)
	assert.doesNotMatch(generatorSource, /valueTypeById\.(?:get|has)\(/)
	assert.doesNotMatch(routeValueTypeIndexer, /new Map\(entities\.map/)
	assert.match(routeValueTypeIndexer, /entityByType: Readonly<Record<string, Entity>>/)
})

test('keeps provider-owned definitions outside compiler emitter inputs', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')

	assert.doesNotMatch(generatorSource, /CompiledSourceProviderFacts|sourceProviderPlans/)
	assert.match(generatorSource, /type CompiledAppFacts = Readonly<\{[\s\S]*?sourceProviders: readonly SourceProviderDefinition\[\][\s\S]*?sources: readonly SourceDefinition\[\][\s\S]*?sourceDefinitionById: Readonly<Record<string, SourceDefinition>>[\s\S]*?sourceBindings: readonly SourceBindingEntry\[\]/)
	assert.doesNotMatch(generatorSource, /GenerationInput|generationInput/)
	assert.doesNotMatch(generatorSource, /sourceBindingsByProvider|sourcesByProvider/)
	assert.doesNotMatch(generatorSource, /generateSourceProvider(?:Bindings|Definition)File/)
	assert.match(generatorSource, /generateSourceProvidersFile\(sourceProviderNames\)/)
	assert.match(generatorSource, /generateSourceServerCredentialsFile\(indexes\.sourceBindings\)/)
})

test('owns Esplora target identities without object stringification', () => {
	assert.deepEqual(
		sourceBindingRows
			.filter(({ source }) => source === Source.Esplora_Rest)
			.map(({ binding }) => binding.target.key),
		[
			'bip122:000000000019d6689c085ae165831e93',
			'liquid',
		]
	)
})

test('owns domain target identities instead of configuration prose', () => {
	assert.deepEqual(
		Object.fromEntries(sourceBindingRows
			.filter(({ source }) => source in domainTargetBySource)
			.map(({ binding, source }) => [
				source,
				binding.target,
			])),
		domainTargetBySource
	)
	assert.equal(
		sourceBindingRows.some(({ binding }) => binding.target.key.includes('configured')),
		false
	)
})

test('renders SOURCES.md exactly from APP', async () => {
	const sourceDoc = await readFile('SOURCES.md', 'utf8')
	const bindings = sourceBindingRows.map((sourceBinding) => ({
		...sourceBinding,
		bindingId: sourceBindingId({
			...sourceBinding.binding,
			source: sourceBinding.source,
		}),
	}))

	assert.equal(
		sourceDoc,
		`${sourcesMarkdownText}\n`
	)
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Providers'), {
		headings: [
			'Provider',
			'Label',
		],
		rows: app.sources.providers.map((provider) => [
			provider.provider,
			provider.label,
		]),
	})
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Sources'), {
		headings: [
			'Source',
			'Provider',
			'Label',
		],
		rows: app.sources.sources.map((source) => [
			source.source,
			source.provider,
			source.label,
		]),
	})
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Bindings'), {
		headings: [
			'Binding',
			'Provider',
			'Source',
			'Target kind',
			'Target key',
			'Wire protocol',
			'API family',
			'Operation groups',
			'Delivery',
		],
		rows: bindings.map(({ binding, bindingId, provider, source }) => [
			bindingId,
			provider,
			String(source),
			binding.target.kind,
			binding.target.key,
			binding.wireProtocol,
			binding.apiFamily,
			binding.operationGroups.join(', '),
			binding.delivery,
		]),
	})
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Endpoints'), {
		headings: [
			'Binding',
			'Kind',
			'Locator',
			'Origin',
			'CORS',
		],
		rows: bindings.flatMap(({ binding, bindingId }) => binding.endpoints.map((endpoint) => [
			bindingId,
			endpoint.endpointKind,
			endpoint.locator,
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& !endpoint.locator.startsWith('env:')
				&& URL.canParse(endpoint.locator) ?
					new URL(endpoint.locator).origin
				:
					'',
			endpoint.corsEnabled == null ? '' : String(endpoint.corsEnabled),
		])),
	})
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Credentials'), {
		headings: [
			'Binding',
			'Scope',
			'Environment schema',
			'Keys',
		],
		rows: bindings.flatMap(({ binding, bindingId }) => binding.credentials.map((credential) => [
			bindingId,
			credential.scope,
			credential.env == null ? 'no' : 'yes',
			(
				(
					credential.scope === SourceCredentialScope.PublicConfig ?
						credential.env?.keys.map(({ name }) => name)
					:
						credential.keys
				)
				?? []
			).join(', '),
		])),
	})
	assert.deepEqual(tableAfterHeading(sourceDoc, '## Artifacts'), {
		headings: [
			'Binding',
			'Kind',
			'Path',
			'Generated',
			'Official URL',
			'Reference URL',
		],
		rows: bindings.flatMap(({ binding, bindingId }) => (binding.artifacts ?? []).map((artifact) => [
			bindingId,
			artifact.kind,
			artifact.path,
			artifact.generated ? 'yes' : 'no',
			artifact.officialUrl ?? '',
			artifact.referenceUrl ?? '',
		])),
	})
})

test('keeps source documentation joins stable when a binding is inserted', () => {
	const appWithoutDydxLive = structuredClone(app)
	const dydxSourceWithoutLive = appWithoutDydxLive.sources.sources.find(({ source }) => (
		source === Source.DydxIndexer
	))
	const dydxLiveBinding = sourceBindingRows.find(({ binding, source }) => (
		source === Source.DydxIndexer
		&& binding.apiFamily === 'DydxIndexer'
	))
	assert.ok(dydxSourceWithoutLive?.bindings && dydxLiveBinding)
	dydxSourceWithoutLive.bindings.splice(1, 1)
	const markdownWithoutDydxLive = compileApp(appWithoutDydxLive).generatedFiles.find(({ path }) => (
		path === 'SOURCES.md'
	))
	assert.ok(markdownWithoutDydxLive && markdownWithoutDydxLive.kind === 'text')
	const dydxLiveBindingId = sourceBindingId({
		...dydxLiveBinding.binding,
		source: dydxLiveBinding.source,
	})

	for (const heading of [
		'## Bindings',
		'## Endpoints',
		'## Credentials',
		'## Artifacts',
	])
		assert.deepEqual(
			tableAfterHeading(sourcesMarkdownText, heading).rows.filter(([bindingId]) => (
				bindingId !== dydxLiveBindingId
			)),
			tableAfterHeading(markdownWithoutDydxLive.body.join('\n'), heading).rows
		)
})

test('keys every binding provider from canonical source definitions', () => {
	const providerBySource = Object.fromEntries(app.sources.sources.map(({ source, provider }) => [
		source,
		provider,
	]))
	const bindingRows = tableAfterHeading(
		sourcesMarkdownText,
		'## Bindings'
	).rows

	for (const bindingRow of bindingRows)
		assert.equal(bindingRow[1], providerBySource[bindingRow[2] ?? ''])
})

test('emits one provider binding file for every canonical provider closure', () => {
	const compiled = compileApp(app)
	const expectedProviders = [...new Set(sourceBindingRows.map(({ provider }) => provider))]
		.toSorted((left, right) => left.localeCompare(right, 'en'))
	const generatedProviderFiles = compiled.generatedFiles
		.filter(({ path }) => /^src\/sources\/[^/]+\/bindings\.ts$/.test(path))
		.toSorted((left, right) => left.path.localeCompare(right.path))
	assert.deepEqual(
		generatedProviderFiles.map(({ path }) => path),
		expectedProviders.map((provider) => `src/sources/${provider}/bindings.ts`)
	)

	for (const provider of expectedProviders) {
		const file = generatedProviderFiles.find(({ path }) => path === `src/sources/${provider}/bindings.ts`)
		assert.ok(file)
		const providerRows = sourceBindingRows.filter(({ provider: rowProvider }) => rowProvider === provider)
		const rendered = renderGeneratedFile(file)
		for (const { source, binding } of providerRows) {
			assert.match(rendered, new RegExp(`source: Source\\.${source}`))
			assert.match(rendered, new RegExp(`apiFamily: ApiFamily\\.${binding.apiFamily}`))
			assert.match(rendered, new RegExp(`delivery: SourceDelivery\\.${binding.delivery}`))
			assert.match(rendered, /indexSourceBindings/)
		}
	}
})

test('changes a generated provider binding when its canonical APP row changes', () => {
	const baseline = compileApp(app).generatedFiles.find(({ path }) => path === 'src/sources/Ipfs/bindings.ts')
	assert.ok(baseline)
	const changedApp = structuredClone(app)
	const ipfs = changedApp.sources.sources.find(({ source }) => source === Source.Ipfs_Rest)
	assert.ok(ipfs?.binding)
	ipfs.binding.endpoints[0].locator = 'https://ipfs.example'
	const changed = compileApp(changedApp).generatedFiles.find(({ path }) => path === 'src/sources/Ipfs/bindings.ts')
	assert.ok(changed)
	assert.notEqual(renderGeneratedFile(changed), renderGeneratedFile(baseline))
	assert.match(renderGeneratedFile(changed), /https:\/\/ipfs\.example/)
})

test('preserves complete canonical binding semantics in the generated runtime', () => {
	const expected = sourceBindingRows.map(({ source, binding }) => ({
		source,
		...binding,
		credentials: binding.credentials.map((credential) => 'envKey' in credential ? { scope: credential.scope } : ({
			...credential,
			...('env' in credential && credential.env != null ? {
				env: arktype(Object.fromEntries(credential.env.keys.map(({ name, type }) => [name, type]))).expression,
			} : {}),
		})),
	}))
	const actual = runtimeBindings.map((binding) => ({
		...binding,
		credentials: binding.credentials.map((credential) => ({
			...credential,
			...('env' in credential && credential.env != null ? { env: credential.env.expression } : {}),
		})),
	}))
	const key = (binding: { source: string; target: { kind: string; key: string }; delivery: string; apiFamily: string }) => (
		JSON.stringify([binding.source, binding.target.kind, binding.target.key, binding.delivery, binding.apiFamily])
	)
	assert.deepEqual(
		actual.toSorted((left, right) => key(left).localeCompare(key(right))),
		expected.toSorted((left, right) => key(left).localeCompare(key(right)))
	)
})
