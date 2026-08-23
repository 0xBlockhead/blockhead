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
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerAvs_Timestamp, {
				$avs: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'eigen layer avs timestamp'} • eigen layer avs timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer avs timestamp'} • eigen layer avs timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerAvs_Timestamp, {
				$avs: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<EigenLayerAvs_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
