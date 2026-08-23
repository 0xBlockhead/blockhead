<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessage_TimestampView from '$/views/FilecoinMessage_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessage_Timestamp, {
					$message: data.selector,
					height: BigInt(params.height),
					tipsetKey: params.tipsetKey,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin message timestamp')} • filecoin message timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'filecoin message timestamp'} • filecoin message timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessage_Timestamp, {
					$message: data.selector,
					height: BigInt(params.height),
					tipsetKey: params.tipsetKey,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}

		<FilecoinMessage_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
