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
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinActor_Timestamp, {
					$actor: data.selector,
					height: BigInt(params.height),
					tipsetKey: params.tipsetKey,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin actor timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin actor timestamp')} • filecoin actor timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'filecoin actor timestamp'} • filecoin actor timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinActor_Timestamp, {
					$actor: data.selector,
					height: BigInt(params.height),
					tipsetKey: params.tipsetKey,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}

		<FilecoinActor_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
