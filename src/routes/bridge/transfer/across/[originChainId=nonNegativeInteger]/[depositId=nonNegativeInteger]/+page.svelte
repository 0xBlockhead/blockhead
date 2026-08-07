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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BridgeTransfer, {
		originChainId: Number(params.originChainId),
		depositId: Number(params.depositId),
	}, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'bridge transfer' : pageSelection.entity.transferId || 'bridge transfer'} • bridge transfer • Blockhead</title>
</svelte:head>


<Page>
	<BridgeTransferView
		selection={pageSelection}
	/>
</Page>
