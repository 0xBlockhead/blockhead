import { expect, test } from '@playwright/test'


const blockHash = 'a'.repeat(64)
const selectedParentHash = 'b'.repeat(64)
const utxoCommitment = 'e'.repeat(64)

test('Kaspa block visibly preserves public DAG parent and UTXO-commitment facts', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route(`https://api.kaspa.org/blocks/${blockHash}?includeTransactions=false&includeColor=false`, async (route) => {
		await route.fulfill({
			json: {
				header: {
					version: 1,
					timestamp: '1720000000000',
					blueScore: '4',
					daaScore: '3',
					bits: 1,
					nonce: '2',
					utxoCommitment,
					parents: [{
						parentHashes: [selectedParentHash],
					}],
				},
				verboseData: {
					hash: blockHash,
					blueScore: '4',
					selectedParentHash,
				},
			},
		})
	})

	await page.goto(`/network/kaspa/block/${blockHash}`, { waitUntil: 'domcontentloaded' })

	await expect(page.locator('#main')).toContainText('selected parent hash', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText(selectedParentHash)
	await expect(page.locator('#main')).toContainText(utxoCommitment)
	await expect(page.locator('#main')).toContainText('blue score')
	await expect(page.locator('#main')).toContainText('daa score')
})
