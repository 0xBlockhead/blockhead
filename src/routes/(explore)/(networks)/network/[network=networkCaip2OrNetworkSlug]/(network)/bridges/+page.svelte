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
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
</script>


<svelte:head>
	<title>Bridges • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkBridgesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges',
				{
					network: params.network,
				}
			)
		}
		title='Bridges'
		selection={select(EntityType.Network, data.selector).Evm.$$bridges}
		id='bridges'
	/>
</Page>
