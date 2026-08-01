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
	import EvmNetwork_TimestampsView from '$/views/EvmNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Observations • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations',
				{
					network: params.network,
				}
			)
		}
		title='Observations'
		selection={select(EntityType.Network, data.selector).Evm.$$timestamps}
		id='timestamps'
	/>
</Page>
