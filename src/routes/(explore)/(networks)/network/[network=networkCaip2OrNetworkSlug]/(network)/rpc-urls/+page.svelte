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
					network: params.network,
				}
			)
		}
		title='RPC URLs'
		selection={select(EntityType.Network, data.selector).Evm.$$rpcUrls}
		id='rpc-urls'
	/>
</Page>
