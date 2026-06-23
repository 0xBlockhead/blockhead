import { mkdirSync, rmSync } from 'node:fs'

import { audit } from './generation/audit.ts'
import { assembleApp } from './generation/assemble-app.ts'
import { extract } from './generation/extract.ts'
import { generateExpected } from './generation/generate-expected.ts'
import { checkGenerated } from './generation/check.ts'
import { syncGenerated } from './generation/sync.ts'

const command = process.argv[2]
const flags = new Set(process.argv.slice(3))

mkdirSync('.generated', {
	recursive: true,
})

if (command === 'audit')
	await audit()
else if (command === 'extract')
	await extract()
else if (command === 'assemble')
	await assembleApp()
else if (command === 'generate')
	await generateExpected()
else if (command === 'check')
	await checkGenerated()
else if (command === 'sync')
	await syncGenerated({
		dryRun: flags.has('--dry-run'),
	})
else if (command === 'clean')
	rmSync('.generated', {
		force: true,
		recursive: true,
	})
else {
	console.error('Usage: tsx scripts/generate.ts <audit|extract|assemble|generate|check|sync|clean> [--dry-run]')
	process.exit(1)
}
