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
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AptosTransaction, data.selector, {
				fields: {
					hash: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.version ?? '') || 'aptos transaction' : pageSelection.entity.hash || String(pageSelection.entitySelector.version) || 'aptos transaction')} • aptos transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos transaction'} • aptos transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AptosTransaction, data.selector, {
				fields: {
					hash: true,
				},
			})}

	<AptosTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
