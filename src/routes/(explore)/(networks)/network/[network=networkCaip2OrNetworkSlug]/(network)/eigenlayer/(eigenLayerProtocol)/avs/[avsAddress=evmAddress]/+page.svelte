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

	const pageSelection = $derived(select(EntityType.EigenLayerAvs, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.avsAddress || 'eigen layer avs')} • eigen layer avs • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerAvsView
		selection={pageSelection}
	/>
</Page>
