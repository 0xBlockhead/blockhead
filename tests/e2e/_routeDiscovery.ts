import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
	e2eRouteFixtureMetadataByRouteId,
	type E2eRouteFixtureMetadata,
} from './_generatedRouteFixtureMetadata.ts'
import * as routeParamFixtures from './_routeParamFixtures.ts'

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const routesDir = join(repoRoot, 'src', 'routes')

const includeTestRoutes = process.env.E2E_INCLUDE_TEST_ROUTES === '1'

const getRouteParamFixtures = () => {
	return routeParamFixtures
}

const isRouteGroup = (segment: string) => (
	segment.startsWith('(')
	&& segment.endsWith(')')
)

const encodeUrlSegment = (segment: string) => (
	segment === '~' ?
		'~'
	:
		encodeURIComponent(segment)
)

const encodeDynamicUrlSegment = (
	segment: string,
	matcherKey?: string
) => (
	matcherKey === 'networkCaip2'
	|| matcherKey === 'eip155NetworkCaip2' ?
		segment
	:
	(
		segment.includes('/')
		|| segment.includes(':')
	) ?
		encodeURIComponent(encodeURIComponent(segment))
	:
		encodeUrlSegment(segment)
)

const bracketSegmentToParamKey = (segment: string) => (
	segment.startsWith('[...') ?
		`...${segment.slice(4, -1)}`
	:
	segment.startsWith('[') && segment.endsWith(']') ?
		((inner) => (
			(() => {
				const eq = inner.indexOf('=')
				return eq === -1 ? inner : inner.slice(0, eq)
			})()
		))(segment.slice(1, -1))
	:
		segment
)

const bracketSegmentToMatcherKey = (segment: string) => (
	segment.startsWith('[') && segment.endsWith(']') ?
		((inner) => (
			inner.includes('=') ? inner.slice(inner.indexOf('=') + 1) : undefined
		))(segment.slice(1, -1))
	:
		undefined
)

const bracketExpressionToParamKey = (expression: string) => (
	expression.startsWith('...') ?
		`...${expression.slice(3)}`
	:
		expression.includes('=') ?
		expression.slice(0, expression.indexOf('='))
	:
		expression
)

const bracketExpressionToMatcherKey = (expression: string) => (
	expression.includes('=') ? expression.slice(expression.indexOf('=') + 1) : undefined
)

const unique = <_Value>(values: readonly _Value[]) => [...new Set(values)]

const routeParamNames = (href: string) => unique(
	Array.from(href.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g))
		.map((match) => match[1])
)

const publicRouteIdFromSegments = (segments: readonly string[]) => `/${segments
	.filter((segment) => !isRouteGroup(segment))
	.join('/')}`.replaceAll('//', '/')

const generatedRouteFixtureMetadata = (routeId: string): E2eRouteFixtureMetadata => {
	const metadata = Object.entries(e2eRouteFixtureMetadataByRouteId)
		.find(([fixtureRouteId]) => fixtureRouteId === routeId)?.[1]
	if (metadata == null)
		throw new Error(`Missing generated E2E route fixture metadata for ${routeId}`)

	return metadata
}

const dynamicFixture = (
	routeId: string,
	routeFixtureMetadata: E2eRouteFixtureMetadata,
	paramKey: string,
	_matcherKey: string | undefined
) => {
	if (paramKey.startsWith('...'))
		return (
			getRouteParamFixtures().e2eRouteRestSegmentFixtures[paramKey.slice(3)]
			?? getRouteParamFixtures().e2eRouteParamFixtureForMetadata(
				routeId,
				routeFixtureMetadata,
				paramKey.slice(3)
			)
		)

	return getRouteParamFixtures().e2eRouteParamFixtureForMetadata(
		routeId,
		routeFixtureMetadata,
		paramKey
	)
}

