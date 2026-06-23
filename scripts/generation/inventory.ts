import { existsSync } from 'node:fs'

import {
	activeRoots,
	documentWitnesses,
	generatedMarkers,
	referenceRoots,
} from './paths.ts'
import { readText, walkFiles } from './files.ts'
import type { SourceRole, WitnessFile } from './types.ts'

const hasGeneratedMarker = (path: string) => (
	generatedMarkers.some((marker) => readText(path).slice(0, 2000).includes(marker))
)

const classifyPath = (path: string): WitnessFile => {
	if (path.startsWith('tests/'))
		return {
			path,
			role: 'test-invariant',
			reason: 'test file encodes executable product invariant',
		}

	if (path.startsWith('scripts/'))
		return {
			path,
			role: 'script-invariant',
			reason: 'script file encodes generation or validation behavior',
		}

	if (documentWitnesses.includes(path as typeof documentWitnesses[number]))
		return {
			path,
			role: path.endsWith('.ts') || path === 'package.json' ? 'definition' : 'documentation',
			reason: 'top-level witness document or definition file',
		}

	for (const root of referenceRoots) {
		if (path === root || path.startsWith(`${root}/`))
			return {
				path,
				role: hasGeneratedMarker(path) ? 'reference-generated' : 'reference-hand-owned',
				reason: `inside read-only reference root ${root}`,
			}
	}

	for (const root of activeRoots) {
		if (path === root || path.startsWith(`${root}/`))
			return {
				path,
				role: hasGeneratedMarker(path) ? 'active-generated' : 'active-hand-owned',
				reason: `inside active root ${root}`,
			}
	}

	return {
		path,
		role: 'unknown',
		reason: 'not matched by current witness topology',
	}
}

export const inventoryWitnesses = () => (
	[
		...documentWitnesses.filter((path) => existsSync(path)),
		...activeRoots.flatMap(walkFiles),
		...referenceRoots.flatMap(walkFiles),
		...walkFiles('tests'),
		...walkFiles('scripts'),
	]
		.filter((path, index, paths) => paths.indexOf(path) === index)
		.sort()
		.map(classifyPath)
)

export const roleCounts = (files: readonly WitnessFile[]) => (
	Object.fromEntries(
		[
			'active-generated',
			'active-hand-owned',
			'reference-generated',
			'reference-hand-owned',
			'documentation',
			'test-invariant',
			'script-invariant',
			'definition',
			'unknown',
		].map((role) => [
			role,
			files.filter((file) => file.role === (role as SourceRole)).length,
		])
	)
)
