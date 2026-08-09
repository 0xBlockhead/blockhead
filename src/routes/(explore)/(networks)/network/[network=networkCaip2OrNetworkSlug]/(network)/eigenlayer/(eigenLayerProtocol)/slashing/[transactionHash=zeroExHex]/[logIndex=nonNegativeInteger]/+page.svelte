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
	import EigenLayerSlashingEventView from '$/views/EigenLayerSlashingEventView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'eigen layer slashing event'} • eigen layer slashing event • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerSlashingEventView
		selection={
			select(EntityType.EigenLayerSlashingEvent, {
				$network: data.selector,
				transactionHash: params.transactionHash,
				logIndex: Number(params.logIndex),
			}, {
				sources: [
					Source.EigenExplorer_Rest,
					Source.EigenLayerContracts_Evm,
					Source.Etherscan_Rest,
					Source.Voltaire_JsonRpc,
				],
			})
		}
	/>
</Page>
