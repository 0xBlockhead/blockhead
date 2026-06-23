import { existsSync } from 'node:fs'

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

export const generatedOwnership = (): GeneratedOwnership[] => {
	const app = loadApp()

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
		...app.views.entityViews.map((view) => ({
			activePath: view.file,
			expectedPath: `.generated/expected/${view.file}`,
			kind: 'view' as const,
			ownership: view.ownership,
		})),
		...app.routes.sections.map((section) => ({
			activePath: `src/routes/${section.path}/+layout.svelte`.replace('src/routes//', 'src/routes/'),
			expectedPath: `.generated/expected/src/routes/${section.path}/+layout.svelte`.replace('/src/routes//', '/src/routes/'),
			kind: 'route-section' as const,
			ownership: 'hand-owned' as const,
		})),
		...app.routes.pages.map((page) => ({
			activePath: `src/routes/${page.path}/+page.svelte`.replace('src/routes//', 'src/routes/'),
			expectedPath: `.generated/expected/src/routes/${page.path}/+page.svelte`.replace('/src/routes//', '/src/routes/'),
			kind: 'route' as const,
			ownership: page.ownership,
		})),
	]
}

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
