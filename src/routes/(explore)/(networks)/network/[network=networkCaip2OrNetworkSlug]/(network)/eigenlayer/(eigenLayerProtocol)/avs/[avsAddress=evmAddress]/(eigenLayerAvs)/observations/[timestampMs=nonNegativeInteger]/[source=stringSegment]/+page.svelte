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
	import EigenLayerAvs_TimestampView from '$/views/EigenLayerAvs_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'eigen layer avs timestamp'} • eigen layer avs timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerAvs_TimestampView
		selection={
			select(EntityType.EigenLayerAvs_Timestamp, {
				$avs: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
