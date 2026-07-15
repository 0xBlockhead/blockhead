import {
	globSync,
	readFileSync,
} from 'node:fs'
import {
	dirname,
	relative,
	sep,
} from 'node:path'

import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	e2eRouteFixtureMetadataByNodeId,
	e2eRouteParamMatcherByName,
} from '../../tests/e2e/_generatedRouteFixtureMetadata.ts'
import type { NavigationItem } from '$/routes/NavigationItem.ts'
import { navigationItems } from '$/routes/navigationItems.svelte.ts'

const navigationItemList = (navigationItems: readonly NavigationItem[]): NavigationItem[] => navigationItems.flatMap((navigationItem) => [
	navigationItem,
	...navigationItemList(navigationItem.children ?? []),
])

const generatedPageSourceByPublicPath = new Map(globSync('src/routes/**/+page.svelte').map((filePath) => [
	`/${relative('src/routes', dirname(filePath))
		.split(sep)
		.filter((segment) => !/^\(.+\)$/.test(segment))
		.join('/')}`,
	readFileSync(filePath, 'utf8'),
]))

const matchesGeneratedDynamicPage = (href: string) => Object.values(e2eRouteFixtureMetadataByNodeId).some((routeMetadata) => {
	const hrefSegments = href.split('/').filter(Boolean)
	const routeSegments = routeMetadata.publicPath.split('/').filter(Boolean)

	return (
		hrefSegments.length === routeSegments.length
		&& routeSegments.every((routeSegment, index) => {
			const parameterName = /^\[([^\]]+)\]$/.exec(routeSegment)?.[1]

			return parameterName ?
				routeMetadata.parameterMatchers[parameterName]?.some((matcherName) => (
					e2eRouteParamMatcherByName[matcherName](decodeURIComponent(hrefSegments[index]))
				)) === true
				:
				routeSegment === hrefSegments[index]
		})
	)
})

describe('navigation items', () => {
	it('uses unique identifiers', () => {
		const identifiers = navigationItemList(navigationItems).map(({ id }) => id)

		expect(new Set(identifiers).size).toBe(identifiers.length)
	})

	it('targets generated pages or matcher-valid generated route instances', () => {
		for (const { href } of navigationItemList(navigationItems))
			if (href)
				expect(
					generatedPageSourceByPublicPath.has(href)
					|| matchesGeneratedDynamicPage(href),
					href
				).toBe(true)
	})

	it('uses generated matchers for concrete selector routes', () => {
		expect(matchesGeneratedDynamicPage('/network/bitcoin')).toBe(true)
		expect(matchesGeneratedDynamicPage('/network/eip155:1')).toBe(true)
		expect(matchesGeneratedDynamicPage('/proposals/chain-agnostic')).toBe(true)
		expect(matchesGeneratedDynamicPage('/lens/accounts')).toBe(false)
		expect(matchesGeneratedDynamicPage('/rss/items')).toBe(false)
	})

	it('does not target placeholder-only generated pages', () => {
		for (const { href } of navigationItemList(navigationItems)) {
			const pageSource = href && generatedPageSourceByPublicPath.get(href)

			if (pageSource)
				expect(
					/not wired yet/i.test(pageSource)
					&& !/<[A-Z][A-Za-z0-9]*View\b/.test(pageSource),
					href
				).toBe(false)
		}
	})
})
