import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'
import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


const backpackBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Backpack recover has no safe fixture material in unattended automation'
	:
		'Backpack lifecycle automation is blocked'
)

export const backpackBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: backpackBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Backpack Connect chrome surfaces as popup.html. */
export const isBackpackPopupPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/popup.html')
)

export type BackpackRequestKind = 'connect' | 'message' | 'transaction' | 'send'

export type BackpackWalletStandardIdentity = {
	accounts: readonly {
		address: string
		chains: readonly string[]
		features: readonly string[]
		publicKey: Uint8Array
	}[]
	chains: readonly string[]
	features: Readonly<Record<string, object>>
	icon: string
	name: string
}

export const backpackSolanaMainnet = 'solana:mainnet' as const

export const isBackpackWalletStandardIdentity = (
	wallet: BackpackWalletStandardIdentity
) => (
	wallet.name === 'Backpack'
	&& wallet.icon.startsWith('data:image/')
	&& wallet.chains.some((chain) => chain.startsWith('solana:'))
	&& Object.hasOwn(wallet.features, 'standard:connect')
	&& Object.hasOwn(wallet.features, 'standard:events')
	&& Object.hasOwn(wallet.features, 'solana:signMessage')
	&& wallet.accounts.length > 0
	&& wallet.accounts.every((account) => (
		account.address.length > 0
		&& account.publicKey.byteLength === 32
		&& account.address === base58.encode(account.publicKey)
		&& account.chains.some((chain) => chain.startsWith('solana:'))
		&& account.features.includes('solana:signMessage')
	))
)

export const backpackSignMessageInput = (
	wallet: BackpackWalletStandardIdentity,
	accountAddress: string,
	message: Uint8Array,
	network: typeof backpackSolanaMainnet
) => {
	if (!isBackpackWalletStandardIdentity(wallet))
		throw new Error('Backpack Wallet Standard capability is unavailable')
	const account = wallet.accounts.find(({ address }) => address === accountAddress)
	if (!account)
		throw new Error('Backpack Wallet Standard account does not own the signing request')
	if (!wallet.chains.includes(network) || !account.chains.includes(network))
		throw new Error('Backpack Wallet Standard account does not support the requested Solana network')
	if (message.byteLength === 0)
		throw new Error('Backpack Wallet Standard signMessage request must not be empty')

	return {
		account,
		message,
		network,
	}
}

export const verifyBackpackSignMessageOutput = ({
	accountAddress,
	message,
	network,
	outputs,
	wallet,
}: {
	accountAddress: string
	message: Uint8Array
	network: typeof backpackSolanaMainnet
	outputs: readonly { signature: Uint8Array }[]
	wallet: BackpackWalletStandardIdentity
}) => {
	const { account } = backpackSignMessageInput(wallet, accountAddress, message, network)
	if (outputs.length !== 1)
		throw new Error('Backpack Wallet Standard signMessage must return one output for one request')
	const [output] = outputs
	if (!ed25519.verify(output.signature, message, account.publicKey))
		throw new Error('Backpack Wallet Standard signature does not bind the requested account and message')

	return output.signature
}

type BackpackRequestSurface = {
	accountAddress: string
	buttonNames: readonly string[]
	extensionId: string
	headingNames: readonly string[]
	intendedProvider: string
	kind: BackpackRequestKind
	url: string
	visibleText: string
}

const normalizedIdentity = (value: string) => value.trim().toLowerCase()

const providerIdentity = (provider: string) => {
	try {
		return new URL(provider).hostname.toLowerCase()
	}
	catch {
		return normalizedIdentity(provider)
	}
}

const ownsIdentity = (
	visibleText: string,
	accountAddress: string,
	intendedProvider: string
) => {
	const text = normalizedIdentity(visibleText)
	const account = normalizedIdentity(accountAddress)
	const compactAccount = account.length >= 12 ?
		`${account.slice(0, 4)}…${account.slice(-4)}`
	:
		account
	const provider = providerIdentity(intendedProvider)

	return {
		accountMatched: account.length > 0 && (
			text.includes(account)
			|| text.includes(compactAccount)
			|| text.includes(compactAccount.replace('…', '...'))
		),
		providerMatched: provider.length > 0 && text.includes(provider),
	}
}

