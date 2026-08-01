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
	import BeaconSyncCommitteesView from '$/views/BeaconSyncCommitteesView.svelte'
</script>


<svelte:head>
	<title>Beacon sync committees • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSyncCommitteesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committees',
				{
					network: params.network,
				}
			)
		}
		title='Beacon sync committees'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconSyncCommittees}
		id='beacon-sync-committees'
	/>
</Page>
