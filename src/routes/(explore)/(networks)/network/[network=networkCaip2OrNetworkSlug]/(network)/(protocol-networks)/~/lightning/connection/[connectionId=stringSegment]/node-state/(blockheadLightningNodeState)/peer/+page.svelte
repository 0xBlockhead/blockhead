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
	import BlockheadLightningPeersView from '$/views/BlockheadLightningPeersView.svelte'
</script>


<svelte:head>
	<title>Local LND peers • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.BlockheadLightningNodeState, data.selector).$$peers}

	<BlockheadLightningPeersView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer',
				{
					network: params.network,
					connectionId: params.connectionId,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='peers'
	/>
</Page>
