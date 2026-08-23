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
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MevBuilder, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.builderPubkey || 'MEV builder')} • MEV builder • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'MEV builder'} • MEV builder • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MevBuilder, data.selector))}

		<MevBuilderView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