const expandMixedSegment = (
	routeId: string,
	routeFixtureMetadata: E2eRouteFixtureMetadata,
	segment: string,
	contexts: {
		urlSegments: string[]
		params: Record<string, string>
	}[]
) => {
	const parts = [...segment.matchAll(/\[([^\]]+)\]/g)]
	let expandedContexts = contexts.map((context) => ({
		context,
		urlSegment: '',
		offset: 0,
	}))

	for (const part of parts) {
		const expression = part[1]
		const paramKey = bracketExpressionToParamKey(expression)
		const matcherKey = bracketExpressionToMatcherKey(expression)
		expandedContexts = expandedContexts.flatMap((expandedContext) => (
			getRouteParamFixtures().e2eRouteParamFixtureVariantsForMetadata(
				routeId,
				routeFixtureMetadata,
				paramKey,
				expandedContext.context.params
			).map((fixture) => ({
				context: {
					...expandedContext.context,
					params: {
						...expandedContext.context.params,
						[paramKey]: fixture,
					},
				},
				urlSegment: (
					expandedContext.urlSegment
					+ segment.slice(expandedContext.offset, part.index)
					+ encodeDynamicUrlSegment(fixture, matcherKey)
				),
				offset: part.index + part[0].length,
			}))
		))
	}

	return expandedContexts.map((expandedContext) => ({
		...expandedContext.context,
		urlSegments: [
			...expandedContext.context.urlSegments,
			encodeUrlSegment(
				expandedContext.urlSegment
				+ segment.slice(expandedContext.offset)
			),
		],
	}))
}

const pageFileToPathname = (absPath: string) => {
	const rel = relative(routesDir, absPath).replaceAll('\\', '/')
	const dir = rel.replace(/(\/+)?\+page\.svelte$/, '')
	const segments = dir === '' ? [] : dir.split('/').filter(Boolean)
	const routeId = publicRouteIdFromSegments(segments)
	const routeFixtureMetadata = routeParamNames(routeId).length === 0 ? undefined : generatedRouteFixtureMetadata(routeId)
	let contexts: {
		urlSegments: string[]
		params: Record<string, string>
	}[] = [
		{
			urlSegments: [],
			params: {},
		},
	]

	for (const segment of segments) {
		if (isRouteGroup(segment)) continue

		if (segment.startsWith('[...')) {
			if (routeFixtureMetadata == null)
				throw new Error(`Missing generated E2E route fixture metadata for ${routeId}`)

			contexts = contexts.map((context) => ({
				...context,
				urlSegments: [
					...context.urlSegments,
					...dynamicFixture(
						routeId,
						routeFixtureMetadata,
						bracketSegmentToParamKey(segment),
						bracketSegmentToMatcherKey(segment)
					)
						.split('/')
						.filter(Boolean)
						.map(encodeUrlSegment),
				],
			}))
			continue
		}

		if (/^\[[^\]]+\]$/.test(segment)) {
			if (routeFixtureMetadata == null)
				throw new Error(`Missing generated E2E route fixture metadata for ${routeId}`)

			const paramKey = bracketSegmentToParamKey(segment)
			const matcherKey = bracketSegmentToMatcherKey(segment)
			contexts = contexts.flatMap((context) => (
				getRouteParamFixtures().e2eRouteParamFixtureVariantsForMetadata(
					routeId,
					routeFixtureMetadata,
					paramKey,
					context.params
				)
			).map((fixture) => ({
				...context,
				urlSegments: [
					...context.urlSegments,
					encodeDynamicUrlSegment(fixture, matcherKey),
				],
				params: {
					...context.params,
					[paramKey]: fixture,
				},
			})))
			continue
		}

		if (segment.includes('[') && segment.includes(']')) {
			if (routeFixtureMetadata == null)
				throw new Error(`Missing generated E2E route fixture metadata for ${routeId}`)

			contexts = expandMixedSegment(
				routeId,
				routeFixtureMetadata,
				segment,
				contexts
			)
			continue
		}

		contexts = contexts.map((context) => ({
			...context,
			urlSegments: [
				...context.urlSegments,
				encodeUrlSegment(segment),
			],
		}))
	}

	return contexts.map((context) => (
		context.urlSegments.length === 0 ?
			'/'
		:
			`/${context.urlSegments.join('/')}`
	))
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
