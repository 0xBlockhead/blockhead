<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampsView from '$/views/EthereumBeaconFinality_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Beacon finality • Blockhead</title>
</svelte:head>


<Page>
	<EthereumBeaconFinality_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality', {
				caip2: params.caip2,
			})
		}
		title='Beacon finality'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.EthereumBeaconFinality_Timestamp>('$$beaconFinalityTimestamps')
		}
		id='EthereumBeaconFinality_TimestampsView-page'
	/>
</Page>
