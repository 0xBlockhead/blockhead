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
	import TezosBigMapKey_TimestampView from '$/views/TezosBigMapKey_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMapKey_Timestamp, {
					$bigMapKey: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'tezos big map key timestamp'} • tezos big map key timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos big map key timestamp'} • tezos big map key timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMapKey_Timestamp, {
					$bigMapKey: data.selector,
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TezosBigMapKey_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
