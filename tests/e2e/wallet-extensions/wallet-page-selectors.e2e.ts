import {
	readdirSync,
} from 'node:fs'
import {
	dirname,
	join,
} from 'node:path'
import {
	fileURLToPath,
} from 'node:url'

import {
	expect,
	test,
} from '@playwright/test'

import {
	connectWalletButton,
	connectWalletButtonById,
	connectWalletButtonForDriver,
	disconnectWalletButton,
	messageToSignInput,
	retryConnectionButton,
	selectedWalletAccount,
	selectedWalletAccountLabel,
	signMessageButton,
	walletCandidateCard,
	walletConnectNameByDriver,
	walletConnectionCard,
	walletConnectionsStatus,
	walletConnectionsStatusById,
	walletRequestHistory,
	waitForWalletPageReady,
} from './_walletPageSelectors.ts'


test('maps PascalCase driver folders to product Connect names', () => {
	const driverFolders = readdirSync(join(dirname(fileURLToPath(import.meta.url)), '../../../scripts/wallet-extensions'), {
		withFileTypes: true,
	})
		.filter((entry) => (
			entry.isDirectory()
			&& /^[A-Z]/.test(entry.name)
		))
		.map((entry) => entry.name)
		.sort()

	expect(Object.keys(walletConnectNameByDriver).sort()).toEqual(driverFolders)
})

test('locates wallet page controls by product semantics', async ({ page }) => {
	await page.setContent(`
		<article id="wallet-connections" aria-labelledby="wallet-connections-heading">
			<header>
				<h2 id="wallet-connections-heading">Wallet connection status</h2>
			</header>
			<output>Wallet discovery active. Active connections: 1. Saved connections: 1. Providers detected: 2.</output>
		</article>
		<article data-card data-scroll-container data-wallet-name="UniSat" data-wallet-state="connection">
			<a href="/~/wallets/connections/unisat:1">UniSat</a>
			<fieldset>
				<legend>Active account and network</legend>
				<label><input data-wallet-action="select-account" name="account" type="radio">bc1qfirst</label>
				<label><input checked data-wallet-action="select-account" name="account" type="radio">bc1qselected</label>
			</fieldset>
			<button data-wallet-action="disconnect" type="button">Disconnect from Blockhead</button>
			<label for="message">Message to sign</label>
			<form data-wallet-action="sign-message">
				<input id="message" name="message" />
				<button data-wallet-action="sign-message" type="submit">Sign message</button>
			</form>
		</article>
		<article data-wallet-name="Petra" data-wallet-state="candidate">
			<a href="/~/wallets/petra">Petra</a>
			<button data-wallet-action="connect" type="button">Connect Petra</button>
		</article>
		<article data-wallet-name="Argent X" data-wallet-state="candidate">
			<a href="/~/wallets/argent-x">Argent X</a>
			<button data-wallet-action="connect" type="button">Connect Argent X</button>
		</article>
		<article data-wallet-id="polkadot:polkadot-js" data-wallet-name="polkadot-js" data-wallet-state="candidate">
			<a href="/~/wallets/polkadot-js">polkadot-js</a>
			<button data-wallet-action="connect" type="button">Connect polkadot-js</button>
		</article>
		<article>
			<a href="/~/wallets/connections/lace:1">Lace</a>
			<button data-wallet-action="retry" type="button">Retry connection</button>
		</article>
		<section id="wallet-connections-requests">
			<h2>Wallet request history</h2>
		</section>
	`)

	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	await expect(await waitForWalletPageReady(page)).toContainText('Providers detected: 2.')
	await expect(walletConnectionsStatusById(page)).toHaveAttribute('id', 'wallet-connections')
	await expect(connectWalletButton(page, 'Petra')).toBeVisible()
	await expect(connectWalletButtonForDriver(page, 'Petra')).toBeVisible()
	await expect(connectWalletButtonForDriver(page, 'ArgentX')).toBeVisible()
	await expect(connectWalletButtonForDriver(page, 'PolkadotJs')).toBeVisible()
	await expect(connectWalletButtonById(page, 'polkadot:polkadot-js')).toBeVisible()
	await expect(walletCandidateCard(page, 'Petra')).toContainText('Connect Petra')
	await expect(walletConnectionCard(page, 'UniSat')).toContainText('bc1qselected')
	await expect(selectedWalletAccount(walletConnectionCard(page, 'UniSat'))).toHaveAccessibleName('bc1qselected')
	await expect(selectedWalletAccountLabel(walletConnectionCard(page, 'UniSat'))).toContainText('bc1qselected')
	await expect(disconnectWalletButton(walletConnectionCard(page, 'UniSat'))).toBeVisible()
	await expect(messageToSignInput(walletConnectionCard(page, 'UniSat'))).toBeVisible()
	await expect(signMessageButton(walletConnectionCard(page, 'UniSat'))).toBeVisible()
	await expect(retryConnectionButton(page)).toBeVisible()
	await expect(walletRequestHistory(page)).toContainText('Wallet request history')
	expect(walletConnectNameByDriver.ArgentX).toBe('Argent X')
	expect(walletConnectNameByDriver.PolkadotJs).toBe('polkadot-js')
})
