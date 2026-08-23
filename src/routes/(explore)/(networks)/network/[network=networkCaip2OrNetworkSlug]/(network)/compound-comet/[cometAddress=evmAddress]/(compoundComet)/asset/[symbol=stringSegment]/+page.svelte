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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundCometAssetView from '$/views/CompoundCometAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CompoundCometAsset, {
				$comet: data.selector,
				symbol: params.symbol,
			}, {
				sources: [
					Source.Compound_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.symbol || 'Compound Comet collateral asset')} • Compound Comet collateral asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Compound Comet collateral asset'} • Compound Comet collateral asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CompoundCometAsset, {
				$comet: data.selector,
				symbol: params.symbol,
			}, {
				sources: [
					Source.Compound_Rest,
				],
			})}

	<CompoundCometAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
