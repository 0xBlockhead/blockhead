<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<svelte:head>
	<title>EVM network gas estimate timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasEstimate_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EvmNetwork_GasEstimate_Timestamp, data.selector, {
				fields: {
					fastGwei: true,
					slowGwei: true,
					averageGwei: true,
					transport: true,
				},
			})
		}
	/>
</Page>
