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
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CosmosDenom, data.selector, {
				fields: {
					symbol: true,
					display: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.denom ?? '') || 'Cosmos denom' : [(pageSelection.entity.symbol ?? ''), (pageSelection.entity.display ?? ''), pageSelection.entitySelector.denom].filter(Boolean).join(' ') || 'Cosmos denom')} • Cosmos denom • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos denom'} • Cosmos denom • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CosmosDenom, data.selector, {
				fields: {
					symbol: true,
					display: true,
				},
			})}

	<CosmosDenomView
		selection={pageSelection}
	/>
	{/if}
</Page>
