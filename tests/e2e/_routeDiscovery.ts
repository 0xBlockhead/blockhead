import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
	e2eRouteFixtureMetadataByNodeId,
	matchE2eRouteParam,
	type E2eRouteFixtureMetadata,
	type E2eRouteFixtureMapping,
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

export const publicRouteIdFromRouteId = (routeId: string) => publicRouteIdFromSegments(
	routeId
		.split('/')
		.map((segment) => segment.replaceAll(/=([^\]]+)(?=\]\]?)/g, ''))
)

const routeParamNames = (routeId: string) => [
	...new Set([...routeId.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g)].map((match) => String(match[1]))),
]

export const pathnameFromRouteFixture = (
	metadata: E2eRouteFixtureMetadata,
	params: Readonly<Partial<Record<string, string>>>
) => publicRouteIdFromRouteId(metadata.routeId).replace(
	/\[\[?(?:\.\.\.)?(\w+)(?:=\w+)?\]\]?/g,
	(_segment, paramName: string) => {
		const value = params[paramName]
		if (value == null || value === '')
			throw new Error(`${metadata.routeId} is missing required route parameter ${paramName}`)

		const encoding = metadata.parameterEncodingByName?.[paramName]
		return encoding == null ?
			value
		: encoding === 'Path' ?
			value.split('/').map(encodeURIComponent).join('/')
		:
			encodeURIComponent(value)
	}
)

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const routeFixtureParamsFromPathname = (
	metadata: E2eRouteFixtureMetadata,
	pathname: string
) => {
	const publicRouteId = publicRouteIdFromRouteId(metadata.routeId)
	const paramNames: string[] = []
	const matcherByParam = Object.fromEntries([...metadata.routeId.matchAll(
		/\[\[?(?:\.\.\.)?([^=\]]+)=([^\]]+)\]\]?/g
	)].map((match) => [match[1], match[2]]))
	let cursor = 0
	let pattern = '^'

	for (const match of publicRouteId.matchAll(/\[\[?(\.\.\.)?(\w+)(?:=\w+)?\]\]?/g)) {
		const index = match.index
		const token = match[0]
		const rest = token.startsWith('[...') || token.startsWith('[[...')
		const paramName = match[2]

		pattern += escapeRegExp(publicRouteId.slice(cursor, index))
		pattern += rest ? '(.+)' : '([^/]+)'
		paramNames.push(paramName)
		cursor = index + token.length
	}
	pattern += `${escapeRegExp(publicRouteId.slice(cursor))}$`

	const values = new RegExp(pattern, 'u').exec(pathname)
	if (values == null)
		throw new Error(`${pathname} does not match ${metadata.routeId}`)

	return Object.fromEntries(paramNames.map((paramName, index) => {
		const encodedValue = values[index + 1]
		const value = encodedValue.split('/').map(decodeURIComponent).join('/')
		if (!matchE2eRouteParam(matcherByParam[paramName], value))
			throw new Error(`${pathname} has invalid route parameter ${paramName}`)

		return [paramName, value]
	}))
}

const generatedRouteFixtureMetadata = (routeId: string): E2eRouteFixtureMetadata => {
	const matches = Object.values(e2eRouteFixtureMetadataByNodeId)
		.filter((metadata) => metadata.routeId === routeId)
	if (matches.length !== 1)
		throw new Error(`${routeId} has ${matches.length} generated fixture metadata owners`)

	return matches[0]
}

export const routeProbeCasesForMapping = (mapping: E2eRouteFixtureMapping) => (
	mapping.probeCases.map((probeCase, index) => ({
		id: mapping.probeCaseId ?? (index === 0 ? 'default' : `variant-${index + 1}`),
		atoms: probeCase.flatMap(([prefixIndex, caseNumber, fields]) => (
			fields.map((field) => `${mapping.probeAtomPrefixes[prefixIndex]}.${caseNumber}.${field}`)
		)),
	}))
)

export const routeProbeCaseParams = (probeCase: {
	atoms: readonly string[]
}) => Object.fromEntries(probeCase.atoms.map((atom) => [
	atom.slice(atom.lastIndexOf('.') + 1),
	atom,
]))

const pathnamesFromMetadata = (metadata: E2eRouteFixtureMetadata) => {
	const probeCases = metadata.mappings.flatMap(routeProbeCasesForMapping)
	const selectedCases = process.env.E2E_ROUTE_VARIANTS === 'all' ? probeCases : probeCases.slice(0, 1)
	if (selectedCases.length === 0)
		throw new Error(`${metadata.routeId} has no generated route probe cases`)

	return selectedCases.map((probeCase) => {
		const expectedParams = routeParamNames(metadata.routeId)
		const matcherByParam = Object.fromEntries([...metadata.routeId.matchAll(
			/\[\[?(?:\.\.\.)?([^=\]]+)=([^\]]+)\]\]?/g
		)].map((match) => [match[1], match[2]]))
		const probeParams = routeProbeCaseParams(probeCase)
		const caseParams = Object.keys(probeParams).map(String)
		if (
			expectedParams.some((param) => !caseParams.includes(param))
			|| caseParams.some((param) => !expectedParams.includes(param))
		)
			throw new Error(`${metadata.routeId} probe case ${probeCase.id} is not a complete route parameter record`)

		const params = Object.fromEntries(Object.entries(probeParams).map(([param, atom]) => {
			const value = new Map<string, string>(Object.entries(e2eRouteProbeAtomValueById)).get(atom)
			if (value == null)
				throw new Error(`${metadata.routeId} probe case ${probeCase.id} references missing atom ${atom}`)
			const matcher = matcherByParam[param]
			if (!matchE2eRouteParam(matcher, value))
				throw new Error(`${metadata.routeId} probe case ${probeCase.id} value for ${param} fails its generated matcher`)

			return [param, value]
		}))
		return pathnameFromRouteFixture(metadata, params)
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
