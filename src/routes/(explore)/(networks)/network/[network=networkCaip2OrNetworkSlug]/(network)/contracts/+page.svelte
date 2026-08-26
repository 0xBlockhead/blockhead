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
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<svelte:head>
	<title>Contracts • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contracts',
				{
					network: params.network,
				}
			)
		}
		title='Contracts'
		selection={select(EntityType.Network, data.selector).Evm.$$contracts}
		id='contracts'
	/>
</Page>
