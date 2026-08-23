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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MoveModule, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.moduleName || 'move module')} • move module • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'move module'} • move module • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MoveModule, data.selector))}

		<MoveModuleView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
