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
	import GlobalSwarmAccess_TimestampView from '$/views/_GlobalSwarmAccess_TimestampView.svelte'
</script>


<svelte:head>
	<title>global Swarm access timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalSwarmAccess_TimestampView
		href={
			resolve('/(explore)/(swarm)/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalSwarmAccess_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					configuredAccessEndpointCount: true,
					reachableAccessEndpointCount: true,
					sourceWindowResourceCount: true,
					localCatalogExampleCount: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
