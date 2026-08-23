<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningPayment, data.selector, {
					sources: [
						Source.LightningLnd_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.paymentHash || 'local LND payment')} • local LND payment • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'local LND payment'} • local LND payment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningPayment, data.selector, {
					sources: [
						Source.LightningLnd_Rest,
					],
				}))}

		<BlockheadLightningPaymentView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
