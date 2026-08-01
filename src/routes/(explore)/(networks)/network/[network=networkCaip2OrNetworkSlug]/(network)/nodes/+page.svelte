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
	import LightningNodesView from '$/views/LightningNodesView.svelte'
</script>


<svelte:head>
	<title>Nodes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LightningNetwork, data.selector).$$nodes}

	<LightningNodesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes',
				{
					network: params.network,
				}
			)
		}
		title='Nodes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='nodes'
	/>
</Page>