export const classifyBackpackRequestSurface = ({
	accountAddress,
	buttonNames,
	extensionId,
	headingNames,
	intendedProvider,
	kind,
	url,
	visibleText,
}: BackpackRequestSurface) => {
	const identity = ownsIdentity(visibleText, accountAddress, intendedProvider)
	if (!isBackpackPopupPageUrl(url, extensionId))
		return { ...identity, ownsRequest: false }

	const buttons = buttonNames.map((name) => name.trim())
	const headings = headingNames.join(' ')
	const canDecline = buttons.some((name) => /^(?:cancel|deny|reject)$/i.test(name))
	const phase = kind === 'connect' ?
		{
			canApprove: buttons.some((name) => /^(?:approve|connect)$/i.test(name)),
			headingMatched: /\bconnect\b/i.test(headings),
		}
	: kind === 'message' ?
		{
			canApprove: buttons.some((name) => /^(?:approve|sign|sign message)$/i.test(name)),
			headingMatched: /\b(?:sign|approve)\b.*\bmessage\b|\bmessage\b.*\b(?:sign|approve)\b/i.test(headings),
		}
	: kind === 'transaction' ?
		{
			canApprove: buttons.some((name) => /^(?:approve|sign|sign transaction)$/i.test(name)),
			headingMatched: /\bsign\b.*\btransaction\b|\btransaction\b.*\bsign\b/i.test(headings),
		}
	:
		{
			canApprove: buttons.some((name) => /^(?:approve|confirm|send)$/i.test(name)),
			headingMatched: /\b(?:approve|confirm|send)\b.*\btransaction\b|\btransaction\b.*\b(?:approve|confirm|send)\b/i.test(headings),
		}

	return {
		...identity,
		ownsRequest: identity.accountMatched
			&& identity.providerMatched
			&& canDecline
			&& phase.canApprove
			&& phase.headingMatched,
	}
}

export const backpackRequestDiagnostic = ({
	classification,
	snapshot,
	url,
}: {
	classification: ReturnType<typeof classifyBackpackRequestSurface>
	snapshot: Pick<BackpackRequestSurface, 'buttonNames' | 'headingNames'>
	url: string
}) => ({
	accountMatched: classification.accountMatched,
	buttonNames: snapshot.buttonNames,
	headingNames: snapshot.headingNames,
	providerMatched: classification.providerMatched,
	url,
})

const requestSnapshot = async (page: Page) => ({
	buttonNames: await page.getByRole('button').allTextContents(),
	headingNames: await page.getByRole('heading').allTextContents(),
	visibleText: await page.locator('body').innerText(),
})

const waitForBackpackRequest = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	request: Pick<BackpackRequestSurface, 'accountAddress' | 'intendedProvider' | 'kind'>
) => {
	const deadline = Date.now() + 30_000
	let diagnostics: ReturnType<typeof backpackRequestDiagnostic>[] = []

	while (Date.now() < deadline) {
		const pages = context.pages().filter((page) => (
			page.url().startsWith(`chrome-extension://${extension.id}/`)
		))
		const snapshots = await Promise.all(pages.map(requestSnapshot))
		const classifications = snapshots.map((snapshot, index) => classifyBackpackRequestSurface({
			...request,
			...snapshot,
			extensionId: extension.id,
			url: pages[index]?.url() ?? '',
		}))
		const requestIndex = classifications.findIndex(({ ownsRequest }) => ownsRequest)
		if (requestIndex >= 0) {
			const page = pages[requestIndex]
			await page.waitForLoadState('domcontentloaded')
			return page
		}
		diagnostics = snapshots.map((snapshot, index) => backpackRequestDiagnostic({
			classification: classifications[index] ?? {
				accountMatched: false,
				ownsRequest: false,
				providerMatched: false,
			},
			snapshot,
			url: pages[index]?.url() ?? '',
		}))
		await new Promise((resolve) => setTimeout(resolve, 100))
	}

	throw new Error(`Backpack ${request.kind} request surface did not appear: ${JSON.stringify(diagnostics)}`)
}

