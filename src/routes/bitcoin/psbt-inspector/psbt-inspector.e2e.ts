import { expect, test } from '@playwright/test'


// BIP174: two-input/two-output PSBT with the first input finalized.
const bip174FinalizedPsbtV0Base64 = 'cHNidP8BAKACAAAAAqsJSaCMWvfEm4IS9Bfi8Vqz9cM9zxU4IagTn4d6W3vkAAAAAAD+////qwlJoIxa98SbghL0F+LxWrP1wz3PFTghqBOfh3pbe+QBAAAAAP7///8CYDvqCwAAAAAZdqkUdopAu9dAy+gdmI5x3ipNXHE5ax2IrI4kAAAAAAAAGXapFG9GILVT+glechue4O/p+gOcykWXiKwAAAAAAAEHakcwRAIgR1lmF5fAGwNrJZKJSGhiGDR9iYZLcZ4ff89X0eURZYcCIFMJ6r9Wqk2Ikf/REf3xM286KdqGbX+EhtdVRs7tr5MZASEDXNxh/HupccC1AaZGoqg7ECy0OIEhfKaC3Ibi1z+ogpIAAQEgAOH1BQAAAAAXqRQ1RebjO4MsRwUPJNPuuTycA5SLx4cBBBYAFIXRNTfy4mVAWjTbr6nj3aAfuCMIAAAA'

test('navigates directly to the PSBT inspector and hydrates the local parser', async ({ page }) => {
	await page.goto('/bitcoin/psbt-inspector', { waitUntil: 'domcontentloaded' })
	await expect(page.getByRole('heading', { name: 'PSBT inspector' })).toBeVisible()

	await page.getByLabel('Base64 or hex PSBT').fill(bip174FinalizedPsbtV0Base64)
	await page.getByRole('button', { name: 'Inspect PSBT' }).click()
	await expect(page.getByLabel('PSBT inspection')).toContainText(
		'PSBT version0 Transaction version2 Locktime0 Input count2 Output count2 Finalized input count1'
	)
	await expect(page.getByLabel('PSBT inputs')).toContainText('Value sats')
	await expect(page.getByLabel('PSBT inputs')).toContainText('100,000,000')
	await expect(page.getByLabel('PSBT outputs')).toContainText('199,900,000')
	await expect(page).toHaveURL(/\/bitcoin\/psbt-inspector$/)
})
