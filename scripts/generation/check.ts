import { generateExpected } from './generate-expected.ts'
import { validateRoundTrip } from './round-trip.ts'
import { validateExpected } from './validate-expected.ts'

export const checkGenerated = async () => {
	await generateExpected()
	await validateExpected()
	validateRoundTrip()

	console.log('Check passed')
}
