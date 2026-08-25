import { expect, test, type Page } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

const identityRegistry = '0x1234567890abcdef1234567890abcdef12345678'
const otherIdentityRegistry = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
const agentId = '42'
const updatedAt = '2026-08-04T10:58:50.553Z'
const timestampMs = Date.parse(updatedAt)
const registrationPath = (
	chainId: number,
	registry = identityRegistry
) => (
	`/agents/eip-8004/eip155/${String(chainId)}/registry/${registry}/agent/${agentId}`
)
const observationPath = `${registrationPath(1)}/observations/${String(timestampMs)}/Eip8004Scan_Rest`

const agentDetail = {
	success: true,
	data: {
		chain_id: 1,
		token_id: agentId,
		contract_address: identityRegistry,
		owner_address: '0xb5715e7a3130cb09692aefc64b9ae6cd9a20a7ba',
		agent_wallet: '0xe10d5158186870ab0274835191032b1b1013bf69',
		created_block_number: 113957614,
		created_tx_hash: '0xd2281d6e485b3e4265d7aacc1c4286af86188e757b7723979793786ba89ec84b',
		updated_at: updatedAt,
		is_active: true,
		raw_metadata: {
			offchain_uri: 'https://agents.example/42.json',
		},
		services: null,
	},
}

const installAgentFixture = async (page: Page) => {
	await page.route('https://8004scan.io/api/v1/public/agents/**', async (route) => {
		await route.fulfill({
			contentType: 'application/json',
			json: agentDetail,
		})
	})
}

test.describe('EIP-8004 agent lifecycle', () => {
	test('one registry fixture resolves its registration and authoritative observation', async ({ page }) => {
		test.setTimeout(180_000)
		await installAgentFixture(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await diagnostics.step(page.goto(registrationPath(1), { waitUntil: 'domcontentloaded' }))
		await expectMainVisible(page, 120_000, diagnostics)
		await expect(page.locator('#main')).toContainText('Identity registry')
		await expect(page.locator('#main')).toContainText(identityRegistry)
		await expect(page.locator('#main')).toContainText(agentId)

		await diagnostics.step(page.goto(observationPath, { waitUntil: 'domcontentloaded' }))
		await expectMainVisible(page, 120_000, diagnostics)
		await expect(page.locator('#main')).toContainText('Active')
		await expect(page.locator('#main')).toContainText('Yes')
		await expect(page.locator('#main')).toContainText('https://agents.example/42.json')
	})

	for (const mismatch of [
		{
			label: 'chain',
			pathname: registrationPath(10),
		},
		{
			label: 'identity registry',
			pathname: registrationPath(1, otherIdentityRegistry),
		},
	]) {
		test(`rejects a mismatched ${mismatch.label}`, async ({ page }) => {
			await installAgentFixture(page)
			await page.goto(mismatch.pathname, { waitUntil: 'domcontentloaded' })
			await expectMainVisible(page)
			await expect(page.locator('#main').getByRole('alert', {
				name: /response registration does not match request/,
			}).first()).toBeVisible({
				timeout: 120_000,
			})
		})
	}
})
