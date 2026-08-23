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
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalancheValidator, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'avalanche validator')} • avalanche validator • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'avalanche validator'} • avalanche validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalancheValidator, data.selector))}

		<AvalancheValidatorView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
