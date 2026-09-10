import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import PsbtInspector from './+page.svelte'

const bip174FinalizedPsbtV0Base64 = 'cHNidP8BAKACAAAAAqsJSaCMWvfEm4IS9Bfi8Vqz9cM9zxU4IagTn4d6W3vkAAAAAAD+////qwlJoIxa98SbghL0F+LxWrP1wz3PFTghqBOfh3pbe+QBAAAAAP7///8CYDvqCwAAAAAZdqkUdopAu9dAy+gdmI5x3ipNXHE5ax2IrI4kAAAAAAAAGXapFG9GILVT+glechue4O/p+gOcykWXiKwAAAAAAAEHakcwRAIgR1lmF5fAGwNrJZKJSGhiGDR9iYZLcZ4ff89X0eURZYcCIFMJ6r9Wqk2Ikf/REf3xM286KdqGbX+EhtdVRs7tr5MZASEDXNxh/HupccC1AaZGoqg7ECy0OIEhfKaC3Ibi1z+ogpIAAQEgAOH1BQAAAAAXqRQ1RebjO4MsRwUPJNPuuTycA5SLx4cBBBYAFIXRNTfy4mVAWjTbr6nj3aAfuCMIAAAA'

test('inspects official vector and renders parse errors', async () => {
	await render(PsbtInspector)
	await page.getByLabelText('Base64 or hex PSBT').fill(bip174FinalizedPsbtV0Base64)
	await page.getByRole('button', { name: 'Inspect PSBT' }).click()
	await expect.element(page.getByLabelText('PSBT inspection')).toHaveTextContent(
		'PSBT version 0 Transaction version 2 Locktime 0 Input count 2 Output count 2 Finalized input count 1'
	)
	await expect.element(page.getByLabelText('PSBT inputs')).toHaveTextContent('Finalized yes')
	await expect.element(page.getByLabelText('PSBT inputs')).toHaveTextContent('Value sats 100,000,000')
	await expect.element(page.getByLabelText('PSBT inputs')).toHaveTextContent('Witness UTXO present')
	await expect.element(page.getByLabelText('PSBT inputs')).toHaveTextContent('Redeem script present')
	await expect.element(page.getByLabelText('PSBT outputs')).toHaveTextContent('199,900,000')
	await expect.element(page.getByLabelText('PSBT outputs')).toHaveTextContent('9,358')

	await page.getByLabelText('Base64 or hex PSBT').fill('not a psbt')
	await page.getByRole('button', { name: 'Inspect PSBT' }).click()
	await expect.element(page.getByRole('alert')).toHaveTextContent('Could not parse PSBT')
})
