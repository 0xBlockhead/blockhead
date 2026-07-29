<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	const collection0Selection = $derived(select(EntityType.Network, data.selector).Evm.$$beaconValidators)
	const collection1Selection = $derived(select(EntityType.Network, data.selector).Solana.$$validators)


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
</script>


<svelte:head>
	<title>Collections • Blockhead</title>
</svelte:head>


<Page>
	<BeaconValidatorsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
				{
					network: params.network,
				}
			)
		}
		title='Beacon validators'
		selection={collection0Selection}
		id='beacon-validators'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>

	<SolanaValidatorsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
				{
					network: params.network,
				}
			)
		}
		title='Solana validators'
		selection={collection1Selection}
		id='validators'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
