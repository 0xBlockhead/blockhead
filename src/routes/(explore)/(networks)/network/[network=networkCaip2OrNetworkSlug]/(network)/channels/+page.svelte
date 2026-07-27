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
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LightningNetwork, data.selector).$$channels}

	<LightningChannelsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels',
				{
					network: String(params.network),
				}
			)
		}
		title='Channels'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
