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
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EnsName, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.name || 'ENS name')} • ENS name • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ENS name'} • ENS name • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EnsName, data.selector))}

		<EnsNameView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
