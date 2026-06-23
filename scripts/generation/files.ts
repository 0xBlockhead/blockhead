import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const readText = (path: string) => (
	(() => {
		try {
			return readFileSync(path, 'utf8')
		}
		catch {
			return ''
		}
	})()
)

export const writeText = (path: string, text: string) => {
	mkdirSync(dirname(path), {
		recursive: true,
	})

	writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`)
}

export const writeJsonl = <_Row>(path: string, rows: readonly _Row[]) => {
	writeText(
		path,
		rows.map((row) => JSON.stringify(row)).join('\n')
	)
}

export const walkFiles = (root: string): string[] => {
	if (!existsSync(root))
		return []

	return readdirSync(root, {
		withFileTypes: true,
	}).flatMap((entry) => {
		const path = join(root, entry.name)

		if (entry.isDirectory())
			return walkFiles(path)

		if (entry.isFile() || entry.isSymbolicLink())
			return [path]

		return []
	}).sort()
}
