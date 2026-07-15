import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
	e2eRouteFixtureMetadataByNodeId,
	e2eRouteParamMatcherByName,
	type E2eRouteFixtureMetadata,
} from './_generatedRouteFixtureMetadata.ts'
import { e2eRouteProbeAtomValueById } from './_routeParamFixtures.ts'

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const routesDir = join(repoRoot, 'src', 'routes')

const includeTestRoutes = process.env.E2E_INCLUDE_TEST_ROUTES === '1'

const isRouteGroup = (segment: string) => (
	segment.startsWith('(')
	&& segment.endsWith(')')
)

const routeIdFromSegments = (segments: readonly string[]) => `/${segments.join('/')}`.replaceAll('//', '/')

const publicRouteIdFromSegments = (segments: readonly string[]) => `/${segments
	.filter((segment) => !isRouteGroup(segment))
	.join('/')}`.replaceAll('//', '/')

const routeParamNames = (routeId: string) => [
	...new Set([...routeId.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g)].map((match) => match[1])),
]

const generatedRouteFixtureMetadata = (routeId: string): E2eRouteFixtureMetadata => {
	const matches = Object.values(e2eRouteFixtureMetadataByNodeId)
		.filter((metadata) => metadata.routeId === routeId)
	if (matches.length !== 1)
		throw new Error(`${routeId} has ${matches.length} generated fixture metadata owners`)

	return matches[0]
}

const pathnamesFromMetadata = (metadata: E2eRouteFixtureMetadata) => {
	const probeCases = metadata.mappings.flatMap((mapping) => mapping.probeCases)
	const selectedCases = process.env.E2E_ROUTE_VARIANTS === 'all' ? probeCases : probeCases.slice(0, 1)
	if (selectedCases.length === 0)
		throw new Error(`${metadata.nodeId} has no generated route probe cases`)

	return selectedCases.map((probeCase) => {
		const expectedParams = routeParamNames(metadata.routeId)
		const caseParams = Object.keys(probeCase.params)
		if (
			expectedParams.some((param) => !caseParams.includes(param))
			|| caseParams.some((param) => !expectedParams.includes(param))
		)
			throw new Error(`${metadata.nodeId} probe case ${probeCase.id} is not a complete route parameter record`)

		const params = Object.fromEntries(Object.entries(probeCase.params).map(([param, atom]) => {
				const value = new Map<string, string>(Object.entries(e2eRouteProbeAtomValueById)).get(atom)
			if (value == null)
				throw new Error(`${metadata.nodeId} probe case ${probeCase.id} references missing atom ${atom}`)
			const matchers = metadata.parameterMatchers[param]
			if (!matchers.some((matcher) => e2eRouteParamMatcherByName[matcher](value)))
				throw new Error(`${metadata.nodeId} probe case ${probeCase.id} value for ${param} fails its generated matcher`)

			return [param, value]
		}))
		return metadata.resolve(params)
	})
}

const pageFileToPathname = (absPath: string) => {
	const rel = relative(routesDir, absPath).replaceAll('\\', '/')
	const dir = rel.replace(/(\/+)?\+page\.svelte$/, '')
	const segments = dir === '' ? [] : dir.split('/').filter(Boolean)
	const routeId = routeIdFromSegments(segments)
	return routeId.includes('[') ? pathnamesFromMetadata(generatedRouteFixtureMetadata(routeId)) : [publicRouteIdFromSegments(segments)]
}

const walkFiles = async function* (dir: string): AsyncGenerator<string> {
	for (const ent of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name)
		if (ent.isDirectory() && p === join(routesDir, 'demo')) continue
		if (!includeTestRoutes && ent.isDirectory() && p === join(routesDir, 'test')) continue
		if (ent.isDirectory())
			yield* walkFiles(p)
		else if (ent.name === '+page.svelte')
			yield p
	}
}

export const discoverPathnamesFromRoutes = async () => {
	const seen = new Set<string>()
	const out: string[] = []

	for await (const file of walkFiles(routesDir)) {
		for (const pathname of pageFileToPathname(file)) {
			if (seen.has(pathname)) continue
			seen.add(pathname)
			out.push(pathname)
		}
	}

	return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}

const envPositiveInteger = (
	name: string,
	fallback: number
) => {
	const raw = process.env[name]?.trim()
	if (!raw) return fallback
	const parsed = Number(raw)
	if (
		!Number.isInteger(parsed)
		|| parsed <= 0
	)
		throw new Error(`${name} must be a positive integer`)
	return parsed
}

const envNonnegativeInteger = (
	name: string,
	fallback: number
) => {
	const raw = process.env[name]?.trim()
	if (!raw) return fallback
	const parsed = Number(raw)
	if (
		!Number.isInteger(parsed)
		|| parsed < 0
	)
		throw new Error(`${name} must be a non-negative integer`)
	return parsed
}

export const discoverFilteredPathnamesFromRoutes = async () => {
	const pathPattern = process.env.E2E_PATH_PATTERN?.trim()
	const startPath = process.env.E2E_START_PATH?.trim()
	const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
	const limit = envPositiveInteger('E2E_PATH_LIMIT', Number.POSITIVE_INFINITY)
	const shardTotal = envPositiveInteger('E2E_PATH_SHARD_TOTAL', 1)
	const shardIndex = envNonnegativeInteger('E2E_PATH_SHARD_INDEX', 0)
	if (shardIndex >= shardTotal)
		throw new Error('E2E_PATH_SHARD_INDEX must be less than E2E_PATH_SHARD_TOTAL')

	let pageUrls = (
		pathPattern ?
			(await discoverPathnamesFromRoutes()).filter((pathname) => new RegExp(pathPattern).test(pathname))
		:
			await discoverPathnamesFromRoutes()
	)
	if (startPath) {
		const index = pageUrls.indexOf(startPath)
		if (index === -1)
			throw new Error(`E2E_START_PATH=${startPath} did not match a discovered route`)

		pageUrls = pageUrls.slice(index)
	}
	pageUrls = (
		shardTotal > 1 ?
			pageUrls.filter((_, index) => index % shardTotal === shardIndex)
		:
			pageUrls
	)
	pageUrls = (
		limitRaw !== '' ?
			pageUrls.slice(0, limit)
		:
			pageUrls
	)
	if (pageUrls.length === 0)
		throw new Error([
			`No discovered routes matched E2E_PATH_PATTERN=${pathPattern ?? '<unset>'}`,
			`E2E_START_PATH=${startPath ?? '<unset>'}`,
			`E2E_PATH_SHARD_INDEX=${shardIndex}`,
			`E2E_PATH_SHARD_TOTAL=${shardTotal}`,
		].join(' '))
	return pageUrls
}
