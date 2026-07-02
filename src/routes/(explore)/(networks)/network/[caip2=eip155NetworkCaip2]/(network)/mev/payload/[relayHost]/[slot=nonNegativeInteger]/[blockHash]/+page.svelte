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


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<svelte:head>
	<title>MEV relay proposer payload delivered • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_ProposerPayloadDeliveredView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]', {
				caip2: params.caip2,
				relayHost: params.relayHost,
				slot: params.slot,
				blockHash: params.blockHash,
			})
		}
		selection={
			select(EntityType.MevRelay_ProposerPayloadDelivered, data.selector, {
				fields: {
					value: true,
					$builder: true,
					blockNumber: true,
					builderPubkey: true,
					$executionBlock: true,
				},
			})
		}
	/>
</Page>
