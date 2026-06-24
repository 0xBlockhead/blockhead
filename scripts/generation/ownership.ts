import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { readText } from './files.ts'
import { loadApp } from './load-app.ts'

export type GeneratedOwnership = {
	activePath: string
	expectedPath: string
	kind:
		| 'doc'
		| 'schema'
		| 'schema-support'
		| 'views-index'
		| 'view'
		| 'route'
		| 'route-section'
	ownership: 'generated' | 'hand-owned'
}

type AppRouteSelectorMapping = {
	path?: string
	outcome: string
	emitPage?: boolean
	params?: {
		name: string
	}[]
}

export type StaleGeneratedFile = {
	activePath: string
	kind: 'route'
	reason: string
}

export type OwnershipSummary = {
	total: number
	generated: number
	handOwned: number
	generatedByKind: Record<string, number>
	handOwnedByKind: Record<string, number>
	remainingHandOwnedGeneratedSurface: {
		views: number
		routes: number
		routeSections: number
	}
}

const activeFiles = (
	directory: string
): string[] => (
	existsSync(directory) ?
		readdirSync(directory, {
			withFileTypes: true,
		}).flatMap((entry) => {
			const path = join(directory, entry.name)

			return entry.isDirectory() ?
				activeFiles(path)
			:
				[
					path,
				]
		})
	:
		[]
)

const hasRejectedRouteShape = (
	path: string
) => (
	path.includes('/by/$')
	|| path.includes('/by/by-')
	|| path.includes('/by/evm-coin-instance-evm-coin-instance-tool-key/')
	|| /\/by\/[^/]+-[2-9](\/|$)/.test(path)
	|| path.includes('/network/[caip2=networkCaip2]')
	|| path.includes('/data/data/')
	|| path.includes('/global/global/')
)

const routeParamNames = (
	path: string
) => [
	...path.matchAll(/\[([^=\]]+)(?:=[^\]]+)?\]/g),
].map((match) => match[1] ?? '')

const emitsGeneratedRoutePage = (
	mapping: AppRouteSelectorMapping
) => (
	mapping.path !== undefined
	&& !hasRejectedRouteShape(mapping.path)
	&& routeParamNames(mapping.path).every((paramName) => (mapping.params ?? []).some((param) => param.name === paramName))
	&& (mapping.emitPage ?? (mapping.outcome === 'canonical' || mapping.outcome === 'nested' || mapping.outcome === 'observation'))
)

export const staleGeneratedFiles = (): StaleGeneratedFile[] => (
	activeFiles('src/routes')
		.filter((path) => path.endsWith('/+page.svelte') || path.endsWith('/+page.ts'))
		.filter(hasRejectedRouteShape)
		.map((activePath) => ({
			activePath,
			kind: 'route',
			reason: 'rejected generated route shape',
		}))
)

