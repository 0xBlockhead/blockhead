<!-- Generated from APP.ts. Do not edit by hand. -->

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
	import MevRelaysView from '$/views/MevRelaysView.svelte'
</script>


<svelte:head>
	<title>MEV relays • Blockhead</title>
</svelte:head>


<Page>
	<MevRelaysView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relays',
				{
					network: params.network,
				}
			)
		}
		title='MEV relays'
		selection={select(EntityType.Network, data.selector).Evm.$$mevRelays}
		id='mev-relays'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
