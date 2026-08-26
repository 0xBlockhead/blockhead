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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CompoundPositionCollateral, {
		$position: data.selector,
		$asset: {
			$comet: data.selector.$comet,
			symbol: params.symbol,
		},
	}, {
		sources: [
			Source.Compound_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundPositionCollateralView from '$/views/CompoundPositionCollateralView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Compound position collateral'} • Compound position collateral • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Compound position collateral'} • Compound position collateral • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CompoundPositionCollateralView
		selection={pageSelection}
	/>
	{/if}
</Page>
