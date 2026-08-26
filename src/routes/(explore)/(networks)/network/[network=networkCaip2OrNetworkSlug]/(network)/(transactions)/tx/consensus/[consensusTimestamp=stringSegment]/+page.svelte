<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaTransaction, data.selector, {
		fields: {
			transactionType: true,
			transactionId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'hedera transaction' : pageSelection.entity.transactionType || pageSelection.entity.transactionId || 'hedera transaction')} • hedera transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera transaction'} • hedera transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
