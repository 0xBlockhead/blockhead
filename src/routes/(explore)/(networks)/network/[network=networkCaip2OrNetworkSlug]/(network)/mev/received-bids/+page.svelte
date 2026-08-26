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
	import MevRelay_BuilderBlockReceivedsView from '$/views/MevRelay_BuilderBlockReceivedsView.svelte'
</script>


<svelte:head>
	<title>MEV received bids • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_BuilderBlockReceivedsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/received-bids',
				{
					network: params.network,
				}
			)
		}
		title='MEV received bids'
		selection={select(EntityType.Network, data.selector).Evm.$$mevBuilderBlocksReceived}
		id='mev-builder-blocks-received'
	/>
</Page>
