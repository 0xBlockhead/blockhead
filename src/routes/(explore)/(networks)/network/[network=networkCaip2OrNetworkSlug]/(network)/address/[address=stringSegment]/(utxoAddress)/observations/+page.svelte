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
	import UtxoAddress_TimestampsView from '$/views/UtxoAddress_TimestampsView.svelte'
</script>


<svelte:head>
	<title>UTXO address observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.UtxoAddress, data.selector).$$timestamps}

	<UtxoAddress_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations',
				{
					network: params.network,
					address: params.address,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
	/>
</Page>
