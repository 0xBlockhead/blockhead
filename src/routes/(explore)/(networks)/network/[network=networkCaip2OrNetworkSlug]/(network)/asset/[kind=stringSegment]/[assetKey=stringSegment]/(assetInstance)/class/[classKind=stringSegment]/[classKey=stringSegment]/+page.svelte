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
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetClass, {
					$assetInstance: data.selector,
					classKind: params.classKind,
					classKey: params.classKey,
				}, {
					fields: {
						label: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.classKey ?? '') || 'asset class' : [(pageSelection.entity.label ?? ''), pageSelection.entitySelector.classKey].filter(Boolean).join(' ') || 'asset class')} • asset class • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'asset class'} • asset class • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetClass, {
					$assetInstance: data.selector,
					classKind: params.classKind,
					classKey: params.classKey,
				}, {
					fields: {
						label: true,
					},
				}))}

		<AssetClassView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
