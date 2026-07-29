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
	<title>Faucets • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Network, data.selector).$$faucetUrls}

	<UrlsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/faucets',
				{
					network: params.network,
				}
			)
		}
		title='Faucets'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='faucet-urls'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
