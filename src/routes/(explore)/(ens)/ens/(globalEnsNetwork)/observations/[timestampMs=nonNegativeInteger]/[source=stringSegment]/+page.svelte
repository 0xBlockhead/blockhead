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

	const pageSelection = $derived(select(EntityType._GlobalEnsNetwork_Timestamp, {
		$hub: {
			scope: '_GlobalEnsNetwork',
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$hub: {
				scope: '_GlobalEnsNetwork',
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			observedNameCount: true,
			observedRecordCount: true,
			observedReverseRecordCount: true,
			seededContractCount: true,
			discoveredResolverContractCount: true,
			subgraphBlockNumber: true,
			rpcBlockNumber: true,
			reachable: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'ENS hub observation' : 'ENS hub observation')} • ENS hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEnsNetwork_TimestampView
		href={
			resolve('/ens/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