const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const encodeBase58 = (bytes: Uint8Array) => {
	const digits = [
		0,
	]
	for (const byte of bytes) {
		let carry = byte
		for (let index = 0; index < digits.length; index++) {
			const digit = digits[index] ?? 0
			carry += digit << 8
			digits[index] = carry % 58
			carry = (carry / 58) | 0
		}
		while (carry > 0) {
			digits.push(carry % 58)
			carry = (carry / 58) | 0
		}
	}

	let leadingZeros = 0
	for (const byte of bytes) {
		if (byte !== 0)
			break
		leadingZeros += 1
	}

	return (
		'1'.repeat(leadingZeros)
		+ [...digits]
			.reverse()
			.map((digit) => base58Alphabet[digit] ?? '')
			.join('')
	)
}

export const createEphemeralSolanaAddress = () => (
	encodeBase58(randomBytes(32))
)

const extensionPage = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	path: string
) => (
	context.newPage().then(async (page) => {
		await page.goto(`chrome-extension://${extension.id}/${path}`)
		return page
	})
)

const clickByTestIdOrText = async (
	page: Page,
	testId: string,
	name: string | RegExp
) => {
	const byTestId = page.getByTestId(testId)
	if (await byTestId.count() > 0) {
		await byTestId.first().click()
		return
	}

	await page.getByText(name, {
		exact: !(name instanceof RegExp),
	}).first().click()
}

