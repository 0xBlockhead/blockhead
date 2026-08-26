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
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<svelte:head>
	<title>Blocks • Blockhead</title>
</svelte:head>


<Page>
	<EvmBlocksView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks',
				{
					network: params.network,
				}
			)
		}
		title='Blocks'
		selection={select(EntityType.Network, data.selector).Evm.$$blocks}
		id='blocks'
	/>
</Page>
