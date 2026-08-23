<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
		{@const pageSelection = select(EntityType.HederaTransaction, data.selector, {
				fields: {
					transactionType: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.transactionId ?? '') || 'hedera transaction' : pageSelection.entity.transactionType || pageSelection.entitySelector.transactionId || 'hedera transaction')} • hedera transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera transaction'} • hedera transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTransaction, data.selector, {
				fields: {
					transactionType: true,
				},
			})}

	<HederaTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
