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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CelestiaNamespace, data.selector, {
					sources: [
						Source.Celenium_Rest,
					],
					fields: {
						label: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.namespaceId ?? '') || 'celestia namespace' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.namespaceId || 'celestia namespace')} • celestia namespace • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'celestia namespace'} • celestia namespace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CelestiaNamespace, data.selector, {
					sources: [
						Source.Celenium_Rest,
					],
					fields: {
						label: true,
					},
				}))}

		<CelestiaNamespaceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
