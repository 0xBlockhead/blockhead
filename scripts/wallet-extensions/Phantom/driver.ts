import type { BrowserContext, Page } from '@playwright/test'
import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'

export const phantomSolanaMainnet = 'solana:mainnet' as const

/** Phantom approval surfaces stay within the loaded extension origin. */
export const isPhantomExtensionPageUrl = (url: string, extensionId: string) => {
	try {
		const parsed = new URL(url)
		return parsed.protocol === 'chrome-extension:'
			&& parsed.hostname === extensionId
			&& parsed.pathname.length > 1
	}
	catch {
		return false
	}
}
export type PhantomWalletStandardIdentity = {
	name: string
	icon: string
	chains: readonly string[]
	features: Readonly<Record<string, object>>
	accounts: readonly { address: string; chains: readonly string[]; features: readonly string[]; publicKey: Uint8Array }[]
}

export const isPhantomWalletStandardIdentity = (wallet: PhantomWalletStandardIdentity) => (
	wallet.name === 'Phantom' && wallet.icon.startsWith('data:image/') && wallet.chains.includes(phantomSolanaMainnet)
	&& Object.hasOwn(wallet.features, 'standard:connect') && Object.hasOwn(wallet.features, 'solana:signMessage')
	&& wallet.accounts.length > 0 && wallet.accounts.every((account) => account.address === base58.encode(account.publicKey)
		&& account.publicKey.byteLength === 32 && account.chains.includes(phantomSolanaMainnet) && account.features.includes('solana:signMessage'))
)

export const verifyPhantomSignMessageOutput = ({ accountAddress, message, outputs, wallet }: {
	accountAddress: string
	message: Uint8Array
	outputs: readonly { signature: Uint8Array }[]
	wallet: PhantomWalletStandardIdentity
}) => {
	if (!isPhantomWalletStandardIdentity(wallet)) throw new Error('Phantom Wallet Standard capability is unavailable')
	const account = wallet.accounts.find(({ address }) => address === accountAddress)
	if (!account) throw new Error('Phantom Wallet Standard account does not own the signing request')
	if (outputs.length !== 1 || !ed25519.verify(outputs[0].signature, message, account.publicKey))
		throw new Error('Phantom Wallet Standard signature does not bind the requested account and message')
	return outputs[0].signature
}

const approval = async (context: BrowserContext, extension: LoadedWalletExtension) => {
	const existing = context.pages().find((page) => isPhantomExtensionPageUrl(page.url(), extension.id))
	if (existing) return existing
	await context.waitForEvent('page', { predicate: (page) => isPhantomExtensionPageUrl(page.url(), extension.id), timeout: 30_000 })
	const page = context.pages().find((candidate) => isPhantomExtensionPageUrl(candidate.url(), extension.id))
	if (!page) throw new Error('Phantom approval page was not found')
	return page
}

export const phantomDriver = {
	kind: 'phantom',
	waitForMessageRequest: approval,
	approveMessage: async (page: Page) => { await page.getByRole('button', { name: /^(?:sign|approve)$/i }).click(); await page.waitForEvent('close').catch(() => undefined) },
} as const
