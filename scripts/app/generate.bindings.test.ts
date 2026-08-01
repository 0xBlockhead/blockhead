import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
	app,
	Source,
	SourceCredentialScope,
	SourceEndpointKind,
} from '../../APP.ts'
import { compileApp, renderSourcesMarkdown } from './generate.ts'

const sourceBindingRows = app.sources.sources.flatMap((source) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
].map((binding) => ({
	binding,
	provider: source.provider,
	source: source.source,
})))

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

test('retains only canonical source binding facts in compiler rows', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')
	const sourceBindingEntry = generatorSource.slice(
		generatorSource.indexOf('type SourceBindingEntry ='),
		generatorSource.indexOf('type RouteFixtureMetadata =')
	)

	assert.match(sourceBindingEntry, /type SourceBindingEntry = \{\n\treadonly source: SourceDefinition\['source'\]\n\treadonly binding: SourceBinding\n\}/)
	assert.doesNotMatch(sourceBindingEntry, /provider|bindingIndex|artifact/)
	assert.doesNotMatch(generatorSource, /SourceArtifactEntry|sourceArtifacts/)
	assert.match(generatorSource, /const sourceDefinitionById = nullPrototypeRecord\(sources\.map/)
	assert.match(generatorSource, /sourceBindingRows\.flatMap\(\(\{ binding, bindingNumber \}\) => \(binding\.artifacts \?\? \[\]\)\.map/)
})

test('derives provider partitions only at their emitter invocation', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')

	assert.doesNotMatch(generatorSource, /CompiledSourceProviderFacts|sourceProviderPlans/)
	assert.match(generatorSource, /type CompiledAppFacts = Readonly<\{[\s\S]*?sourceProviders: readonly SourceProviderDefinition\[\][\s\S]*?sources: readonly SourceDefinition\[\][\s\S]*?sourceBindings: readonly SourceBindingEntry\[\]/)
	assert.match(generatorSource, /type GenerationInput = Readonly<\{[\s\S]*?sourceProviders: readonly SourceProviderDefinition\[\][\s\S]*?sources: readonly SourceDefinition\[\]/)
	assert.match(generatorSource, /sourceProviders\.flatMap\(\(provider\) => \{[\s\S]*?const providerBindings = indexes\.sourceBindings\.filter[\s\S]*?generateSourceProviderBindingsFile\(provider, providerBindings\)[\s\S]*?generationInput\.sources\.filter\(\(source\) => source\.provider === provider\.provider\)/)
})

test('uses authored binding identity instead of synthetic row indexes', async () => {
	const generatorSource = await readFile('scripts/app/generate.ts', 'utf8')
	const bindingsEmitter = generatorSource.slice(
		generatorSource.indexOf('const generateSourceProviderBindingsFile ='),
		generatorSource.indexOf('const generateSourceProviderDefinitionFile =')
	)

	assert.doesNotMatch(bindingsEmitter, /bindingGroupIndexByBinding|bindingIndex|row\?\.index|sourceBindingRows\[index\]\?\.index/)
	assert.doesNotMatch(bindingsEmitter, /bindings\.map\(\(\{ binding, source \}, index\) =>/)
	assert.match(bindingsEmitter, /const bindingBaseNameByBinding = new Map\(bindingGroups\.flatMap\(\(group, groupIndex\) => \{[\s\S]*?bindingBaseName == null \?[\s\S]*?\[\][\s\S]*?group\.map\(\(\{ binding \}\) => \[binding, bindingBaseName\] as const\)/)
	assert.match(bindingsEmitter, /}, bindingBaseNameByBinding\.get\(binding\)\)\)/)
	assert.match(bindingsEmitter, /orderedMatrixRows\.some\(\(row, index\) => \(\n\t\t\trow !== sourcePlan\.sourceBindingRows\[index\]/)
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
	const bindings = sourceBindingRows.map((sourceBinding, index) => ({
		...sourceBinding,
		bindingNumber: String(index + 1),
	}))

	assert.equal(
		sourceDoc,
		`${renderSourcesMarkdown(compileApp(app))}\n`
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
		rows: bindings.map(({ binding, bindingNumber, provider, source }) => [
			bindingNumber,
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
			'Endpoint',
			'Kind',
			'Locator',
			'Origin',
			'CORS',
		],
		rows: bindings.flatMap(({ binding, bindingNumber }) => binding.endpoints.map((endpoint, index) => [
			bindingNumber,
			String(index + 1),
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
			'Credential',
			'Scope',
			'Environment schema',
			'Keys',
		],
		rows: bindings.flatMap(({ binding, bindingNumber }) => binding.credentials.map((credential, index) => [
			bindingNumber,
			String(index + 1),
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
			'Artifact',
			'Kind',
			'Path',
			'Generated',
			'Official URL',
			'Reference URL',
		],
		rows: bindings.flatMap(({ binding, bindingNumber }) => (binding.artifacts ?? []).map((artifact, index) => [
			bindingNumber,
			String(index + 1),
			artifact.kind,
			artifact.path,
			artifact.generated ? 'yes' : 'no',
			artifact.officialUrl ?? '',
			artifact.referenceUrl ?? '',
		])),
	})
})
