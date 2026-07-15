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

test('projects APP field enums and navigation structure into runtime modules', () => {
	const generatedFileByPath = new Map(compileApp(app).generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))

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

test('emits declarative Network pending enrichment and localized optional carousel shells', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkView = compileApp(app).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')

	assert.ok(network?.views.singular?.pending)
	assert.ok(networkView)

	const renderedNetworkView = renderGeneratedFile(networkView)
	const networkRootQuery = renderedNetworkView.slice(
		renderedNetworkView.indexOf('const network = $derived('),
		renderedNetworkView.indexOf('const titleFallback = $derived(')
	)

	assert.match(renderedNetworkView, /import \{ beaconRestBaseByExecutionChainId \} from '\$\/constants\/BeaconConsensus\.ts'/)
	assert.match(renderedNetworkView, /import \{[^}]*networkByCaip2, networkBySlug[^}]*\} from '\$\/constants\/Network\.ts'/)
	assert.match(renderedNetworkView, /const pendingEntity = \$derived\([\s\S]*?networkByCaip2\[caip2Key\][\s\S]*?networkBySlug\[base\.slug\][\s\S]*?beaconRestBaseByExecutionChainId/)
	assert.doesNotMatch(networkRootQuery, /\$networkStack|\$icon|\$\$nativeAssets|\$\$blockExplorerUrls|\$\$faucetUrls/)
	assert.match(renderedNetworkView, /SectionEvmAssetsNativeCoin[\s\S]*?\{#snippet Pending\(\)\}\{\/snippet\}[\s\S]*?layout=\{EntityLayout\.SummaryInline\}/)
	assert.match(renderedNetworkView, /SectionEvmAssetsNativeInstance[\s\S]*?\{#snippet Pending\(\)\}\{\/snippet\}[\s\S]*?layout=\{EntityLayout\.SummaryInline\}/)
	assert.match(renderedNetworkView, /SectionEvmNetworkRelationshipsParentLayer[\s\S]*?\{#snippet Pending\(\)\}\{\/snippet\}/)
	assert.match(renderedNetworkView, /<dt>Name<\/dt>[\s\S]*?<dt>Namespace<\/dt>[\s\S]*?<dt>Ledger models<\/dt>[\s\S]*?<dt>Execution models<\/dt>[\s\S]*?<dt>Network stack<\/dt>[\s\S]*?<dt>Environment<\/dt>[\s\S]*?<dt>CAIP-2<\/dt>/)
	assert.ok(renderedNetworkView.indexOf('SectionEvmAssetsNativeCoin') < renderedNetworkView.indexOf('SectionEvmAssetsNativeInstance'))
	assert.ok(renderedNetworkView.indexOf('SectionEvmAssetsNativeInstance') < renderedNetworkView.indexOf('SectionEvmAssetsNativeAssets'))
})

test('emits every source-axis enum and only valid enum references in provider rows', () => {
	const generatedFiles = compileApp(app).generatedFiles
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
	const generatedFile = compileApp(app).generatedFiles.find((candidate) => candidate.path === 'src/sources/$sourceBindingCompatibility.ts')

	assert.ok(generatedFile)
	assert.equal(renderGeneratedFile(generatedFile).match(/wireProtocol:/g)?.length, sourceBindingCompatibility.length)
	assert.match(renderGeneratedFile(generatedFile), /apiFamilies: \[\s*ApiFamily\.EvmExecutionJsonRpc,/)
	assert.match(renderGeneratedFile(generatedFile), /operationGroups: \[[\s\S]*?SourceOperationGroup\.EvmRpcCore/)
	assert.match(renderGeneratedFile(generatedFile), /artifactKinds: \[[\s\S]*?SourceArtifactKind\.OpenRpcSpec/)
	assert.match(renderGeneratedFile(generatedFile), /apiFamilies: \[\s*ApiFamily\.WalletApi,[\s\S]*?artifactKinds: \[\]/)
	assert.match(renderGeneratedFile(generatedFile), /WireProtocol\.Grpc,[\s\S]*?ApiFamily\.GrpcService,[\s\S]*?SourceEndpointKind\.HttpUrl,[\s\S]*?SourceEndpointKind\.TcpAddress,/)
	assert.match(renderGeneratedFile(generatedFile), /WireProtocol\.Grpc,[\s\S]*?operationGroups: true,[\s\S]*?artifactKinds: true,/)
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
	const generatedFiles = compileApp(app).generatedFiles
	const ensNetworkView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/_GlobalEnsNetworkView.svelte')
	const marketCandlesView = generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/Market_TimeInterval_TimestampsView.svelte')

	assert.ok(ensNetworkView)
	assert.ok(marketCandlesView)
	assert.match(renderGeneratedFile(ensNetworkView), /_GlobalEnsNetwork_TimestampsView/)
	assert.match(renderGeneratedFile(marketCandlesView), /placeholderText = 'Loading OHLC candles\.\.\.'/)
	assert.match(renderGeneratedFile(marketCandlesView), /limit: 4096/)
})

test('rejects missing and nonsingular selector fields before route compilation', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)

	assert.ok(network)
	assert.doesNotThrow(() => compileApp(app))
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

test('derives disjoint CAIP-2 and slug domains from structured value types', () => {
	const networkMappings = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.selectors?.[EntityType.Network]
	const networkSchema = compileApp(app).generatedFiles.find((generatedFile) => generatedFile.path === 'src/schema/Network.ts')

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
			'(evm)': {
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
									},
								},
							},
						},
					},
				},
			},
			'(bitcoin)': {
				children: {
					network: {
						children: {
							'[network]': {
								selectors: {
									[EntityType.Network]: {
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
				valueType: 'knownCaip2',
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
		/overlap public route shape \/network\/\[\] with overlapping or unknown applicability/
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
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
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
	assert.match(renderedFileByPath.get(`${swarmContentPath}/+page.svelte`) ?? '', /swarmResourceContentPathFromRouteParam\(decodeURIComponent\(params\.contentPath\)\)/)
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
	const evmRoutes = app.routes.children['(explore)']?.children?.['(evm)']?.children?.evm
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

	const compiledApp = compileApp(app)
	const youtubeVideoView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/YoutubeVideoView.svelte')
	const youtubeVideosView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/YoutubeVideosView.svelte')

	assert.ok(youtubeVideoView)
	assert.ok(youtubeVideosView)
	const renderedYoutubeVideosView = renderGeneratedFile(youtubeVideosView)
	assert.match(
		renderGeneratedFile(youtubeVideoView),
		/resolve\('\/youtube\/video\/\[videoId=stringSegment\]'[\s\S]*?videoId: String\(pendingEntity\.videoId \?\? ''\)/
	)
	assert.match(
		renderedYoutubeVideosView,
		/resolve\('\/youtube\/video\/\[videoId=stringSegment\]'[\s\S]*?videoId: String\(youtubeVideoHrefFields\.videoId \?\? ''\)/
	)
	assert.match(renderedYoutubeVideosView, /const collectionSelection = \$derived\(selection\)/)
	assert.match(renderedYoutubeVideosView, /sources: collectionSelection\.sources/)
})

test('derives inverse ancestor and local href parameters from normalized selector mappings', () => {
	const evmContractMapping = app.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']?.children?.['(contracts)']?.children?.contract?.children?.['[address]']?.selectors?.[EntityType.EvmContract]?.EvmNetworkAddress

	assert.ok(evmContractMapping)
	assert.equal(evmContractMapping.href, undefined)

	const evmContractsView = compileApp(app).generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/EvmContractsView.svelte')
	assert.ok(evmContractsView)
	const renderedEvmContractsView = renderGeneratedFile(evmContractsView)

	assert.match(renderedEvmContractsView, /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/contract\/\[address=evmAddress\]'/)
	assert.match(renderedEvmContractsView, /network: String\(caip2StringFromValue\(evmContractHrefFields\.\$network\.caip2\) \?\? ''\)/)
	assert.match(renderedEvmContractsView, /address: String\(evmContractHrefFields\.address \?\? ''\)/)
})

test('suppresses selector detail entity hrefs only when explicitly disabled', () => {
	const compiledApp = compileApp(app)
	const utxoBlockView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UtxoBlockView.svelte')
	const utxoBlocksView = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/UtxoBlocksView.svelte')

	assert.ok(utxoBlockView)
	assert.ok(utxoBlocksView)
	assert.doesNotMatch(renderGeneratedFile(utxoBlockView), /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/block\/\[blockNumber=nonNegativeBigInt\]'/)
	assert.doesNotMatch(renderGeneratedFile(utxoBlocksView), /resolve\('\/network\/\[network=networkCaip2OrNetworkSlug\]\/block\/\[blockNumber=nonNegativeBigInt\]'/)
})

test('emits Node-safe route metadata with compiler-owned descendant probe cases', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-route-metadata-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

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

const ensRecordsMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ens)/ens/name/[ensName]/(ensName)/records']
assert.equal(ensRecordsMetadata.probeOwnerNodeId, '/(explore)/(ens)/ens/name/[ensName]')
assert.deepEqual(ensRecordsMetadata.mappings.map(({ id }) => id), ['EnsName.NormalizedName'])
assert.equal(
\tensRecordsMetadata.resolve({
\t\tensName: 'vitalik.eth',
\t}),
\t'/ens/name/vitalik.eth/records'
)

const ipfsPathMetadata = e2eRouteFixtureMetadataByNodeId['/(explore)/(ipfs)/[namespace]/[target]/path/[contentPath]']
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
		const routeMetadataNodeImportResult = spawnSync(
			process.execPath,
			[
				'--import',
				'tsx',
				routeMetadataNodeImportTest,
			],
			{
				cwd: root,
				encoding: 'utf8',
			}
		)
		assert.equal(
			routeMetadataNodeImportResult.status,
			0,
			routeMetadataNodeImportResult.stderr || routeMetadataNodeImportResult.stdout
		)
	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('typechecks generated E2eRouteProbeAtom as a distributive probe-value union', () => {
	const servicesRoutes = app.routes.children.services
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-route-metadata-types-test-'))

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
		const routeMetadataTypeTestResult = spawnSync(
			path.join(root, 'node_modules/.bin/tsc'),
			[
				'--project',
				routeMetadataTypeTestConfig,
			],
			{
				cwd: root,
				encoding: 'utf8',
			}
		)
		assert.equal(
			routeMetadataTypeTestResult.status,
			0,
			routeMetadataTypeTestResult.stderr || routeMetadataTypeTestResult.stdout
		)
	} finally {
		rmSync(typeTestRoot, {
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

test('carries field-conditioned view sources into initial route selections', () => {
	const proposalPage = compileApp(app).generatedFiles.find((generatedFile) => (
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
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-app-view-types-test-'))
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
		writeFileSync(typeTestPath, `${appSource.slice(0, facetStatement.end)}\n${fixtureSource.slice(fixtureImport.end)}`)
		const typeTestResult = spawnSync(
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
			{
				cwd: root,
				encoding: 'utf8',
			}
		)

		assert.equal(typeTestResult.status, 0, typeTestResult.stderr || typeTestResult.stdout)
	} finally {
		rmSync(typeTestRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('isolates replacement-managed output from checked-in provider roots', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-test-'))
	const checkedInProviderRoot = path.join(generatedOutputRoot, 'src/sources/Fixture/index.ts')
	const staleRoute = path.join(generatedOutputRoot, 'src/routes/stale/+page.svelte')
	const staleSourceProjection = path.join(generatedOutputRoot, 'src/sources/$staleGeneratedRegistry.ts')

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
		writeFileSync(staleSourceProjection, '// Generated from APP.ts. Do not edit by hand.\nexport const stale = true\n')

		const checkResult = runGenerator('check', generatedOutputRoot)
		assert.notEqual(checkResult.status, 0)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/routes\/stale\/\+page\.svelte/)
		assert.match(checkResult.stderr || checkResult.stdout, /Stale generated files exist:[\s\S]*src\/sources\/\$staleGeneratedRegistry\.ts/)

		const regenerateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(regenerateResult.status, 0, regenerateResult.stderr || regenerateResult.stdout)
		assert.equal(existsSync(staleRoute), false)
		assert.equal(existsSync(staleSourceProjection), false)
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

test('keeps runtime secret configuration in one server projection', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-server-credentials-test-'))

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)

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

test('preserves sibling facet field references through projection-scoped singular and plural views', () => {
	const compiled = compileApp(app)
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
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.symbol/)
	assert.match(singularView, /\{#snippet Title\(\)\}[\s\S]*?resource=\{selection\.Erc20Token\}[\s\S]*?projection\.symbol/)
	assert.match(singularView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.\$icon/)
	assert.match(singularView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.\$icon/)
	assert.match(singularView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.\$\$marketsWithInstanceAsBase/)
	assert.match(singularView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.\$\$marketsWithInstanceAsBase/)
	assert.doesNotMatch(rootResource, /NativeCurrency|Erc20Token|Blockscout_Rest|Constants_Internal|symbol|name/)
})

test('keeps sibling facet query fields and sources projection-scoped', () => {
	const evmCoinInstance = app.schema.entities.find((entity) => entity.entityType === EntityType.EvmCoinInstance)

	assert.ok(evmCoinInstance)
	const generatedFile = compileApp({
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => entity !== evmCoinInstance ? entity : {
				...entity,
				facets: entity.facets?.map((facet) => ({
					...facet,
					singularView: facet.name === 'NativeCurrency' ? {
						query: {
							sources: [Source.Constants_Internal],
							fields: ['symbol'],
						},
						summary: {
							title: ['symbol'],
						},
					} : {
						query: {
							sources: [Source.Blockscout_Rest],
							fields: ['name'],
						},
						summary: {
							title: ['name'],
						},
					},
				})),
				views: {
					...entity.views,
					singular: {
						query: {
							sources: [Source.Coingecko_Rest],
							fields: ['type'],
						},
					},
				},
			}),
		},
	}).generatedFiles.find((file) => file.path === 'src/views/EvmCoinInstanceView.svelte')

	assert.ok(generatedFile)
	const generatedView = renderGeneratedFile(generatedFile)
	const rootResource = generatedView.slice(
		generatedView.indexOf('const evmCoinInstance = $derived('),
		generatedView.indexOf('const titleFallback = $derived(')
	)

	assert.match(rootResource, /Source\.Coingecko_Rest/)
	assert.doesNotMatch(rootResource, /Source\.Constants_Internal|Source\.Blockscout_Rest|NativeCurrency|Erc20Token|symbol|name/)
	assert.match(generatedView, /resource=\{selection\.NativeCurrency\}[\s\S]*?projection\.symbol\(\{[\s\S]*?Source\.Constants_Internal/)
	assert.match(generatedView, /resource=\{selection\.Erc20Token\}[\s\S]*?projection\.name\(\{[\s\S]*?Source\.Blockscout_Rest/)
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
		assert.doesNotMatch(
			evmTransactionView.slice(
				evmTransactionView.indexOf('const evmTransaction = $derived('),
				evmTransactionView.indexOf('const titleFallback = $derived(')
			),
			/ContractCreation/
		)

		const evmCoinInstancesView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmCoinInstancesView.svelte'), 'utf8')
		assert.match(evmCoinInstancesView, /resource=\{selection\.NativeCurrency\}/)
		assert.doesNotMatch(
			evmCoinInstancesView.slice(
				evmCoinInstancesView.indexOf('resource={'),
				evmCoinInstancesView.indexOf('{#snippet Pending()}')
			),
			/NativeCurrency|Erc20Token/
		)

		const evmTokenTransfersView = readFileSync(path.join(generatedOutputRoot, 'src/views/EvmTokenTransfersView.svelte'), 'utf8')
		assert.match(evmTokenTransfersView, /resource=\{selection\.Nft\}/)
		assert.doesNotMatch(
			evmTokenTransfersView.slice(
				evmTokenTransfersView.indexOf('resource={'),
				evmTokenTransfersView.indexOf('{#snippet Pending()}')
			),
			/Nft/
		)

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
