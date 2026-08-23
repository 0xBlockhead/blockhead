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
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitObject, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.objectId || 'Git object')} • Git object • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git object'} • Git object • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitObject, data.selector))}

		<GitObjectView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
