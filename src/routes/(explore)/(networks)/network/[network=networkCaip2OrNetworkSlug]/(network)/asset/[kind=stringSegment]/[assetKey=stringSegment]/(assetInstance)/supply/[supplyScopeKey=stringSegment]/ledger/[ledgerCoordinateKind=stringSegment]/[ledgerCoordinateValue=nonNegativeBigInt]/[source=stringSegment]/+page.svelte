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

	const pageSelection = $derived(select(EntityType.AssetSupply_LedgerCoordinate, {
		$assetInstance: data.selector,
		supplyScopeKey: params.supplyScopeKey,
		ledgerCoordinateKind: params.ledgerCoordinateKind,
		ledgerCoordinateValue: BigInt(params.ledgerCoordinateValue),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetSupply_LedgerCoordinateView from '$/views/AssetSupply_LedgerCoordinateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.supplyScopeKey || 'asset supply ledger coordinate')} • asset supply ledger coordinate • Blockhead</title>
</svelte:head>


<Page>
	<AssetSupply_LedgerCoordinateView
		selection={pageSelection}
	/>
</Page>
