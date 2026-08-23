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
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningInvoice, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
				],
				fields: {
					memo: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.paymentHash ?? '') || 'local LND invoice' : (pageSelection.entity.memo ?? '') || pageSelection.entitySelector.paymentHash || 'local LND invoice')} • local LND invoice • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND invoice'} • local LND invoice • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningInvoice, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
				],
				fields: {
					memo: true,
				},
			})}

	<BlockheadLightningInvoiceView
		selection={pageSelection}
	/>
	{/if}
</Page>
