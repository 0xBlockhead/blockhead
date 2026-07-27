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
	import EthereumBeaconFinality_TimestampsView from '$/views/EthereumBeaconFinality_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Beacon finality • Blockhead</title>
</svelte:head>


<Page>
	<EthereumBeaconFinality_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality',
				{
					network: String(params.network),
				}
			)
		}
		title='Beacon finality'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconFinalityTimestamps}
		id='beacon-finality-timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
