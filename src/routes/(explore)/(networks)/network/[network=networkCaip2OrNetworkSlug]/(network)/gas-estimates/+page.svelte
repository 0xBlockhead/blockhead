<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
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
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Gas estimates • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasEstimate_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates',
				{
					network: params.network,
				}
			)
		}
		title='Gas estimates'
		selection={select(EntityType.Network, data.selector).Evm.$$gasEstimateTimestamps}
		id='gas-estimate-timestamps'
	/>
</Page>
