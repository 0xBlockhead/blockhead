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
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoAddress, data.selector, {
				sources: [
					Source.Blockfrost_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'Cardano address')} • Cardano address • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano address'} • Cardano address • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoAddress, data.selector, {
				sources: [
					Source.Blockfrost_Rest,
				],
			})}

	<CardanoAddressView
		selection={pageSelection}
	/>
	{/if}
</Page>
