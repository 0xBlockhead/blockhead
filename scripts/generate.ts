import { mkdirSync, rmSync } from 'node:fs'

import { generateExpected } from './generation/generate-expected.ts'
import { checkGenerated } from './generation/check.ts'
import { syncGenerated } from './generation/sync.ts'

const command = process.argv[2]
const flags = new Set(process.argv.slice(3))

mkdirSync('.generated', {
	recursive: true,
})

if (command === 'generate')
	await generateExpected()
else if (command === 'check')
	await checkGenerated()
else if (command === 'sync')
	await syncGenerated({
		dryRun: flags.has('--dry-run'),
		deleteStale: flags.has('--delete-stale'),
	})
else if (command === 'clean')
	rmSync('.generated', {
		force: true,
		recursive: true,
	})
else {
	console.error('Usage: tsx scripts/generate.ts <generate|check|sync|clean> [--dry-run] [--delete-stale]')
	process.exit(1)
}
