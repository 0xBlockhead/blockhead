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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetSupply_LedgerCoordinateView from '$/views/AssetSupply_LedgerCoordinateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AssetSupply_LedgerCoordinate, {
				$assetInstance: data.selector,
				supplyScopeKey: params.supplyScopeKey,
				ledgerCoordinateKind: params.ledgerCoordinateKind,
				ledgerCoordinateValue: BigInt(params.ledgerCoordinateValue),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.supplyScopeKey || 'asset supply ledger coordinate')} • asset supply ledger coordinate • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'asset supply ledger coordinate'} • asset supply ledger coordinate • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AssetSupply_LedgerCoordinate, {
				$assetInstance: data.selector,
				supplyScopeKey: params.supplyScopeKey,
				ledgerCoordinateKind: params.ledgerCoordinateKind,
				ledgerCoordinateValue: BigInt(params.ledgerCoordinateValue),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<AssetSupply_LedgerCoordinateView
		selection={pageSelection}
	/>
	{/if}
</Page>
