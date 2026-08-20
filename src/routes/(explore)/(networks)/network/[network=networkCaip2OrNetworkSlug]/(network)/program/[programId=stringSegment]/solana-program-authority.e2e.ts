import { expect, test } from '@playwright/test'

import bindings from '$/sources/PublicNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { base58, base64 } from '@scure/base'


const network = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
const solanaUpgradeableLoaderProgramId = 'BPFLoaderUpgradeab1e11111111111111111111111'
const programId = base58.encode(new Uint8Array(32).fill(3))
const programDataAddress = base58.encode(new Uint8Array(32).fill(7))
const upgradeAuthorityAddress = base58.encode(new Uint8Array(32).fill(9))
const programPath = `/network/${network}/program/${programId}`
const solanaProxyPath = `/api-proxy/${sourceBindingId(bindings[Source.Solana_JsonRpc][0])}/0/`

const accountInfo = ({
	pubkey,
	upgradeAuthority,
}: {
	pubkey: string
	upgradeAuthority?: string
}) => {
	if (pubkey === programId) {
		const data = new Uint8Array(36)
		new DataView(data.buffer).setUint32(0, 2, true)
		data.set(base58.decode(programDataAddress), 4)
		return {
			context: {
				slot: 100,
			},
			value: {
				data: [base64.encode(data), 'base64'],
				executable: true,
				lamports: 1,
				owner: solanaUpgradeableLoaderProgramId,
				rentEpoch: 0,
				space: data.length,
			},
		}
	}

	if (pubkey === programDataAddress) {
		const data = new Uint8Array(upgradeAuthority == null ? 17 : 49)
		new DataView(data.buffer).setUint32(0, 3, true)
		if (upgradeAuthority != null) {
			data[12] = 1
			data.set(base58.decode(upgradeAuthority), 13)
		}
		return {
			context: {
				slot: 101,
			},
			value: {
				data: [base64.encode(data), 'base64'],
				executable: false,
				lamports: 1,
				owner: solanaUpgradeableLoaderProgramId,
				rentEpoch: 0,
				space: data.length,
			},
		}
	}

	return {
		context: {
			slot: 101,
		},
		value: {
			data: ['', 'base64'],
			executable: false,
			lamports: 1,
			owner: '11111111111111111111111111111111',
			rentEpoch: 0,
			space: 0,
		},
	}
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-solana-program-authority-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

for (const program of [
	{
		label: 'upgradeable',
		upgradeAuthority: upgradeAuthorityAddress,
	},
	{
		label: 'finalized',
		upgradeAuthority: undefined,
	},
]) {
	test(`${program.label} program shows truthful authority state`, async ({ page }) => {
		test.setTimeout(180_000)
		const unexpectedProviderRequests: string[] = []
		const requestedAccounts: string[] = []

		await page.route('**/api-proxy/**', async (route) => {
			const request = route.request()
			const decodedUrl = decodeURIComponent(request.url())
			const body = request.postDataJSON()
			if (
				request.method() === 'POST'
				&& decodedUrl.includes(solanaProxyPath)
				&& body.method === 'getAccountInfo'
			) {
				const pubkey = body.params[0]
				requestedAccounts.push(pubkey)
				await route.fulfill({
					contentType: 'application/json',
					json: {
						jsonrpc: '2.0',
						id: body.id,
						result: accountInfo({
							pubkey,
							upgradeAuthority: program.upgradeAuthority,
						}),
					},
				})
				return
			}

			unexpectedProviderRequests.push(`${request.method()} ${decodedUrl}`)
			await route.fulfill({
				body: 'Unexpected Solana program fixture request',
				status: 418,
			})
		})

		await page.goto(programPath, {
			waitUntil: 'domcontentloaded',
		})
		await expect(page.locator('#main')).toBeVisible()
		await expect.poll(
			() => requestedAccounts.filter((pubkey) => pubkey === programDataAddress).length,
			{
				timeout: 120_000,
			}
		).toBeGreaterThan(0)
		await expect(page.locator('#main').getByText('Program account', { exact: true })).toBeAttached()

		if (program.upgradeAuthority == null)
			await expect(page.locator('#main').getByText('Upgrade authority', { exact: true })).toHaveCount(0)
		else {
			await expect(page.locator('#main').getByText('Upgrade authority', { exact: true })).toBeAttached()
			await expect(page.locator(`#main a[href='/network/${network}/account/${program.upgradeAuthority}']`)).toBeAttached()
		}

		expect(unexpectedProviderRequests).toEqual([])
	})
}
