<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<svelte:head>
	<title>Beacon slots • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlotsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slots',
				{
					network: params.network,
				}
			)
		}
		title='Beacon slots'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconSlots}
		id='beacon-slots'
	/>
</Page>
