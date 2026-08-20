import {
	expect,
	test,
} from '@playwright/test'


const emitter = `000000000000000000000000${'1'.repeat(40)}`
const transferId = `2/${emitter}/42`
const sourceTransactionHash = `0x${'a'.repeat(64)}`
const destinationTransactionHash = `0x${'b'.repeat(64)}`
const sourceTimestampMs = Date.parse('2026-01-02T03:04:05.000Z')
const destinationTimestampMs = Date.parse('2026-01-02T03:05:06.000Z')
const transferPath = `/~/bridge/transfer/Wormholescan/${encodeURIComponent(transferId)}`

const operation = {
	id: transferId,
	emitterChain: 2,
	emitterAddress: {
		hex: emitter,
	},
	sequence: '42',
	content: {
		standarizedProperties: {
			amount: '1000000000000000000',
			fromChain: 2,
			toChain: 23,
			fromAddress: emitter,
			toAddress: `000000000000000000000000${'2'.repeat(40)}`,
			tokenAddress: '',
			tokenChain: 2,
		},
	},
	sourceChain: {
		chainId: 2,
		status: 'confirmed',
		timestamp: '2026-01-02T03:04:05.000Z',
		from: emitter,
		feeUSD: '1.25',
		transaction: {
			txHash: sourceTransactionHash,
		},
	},
	targetChain: {
		chainId: 23,
		status: 'completed',
		timestamp: '2026-01-02T03:05:06.000Z',
		to: `000000000000000000000000${'2'.repeat(40)}`,
		fee: '21000',
		feeUSD: '0.42',
		transaction: {
			txHash: destinationTransactionHash,
		},
	},
}


test('Wormhole transfer shows source and destination event-clocked observations', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const pageErrors: string[] = []
	const unexpectedConsoleErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))
	page.on('console', (message) => {
		if (
			message.type() === 'error'
			&& !message.text().includes('unsupported bridge transfer source Wormholescan')
		)
			unexpectedConsoleErrors.push(message.text())
	})

	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `wormhole-transfer-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route('**/api-proxy/**', async (route) => {
		if (
			decodeURIComponent(route.request().url()).includes(
				`api.wormholescan.io/api/v1/operations/2/${emitter}/42`
			)
		) {
			await route.fulfill({
				contentType: 'application/json',
				json: operation,
			})
			return
		}

		await route.fulfill({
			status: 418,
		})
	})

	await page.goto(transferPath, {
		waitUntil: 'domcontentloaded',
	})
	const main = page.locator('#main')
	await expect(main).toBeVisible({
		timeout: 120_000,
	})
	await expect(main).toContainText(transferId, {
		timeout: 120_000,
	})
	await expect(main.getByRole('heading', {
		level: 4,
		name: String(sourceTimestampMs),
	})).toBeAttached()
	await expect(main.getByRole('heading', {
		level: 4,
		name: String(destinationTimestampMs),
	})).toBeAttached()
	await expect(main).toContainText('timestamps (2)')
	expect(pageErrors).toEqual([])
	expect(unexpectedConsoleErrors).toEqual([])
})
