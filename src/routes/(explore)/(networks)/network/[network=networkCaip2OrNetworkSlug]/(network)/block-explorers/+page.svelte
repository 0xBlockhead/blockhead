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
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<svelte:head>
	<title>Block explorers • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Network, data.selector).$$blockExplorerUrls}

	<UrlsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block-explorers',
				{
					network: params.network,
				}
			)
		}
		title='Block explorers'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='block-explorer-urls'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
