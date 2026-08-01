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
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
</script>


<svelte:head>
	<title>MEV payloads • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_ProposerPayloadDeliveredsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payloads',
				{
					network: params.network,
				}
			)
		}
		title='MEV payloads'
		selection={select(EntityType.Network, data.selector).Evm.$$mevProposerPayloadDelivered}
		id='mev-proposer-payload-delivered'
	/>
</Page>
