<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRef, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.refName || 'Git ref')} • Git ref • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git ref'} • Git ref • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRef, data.selector)}

	<GitRefView
		selection={pageSelection}
	/>
	{/if}
</Page>
