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
	import LightningNode_TimestampView from '$/views/LightningNode_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningNode_Timestamp, {
					$node: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						alias: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'Lightning public node observation' : [(pageSelection.entity.alias ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'Lightning public node observation')} • Lightning public node observation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Lightning public node observation'} • Lightning public node observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningNode_Timestamp, {
					$node: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						alias: true,
					},
				}))}

		<LightningNode_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
