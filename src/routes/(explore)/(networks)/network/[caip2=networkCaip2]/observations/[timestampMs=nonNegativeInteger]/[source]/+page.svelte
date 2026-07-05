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
	import Network_TimestampView from '$/views/Network_TimestampView.svelte'
</script>


<svelte:head>
	<title>Network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Network_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.Network_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					latestHeight: true,
					health: true,
					txCount: true,
				},
			})
		}
	/>
</Page>
