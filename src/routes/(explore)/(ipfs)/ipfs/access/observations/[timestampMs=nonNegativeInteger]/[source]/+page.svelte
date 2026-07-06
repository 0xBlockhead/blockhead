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
	import GlobalIpfsAccess_TimestampView from '$/views/_GlobalIpfsAccess_TimestampView.svelte'
</script>


<svelte:head>
	<title>global IPFS access timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccess_TimestampView
		href={
			resolve('/(explore)/(ipfs)/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalIpfsAccess_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					declaredAccessEndpointCount: true,
					reachableAccessEndpointCount: true,
					observedResourceCount: true,
					seededExampleCount: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
