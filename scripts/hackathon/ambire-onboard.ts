import { mkdir, readFile, lstat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { chromium } from 'playwright'
import { expect } from '@playwright/test'
import { type } from 'arktype'
import * as Mnemonic from 'ox/Mnemonic'
import * as Address from 'ox/Address'
import { acquireWalletExtension } from '../wallet-extensions/acquire.mjs'
import descriptors from '../wallet-extensions/wallets.json' with { type: 'json' }
import { extensionIdForManifest } from '../wallet-extensions/WalletExtensionHarness.ts'


const readWallet = async () => {
	const { stdout } = await promisify(execFile)('/usr/bin/swift', [
		join(import.meta.dirname, 'ambire-keychain.swift'),
	], { timeout: 60_000 })
	const wallet = type({
		purpose: "'ETHOnline 2026 testnet only; never use with real assets'",
		mnemonic: 'string',
		password: 'string',
		derivationPath: 'string',
		address: 'string',
	}).assert(JSON.parse(stdout))
	if (
		!Mnemonic.validate(wallet.mnemonic, Mnemonic.english)
		|| Address.fromPublicKey(Mnemonic.toHdKey(wallet.mnemonic).derive(wallet.derivationPath).publicKey).toLowerCase() !== '0x87da912925adf173eaf333e309e9bfcd03ae0d9d'
		|| wallet.address.toLowerCase() !== '0x87da912925adf173eaf333e309e9bfcd03ae0d9d'
	)
		throw new Error('Keychain test wallet identity mismatch')

	return wallet
}


const run = async () => {
	if (process.argv.includes('--verify-recovery')) {
		await readWallet()
		console.log('Keychain recovery verified for the intended Ambire testnet address; no secrets printed.')
		return
	}

	console.log(JSON.stringify({ phase: 'artifact-preflight' }))
	const extension = await acquireWalletExtension('ambire', descriptors.ambire, {
		artifactRoot: join(homedir(), 'Developer/blockhead-2026-worktrees/feature/actions/.wallet-extensions/artifacts'),
	})
	const manifest = type({
		name: 'string',
		version: "'6.14.4'",
		manifest_version: '3',
		key: 'string',
		background: { service_worker: 'string' },
	}).assert(JSON.parse(await readFile(join(extension, 'manifest.json'), 'utf8')))
	const profile = join(homedir(), 'Developer/blockhead-2026-worktrees/.ethonline-2026-testnet-wallets/ambire-browser')
	await mkdir(profile, { recursive: true, mode: 0o700 })
	const info = await lstat(profile)
	if (!info.isDirectory() || info.isSymbolicLink() || (info.mode & 0o777) !== 0o700)
		throw new Error('Unsafe test wallet profile')

	console.log(JSON.stringify({ phase: 'browser-launch' }))
	const context = await chromium.launchPersistentContext(profile, {
		channel: 'chromium',
		headless: true,
		timeout: 30_000,
		args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
	}).catch((error: Error) => {
		// Launch happens before any secret entry. Preserve the actual launch failure.
		console.error(JSON.stringify({ phase: 'browser-launch-failed', message: error.message.slice(0, 5000) }))
		throw error
	})
	let phase = 'extension-navigation'
	context.on('page', (page) => page.on('crash', () => console.error(JSON.stringify({ phase: 'page-crashed' }))))
	context.on('close', () => console.log(JSON.stringify({ phase: 'context-closed' })))
	try {
		console.log(JSON.stringify({ phase: 'extension-navigation' }))
		// This task owns the disposable profile. Do not accumulate restored tabs
		// across bounded journeys or let their RPC work compete with this run.
		await Promise.all(context.pages().map((page) => page.close()))
		const page = await context.newPage()
		page.on('crash', () => console.error(JSON.stringify({ phase: 'page-crashed' })))
		await page.goto(`chrome-extension://${extensionIdForManifest(manifest, extension)}/tab.html`, { timeout: 30_000 })
		console.log(JSON.stringify({ phase: 'extension-document-loaded' }))
		if (process.argv.includes('--inspect-restored')) {
			await page.locator('[data-testid]').first().waitFor()
			const wallet = await readWallet()
			await page.getByTestId('passphrase-field').fill(wallet.password)
			await page.getByTestId('button-unlock').click()
			await page.getByTestId('account-select-btn').waitFor()
			await page.getByTestId('dashboard-hamburger-btn').click()
			await page.getByText('Settings', { exact: true }).waitFor()
			await page.getByTestId('settings-nav-opt-outs').click()
			await page.getByText('Tokens, NFTs & DeFi positions auto discovery', { exact: true }).waitFor()
			const toggles = page.locator('label').filter({ has: page.locator('input[type="checkbox"]') })
			if (await toggles.count() !== 4)
				throw new Error('Unexpected privacy control denominator')

			for (const toggle of await toggles.all()) {
				if (await toggle.locator('input').isChecked())
					await toggle.click()
				await toggle.locator('input:not(:checked)').waitFor({ state: 'attached' })
			}
			console.log(JSON.stringify({ phase: 'privacy-disabled', controls: 4 }))
			await page.getByTestId('settings-nav-accounts').click()
			await page.getByTestId('account').first().waitFor()
			console.log(JSON.stringify({ phase: 'restored-controls', controls: await page.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))) }))
			console.log(JSON.stringify({ phase: 'dashboard-menu', text: (await page.locator('body').innerText()).slice(-4000) }))
			await expect(page.getByTestId('address')).toContainText(/0x87DA9.*AE0D9D/i)
			if (process.argv.includes('--inspect-networks')) {
				await page.getByTestId('settings-nav-networks').click()
				await page.getByText('Ethereum Sepolia', { exact: true }).click()
				if (process.argv.includes('--enable-sepolia')) {
					await expect(page.getByText('11155111', { exact: true })).toBeVisible()
					await expect(page.getByTestId('disable-network-btn')).toHaveText('Enable')
					await page.getByTestId('disable-network-btn').click()
					await expect(page.getByTestId('disable-network-btn')).toHaveText('Disable')
				}
				console.log(JSON.stringify({ phase: 'network-settings', text: await page.locator('body').innerText(), controls: await page.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))) }))
				return
			}
			if (process.argv.includes('--connect')) {
				phase = 'blockhead-wallet-mount'
				const app = await context.newPage()
				await app.goto('http://127.0.0.1:5296/~/wallets')
				await expect(app.locator('#layout')).toHaveAttribute('data-persistence-phase', 'owner', { timeout: 120_000 })
				const connect = app.locator('[data-wallet-name="Ambire"][data-wallet-state="candidate"] [data-wallet-action="connect"]')
				await connect.waitFor({ timeout: 120_000 })
				await connect.click()
				phase = 'connection-consent'
				const requestUrl = `chrome-extension://${extensionIdForManifest(manifest, extension)}/request-window.html`
				const connection = app.locator('[data-wallet-name="Ambire"][data-connection-status="connected"]')
				await expect.poll(async () => await connection.isVisible() || context.pages().some((page) => page.url().split('#')[0] === requestUrl)).toBe(true)
				const request = context.pages().find((page) => page.url().split('#')[0] === requestUrl)
				if (request) {
				await request.getByTestId('dapp-connect-button').waitFor()
				console.log(JSON.stringify({ phase: 'connection-review', text: (await request.locator('body').innerText()).slice(0, 3000) }))
				await expect(request.getByText('127.0.0.1', { exact: true })).toBeVisible()
				await expect(request.getByText('Passed', { exact: true })).toBeVisible()
				await request.getByTestId('dapp-connect-button').click()
				}
				await connection.waitFor({ timeout: 60_000 })
				await connection.getByRole('radio').check()
				await expect(connection).toContainText('0x87da912925adf173eaf333e309e9bfcd03ae0d9d')
				if (process.argv.includes('--transaction-probe')) {
					phase = 'transaction-network-selection'
					await connection.getByText('Send a transaction', { exact: true }).click()
					await connection.getByRole('textbox', { name: 'EVM chain ID', exact: true }).fill('11155111')
					await connection.getByRole('button', { name: 'Switch wallet network', exact: true }).click()
					await expect.poll(async () => await connection.getByText('eip155:11155111', { exact: true }).isVisible() || context.pages().some((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl), { timeout: 30_000 }).toBe(true)
					const networkRequest = context.pages().find((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl)
					if (networkRequest) {
						console.log(JSON.stringify({ phase: 'network-request-inspection', text: (await networkRequest.locator('body').innerText()).slice(0, 5000), controls: await networkRequest.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))) }))
						return
					}
					await expect(connection.getByText('eip155:11155111', { exact: true })).toBeVisible()
					if (!await connection.getByRole('textbox', { name: 'Recipient', exact: true }).isVisible())
						await connection.getByText('Send a transaction', { exact: true }).click()

					await connection.getByRole('textbox', { name: 'Recipient', exact: true }).fill('0x7883053bfc5bc3cab18c35452f5ea317c837fa60')
					await connection.getByRole('textbox', { name: 'Value in wei', exact: true }).fill('1000000000000000')
					await connection.getByRole('textbox', { name: 'Call data', exact: true }).fill('0x')
					await connection.getByRole('button', { name: 'Review transaction', exact: true }).click()
					await expect(connection).toContainText('1000000000000000 wei')
					phase = 'transaction-wallet-review'
					await connection.getByRole('button', { name: 'Confirm in wallet', exact: true }).click()
					await expect.poll(() => context.pages().some((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl), { timeout: 30_000 }).toBe(true)
					const signing = context.pages().find((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl)
					if (!signing)
						throw new Error('Missing transaction review window')

					await signing.locator('[data-testid]').first().waitFor()
					console.log(JSON.stringify({ phase: 'transaction-review-inspection', text: (await signing.locator('body').innerText()).slice(0, 7000), controls: await signing.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))) }))
					await expect(signing.getByTestId('recipient-address-0')).toContainText(/0x7883/i, { timeout: 60_000 })
					console.log(JSON.stringify({ phase: 'recipient-review-structure', text: await signing.getByTestId('recipient-address-0').innerText(), tooltips: await signing.getByTestId('recipient-address-0').locator('[data-tooltip]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-tooltip'))) }))
					if (process.argv.includes('--send-testnet')) {
						phase = 'transaction-authority-check'
						await expect(signing.getByTestId('address')).toContainText('0x87DA912925ADf173EAF333e309E9BfCD03AE0D9D')
						await expect(signing.locator('body')).toContainText(/on\s+Ethereum Sepolia/)
						phase = 'transaction-recipient-check'
						await signing.getByTestId('recipient-address-0').getByText('0x7883...FA60', { exact: true }).click()
						console.log(JSON.stringify({ phase: 'recipient-details', text: await signing.locator('body').innerText() }))
						await expect.poll(() => context.pages().some((page) => {
							const url = new URL(page.url())
							return url.hostname === 'sepolia.etherscan.io'
								&& url.pathname.toLowerCase() === '/address/0x7883053bfc5bc3cab18c35452f5ea317c837fa60'
						}), { timeout: 30_000 }).toBe(true)
						const evidence = join(process.cwd(), 'research/ethonline-2026/evidence', `ambire-transaction-${Date.now()}`)
						await mkdir(evidence, { recursive: true })
						await signing.screenshot({ path: join(evidence, 'wallet-review.png'), fullPage: true })
						await writeFile(join(profile, '..', 'ambire-funded-transfer-attempt.json'), JSON.stringify({
							chainId: 11155111,
							from: wallet.address,
							to: '0x7883053bfc5bc3cab18c35452f5ea317c837fa60',
							value: '1000000000000000',
							evidence,
							state: 'approval-about-to-be-dispatched; reconcile before retry',
						}) + '\n', { flag: 'wx', mode: 0o600 })
						phase = 'transaction-sign-once'
						await signing.getByTestId('transaction-button-sign').click()
						await expect(app.getByText('Transaction submitted; confirmation is pending.', { exact: false })).toBeVisible({ timeout: 120_000 })
						await app.getByRole('link', { name: 'View transaction history', exact: true }).click()
						await expect(app.getByRole('main')).toContainText('0x87da912925adf173eaf333e309e9bfcd03ae0d9d', { timeout: 60_000 })
						await writeFile(join(evidence, 'native-history.json'), JSON.stringify({ url: app.url(), text: await app.getByRole('main').innerText() }, null, 2) + '\n')
						await app.screenshot({ path: join(evidence, 'native-history.png'), fullPage: true })
						console.log(JSON.stringify({ phase: 'transaction-submitted-history', evidence }))
					}
					return
				}
				console.log(JSON.stringify({ phase: 'ambire-connected', text: (await connection.innerText()).slice(0, 2000) }))
				await connection.getByRole('textbox', { name: 'Message to sign' }).fill('Blockhead ETHOnline 2026: inspect, authorize, verify.')
				const historyLinks = app.locator('a[href*="/~/wallets/requests/wallet-request-"]')
				await expect.poll(async () => {
					const count = (await app.locator('body').innerText()).match(/Wallet request history \((\d+)\)/)?.[1]
					return count !== undefined && new Set(await historyLinks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))).size === Number(count)
				}, { timeout: 60_000 }).toBe(true)
				const previousRequests = new Set(await historyLinks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))))
				phase = 'signing-window'
				await connection.getByRole('button', { name: 'Sign message', exact: true }).click()
				await expect.poll(() => context.pages().some((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl), { timeout: 30_000 }).toBe(true)
				const signing = context.pages().find((page) => !page.isClosed() && page.url().split('#')[0] === requestUrl)
				if (!signing)
					throw new Error('Missing wallet-owned signing window')
				await signing.locator('[data-testid]').first().waitFor()
				console.log(JSON.stringify({ phase: 'signing-review', text: (await signing.locator('body').innerText()).slice(0, 3000), controls: await signing.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))) }))
				await expect(signing.getByTestId('address')).toContainText('0x87DA912925ADf173EAF333e309E9BfCD03AE0D9D')
				await expect.poll(async () => (await signing.locator('body').innerText()).replace(/\s+/g, ' ')).toContain('Blockhead ETHOnline 2026: inspect, authorize, verify.')
				phase = 'signing-approval'
				const evidence = join(process.cwd(), 'research/ethonline-2026/evidence', `ambire-signer-${Date.now()}`)
				await mkdir(evidence, { recursive: true })
				await signing.screenshot({ path: join(evidence, 'ambire-message-review.png'), fullPage: true })
				await signing.getByTestId('button-sign').click()
				await expect(app.getByText(/Message signed by .*Authority and dispatch history were saved\./)).toBeVisible({ timeout: 60_000 })
				console.log(JSON.stringify({ phase: 'ambire-message-signed' }))
				const newRequestLinks = async () => [...new Set((await historyLinks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))).filter((href) => href !== null && !previousRequests.has(href)))]
				await expect.poll(async () => (await newRequestLinks()).length, { timeout: 30_000 }).toBe(1)
				const newRequests = await newRequestLinks()
				expect(newRequests).toHaveLength(1)
				const href = newRequests[0]
				if (!href)
					throw new Error('Missing signed request destination')

				phase = 'signed-history-reload'
				await app.goto(new URL(href, app.url()).href, { timeout: 60_000 })
				const signed = app.getByRole('main').getByRole('link', { name: 'signed', exact: true })
				await expect(signed).toBeVisible({ timeout: 60_000 })
				const signedHref = await signed.getAttribute('href')
				expect(signedHref).toContain(`${href}/observations/`)
				await app.reload()
				await expect(signed).toHaveAttribute('href', signedHref ?? '', { timeout: 60_000 })
				await expect(app.getByRole('main')).toContainText(/0x87da912925adf173eaf333e309e9bfcd03ae0d9d/i)
				await app.screenshot({ path: join(evidence, 'ambire-signed-history-restored.png'), fullPage: true })
				await writeFile(join(evidence, 'result.json'), JSON.stringify({ version: manifest.version, address: '0x87da912925adf173eaf333e309e9bfcd03ae0d9d', href, signedHref, restored: true, fundedTransaction: false }, null, 2) + '\n')
				console.log(JSON.stringify({ phase: 'ambire-signed-history-restored', evidence }))
			}
			return
		}
		phase = 'onboarding-mount'
		await page.getByText('Create new account', { exact: true }).waitFor({ timeout: 30_000 })
		console.log(JSON.stringify({ phase: 'onboarding-mounted' }))
		await page.getByText('Customize', { exact: true }).click()
		await page.getByText('Privacy Opt-outs configuration', { exact: true }).click()
		phase = 'privacy-opt-out'
		console.log(JSON.stringify({ phase: 'privacy-mounted' }))
		// Ambire's pinned Toggle renders a hidden input inside its native clickable label.
		if (await page.locator('input[type="checkbox"]').isChecked())
			await page.locator('label').filter({ has: page.locator('input[type="checkbox"]') }).click()

		await page.locator('input[type="checkbox"]:not(:checked)').waitFor({ state: 'attached' })
		if (await page.locator('input[type="checkbox"]').isChecked())
			throw new Error('Privacy opt-out did not persist')

		await page.getByText('Confirm and go back', { exact: true }).click()
		console.log(JSON.stringify({ phase: 'third-party-discovery-disabled' }))
		if (process.argv.includes('--privacy')) {
			await page.getByText('Customize', { exact: true }).click()
			await page.getByText('Privacy Opt-outs configuration', { exact: true }).click()
			console.log(JSON.stringify({
				phase: 'privacy-controls',
				text: (await page.locator('body').innerText()).slice(0, 3000),
				controls: await page.locator('[role], input, [data-testid]').evaluateAll((nodes) => nodes.map((node) => ({
					role: node.getAttribute('role'),
					type: node.getAttribute('type'),
					isChecked: node.matches(':checked'),
					testId: node.getAttribute('data-testid'),
					checked: node.getAttribute('aria-checked'),
				}))),
			}))
			return
		}
		// No secret has been entered at this checkpoint. No video, trace or screenshots are enabled.
		console.log(JSON.stringify({
			phase: 'onboarding-start',
			version: manifest.version,
			// This checkpoint precedes account creation or secret entry.
			onboardingText: (await page.locator('body').innerText()).slice(0, 2000),
			controls: (await page.locator('button, [role="button"]').allTextContents()).map((text) => text.trim()).filter(Boolean),
		}))
		await page.getByText('Import existing account', { exact: true }).click()
		console.log(JSON.stringify({
			phase: 'import-options',
			text: (await page.locator('body').innerText()).slice(0, 2000),
		}))
		await page.getByText('Private key', { exact: true }).click()
		console.log(JSON.stringify({
			phase: 'private-key-form',
			text: (await page.locator('body').innerText()).slice(0, 2000),
			inputs: await page.locator('input').evaluateAll((inputs) => inputs.map((input) => ({
				type: input.getAttribute('type'),
				testId: input.getAttribute('data-testid'),
			}))),
		}))
		if (!process.argv.includes('--import'))
			return

		const wallet = await readWallet()
		const key = Mnemonic.toHdKey(wallet.mnemonic).derive(wallet.derivationPath)
		if (Address.fromPublicKey(key.publicKey).toLowerCase() !== wallet.address.toLowerCase() || !key.privateKey)
			throw new Error('Test wallet identity mismatch')

		await page.getByTestId('enter-private-key-field').fill(key.privateKey)
		await page.getByTestId('backup-warning-checkbox').click()
		await page.getByTestId('import-button').click()
		phase = 'vault-creation'
		console.log(JSON.stringify({ phase: 'private-key-import-confirmed' }))
		await page.getByTestId('enter-pass-field').fill(wallet.password)
		await page.getByTestId('repeat-pass-field').fill(wallet.password)
		await page.getByText('Passwords match', { exact: true }).waitFor()
		// The pinned setup defaults this acknowledgement on; its native check icon owns the state.
		if (await page.getByTestId('keystore-setup-checkbox').locator('svg').count() === 0)
			await page.getByTestId('keystore-setup-checkbox').click()
		await page.locator('[data-testid="create-keystore-pass-btn"]:not([aria-disabled="true"])').waitFor()
		console.log(JSON.stringify({ phase: 'vault-submit-control', control: await page.getByTestId('create-keystore-pass-btn').evaluate((node) => ({ text: node.textContent, disabled: node.getAttribute('aria-disabled'), role: node.getAttribute('role') })) }))
		await page.getByTestId('create-keystore-pass-btn').click()
		phase = 'account-completion'
		console.log(JSON.stringify({ phase: 'test-vault-creation-requested' }))
		await page.getByTestId('wallet-ready-to-use-text').waitFor()
		await page.getByTestId('onboarding-completed-open-dashboard-btn').click()
		console.log(JSON.stringify({ phase: 'dashboard-opened', address: wallet.address }))
	} catch (error) {
		console.error(JSON.stringify({
			phase,
			errorClass: error instanceof Error ? error.name : 'Unclassified',
			errorMessage: phase.startsWith('transaction-') && error instanceof Error ? error.message.slice(0, 4000) : undefined,
			controls: await Promise.all(context.pages().map(async (page) => ({
				testIds: await page.locator('[data-testid]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-testid'))).catch(() => []),
				vaultButton: await page.getByTestId('create-keystore-pass-btn').evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent, disabled: node.getAttribute('aria-disabled') }))).catch(() => []),
				appStatus: page.url().startsWith('http://127.0.0.1:5296/') ? (await page.locator('body').innerText().catch(() => 'unavailable')).slice(0, 10000) : undefined,
			}))),
		}))
		process.exitCode = 1
	} finally {
		console.log(JSON.stringify({ phase: 'browser-close' }))
		await context.close()
		console.log(JSON.stringify({ phase: 'browser-closed' }))
	}
}

await run().catch(() => {
	// Playwright errors can include entered values. Never print them during wallet onboarding.
	console.error('Ambire onboarding did not complete; no secret values were logged.')
	process.exitCode = 1
})
