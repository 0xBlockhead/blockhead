import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterResponseAuditFailure,
} from './types.ts'

export type SolanaSignMessageResponseAudit = Readonly<{
	accountAddress: string
	messageForProvider(): Uint8Array
	// oxlint-disable-next-line typescript/no-restricted-types -- A Wallet Standard provider response is untrusted external input at this audit boundary.
	audit(response: unknown): string
}>

const bytesEqual = (
	left: Uint8Array,
	right: Uint8Array
) => (
	left.byteLength === right.byteLength
	&& left.every((byte, index) => byte === right[index])
)

const responseSummary = (
	// oxlint-disable-next-line typescript/no-restricted-types -- A Wallet Standard provider response is untrusted external input at this audit boundary.
	response: unknown,
	signature?: Uint8Array
) => ({
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- The external provider result must be summarized without trusting its declared TypeScript shape.
	kind: Array.isArray(response) ? 'array' : typeof response,
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- The external provider result must be summarized without trusting its declared TypeScript shape.
	...(Array.isArray(response) && { outputCount: response.length }),
	...(signature != null && { signature: base58.encode(signature) }),
})

/**
 * Captures the selected account key and exact UTF-8 message before a Wallet
 * Standard provider is called, then audits the untrusted response against that
 * retained authority. Each provider request receives a copy so a provider
 * cannot mutate the verification bytes held in the closure.
 */
export const createSolanaSignMessageResponseAudit = ({
	accountAddress,
	publicKey,
	message,
}: Readonly<{
	accountAddress: string
	publicKey: Uint8Array
	message: string
}>): SolanaSignMessageResponseAudit => {
	let decodedAddress: Uint8Array
	try {
		decodedAddress = base58.decode(accountAddress)
	}
	catch {
		throw new WalletAdapterPreDispatchFailure(
			'Solana signing authority has a malformed account address'
		)
	}

	if (
		decodedAddress.byteLength !== 32
		|| base58.encode(decodedAddress) !== accountAddress
		|| !(publicKey instanceof Uint8Array)
		|| publicKey.byteLength !== 32
		|| !bytesEqual(decodedAddress, publicKey)
	)
		throw new WalletAdapterPreDispatchFailure(
			'Solana signing authority does not bind the selected address and public key'
		)

	const retainedPublicKey = publicKey.slice()
	const retainedMessage = new TextEncoder().encode(message)

	return Object.freeze({
		accountAddress,
		messageForProvider: () => retainedMessage.slice(),
		// oxlint-disable-next-line typescript/no-restricted-types -- A Wallet Standard provider response is untrusted external input at this audit boundary.
		audit: (response: unknown) => {
			// oxlint-disable-next-line no-runtime-shape-guards/guards -- This is the explicit external Wallet Standard response boundary.
			if (!Array.isArray(response) || response.length !== 1)
				throw new WalletAdapterResponseAuditFailure(
					'Solana wallet returned an invalid solana:signMessage output count',
					responseSummary(response)
				)

			// oxlint-disable-next-line typescript/no-restricted-types -- The provider output must be narrowed before reading its signature.
			const output: unknown = response[0]
			const signature = (
				// oxlint-disable-next-line no-runtime-shape-guards/guards -- This is the explicit external Wallet Standard response boundary.
				typeof output === 'object'
				&& output != null
				&& 'signature' in output
			) ?
				output.signature
			:
				undefined

			if (!(signature instanceof Uint8Array) || signature.byteLength !== 64)
				throw new WalletAdapterResponseAuditFailure(
					'Solana wallet returned a malformed solana:signMessage signature',
					responseSummary(response)
				)

			let verified = false
			try {
				verified = ed25519.verify(signature, retainedMessage, retainedPublicKey)
			}
			catch {
				verified = false
			}

			if (!verified)
				throw new WalletAdapterResponseAuditFailure(
					'Solana wallet signature does not bind the selected account and exact message',
					responseSummary(response, signature)
				)

			return base58.encode(signature)
		},
	})
}
