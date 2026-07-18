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

	const pageSelection = $derived(select(EntityType._GlobalIpfsAccess_Timestamp, {
		$hub: {
			scope: '_GlobalIpfsAccess',
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$hub: {
				scope: '_GlobalIpfsAccess',
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'global IPFS access timestamp' : 'global IPFS access timestamp'))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccess_TimestampView from '$/views/_GlobalIpfsAccess_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • global IPFS access timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccess_TimestampView
		href={
			resolve('/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
