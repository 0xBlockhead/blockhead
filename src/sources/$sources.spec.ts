import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'
import {
	existsSync,
	globSync,
	readFileSync,
} from 'node:fs'
import {
	dirname,
	join,
	resolve,
} from 'node:path'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import type { SourceProviderDefinition } from '$/sources/$sources.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	beaconOrigins,
	beaconRestEndpoints,
} from '$/sources/Beacon/Rest/constants.ts'
import { pipedApiOrigins } from '$/sources/Piped/Rest/constants.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	evmExecutionOpenRpcArtifactFailures,
	providerLocalBindingImportFailures,
} from '$/sources/validateSourceRegistry.ts'
import {
	getRpcTx,
	narrowRpcLog,
	narrowTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'

import {
	executionEndpoints,
	voltaireJsonRpcTransportCandidates,
} from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'
import {
	voltaireJsonRpcTransportsWithOriginsByChainId,
	voltaireJsonRpcTransportWithOriginsByChainId,
} from '$/sources/Voltaire/JsonRpc/queries.ts'
import { SourceArtifactKind } from '$/sources/SourceBinding.ts'
import {
	zeroGMainnetRpcEndpoints,
	zeroGOrigins as zeroGChainOrigins,
} from '$/sources/ZeroG/Chain/JsonRpc/endpoints.ts'
import {
	zeroGMainnetExplorerEndpoints,
	zeroGOrigins as zeroGChainScanOrigins,
} from '$/sources/ZeroG/ChainScan/Rest/endpoints.ts'
import {
	zeroGOrigins as zeroGStorageNodeOrigins,
	zeroGStorageNodeRpcEndpoints,
} from '$/sources/ZeroG/StorageNode/JsonRpc/endpoints.ts'
import {
	zeroGMainnetStorageEndpoints,
	zeroGOrigins as zeroGStorageScanOrigins,
} from '$/sources/ZeroG/StorageScan/Rest/endpoints.ts'
import { sourceProviders as appSourceProviders } from '$/sources/index.ts'

const sourceBindingArtifacts = sourceProviderDefinitions.flatMap((provider) => provider.bindings)
	.flatMap((binding) => binding.artifacts ?? [])

const fixtureSourceProviders = [
	{
		provider: 'ProviderWithEnv',
		label: 'Provider with env',
		env: arktype({
			PUBLIC_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				provider: 'ProviderWithEnv',
				source: 'ProviderOnlySource',
				label: 'Provider-only source',
			},
			{
				provider: 'ProviderWithEnv',
				source: 'ProviderAndSourceEnvSource',
				label: 'Provider and source env source',
				env: arktype({
					PUBLIC_SOURCE_KEY: 'string',
				}),
			},
			{
				provider: 'ProviderWithEnv',
				source: 'FailingSourceEnvSource',
				label: 'Failing source env source',
				env: arktype({
					PUBLIC_FAILING_SOURCE_KEY: 'string',
				}),
			},
		],
	},
	{
		provider: 'ProviderWithoutEnv',
		label: 'Provider without env',
		sources: [
			{
				provider: 'ProviderWithoutEnv',
				source: 'SourceOnlyEnvSource',
				label: 'Source-only env source',
				env: arktype({
					PUBLIC_SOURCE_ONLY_KEY: 'string',
				}),
			},
			{
				provider: 'ProviderWithoutEnv',
				source: 'OpenSource',
				label: 'Open source',
			},
		],
	},
	{
		provider: 'FailingProvider',
		label: 'Failing provider',
		env: arktype({
			PUBLIC_FAILING_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				provider: 'FailingProvider',
				source: 'ProviderDisabledSource',
				label: 'Provider disabled source',
			},
		],
	},
] as const satisfies readonly SourceProviderDefinition<string, string>[]

describe('source provider registry', () => {
	it('names every EVM execution binding missing OpenRPC authority', () => {
		expect(evmExecutionOpenRpcArtifactFailures(sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.filter((binding) => (
				binding.source === 'EnvioHyperRpc_JsonRpc'
				|| binding.source === 'GetBlockRpc_JsonRpc'
			))
			.map((binding) => ({
				...binding,
				artifacts: [],
			})))).toEqual([
			'EnvioHyperRpc_JsonRpc / Eip155Chain:1: EVM execution JSON-RPC binding lacks OpenRPC artifact',
			'GetBlockRpc_JsonRpc / Eip155Chain:1: EVM execution JSON-RPC binding lacks OpenRPC artifact',
		])
	})

	it('gates providers and sources by env schemas and rejects empty strings', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: '   ',
				PUBLIC_FAILING_PROVIDER_KEY: '',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect([...indexed.enabledSources]).toEqual([
			'ProviderOnlySource',
			'ProviderAndSourceEnvSource',
			'SourceOnlyEnvSource',
			'OpenSource',
		])
		expect(indexed.resolverPublicEnvBySource.has('ProviderDisabledSource')).toBe(false)
		expect(indexed.resolverPublicEnvBySource.has('FailingSourceEnvSource')).toBe(false)
	})

	it('keeps Voltaire transaction source narrowing from dropping signature and blob fields', () => {
		const tx = narrowTxRpc({
			hash: '0xtransaction',
			r: '0xr',
			s: '0xs',
			v: '0x1',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x3',
			maxFeePerBlobGas: '0x4',
			blobVersionedHashes: [
				'0x01blob',
			],
		})
		if (tx == null)
			throw new Error('Voltaire transaction narrowing rejected valid transaction wire')

		expect(getRpcTx(tx, '0xtransaction')).toMatchObject({
			hash: '0xtransaction',
			r: '0xr',
			s: '0xs',
			v: '0x1',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x3',
			maxFeePerBlobGas: '0x4',
			blobVersionedHashes: [
				'0x01blob',
			],
		})
	})

	it('keeps Voltaire log source narrowing from dropping receipt detail fields', () => {
		expect(narrowRpcLog({
			address: '0xaddress',
			topics: [
				'0xtopic',
			],
			data: '0xdata',
			blockNumber: '0x1',
			blockHash: '0xblock',
			transactionHash: '0xtransaction',
			transactionIndex: '0x2',
			logIndex: '0x3',
			removed: false,
		})).toEqual({
			address: '0xaddress',
			topics: [
				'0xtopic',
			],
			data: '0xdata',
			blockNumber: '0x1',
			blockHash: '0xblock',
			transactionHash: '0xtransaction',
			transactionIndex: '0x2',
			logIndex: '0x3',
			removed: false,
		})
	})

	it('passes full public env only to sources without provider or source env schema', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect(indexed.resolverPublicEnvBySource.get('OpenSource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
			PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
			PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
			PUBLIC_EXTRA_KEY: 'extra-public',
		})
	})

	it('passes provider env to inherited sources and merged env to source-specific sources', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect(indexed.resolverPublicEnvBySource.get('ProviderOnlySource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('ProviderAndSourceEnvSource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('SourceOnlyEnvSource')).toEqual({
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
		})
	})

	it('keeps provider origins canonical and non-conflicting', () => {
		const corsEnabledByOrigin = new Map<string, boolean>()

		for (const sourceProvider of appSourceProviders) {
			expect(sourceProvider.provider, sourceProvider.label).toBeDefined()
			expect(sourceProvider.sources.length, String(sourceProvider.provider)).toBeGreaterThan(0)

			for (const { origin, corsEnabled } of sourceProvider.origins ?? []) {
				expect(new URL(origin).origin, `${sourceProvider.provider}: ${origin}`).toBe(origin)
				expect(origin, String(sourceProvider.provider)).not.toMatch(/[/?#]$/)
				expect(
					corsEnabledByOrigin.get(origin) ?? corsEnabled,
					`${sourceProvider.provider}: ${origin}`
					).toBe(corsEnabled)
				corsEnabledByOrigin.set(origin, corsEnabled)
			}
		}
	})

	it('keeps source rows registered under their owning provider', () => {
		const sourceProvidersBySource = new Map<PropertyKey, PropertyKey>()

		for (const sourceProvider of appSourceProviders) {
			for (const sourceDefinition of sourceProvider.sources) {
				expect(sourceDefinition.provider, String(sourceDefinition.source)).toBe(sourceProvider.provider)
				expect(sourceProvidersBySource.has(sourceDefinition.source), String(sourceDefinition.source)).toBe(false)
				sourceProvidersBySource.set(sourceDefinition.source, sourceProvider.provider)
			}
		}
	})

	it('keeps CORS-aware source callers backed by provider origins', () => {
		const providersWithOrigins = new Set(
			appSourceProviders
				.filter((sourceProvider) => (sourceProvider.origins ?? []).length > 0)
				.map((sourceProvider) => String(sourceProvider.provider))
		)

		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('/index.ts')
				|| filePath.endsWith('/constants.ts')
				|| filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
			)
				continue

			const source = readFileSync(filePath, 'utf8')
			if (!/\b(?:corsFetch|getJson|getText)\b/.test(source))
				continue

			for (const provider of source.matchAll(/\borigins:\s*([A-Za-z0-9_]+)\.origins\b/g))
				expect(providersWithOrigins, `${filePath}: ${provider[1]}.origins`).toContain(provider[1])

			for (const origins of source.matchAll(/\borigins:\s*([A-Za-z0-9_]+Origins)\b/g))
				expect(
					source,
					`${filePath}: ${origins[1]}`
				).toMatch(new RegExp(`(?:import\\s*\\{[^}]*\\b${origins[1]}\\b[^}]*\\}\\s*from\\s*'\\$/sources/[^']+\\.ts'|(?:export\\s+)?const\\s+${origins[1]}\\s*=)`))
		}
	})

	it('keeps every provider origin represented in the proxy allow-list source', () => {
		const serverSource = readFileSync(join(process.cwd(), 'src', 'sources', 'index.server.ts'), 'utf8')

		expect(serverSource).toMatch(/\bsourceProviderDefinitions\.flatMap\(\(provider\) => provider\.bindings\)/)
		expect(serverSource).toMatch(/\bbinding\.delivery === SourceDelivery\.HttpProxy\b/)
		expect(serverSource).toMatch(/\bendpoint\.endpointKind === SourceEndpointKind\.HttpUrl\b/)
		expect(serverSource).not.toMatch(/\bnew Set\(\s*\[/)

		for (const sourceProvider of appSourceProviders)
			for (const { origin } of sourceProvider.origins ?? [])
				expect(
					appSourceProviders.flatMap((provider) => (
						(provider.origins ?? []).map((entry) => entry.origin)
					)),
					`${sourceProvider.provider}: ${origin}`
				).toContain(origin)
	})

	it('keeps source modules from bypassing source-aware browser fetch routing or importing provider-local bindings', () => {
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
				|| filePath.endsWith('.d.ts')
				|| filePath === 'src/sources/_runtime/proxy.server.ts'
			)
				continue

			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bfetch\s*\(/)
		}

		expect(providerLocalBindingImportFailures({
			'src/sources/Fixture/bindings.ts': 'export const fixtureBindings = []',
			'src/sources/Fixture/index.ts': "export { fixtureBindings } from './bindings.ts'",
			'src/sources/Fixture/Binary/client.ts': "export const fixtureBindings = import('../' + 'bindings.ts')",
			'src/sources/Fixture/Identifier/client.ts': "const bindingModule = '../bindings.ts'\nexport const fixtureBindings = import(bindingModule)",
			'src/sources/Fixture/Rest/index.ts': "import { fixtureBindings } from '../bindings.ts'",
			'src/sources/Fixture/Rest/v1/client.ts': "import { fixtureBindings } from '../../bindings.ts'",
			'src/sources/Fixture/Graphql/client.ts': 'import { fixtureBindings } from "$/sources/Fixture/bindings.ts"',
			'src/sources/Fixture/JsonRpc/queries.ts': "import { fixtureBindings } from '$/sources/Fixture/bindings.ts'",
			'src/sources/Fixture/OpenApi/index.ts': "export { fixtureBindings } from '../bindings.ts'",
			'src/sources/Fixture/Template/client.ts': 'const bindingFile = \'bindings.ts\'\nexport const fixtureBindings = import(`../${bindingFile}`)',
			'src/sources/Fixture/WebSocket/index.ts': "export const fixtureBindings = import('../bindings.ts')",
			'src/sources/Fixture/Rest/constants.ts': "import { fixtureMetadata } from './metadata.ts'",
			'src/sources/Fixture/Rest/metadata.ts': 'export const fixtureMetadata = []',
		})).toEqual([
			'src/sources/Fixture/Binary/client.ts: dynamic import target must be a string literal because computed imports cannot be proven not to target provider-local bindings',
			'src/sources/Fixture/Identifier/client.ts: dynamic import target must be a string literal because computed imports cannot be proven not to target provider-local bindings',
			'src/sources/Fixture/Rest/index.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
			'src/sources/Fixture/Rest/v1/client.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
			'src/sources/Fixture/Graphql/client.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
			'src/sources/Fixture/JsonRpc/queries.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
			'src/sources/Fixture/OpenApi/index.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
			'src/sources/Fixture/Template/client.ts: dynamic import target must be a string literal because computed imports cannot be proven not to target provider-local bindings',
			'src/sources/Fixture/WebSocket/index.ts: runtime transport imports provider-local bindings instead of using protocol-local transport metadata',
		])
	})

	it('keeps source-aware HTTP helper calls tied to origin metadata', () => {
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
			)
				continue

			const source = readFileSync(filePath, 'utf8')
			const httpImport = source.match(/import\s+\{([^}]+)\}\s+from\s+'\$\/lib\/http\.ts'/)
			if (httpImport == null)
				continue

			for (const helperName of httpImport[1]
				.split(',')
				.map((name) => name.trim())
				.flatMap((name) => {
					const [
						imported,
						local = imported,
					] = name.split(/\s+as\s+/)
					return [
						'corsFetch',
						'getJson',
						'getText',
					].includes(imported) ?
						[local]
					:
						[]
				})) {
				for (const helperMatch of source.matchAll(new RegExp(`\\b${helperName}(?:<[^>]+>)?\\s*\\(`, 'g'))) {
					let depth = 0
					let endIndex = helperMatch.index
					for (; endIndex < source.length; endIndex++) {
						if (source[endIndex] === '(')
							depth++
						else if (source[endIndex] === ')') {
							depth--
							if (depth === 0) {
								endIndex++
								break
							}
						}
					}

					expect(
						source.slice(helperMatch.index, endIndex),
						`${filePath}: ${helperName} call must pass source provider origins`
					).toMatch(/\borigins:\s*(?:\[\.\.\.)?[A-Za-z0-9_]+\.origins\b|\borigins:\s*\[\.\.\.origins\]|\borigins:\s*[A-Za-z0-9_]+Origins\b|\borigins:\s*[A-Za-z0-9_]+Origins\(|\borigins:\s*originsFor[A-Za-z0-9_]*\(|\borigins:\s*endpoints\.flatMap\(|\borigins:\s*httpOriginsForBinding\(|\borigins:\s*\[\s*\{[\s\S]*?corsEnabled:\s*false|\{\s*origins\s*\}|\borigins\s*,/)
				}
			}
		}
	})

	it('keeps Piped origins in static protocol metadata instead of public-env call-site rows', () => {
		expect(pipedApiOrigins).toEqual([{
			origin: 'https://api.piped.private.coffee',
			corsEnabled: true,
		}])
		expect(readFileSync(join(process.cwd(), 'src', 'sources', 'Piped', 'Rest', 'client.ts'), 'utf8')).toMatch(/\borigins:\s*pipedApiOrigins\b/)
		for (const filePath of globSync('src/sources/Piped/**/*.ts'))
			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bOriginsForPublicEnv\b|\bPUBLIC_PIPED_API_BASE_URL\b/)
	})

	it('keeps Voltaire origins aligned with source JSON-RPC transport candidates', () => {
		expect(new Set(Object.values(voltaireJsonRpcTransportsWithOriginsByChainId).flatMap((entries) => (
			entries.flatMap((entry) => entry.origins.map((origin) => origin.origin))
		)))).toEqual(
			new Set(
				voltaireJsonRpcTransportCandidates
					.filter((entry) => entry.transportType === TransportType.Http)
					.map((entry) => new URL(entry.rpcUrl).origin)
			)
		)
	})

	it('keeps Voltaire default JSON-RPC transport HTTP when the chain has any HTTP candidate', () => {
		for (const chainId of new Set(voltaireJsonRpcTransportCandidates.map((entry) => entry.chainId))) {
			const httpCandidate = voltaireJsonRpcTransportCandidates
				.find((entry) => (
					entry.chainId === chainId
					&& entry.transportType === TransportType.Http
			))
			if (httpCandidate != null)
				expect(voltaireJsonRpcTransportWithOriginsByChainId[chainId]).toEqual({
					...httpCandidate,
					origins: voltaireJsonRpcTransportsWithOriginsByChainId[chainId][0].origins,
				})
		}
	})

	it('keeps Voltaire JSON-RPC transport candidates derived from source endpoint rows', () => {
		const byChainUrlTransport = (entry: {
			chainId: number
			rpcUrl: string
			transportType: TransportType
		}) => `${entry.chainId}:${entry.rpcUrl}:${entry.transportType}`
		expect(voltaireJsonRpcTransportCandidates.toSorted((left, right) => byChainUrlTransport(left).localeCompare(byChainUrlTransport(right)))).toEqual(executionEndpoints.map((executionEndpoint) => ({
			chainId: executionEndpoint.chainId,
			rpcUrl: executionEndpoint.url,
			transportType: executionEndpoint.transportType,
		})).toSorted((left, right) => byChainUrlTransport(left).localeCompare(byChainUrlTransport(right))))
	})

	it('keeps Beacon origins aligned with source endpoint rows', () => {
		expect(beaconOrigins).toEqual(beaconRestEndpoints.map((beaconRestEndpoint) => ({
			origin: new URL(beaconRestEndpoint.restBaseUrl).origin,
			corsEnabled: beaconRestEndpoint.corsEnabled,
		})))
	})

	it('keeps Quilibrium docs endpoints in generated APP binding metadata', () => {
		expect(sourceProviderDefinitions
			.filter((provider) => provider.provider === SourceProvider.QuilibriumDocs)
			.flatMap((provider) => provider.bindings)
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => ({
				locator: endpoint.locator,
				origin: endpoint.origin,
				corsEnabled: endpoint.corsEnabled,
			}))).toEqual([
			{
				locator: 'https://docs.quilibrium.com',
				origin: 'https://docs.quilibrium.com',
				corsEnabled: true,
			},
			{
				locator: 'https://quilibrium.com',
				origin: 'https://quilibrium.com',
				corsEnabled: true,
			},
		])
	})

	it('keeps ZeroG origins aligned with source endpoint rows', () => {
		expect(new Set([
			...zeroGChainOrigins,
			...zeroGChainScanOrigins,
			...zeroGStorageNodeOrigins,
			...zeroGStorageScanOrigins,
		].map((entry) => entry.origin))).toEqual(
			new Set([
				...zeroGMainnetExplorerEndpoints.map((entry) => new URL(entry.url).origin),
				...zeroGMainnetStorageEndpoints.map((entry) => new URL(entry.url).origin),
				...zeroGMainnetRpcEndpoints.map((entry) => new URL(entry.url).origin),
				...zeroGStorageNodeRpcEndpoints.map((entry) => new URL(entry.url).origin),
			])
		)
	})

	it('keeps generated OpenAPI sources reproducible from checked-in schema manifests', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const manifestFiles = globSync('src/sources/*/OpenApi/schema-source.ts')
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredTypesFiles = new Set<string>()
		const inactiveManifests: string[] = []

		expect(packageJson).toMatch(/"sources:openapi": "pnpm exec tsx scripts\/sources\/openapi\.ts"/)
		expect(packageJson).toMatch(/"sources:openapi:check": "pnpm exec tsx scripts\/sources\/openapi\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'sources', 'openapi.ts'), 'utf8')).toMatch(/glob\('\/?\*\/OpenApi\/schema-source\.ts'|glob\('\*\/OpenApi\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const typesFile = manifestSource.match(/typesFile:\s*'([^']+)'/)?.[1]
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)
			if (typesFile == null)
				throw new Error(`${manifestFile}: missing typesFile`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), typesFile))).toBe(true)
			coveredTypesFiles.add(resolve(dirname(manifestFile), typesFile))
		}

		for (const typesFile of globSync('src/sources/*/OpenApi/openapi.d.ts')) {
			expect(existsSync(resolve(dirname(typesFile), 'schema-source.ts'))).toBe(true)
			if (inactiveManifests.includes(join(dirname(typesFile), 'schema-source.ts')))
				continue

			expect(coveredTypesFiles.has(resolve(typesFile)), typesFile).toBe(true)
		}
			expect(inactiveManifests.every((manifestFile) => !activeManifestFiles.has(manifestFile))).toBe(true)
	})

	it('keeps generated GraphQL sources reproducible from checked-in schema manifests', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const manifestFiles = globSync('src/sources/**/Graphql/**/schema-source.ts')
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredOutputFiles = new Set<string>()
		const inactiveManifests: string[] = []

		expect(packageJson).toMatch(/"sources:graphql": "pnpm exec tsx scripts\/sources\/graphql\.ts"/)
		expect(packageJson).toMatch(/"sources:graphql:check": "pnpm exec tsx scripts\/sources\/graphql\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'sources', 'graphql.ts'), 'utf8')).toMatch(/glob\('\*\/Graphql\/\*\*\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const outputFile = manifestSource.match(/outputFile:\s*'([^']+)'/)?.[1]
			const patchFile = manifestSource.match(/patchFile:\s*'([^']+)'/)?.[1]
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			if (outputFile != null) {
				expect(existsSync(resolve(dirname(manifestFile), outputFile))).toBe(true)
				coveredOutputFiles.add(resolve(dirname(manifestFile), outputFile))
			}
			if (patchFile != null)
				expect(existsSync(resolve(dirname(manifestFile), patchFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'queries.ts'))).toBe(true)
		}

		for (const outputFile of globSync('src/sources/**/Graphql/**/graphql-env.d.ts')) {
			expect(existsSync(resolve(dirname(outputFile), 'schema-source.ts'))).toBe(true)
			if (inactiveManifests.includes(join(dirname(outputFile), 'schema-source.ts')))
				continue

			expect(coveredOutputFiles.has(resolve(outputFile)), outputFile).toBe(true)
		}
			expect(inactiveManifests.every((manifestFile) => !activeManifestFiles.has(manifestFile))).toBe(true)
	})

	it('keeps generated precompile data reproducible from the checked-in manifest', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const scriptSource = readFileSync(join(process.cwd(), 'scripts', 'sources', 'precompiles', 'source.ts'), 'utf8')
		const manifest = JSON.parse(
			readFileSync(join(process.cwd(), 'src', 'data', 'precompiles', 'manifest.json'), 'utf8')
		) as {
			source?: string
			ref?: string
		}
		const definitions = new Set<string>()
		const schedules = globSync('src/data/precompiles/eip155-*-schedule.json')

		expect(packageJson).toMatch(/"sources:precompiles:sync": "pnpm exec tsx scripts\/sources\/precompiles\/source\.ts sync"/)
		expect(packageJson).toMatch(/"sources:precompiles:check": "pnpm exec tsx scripts\/sources\/precompiles\/source\.ts check"/)
		expect(scriptSource).toContain("action === 'check'")
		expect(manifest.source).toBe('https://github.com/shemnon/precompiles')
		expect(manifest.ref).toBeTruthy()
		expect(schedules.length).toBeGreaterThan(0)

		for (const filePath of globSync('src/data/precompiles/*.json')) {
			if (filePath.endsWith('/manifest.json'))
				continue

			expect(filePath).toMatch(/\/eip155-\d+-(?:schedule|0x[0-9a-f]+)\.json$/)
			if (!filePath.endsWith('-schedule.json'))
				definitions.add(filePath.slice(filePath.lastIndexOf('/') + 1).replace('.json', ''))
		}
		expect(definitions.size).toBeGreaterThan(0)

		for (const filePath of schedules) {
			const schedule = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, string[] | string>
			for (const [
				key,
				value,
			] of Object.entries(schedule)) {
				if (key === 'name')
					continue

				expect(key, filePath).toMatch(/^\d+$/)
				expect(Array.isArray(value), `${filePath}: ${key}`).toBe(true)
				if (!Array.isArray(value))
					continue

				for (const id of value) {
					expect(id.startsWith('eip155-4220-'), `${filePath}: ${id}`).toBe(false)
					expect(definitions.has(id), `${filePath}: ${id}`).toBe(true)
				}
			}
		}
	})
})
