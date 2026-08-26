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
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
</script>


<svelte:head>
	<title>Beacon committees • Blockhead</title>
</svelte:head>


<Page>
	<BeaconCommitteesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/committees',
				{
					network: params.network,
				}
			)
		}
		title='Beacon committees'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconCommittees}
		id='beacon-committees'
	/>
</Page>
