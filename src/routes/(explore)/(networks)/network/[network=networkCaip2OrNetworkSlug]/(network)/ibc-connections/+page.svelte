<!-- Generated from APP.ts. -->

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
	import IbcConnectionsView from '$/views/IbcConnectionsView.svelte'
</script>


<svelte:head>
	<title>IBC connections • Blockhead</title>
</svelte:head>


<Page>
	<IbcConnectionsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-connections',
				{
					network: params.network,
				}
			)
		}
		selection={select(EntityType.Network, data.selector).Cosmos.$$ibcConnections}
		id='ibc-connections'
	/>
</Page>
