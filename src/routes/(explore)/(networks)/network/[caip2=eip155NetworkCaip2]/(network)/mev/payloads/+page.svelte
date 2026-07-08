<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
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
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payloads', {
				caip2: params.caip2,
			})
		}
		title='MEV payloads'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}).Evm.$$mevProposerPayloadDelivered({
				sources: [
					Source.MevRelay_Rest,
				],
			})
		}
		id='mev-proposer-payload-delivered'
	/>
</Page>
