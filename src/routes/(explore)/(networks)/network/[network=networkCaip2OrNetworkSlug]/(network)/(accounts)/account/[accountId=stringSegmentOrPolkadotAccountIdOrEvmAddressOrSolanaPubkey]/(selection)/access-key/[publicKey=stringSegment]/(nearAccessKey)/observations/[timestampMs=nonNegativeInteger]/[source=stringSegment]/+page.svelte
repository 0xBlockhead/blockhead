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
	import NearAccessKey_TimestampView from '$/views/NearAccessKey_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearAccessKey_Timestamp, {
					$accessKey: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'near access key timestamp')} • near access key timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near access key timestamp'} • near access key timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearAccessKey_Timestamp, {
					$accessKey: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<NearAccessKey_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
