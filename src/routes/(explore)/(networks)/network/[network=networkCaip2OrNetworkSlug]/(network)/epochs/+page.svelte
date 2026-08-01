<!-- Generated from APP.ts. -->

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
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
</script>


<svelte:head>
	<title>Beacon epochs • Blockhead</title>
</svelte:head>


<Page>
	<BeaconEpochsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epochs',
				{
					network: params.network,
				}
			)
		}
		title='Beacon epochs'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconEpochs}
		id='beacon-epochs'
	/>
</Page>
