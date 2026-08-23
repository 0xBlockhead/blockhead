<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import GmxPositionView from '$/views/GmxPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GmxPosition, {
					$account: data.selector,
					contractKey: params.contractKey,
				}, {
					sources: [
						Source.Gmx_Rest,
					],
					fields: {
						indexName: true,
						poolName: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'GMX position' : [(pageSelection.entity.indexName ?? ''), (pageSelection.entity.poolName ?? '')].filter(Boolean).join(' ') || 'GMX position')} • GMX position • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'GMX position'} • GMX position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GmxPosition, {
					$account: data.selector,
					contractKey: params.contractKey,
				}, {
					sources: [
						Source.Gmx_Rest,
					],
					fields: {
						indexName: true,
						poolName: true,
					},
				}))}

		<GmxPositionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
