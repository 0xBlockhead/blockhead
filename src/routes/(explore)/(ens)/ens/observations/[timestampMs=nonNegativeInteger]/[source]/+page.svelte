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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalEnsNetwork_TimestampView
		href={
			resolve('/(explore)/(ens)/ens/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalEnsNetwork_Timestamp, {
				$hub: {
					scope: '_GlobalEnsNetwork',
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$hub: {
					scope: '_GlobalEnsNetwork',
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
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
			})
		}
	/>
</Page>
