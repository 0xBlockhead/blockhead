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
	import EigenLayerAllocation_TimestampView from '$/views/EigenLayerAllocation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'eigen layer allocation timestamp'} • eigen layer allocation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerAllocation_TimestampView
		selection={
			select(EntityType.EigenLayerAllocation_Timestamp, {
				$operator: data.selector,
				$avs: {
					$network: data.selector.$network,
					avsAddress: params.avsAddress,
				},
				$strategy: {
					$network: data.selector.$network,
					strategyAddress: params.strategyAddress,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
