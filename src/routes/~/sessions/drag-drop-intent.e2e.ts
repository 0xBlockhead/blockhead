import { expect, test } from '@playwright/test'
import { stringify } from 'devalue'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'


test.setTimeout(180_000)

test('turns typed account selection into one reviewable persisted draft', async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-session-intent-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/sessions'))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByLabel('Session name').fill('Typed entity intent')
	await page.getByRole('button', { name: 'Create session' }).click()
	await page.getByRole('link', { name: 'Typed entity intent' }).click()
	await expect(page).toHaveURL(/\/~\/session\//)
	await expect(page.getByLabel('Entity drop target')).toBeVisible({
		timeout: 120_000,
	})

	for (const { payload, message } of [
		{
			payload: 'not devalue',
			message: 'That drop payload is invalid or expired. Try an account card again.',
		},
		{
			payload: stringify({
				entityType: 'Network',
				entitySelector: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			}),
			message: 'Only EVM account cards can start transfer drafts.',
		},
	]) {
		await page.getByLabel('Entity drop target').evaluate((target, serializedPayload) => {
			const dataTransfer = new DataTransfer()
			dataTransfer.setData('application/x-blockhead-entity', serializedPayload)
			target.dispatchEvent(new DragEvent('drop', {
				bubbles: true,
				cancelable: true,
				dataTransfer,
			}))
		}, payload)
		await expect(page.getByText(message, { exact: true })).toBeVisible()
		await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()
	}

	const validPayload = stringify({
		entityType: 'EvmNetworkAccount',
		entitySelector: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			$actor: {
				address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
			},
		},
	})
	await page.getByLabel('Entity drop target').evaluate((target, serializedPayload) => {
		const dataTransfer = new DataTransfer()
		dataTransfer.setData('application/x-blockhead-entity', serializedPayload)
		target.dispatchEvent(new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
			dataTransfer,
		}))
	}, validPayload)
	await expect(page.getByText('Transfer draft', { exact: true })).toBeVisible()
	await expect(page.getByLabel('From account')).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await expect(page.getByLabel('Chain ID', { exact: true })).toHaveValue('1')
	await expect(page.getByText('Transfer draft added.')).not.toBeAttached()
	await page.getByRole('button', { name: 'Cancel' }).click()
	await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()

	await page.getByLabel('Entity drop target').evaluate((target, serializedPayload) => {
		const dataTransfer = new DataTransfer()
		dataTransfer.setData('application/x-blockhead-entity', serializedPayload)
		target.dispatchEvent(new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
			dataTransfer,
		}))
	}, validPayload)
	await page.getByLabel('To account').fill('0x000000000000000000000000000000000000dEaD')
	await page.getByLabel('Token address').fill('0x0000000000000000000000000000000000000000')
	await page.getByLabel('Amount (base units)').fill('1')
	await page.getByRole('button', { name: 'Confirm draft' }).evaluate((button) => {
		button.closest('form')?.dispatchEvent(new SubmitEvent('submit', {
			bubbles: true,
			cancelable: true,
		}))
	})
	await expect(page.getByText('Transfer draft added.')).toBeVisible()
	await page.reload({ waitUntil: 'load' })
	await expect(page.getByRole('button', { name: 'Edit Transfer action' })).toBeVisible({
		timeout: 120_000,
	})
	await page.getByRole('button', { name: 'Edit Transfer action' }).click()
	await expect(page.getByLabel('From account')).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await expect(page.getByLabel('Chain ID', { exact: true })).toHaveValue('1')
	await page.getByRole('button', { name: 'Cancel' }).click()

	await page.getByLabel('Source account').fill('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await page.getByLabel('Source chain ID').fill('1')
	await page.getByLabel('Source chain ID').press('Enter')
	await expect(page.getByLabel('From account')).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await expect(page.getByLabel('Chain ID', { exact: true })).toHaveValue('1')
	await page.getByRole('button', { name: 'Cancel' }).click()
	await expect(page.getByRole('button', { name: 'Edit Transfer action' })).toBeVisible()
	expect(diagnostics.issues).toEqual([])
})
