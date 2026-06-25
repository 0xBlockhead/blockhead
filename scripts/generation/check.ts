import { generateExpected } from './generate-expected.ts'
import { validateExpected } from './validate-expected.ts'

export const checkGenerated = async () => {
	await generateExpected()
	await validateExpected()

	console.log('Check passed')
}
