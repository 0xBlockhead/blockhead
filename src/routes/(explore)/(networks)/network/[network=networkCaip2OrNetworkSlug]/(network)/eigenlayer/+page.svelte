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

	const pageSelection = $derived(select(EntityType.EigenLayerProtocol, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerProtocolView from '$/views/EigenLayerProtocolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'eigen layer protocol' : pageSelection.entity.protocolName || 'eigen layer protocol')} • eigen layer protocol • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerProtocolView
		selection={pageSelection}
	/>
</Page>
