import { expect, test, type Page } from '@playwright/test'

import { networkBySlug } from '$/constants/Network.ts'
import { expectMainVisible } from '../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'

const networkPath = (slug: 'bitcoin' | 'solana') => {
	const { caip2 } = networkBySlug[slug]
	return `/network/${caip2.namespace}:${caip2.reference}`
}

const solanaBlockHeight = 1
const solanaTransactionId = 'solana-block-family-fixture-signature'
const solanaNetworkPath = networkPath('solana')
const solanaTransactionsPath = `${solanaNetworkPath}/block/${solanaBlockHeight}/transactions`
const solanaBlockPath = `${solanaNetworkPath}/block/${solanaBlockHeight}`
const solanaBlock = {
	blockHeight: 1,
	blockTime: 1_786_217_755,
	blockhash: 'solana-block-family-fixture-hash',
	parentSlot: 0,
	previousBlockhash: 'solana-block-family-fixture-parent',
	transactions: [{
		transaction: {
			signatures: [solanaTransactionId],
			message: {
				accountKeys: [{
					pubkey: '11111111111111111111111111111111',
					signer: true,
					writable: true,
				}],
				instructions: [{
					programId: '11111111111111111111111111111111',
				}],
			},
		},
		meta: {
			err: null,
			fee: 5_000,
		},
	}],
}

const utxoBlockHeight = 961_632
const utxoBlockHash = 'a'.repeat(64)
const utxoTransactionId = 'b'.repeat(64)
const utxoNetworkPath = networkPath('bitcoin')
const utxoTransactionsPath = `${utxoNetworkPath}/block/${utxoBlockHeight}/transactions`
const utxoBlockPath = `${utxoNetworkPath}/block/${utxoBlockHeight}`
const utxoBlock = {
	id: utxoBlockHash,
	height: utxoBlockHeight,
	version: 536_870_912,
	timestamp: 1_786_217_755,
	tx_count: 1,
	size: 1_000,
	weight: 4_000,
	merkle_root: 'c'.repeat(64),
	previousblockhash: 'd'.repeat(64),
	mediantime: 1_786_217_700,
	nonce: 1,
	bits: 386_000_000,
	difficulty: 127_479_855_693_691.4,
}
const utxoTransaction = {
	txid: utxoTransactionId,
	version: 2,
	locktime: 0,
	size: 220,
	weight: 640,
	fee: 1_200,
	status: {
		confirmed: true,
		block_height: utxoBlockHeight,
		block_hash: utxoBlockHash,
		block_time: utxoBlock.timestamp,
	},
	vin: [{
		coinbase: 'block-family-fixture',
		sequence: 0xffffffff,
	}],
	vout: [{
		scriptpubkey: '0014deadbeef',
		scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 deadbeef',
		scriptpubkey_type: 'v0_p2wpkh',
		value: 50_000,
	}],
}
test.setTimeout(180_000)

const assertTransactionCollection = async (
	page: Page,
	pathname: string,
	parentPathname: string,
	transactionPath: string
) => {
	await expectMainVisible(page)
	await expect(page).toHaveURL((url) => url.pathname === pathname && url.search === '' && url.hash === '')
	const transactions = page.locator('#transactions')
	await expect(transactions.locator(`a[href="${transactionPath}"]`)).toBeAttached({
		timeout: 120_000,
	})
	await expect(transactions.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(transactions.locator('[data-resource-state="failed"]')).toHaveCount(0)
	await expect(page.locator(`a[href="${parentPathname}"]`)).toBeAttached()
}

test('Solana block transactions use the Solana collection and keep block identity', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		let providerUrl: URL
		try {
			providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
		} catch {
			await route.abort('failed')
			return
		}

		if (providerUrl.origin !== 'https://solana-rpc.publicnode.com') {
			await route.abort('failed')
			return
		}

		let request: { id?: number; method?: string }
		try {
			request = JSON.parse(route.request().postData() ?? '{}')
		} catch {
			await route.abort('failed')
			return
		}
		if (request.method !== 'getBlock') {
			await route.abort('failed')
			return
		}
		await route.fulfill({
			json: {
				jsonrpc: '2.0',
				id: request.id ?? 1,
				result: solanaBlock,
			},
		})
	})

	await page.goto(solanaTransactionsPath, { waitUntil: 'load' })
	await assertTransactionCollection(
		page,
		solanaTransactionsPath,
		solanaBlockPath,
		`${solanaNetworkPath}/tx/${solanaTransactionId}`
	)
})

test('Bitcoin block transactions use the UTXO collection and keep block identity', async ({ page }) => {
	const providerUrls = [
		'https://mempool.space/api/**',
		'https://blockstream.info/api/**',
	]
	for (const providerUrl of providerUrls)
		await page.route(providerUrl, async (route) => {
			const pathname = new URL(route.request().url()).pathname
			if (pathname.endsWith(`/block-height/${utxoBlockHeight}`)) {
				await route.fulfill({ json: utxoBlockHash })
				return
			}
			if (pathname.endsWith(`/block/${utxoBlockHash}`)) {
				await route.fulfill({ json: utxoBlock })
				return
			}
			if (pathname.endsWith(`/block/${utxoBlockHash}/txs/0`)) {
				await route.fulfill({ json: [utxoTransaction] })
				return
			}
			await route.abort('failed')
		})

	await page.goto(utxoTransactionsPath, { waitUntil: 'load' })
	await assertTransactionCollection(
		page,
		utxoTransactionsPath,
		utxoBlockPath,
		`${utxoNetworkPath}/tx/${utxoTransactionId}`
	)
})
