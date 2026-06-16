import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
	e2eRouteParamFixtureForContext,
	e2eRouteParamFixtureVariantsForContext,
	e2eRouteRestSegmentFixtures,
} from './_routeParamFixtures.ts'


const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const routesDir = join(repoRoot, 'src', 'routes')

const isRouteGroup = (segment: string) => (
	segment.startsWith('(')
	&& segment.endsWith(')')
)

const encodeUrlSegment = (segment: string) => (
	segment === '~' ?
		'~'
	:
		encodeURIComponent(segment).replaceAll('%3A', ':')
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

const dynamicFixture = (
	paramKey: string,
	matcherKey: string | undefined,
	staticSegments: readonly string[]
) => {
	if (paramKey.startsWith('...'))
		return e2eRouteRestSegmentFixtures[paramKey.slice(3)] ?? 'index.html'

	if (matcherKey === 'eip155Caip2Namespace') return 'eip155'
	if (matcherKey === 'eip155Caip2Reference') return '1'

	const contextual = e2eRouteParamFixtureForContext(paramKey, staticSegments)
	return (
		contextual

	)
}

const expandMixedSegment = (
	segment: string,
	contexts: {
		urlSegments: string[]
		staticSegments: string[]
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
			(
				matcherKey === 'eip155Caip2Namespace' ?
					['eip155']
	:
		matcherKey === 'eip155Caip2Reference' ?
					['1']
				:
					e2eRouteParamFixtureVariantsForContext(
					paramKey,
					expandedContext.context.staticSegments,
					expandedContext.context.params
				)
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
					+ encodeUrlSegment(fixture)
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
	let contexts: {
		urlSegments: string[]
		staticSegments: string[]
		params: Record<string, string>
	}[] = [
		{
			urlSegments: [],
			staticSegments: [],
			params: {},
		},
	]

	for (const segment of segments) {
		if (isRouteGroup(segment)) continue

		if (segment.startsWith('[...')) {
			contexts = contexts.map((context) => ({
				...context,
				urlSegments: [
					...context.urlSegments,
					...dynamicFixture(
						bracketSegmentToParamKey(segment),
						bracketSegmentToMatcherKey(segment),
						context.staticSegments
					)
						.split('/')
						.filter(Boolean)
						.map(encodeUrlSegment),
				],
			}))
			continue
		}

		if (/^\[[^\]]+\]$/.test(segment)) {
			const paramKey = bracketSegmentToParamKey(segment)
			const matcherKey = bracketSegmentToMatcherKey(segment)
			contexts = contexts.flatMap((context) => (
				matcherKey === 'eip155Caip2Namespace' ?
					['eip155']
	:
		matcherKey === 'eip155Caip2Reference' ?
					['1']
				:
					e2eRouteParamFixtureVariantsForContext(
						paramKey,
						context.staticSegments,
						context.params
					)
			).map((fixture) => ({
				...context,
				urlSegments: [
					...context.urlSegments,
					encodeUrlSegment(fixture),
				],
				params: {
					...context.params,
					[paramKey]: fixture,
				},
			})))
			continue
		}

		if (segment.includes('[') && segment.includes(']')) {
			contexts = expandMixedSegment(segment, contexts)
			continue
		}

		contexts = contexts.map((context) => ({
			...context,
			staticSegments: [
				...context.staticSegments,
				segment,
			],
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
