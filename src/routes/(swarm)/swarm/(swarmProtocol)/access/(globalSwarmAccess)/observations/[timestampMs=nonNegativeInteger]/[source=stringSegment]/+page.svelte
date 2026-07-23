<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalSwarmAccess_Timestamp, {
		$hub: {
			scope: '_GlobalSwarmAccess',
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			declaredAccessEndpointCount: true,
			reachableAccessEndpointCount: true,
			observedResourceCount: true,
			seededExampleCount: true,
			reachable: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalSwarmAccess_TimestampView from '$/views/_GlobalSwarmAccess_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'global Swarm access timestamp' : 'global Swarm access timestamp')} • global Swarm access timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalSwarmAccess_TimestampView
		href={
			resolve('/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
