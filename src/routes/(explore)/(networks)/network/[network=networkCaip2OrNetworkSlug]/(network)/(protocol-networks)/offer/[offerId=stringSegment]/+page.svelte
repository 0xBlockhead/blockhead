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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarOffer, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarOfferView from '$/views/StellarOfferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.offerId || 'stellar offer')} • stellar offer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar offer'} • stellar offer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarOfferView
		selection={pageSelection}
	/>
	{/if}
</Page>
