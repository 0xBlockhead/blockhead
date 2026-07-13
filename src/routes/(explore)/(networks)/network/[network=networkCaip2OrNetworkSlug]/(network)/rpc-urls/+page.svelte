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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<svelte:head>
	<title>RPC URLs • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<UrlsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/rpc-urls', {
						network: params.network,
					})
				}
				title='RPC URLs'
				selection={
					projection.$$rpcUrls({
						count: true,
					})
				}
				id='rpc-urls'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
