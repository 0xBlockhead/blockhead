import { existsSync } from 'node:fs'

import { audit } from './audit.ts'
import { generateExpected } from './generate-expected.ts'
import { validateApp } from './validate-app.ts'
import { validateExpected } from './validate-expected.ts'

export const checkGenerated = async () => {
	await audit()
	await validateApp()
	await generateExpected()
	await validateExpected()

	if (!existsSync('.generated/expected/APP.snapshot.json'))
		throw new Error('Expected APP snapshot was not generated')

	console.log('Check passed')
}
