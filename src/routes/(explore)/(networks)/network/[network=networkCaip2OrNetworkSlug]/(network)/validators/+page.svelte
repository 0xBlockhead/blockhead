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
	const collectionHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
			{
				network: params.network,
			}
		)
	)
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
		href={collectionHref}
		title='Beacon validators'
		selection={collection0Selection}
		id='beacon-validators'
	/>

	<SolanaValidatorsView
		href={collectionHref}
		title='Solana validators'
		selection={collection1Selection}
		id='validators'
	/>
</Page>
