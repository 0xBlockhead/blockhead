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
	import BlockheadLightningForwardsView from '$/views/BlockheadLightningForwardsView.svelte'
</script>


<svelte:head>
	<title>Local LND forwards • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.BlockheadLightningNodeState, data.selector).$$forwards}

	<BlockheadLightningForwardsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/forward',
				{
					network: params.network,
					connectionId: params.connectionId,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='forwards'
	/>
</Page>
