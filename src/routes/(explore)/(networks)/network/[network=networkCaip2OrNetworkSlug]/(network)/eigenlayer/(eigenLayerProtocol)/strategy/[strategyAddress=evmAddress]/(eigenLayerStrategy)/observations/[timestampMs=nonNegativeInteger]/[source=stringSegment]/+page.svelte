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
	import EigenLayerStrategy_TimestampView from '$/views/EigenLayerStrategy_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'eigen layer strategy timestamp'} • eigen layer strategy timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerStrategy_TimestampView
		selection={
			select(EntityType.EigenLayerStrategy_Timestamp, {
				$strategy: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
