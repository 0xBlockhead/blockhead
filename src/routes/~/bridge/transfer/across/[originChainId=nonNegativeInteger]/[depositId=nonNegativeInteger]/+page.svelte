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
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BridgeTransfer, data.selector, {
				sources: [
					Source.Across_Rest,
					Source.Allium_Rest,
					Source.Axelarscan_Rest,
					Source.Dune_Rest,
					Source.LayerZeroScan_Rest,
					Source.Lifi_Rest,
					Source.Voltaire_JsonRpc,
					Source.Wormholescan,
				],
				fields: {
					transferId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'bridge transfer' : pageSelection.entity.transferId || 'bridge transfer')} • bridge transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge transfer'} • bridge transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BridgeTransfer, data.selector, {
				sources: [
					Source.Across_Rest,
					Source.Allium_Rest,
					Source.Axelarscan_Rest,
					Source.Dune_Rest,
					Source.LayerZeroScan_Rest,
					Source.Lifi_Rest,
					Source.Voltaire_JsonRpc,
					Source.Wormholescan,
				],
				fields: {
					transferId: true,
				},
			})}

	<BridgeTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