export const backpackDriver = {
	kind: 'backpack',
	open: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	): Promise<Page> => (
		extensionPage(context, extension, 'onboarding.html')
	),
	openPopup: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	): Promise<Page> => (
		extensionPage(context, extension, 'popup.html')
	),
	onboardSolana: async (page: Page, password: string) => {
		await expect(page.getByTestId('create-wallet-button').or(page.getByText('Create a new wallet', {
			exact: true,
		})).first()).toBeVisible({
			timeout: 30_000,
		})
		await clickByTestIdOrText(page, 'create-wallet-button', 'Create a new wallet')
		const touchable = page.getByRole('button', {
			name: 'Touchable',
			exact: true,
		})
		if (await touchable.count() > 0)
			await touchable.click({
				position: {
					x: 12,
					y: 12,
				},
			})
		if (await page.getByText('Create a new wallet', {
			exact: true,
		}).count() > 0)
			await page.getByText('Create a new wallet', {
				exact: true,
			}).click()
		await page.getByText('Solana', {
			exact: true,
		}).click()
		await page.getByRole('button', {
			name: 'Set up wallet',
			exact: true,
		}).or(page.getByTestId('set-up-networks-button')).first().click()
		const passwordInputs = page.locator('input[type="password"]').or(page.getByRole('textbox'))
		await passwordInputs.nth(0).fill(password)
		await passwordInputs.nth(1).fill(password)
		await page.getByRole('button', {
			name: 'Next',
			exact: true,
		}).or(page.getByTestId('password-next-button')).first().click()
		const completion = page.getByTestId('open-wallet-button')
			.or(page.getByText('Open Backpack', {
				exact: true,
			}))
			.or(page.getByText("You're all good!", {
				exact: true,
			}))
			.or(page.getByText('Done', {
				exact: true,
			}))
		await expect(completion.first()).toBeVisible({
			timeout: 30_000,
		})
	},
	createDerivedSolanaAccount: async (page: Page, ordinal: 2 | 3) => {
		await page.getByText(`Wallet ${ordinal - 1}`, {
			exact: true,
		}).click()
		await page.getByText('Add new Solana wallet', {
			exact: true,
		}).or(page.getByText('Add wallet', {
			exact: true,
		})).first().click()
		await clickByTestIdOrText(page, 'create-wallet-button', 'Create new wallet')
		await expect(page.getByText(`Wallet ${ordinal}`, {
			exact: true,
		})).toBeVisible()
	},
	importViewOnlySolanaAccount: async (
		page: Page,
		address = createEphemeralSolanaAddress()
	) => {
		const viewOnlyImport = page.getByTestId('view-only-importing-button')
		const walletPicker = page.getByTestId('wallets-button').or(page.getByText('Wallet 1', {
			exact: true,
		}))
		await expect(walletPicker.first()).toBeVisible({
			timeout: 15_000,
		})
		await walletPicker.first().click()
		await expect(viewOnlyImport).toBeAttached({
			timeout: 15_000,
		}).catch((error) => {
			throw new Error('Backpack wallet picker did not attach view-only-importing-button', {
				cause: error,
			})
		})
		const viewOnlyBox = await viewOnlyImport.first().boundingBox()
		if (viewOnlyBox == null)
			throw new Error('Backpack View-only wallet import row has no clickable box')

		await page.mouse.click(
			viewOnlyBox.x + viewOnlyBox.width / 2,
			viewOnlyBox.y + viewOnlyBox.height / 2
		)
		const publicKeyInput = page.getByTestId('public-key-input').or(page.getByPlaceholder('Public key'))
		await expect(publicKeyInput.first()).toBeVisible({
			timeout: 15_000,
		})
		await publicKeyInput.first().fill(address)
		await clickByTestIdOrText(page, 'public-key-import-button', /import|add|continue/i)
		await expect(page.getByText(address.slice(0, 4))).toBeVisible({
			timeout: 30_000,
		})
		return address
	},
	waitForApproval: async (
		_context?: BrowserContext,
		_extension?: LoadedWalletExtension
	): Promise<Page> => {
		throw new Error('Backpack generic approval waiting is unsupported; use a phase- and identity-bound request hook')
	},
	waitForConnectionRequest: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		request: Pick<BackpackRequestSurface, 'accountAddress' | 'intendedProvider'>
	) => waitForBackpackRequest(context, extension, { ...request, kind: 'connect' }),
	waitForMessageRequest: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		request: Pick<BackpackRequestSurface, 'accountAddress' | 'intendedProvider'>
	) => waitForBackpackRequest(context, extension, { ...request, kind: 'message' }),
	waitForTransactionRequest: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		request: Pick<BackpackRequestSurface, 'accountAddress' | 'intendedProvider'>
	) => waitForBackpackRequest(context, extension, { ...request, kind: 'transaction' }),
	waitForSendRequest: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		request: Pick<BackpackRequestSurface, 'accountAddress' | 'intendedProvider'>
	) => waitForBackpackRequest(context, extension, { ...request, kind: 'send' }),
	rejectRequest: async (page: Page) => {
		await page.getByRole('button', {
			name: /^(?:cancel|deny|reject)$/i,
		}).click()
		await page.waitForEvent('close').catch(() => undefined)
	},
	approveMessage: async (page: Page) => {
		await page.getByRole('button', {
			name: /^(?:approve|sign|sign message)$/i,
		}).click()
		await page.waitForEvent('close').catch(() => undefined)
	},
	approveTransaction: async (page: Page) => {
		await page.getByRole('button', {
			name: /^(?:approve|sign|sign transaction)$/i,
		}).click()
		await page.waitForEvent('close').catch(() => undefined)
	},
	approveSend: async (page: Page) => {
		await page.getByRole('button', {
			name: /^(?:approve|confirm|send)$/i,
		}).click()
		await page.waitForEvent('close').catch(() => undefined)
	},
	rejectConnection: async (page: Page) => {
		await Promise.all([
			page.waitForEvent('close'),
			page.getByRole('button', {
				name: 'Deny',
				exact: true,
			}).click(),
		])
	},
	approveConnection: async (page: Page) => {
		await Promise.all([
			page.waitForEvent('close'),
			page.getByRole('button', {
				name: 'Approve',
				exact: true,
			}).click(),
		])
	},
	switchAccount: async (page: Page, currentLabel: string, nextLabel: string) => {
		await page.getByText(currentLabel, {
			exact: true,
		}).click()
		await page.getByText(nextLabel, {
			exact: true,
		}).click()
	},
} as const
