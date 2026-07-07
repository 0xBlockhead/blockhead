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
	import MevBuilder_TimestampView from '$/views/MevBuilder_TimestampView.svelte'
</script>


<Page>
	<MevBuilder_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				builderPubkey: params.builderPubkey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.MevBuilder_Timestamp, {
				$builder: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					builderPubkey: decodeURIComponent(params.builderPubkey),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$builder: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					builderPubkey: decodeURIComponent(params.builderPubkey),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					deliveredPayloadCount: true,
					deliveredValueWei: true,
					relayCount: true,
					windowStartSlot: true,
					windowEndSlot: true,
					sampleLimit: true,
				},
			})
		}
	/>
</Page>
