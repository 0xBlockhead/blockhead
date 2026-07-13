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
	<title>Faucets • Blockhead</title>
</svelte:head>


<Page>
	<UrlsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/faucets', {
				network: params.network,
			})
		}
		title='Faucets'
		selection={select(EntityType.Network, data.selector).$$faucetUrls}
		id='faucet-urls'
	/>
</Page>
