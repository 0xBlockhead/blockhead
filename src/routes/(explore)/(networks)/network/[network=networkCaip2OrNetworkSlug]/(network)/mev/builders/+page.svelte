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
	import MevBuildersView from '$/views/MevBuildersView.svelte'
</script>


<svelte:head>
	<title>MEV builders • Blockhead</title>
</svelte:head>


<Page>
	<MevBuildersView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builders',
				{
					network: params.network,
				}
			)
		}
		selection={select(EntityType.Network, data.selector).Evm.$$mevBuilders}
		id='mev-builders'
	/>
</Page>
