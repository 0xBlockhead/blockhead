<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<UrlsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block-explorers', {
				network: params.network,
			})
		}
		title='Block explorers'
		selection={select(EntityType.Network, data.selector).$$blockExplorerUrls}
		countResource={select(EntityType.Network, data.selector).$$blockExplorerUrls.count}
		id='block-explorer-urls'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