export const generatedOwnership = (): GeneratedOwnership[] => {
	const app = loadApp()
	const generatedRoutePagePaths = new Set(
		app.routes.selectorMappings
			.filter(emitsGeneratedRoutePage)
			.flatMap((mapping) => mapping.path === undefined ? [] : [
				mapping.path,
			])
	)

	return [
		{
			activePath: 'SCHEMA.md',
			expectedPath: '.generated/expected/SCHEMA.md',
			kind: 'doc',
			ownership: 'generated',
		},
		{
			activePath: 'RESOLVER-COVERAGE.md',
			expectedPath: '.generated/expected/RESOLVER-COVERAGE.md',
			kind: 'doc',
			ownership: 'generated',
		},
		{
			activePath: 'SOURCES.md',
			expectedPath: '.generated/expected/SOURCES.md',
			kind: 'doc',
			ownership: 'generated',
		},
		...app.schema.entities.map((entity) => ({
			activePath: `src/schema/${entity.name}.ts`,
			expectedPath: `.generated/expected/src/schema/${entity.name}.ts`,
			kind: 'schema' as const,
			ownership: 'generated' as const,
		})),
		...[
			'EntityType.ts',
			'index.ts',
		].map((file) => ({
			activePath: `src/schema/${file}`,
			expectedPath: `.generated/expected/src/schema/${file}`,
			kind: 'schema-support' as const,
			ownership: 'generated' as const,
		})),
		{
			activePath: 'src/views/index.ts',
			expectedPath: '.generated/expected/src/views/index.ts',
			kind: 'views-index',
			ownership: 'generated',
		},
		{
			activePath: 'src/routes/entity-selector-route-leaves.ts',
			expectedPath: '.generated/expected/src/routes/entity-selector-route-leaves.ts',
			kind: 'route',
			ownership: 'generated',
		},
		{
			activePath: 'src/routes/entity-hub-collection-routes.ts',
			expectedPath: '.generated/expected/src/routes/entity-hub-collection-routes.ts',
			kind: 'route',
			ownership: 'generated',
		},
		...app.views.entityViews.map((view) => ({
			activePath: view.file,
			expectedPath: `.generated/expected/${view.file}`,
			kind: 'view' as const,
			ownership: app.views.entityViewShells.some((shell) => shell.file === view.file) ? 'generated' as const : view.ownership,
		})),
		...app.routes.sections.map((section) => ({
			activePath: `src/routes/${section.path}/+layout.svelte`.replace('src/routes//', 'src/routes/'),
			expectedPath: `.generated/expected/src/routes/${section.path}/+layout.svelte`.replace('/src/routes//', '/src/routes/'),
			kind: 'route-section' as const,
			ownership: app.routes.sectionShells.some((shell) => shell.routePath === section.path) ? 'generated' as const : 'hand-owned' as const,
		})),
		...app.routes.pages.map((page) => ({
			activePath: `src/routes/${page.path}/+page.svelte`.replace('src/routes//', 'src/routes/'),
			expectedPath: `.generated/expected/src/routes/${page.path}/+page.svelte`.replace('/src/routes//', '/src/routes/'),
			kind: 'route' as const,
			ownership: generatedRoutePagePaths.has(page.path) || app.routes.pageShells.some((shell) => shell.routePath === page.path) ? 'generated' as const : page.ownership,
		})),
		...app.routes.loaderTransforms.map((transform) => ({
			activePath: `src/routes/${transform.routePath}/+page.ts`.replace('src/routes//', 'src/routes/'),
			expectedPath: `.generated/expected/src/routes/${transform.routePath}/+page.ts`.replace('/src/routes//', '/src/routes/'),
			kind: 'route' as const,
			ownership: 'generated' as const,
		})),
	]
}

export const ownershipSummary = (ownershipRows: readonly GeneratedOwnership[]): OwnershipSummary => ({
	total: ownershipRows.length,
	generated: ownershipRows.filter((row) => row.ownership === 'generated').length,
	handOwned: ownershipRows.filter((row) => row.ownership === 'hand-owned').length,
	generatedByKind: Object.fromEntries(
		Object.entries(Object.groupBy(
			ownershipRows.filter((row) => row.ownership === 'generated'),
			(row) => row.kind
		)).map(([kind, rows]) => [
			kind,
			rows?.length ?? 0,
		])
	),
	handOwnedByKind: Object.fromEntries(
		Object.entries(Object.groupBy(
			ownershipRows.filter((row) => row.ownership === 'hand-owned'),
			(row) => row.kind
		)).map(([kind, rows]) => [
			kind,
			rows?.length ?? 0,
		])
	),
	remainingHandOwnedGeneratedSurface: {
		views: ownershipRows.filter((row) => row.kind === 'view' && row.ownership === 'hand-owned').length,
		routes: ownershipRows.filter((row) => row.kind === 'route' && row.ownership === 'hand-owned').length,
		routeSections: ownershipRows.filter((row) => row.kind === 'route-section' && row.ownership === 'hand-owned').length,
	},
})

export const ownershipDiff = (ownershipRows: readonly GeneratedOwnership[]) => (
	ownershipRows.map((row) => ({
		...row,
		activeExists: existsSync(row.activePath),
		expectedExists: existsSync(row.expectedPath),
		matches: (
			existsSync(row.activePath)
			&& existsSync(row.expectedPath)
			&& readText(row.activePath) === readText(row.expectedPath)
		),
	}))
)
