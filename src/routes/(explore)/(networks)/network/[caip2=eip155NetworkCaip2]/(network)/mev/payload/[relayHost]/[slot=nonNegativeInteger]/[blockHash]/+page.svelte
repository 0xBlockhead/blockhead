<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


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
			select(EntityType.MevRelay_ProposerPayloadDelivered, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				relayHost: decodeURIComponent(params.relayHost),
				slot: Number(params.slot),
				blockHash: decodeURIComponent(params.blockHash),
			}, {
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
