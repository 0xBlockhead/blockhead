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
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
</script>


<svelte:head>
	<title>Native assets • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Network, data.selector).$$nativeAssets}

	<AssetInstancesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-assets',
				{
					network: params.network,
				}
			)
		}
		title='Native assets'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='native-assets'
	/>
</Page>
