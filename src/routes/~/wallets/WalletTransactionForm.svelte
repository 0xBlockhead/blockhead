<script lang="ts">
	import { resolve } from '$app/paths'
	import { WalletCapability } from '$/constants/Wallet.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { normalizeBoundaryError } from '$/lib/errors.ts'
	import type { WalletAccount } from '$/state/wallets/adapters/types.ts'
	import { getWalletConnectionRuntime, type WalletEvmTransactionInput } from '$/state/wallets/walletConnectionRuntime.svelte.ts'
	import Boundary from '$/components/Boundary.svelte'


	let {
		connectionKey,
		account,
	}: {
		connectionKey: string
		account: WalletAccount
	} = $props()
	let recipient = $state('')
	let value = $state('0')
	let data = $state('0x')
	let review = $state<WalletEvmTransactionInput>()
	let pending = $state(false)
	let failure = $state<{ error: Error }>()
	let submittedRequestId = $state<string>()
	let networkReference = $state('')

	const switchNetwork = async (event: SubmitEvent) => {
		event.preventDefault()
		const runtime = getWalletConnectionRuntime()
		if (pending || runtime === null)
			return

		failure = undefined
		review = undefined
		pending = true
		try {
			if (!/^[1-9][0-9]*$/.test(networkReference))
				throw new Error('Chain ID must be a positive whole number.')

			await runtime.switchScope(connectionKey, {
				namespace: 'eip155',
				reference: networkReference,
			})
		} catch (error) {
			failure = { error: normalizeBoundaryError(error) }
		} finally {
			pending = false
		}
	}

	const prepareReview = (event: SubmitEvent) => {
		event.preventDefault()
		failure = undefined
		submittedRequestId = undefined
		try {
			if (!/^(0|[1-9][0-9]*)$/.test(value))
				throw new Error('Value must be a whole, nonnegative number of wei.')
			review = {
				connectionKey,
				transaction: {
					chainId: Number(account.reference),
					from: EvmAddress.assert(account.accountAddress),
					to: EvmAddress.assert(recipient),
					value: BigInt(value),
					data: ZeroExHex.assert(data),
				},
				authorityPresentation: { submittedAt: Date.now(), validUntil: Date.now() + 120_000 },
			}
		} catch (error) {
			failure = { error: normalizeBoundaryError(error) }
		}
	}

	const submit = async () => {
		const runtime = getWalletConnectionRuntime()
		if (pending || review === undefined || runtime === null)
			return
		pending = true
		failure = undefined
		try {
			const result = await runtime.sendEvmTransaction(review)
			submittedRequestId = result.walletRequestId
		} catch (error) {
			failure = { error: normalizeBoundaryError(error) }
		} finally {
			pending = false
			review = undefined
		}
	}
</script>


<details>
	<summary>Send a transaction</summary>

	<Boundary {failure} boundaryKey="Wallet transaction" />

	{#if account.capabilities.includes(WalletCapability.SwitchScope)}
		<form onsubmit={switchNetwork}>
			<label>EVM chain ID <input bind:value={networkReference} placeholder={account.reference} inputmode="numeric" required disabled={pending} /></label>

			<button type="submit" disabled={pending}>Switch wallet network</button>
		</form>
	{/if}

	{#if review}
		<dl>
			<div><dt>Network</dt><dd>eip155:{review.transaction.chainId}</dd></div>
			<div><dt>From</dt><dd>{review.transaction.from}</dd></div>
			<div><dt>Recipient</dt><dd>{review.transaction.to}</dd></div>
			<div><dt>Value</dt><dd>{review.transaction.value.toString()} wei</dd></div>
			<div><dt>Call data</dt><dd>{review.transaction.data}</dd></div>
		</dl>

		<p>Review these details in your wallet. This request expires after two minutes.</p>

		<button type="button" disabled={pending} onclick={submit}>
			{pending ? 'Waiting for wallet…' : 'Confirm in wallet'}
		</button>

		<button type="button" disabled={pending} onclick={() => { review = undefined }}>Edit</button>
	{:else}
		<form onsubmit={prepareReview}>
			<label>Recipient <input bind:value={recipient} required autocomplete="off" /></label>

			<label>Value in wei <input bind:value inputmode="numeric" required /></label>

			<label>Call data <textarea bind:value={data} required spellcheck="false"></textarea></label>

			<button type="submit" disabled={pending}>Review transaction</button>
		</form>
	{/if}

	{#if submittedRequestId}
		<p role="status">
			Transaction submitted; confirmation is pending.
			<a href={resolve('/~/wallets/requests/[id=stringSegment]', { id: submittedRequestId })}>View transaction history</a>
		</p>
	{/if}
</details>
