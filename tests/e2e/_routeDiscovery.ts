import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
	e2eRouteParamFixtureForContext,
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
	:	encodeURIComponent(segment)
)

const bracketSegmentToParamKey = (segment: string) => (
	segment.startsWith('[...') ?
		`...${segment.slice(4, -1)}`
	:	segment.startsWith('[') && segment.endsWith(']') ?
		((inner) => (
			(() => {
				const eq = inner.indexOf('=')
				return eq === -1 ? inner : inner.slice(0, eq)
			})()
		))(segment.slice(1, -1))
	:	segment
)

const dynamicFixture = (
	paramKey: string,
	staticSegments: readonly string[],
) => {
	if (paramKey.startsWith('...'))
		return e2eRouteRestSegmentFixtures[paramKey.slice(3)] ?? 'index.html'

	const contextual = e2eRouteParamFixtureForContext(paramKey, staticSegments)
	return (
		contextual
		?? `e2e-${paramKey}`
	)
}

const pageFileToPathname = (absPath: string) => {
	const rel = relative(routesDir, absPath).replaceAll('\\', '/')
	const dir = rel.replace(/(\/+)?\+page\.svelte$/, '')
	const segments = dir === '' ? [] : dir.split('/').filter(Boolean)
	const urlSegments: string[] = []
	const staticSegments: string[] = []

	for (const segment of segments) {
		if (isRouteGroup(segment)) continue

		if (segment.startsWith('[...')) {
			const raw = dynamicFixture(bracketSegmentToParamKey(segment), staticSegments)
			for (const piece of raw.split('/').filter(Boolean))
				urlSegments.push(encodeUrlSegment(piece))

			continue
		}

		if (segment.startsWith('[') && segment.endsWith(']')) {
			urlSegments.push(encodeUrlSegment(dynamicFixture(
				bracketSegmentToParamKey(segment),
				staticSegments,
			)))
			continue
		}

		staticSegments.push(segment)
		urlSegments.push(encodeUrlSegment(segment))
	}

	return (
		urlSegments.length === 0 ?
			'/'
		:	`/${urlSegments.join('/')}`
	)
}

const walkFiles = async function* (dir: string): AsyncGenerator<string> {
	for (const ent of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name)
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
		const pathname = pageFileToPathname(file)
		if (seen.has(pathname)) continue
		seen.add(pathname)
		out.push(pathname)
	}

	return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}
