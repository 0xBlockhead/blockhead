<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadLightningPayment, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.paymentHash || 'local LND payment')} • local LND payment • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND payment'} • local LND payment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadLightningPaymentView
		selection={pageSelection}
	/>
	{/if}
</Page>
