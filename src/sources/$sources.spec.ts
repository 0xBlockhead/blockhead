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

import { indexSourceProviders } from '$/sources/$sources.ts'
import type { SourceProviderDefinition } from '$/sources/$sources.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { executionEndpoints } from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'
import Beacon, { beaconRestEndpoints } from '$/sources/Beacon/index.ts'
import Piped from '$/sources/Piped/index.ts'
import { pipedApiDefaultOrigin } from '$/sources/Piped/Rest/constants.ts'
import QuilibriumDocs, { quilibriumDocsEndpoints } from '$/sources/QuilibriumDocs/index.ts'
import {
	getRpcTx,
	narrowRpcLog,
	narrowTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'
import Voltaire, {
	voltaireJsonRpcTransportCandidates,
	voltaireJsonRpcUrlWithTransportForChain,
} from '$/sources/Voltaire/index.ts'
import ZeroG from '$/sources/ZeroG/index.ts'
import { zeroGMainnetRpcEndpoints } from '$/sources/ZeroG/Chain/JsonRpc/index.ts'
import { zeroGMainnetExplorerEndpoints } from '$/sources/ZeroG/ChainScan/Rest/index.ts'
import { zeroGStorageNodeRpcEndpoints } from '$/sources/ZeroG/StorageNode/JsonRpc/index.ts'
import { zeroGMainnetStorageEndpoints } from '$/sources/ZeroG/StorageScan/Rest/index.ts'
import { sourceProviders as appSourceProviders } from '$/sources/index.ts'

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
		}
	})

	it('keeps every provider origin represented in the proxy allow-list source', () => {
		const hooksSource = readFileSync(join(process.cwd(), 'src', 'hooks.server.ts'), 'utf8')

		expect(hooksSource).toMatch(/\bsourceProviders\.flatMap\(\(provider\) =>/)
		expect(hooksSource).toMatch(/\(provider\.origins \?\? \[\]\)\.map\(\(entry\) => entry\.origin\)/)
		expect(hooksSource).not.toMatch(/\bnew Set\(\s*\[/)

		for (const sourceProvider of appSourceProviders)
			for (const { origin } of sourceProvider.origins ?? [])
				expect(
					appSourceProviders.flatMap((provider) => (
						(provider.origins ?? []).map((entry) => entry.origin)
					)),
					`${sourceProvider.provider}: ${origin}`
				).toContain(origin)
	})

	it('keeps source modules from bypassing source-aware browser fetch routing', () => {
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
			)
				continue

			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bfetch\s*\(/)
		}
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
					).toMatch(/\borigins:\s*(?:\[\.\.\.)?[A-Za-z0-9_]+\.origins\b|\borigins:\s*\[\.\.\.origins\]|\borigins\s*,/)
				}
			}
		}
	})

	it('keeps Piped proxy origins static provider metadata instead of public-env call-site rows', () => {
		expect(Piped.origins).toEqual([{
			origin: pipedApiDefaultOrigin,
			corsEnabled: false,
		}])
		expect(readFileSync(join(process.cwd(), 'src', 'sources', 'Piped', 'Rest', 'client.ts'), 'utf8')).toMatch(/\borigins:\s*Piped\.origins\b/)
		for (const filePath of globSync('src/sources/Piped/**/*.ts'))
			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bOriginsForPublicEnv\b|\bPUBLIC_PIPED_API_BASE_URL\b/)
	})

	it('keeps Voltaire origins aligned with source JSON-RPC transport candidates', () => {
		expect(new Set(Voltaire.origins.map((entry) => entry.origin))).toEqual(
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
				expect(voltaireJsonRpcUrlWithTransportForChain(chainId)).toEqual({
					...httpCandidate,
					origins: Voltaire.origins,
				})
		}
	})

	it('keeps Voltaire JSON-RPC transport candidates derived from source endpoint rows', () => {
		expect(voltaireJsonRpcTransportCandidates).toEqual(executionEndpoints.map((executionEndpoint) => ({
			chainId: executionEndpoint.chainId,
			rpcUrl: executionEndpoint.url,
			transportType: executionEndpoint.transportType,
		})))
	})

	it('keeps Beacon origins aligned with source endpoint rows', () => {
		expect(Beacon.origins).toEqual(beaconRestEndpoints.map((beaconRestEndpoint) => ({
			origin: new URL(beaconRestEndpoint.restBaseUrl).origin,
			corsEnabled: beaconRestEndpoint.corsEnabled,
		})))
	})

	it('keeps Quilibrium docs origins aligned with source endpoint rows', () => {
		expect(new Set(QuilibriumDocs.origins.map((entry) => entry.origin))).toEqual(
			new Set(quilibriumDocsEndpoints.map((entry) => new URL(entry.url).origin))
		)
	})

	it('keeps ZeroG origins aligned with source endpoint rows', () => {
		expect(new Set(ZeroG.origins.map((entry) => entry.origin))).toEqual(
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
		const coveredTypesFiles = new Set<string>()

		expect(packageJson).toMatch(/"sources:openapi": "pnpm exec tsx scripts\/openapi-source\.ts"/)
		expect(packageJson).toMatch(/"sources:openapi:check": "pnpm exec tsx scripts\/openapi-source\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'openapi-source.ts'), 'utf8')).toMatch(/glob\('\/?\*\/OpenApi\/schema-source\.ts'|glob\('\*\/OpenApi\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const typesFile = manifestSource.match(/typesFile:\s*'([^']+)'/)?.[1]
			const sourceIndex = readFileSync(resolve(dirname(manifestFile), 'index.ts'), 'utf8')
			const sourceName = sourceIndex.match(/\bsource:\s*Source\.([A-Za-z0-9_]+)/)?.[1]

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)
			if (typesFile == null)
				throw new Error(`${manifestFile}: missing typesFile`)
			if (sourceName == null)
				throw new Error(`${manifestFile}: missing Source enum registration in index.ts`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), typesFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'client.ts'))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'queries.ts'))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'types.ts'))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'index.ts'))).toBe(true)
			coveredTypesFiles.add(resolve(dirname(manifestFile), typesFile))
			expect(
				appSourceProviders.flatMap((provider) => provider.sources).some((source) => (
					source.source === sourceName
				))
				).toBe(true)
		}

		for (const typesFile of globSync('src/sources/*/OpenApi/openapi.d.ts')) {
			expect(existsSync(resolve(dirname(typesFile), 'schema-source.ts'))).toBe(true)
			expect(coveredTypesFiles.has(resolve(typesFile)), typesFile).toBe(true)
		}
	})

	it('keeps generated GraphQL sources reproducible from checked-in schema manifests', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const manifestFiles = globSync('src/sources/**/Graphql/**/schema-source.ts')
		const coveredOutputFiles = new Set<string>()

		expect(packageJson).toMatch(/"sources:graphql": "pnpm exec tsx scripts\/graphql-source\.ts"/)
		expect(packageJson).toMatch(/"sources:graphql:check": "pnpm exec tsx scripts\/graphql-source\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'graphql-source.ts'), 'utf8')).toMatch(/glob\('\*\/Graphql\/\*\*\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const outputFile = manifestSource.match(/outputFile:\s*'([^']+)'/)?.[1]
			const patchFile = manifestSource.match(/patchFile:\s*'([^']+)'/)?.[1]
			const sourceIndex = readFileSync(
				resolve(
					manifestFile.slice(0, manifestFile.indexOf('/Graphql/') + '/Graphql'.length),
					'index.ts'
				),
				'utf8'
			)
			const sourceName = sourceIndex.match(/\bsource:\s*Source\.([A-Za-z0-9_]+)/)?.[1]

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)
			if (outputFile == null)
				throw new Error(`${manifestFile}: missing outputFile`)
			if (sourceName == null)
				throw new Error(`${manifestFile}: missing Source enum registration in index.ts`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), outputFile))).toBe(true)
			coveredOutputFiles.add(resolve(dirname(manifestFile), outputFile))
			if (patchFile != null)
				expect(existsSync(resolve(dirname(manifestFile), patchFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'client.ts'))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'queries.ts'))).toBe(true)
			expect(
				appSourceProviders.flatMap((provider) => provider.sources).some((source) => (
					source.source === sourceName
				))
				).toBe(true)
		}

		for (const outputFile of globSync('src/sources/**/Graphql/**/graphql-env.d.ts')) {
			expect(existsSync(resolve(dirname(outputFile), 'schema-source.ts'))).toBe(true)
			expect(coveredOutputFiles.has(resolve(outputFile)), outputFile).toBe(true)
		}
	})

	it('keeps generated precompile data reproducible from the checked-in manifest', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const scriptSource = readFileSync(join(process.cwd(), 'scripts', 'precompiles-source.ts'), 'utf8')
		const manifest = JSON.parse(
			readFileSync(join(process.cwd(), 'src', 'data', 'precompiles', 'manifest.json'), 'utf8')
		) as {
			source?: string
			ref?: string
		}
		const definitions = new Set<string>()
		const schedules = globSync('src/data/precompiles/eip155-*-schedule.json')

		expect(packageJson).toMatch(/"sources:precompiles:sync": "pnpm exec tsx scripts\/precompiles-source\.ts sync"/)
		expect(packageJson).toMatch(/"sources:precompiles:check": "pnpm exec tsx scripts\/precompiles-source\.ts check"/)
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
