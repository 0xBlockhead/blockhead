import { existsSync } from 'node:fs'

import { audit } from './audit.ts'
import { generateExpected } from './generate-expected.ts'
import { validateRoundTrip } from './round-trip.ts'
import { validateApp } from './validate-app.ts'
import { validateExpected } from './validate-expected.ts'

export const checkGenerated = async () => {
	await audit()
	await validateApp()
	await generateExpected()
	await validateExpected()
	validateRoundTrip()

	if (!existsSync('.generated/expected/APP.snapshot.json'))
		throw new Error('Expected APP snapshot was not generated')

	console.log('Check passed')
}
