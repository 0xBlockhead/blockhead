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
	import TezosBigMap_TimestampView from '$/views/TezosBigMap_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMap_Timestamp, {
					$bigMap: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'tezos big map timestamp'} • tezos big map timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos big map timestamp'} • tezos big map timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMap_Timestamp, {
					$bigMap: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TezosBigMap_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
