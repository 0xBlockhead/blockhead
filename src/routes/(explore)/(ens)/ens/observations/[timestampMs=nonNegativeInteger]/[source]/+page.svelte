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
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>ENS hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEnsNetwork_TimestampView
		href={
			resolve('/(explore)/(ens)/ens/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalEnsNetwork_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					sourceWindowNameCount: true,
					sourceWindowRecordCount: true,
					sourceWindowReverseRecordCount: true,
					localCatalogContractCount: true,
					discoveredResolverContractCount: true,
					subgraphBlockNumber: true,
					rpcBlockNumber: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
