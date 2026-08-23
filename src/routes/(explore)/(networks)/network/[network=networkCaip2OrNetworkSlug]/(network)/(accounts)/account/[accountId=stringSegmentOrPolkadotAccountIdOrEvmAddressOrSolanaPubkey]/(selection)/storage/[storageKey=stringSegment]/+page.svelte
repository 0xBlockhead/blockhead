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
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetStorageEntry, data.selector, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.storageKey || 'starknet storage entry')} • starknet storage entry • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'starknet storage entry'} • starknet storage entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetStorageEntry, data.selector, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
					],
				}))}

		<StarknetStorageEntryView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
