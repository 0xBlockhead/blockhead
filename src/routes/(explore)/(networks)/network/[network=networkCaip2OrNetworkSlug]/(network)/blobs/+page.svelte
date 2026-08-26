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
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
</script>


<svelte:head>
	<title>Blobs • Blockhead</title>
</svelte:head>


<Page>
	<EvmBlobsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blobs',
				{
					network: params.network,
				}
			)
		}
		title='Blobs'
		selection={select(EntityType.Network, data.selector).Evm.$$blobs}
		id='blobs'
	/>
</Page>
