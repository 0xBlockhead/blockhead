<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
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
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/gas-estimates', {
				caip2: params.caip2,
			})
		}
		title='Gas estimates'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.EvmNetwork_GasEstimate_Timestamp>('$$gasEstimateTimestamps', {
				sources: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
			})
		}
		id='gas-estimate-timestamps'
	/>
</Page>
