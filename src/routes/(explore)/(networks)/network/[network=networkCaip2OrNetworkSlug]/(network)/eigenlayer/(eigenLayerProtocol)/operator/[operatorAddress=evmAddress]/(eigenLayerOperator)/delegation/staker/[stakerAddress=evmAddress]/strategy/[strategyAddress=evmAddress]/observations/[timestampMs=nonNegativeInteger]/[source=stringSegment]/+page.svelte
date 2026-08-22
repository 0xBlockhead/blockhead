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
	import EigenLayerDelegation_TimestampView from '$/views/EigenLayerDelegation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'eigen layer delegation timestamp'} • eigen layer delegation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerDelegation_TimestampView
		selection={
			select(EntityType.EigenLayerDelegation_Timestamp, {
				$staker: {
					$network: data.selector.$network,
					$actor: {
						address: params.stakerAddress,
					},
				},
				$operator: data.selector,
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
