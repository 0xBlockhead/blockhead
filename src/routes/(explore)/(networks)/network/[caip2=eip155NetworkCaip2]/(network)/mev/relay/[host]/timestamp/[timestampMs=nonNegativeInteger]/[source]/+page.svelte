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
	import MevRelay_TimestampView from '$/views/MevRelay_TimestampView.svelte'
</script>


<svelte:head>
	<title>MEV relay timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				host: params.host,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.MevRelay_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					reachable: true,
					statusCode: true,
					error: true,
					deliveredPayloadSampleCount: true,
					builderSampleCount: true,
					sampleLimit: true,
					windowStartSlot: true,
					windowEndSlot: true,
				},
			})
		}
	/>
</Page>
