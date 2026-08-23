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
	import StellarOfferView from '$/views/StellarOfferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarOffer, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.offerId || 'stellar offer')} • stellar offer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar offer'} • stellar offer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarOffer, data.selector)}

	<StellarOfferView
		selection={pageSelection}
	/>
	{/if}
</Page>
