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
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
</script>


<svelte:head>
	<title>IBC channels • Blockhead</title>
</svelte:head>


<Page>
	<IbcChannelsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels',
				{
					network: params.network,
				}
			)
		}
		selection={select(EntityType.Network, data.selector).Cosmos.$$ibcChannels}
		id='ibc-channels'
	/>
</Page>
