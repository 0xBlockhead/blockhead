<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
	<title>{data?.title ?? 'Network timestamp'} • Network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Network_TimestampView
		selection={
			select(EntityType.Network_Timestamp, {
				$network: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
