<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTransaction, data.selector, {
					fields: {
						transactionType: true,
						transactionId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'hedera transaction' : pageSelection.entity.transactionType || pageSelection.entity.transactionId || 'hedera transaction')} • hedera transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera transaction'} • hedera transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTransaction, data.selector, {
					fields: {
						transactionType: true,
						transactionId: true,
					},
				}))}

		<HederaTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
