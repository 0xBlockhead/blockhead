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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoAddress, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'Cardano address')} • Cardano address • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano address'} • Cardano address • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoAddressView
		selection={pageSelection}
	/>
	{/if}
</Page>
