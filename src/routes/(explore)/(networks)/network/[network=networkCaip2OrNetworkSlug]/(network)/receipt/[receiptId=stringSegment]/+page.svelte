<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NearReceiptView from '$/views/NearReceiptView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearReceipt, data.selector, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.receiptId || 'near receipt')} • near receipt • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near receipt'} • near receipt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearReceipt, data.selector, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
			})}

	<NearReceiptView
		selection={pageSelection}
	/>
	{/if}
</Page>
