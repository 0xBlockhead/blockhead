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
	<title>RPC URLs • Blockhead</title>
</svelte:head>


<Page>
	<UrlsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rpc-urls',
				{
					network: String(params.network),
				}
			)
		}
		title='RPC URLs'
		selection={select(EntityType.Network, data.selector).Evm.$$rpcUrls}
		id='rpc-urls'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
