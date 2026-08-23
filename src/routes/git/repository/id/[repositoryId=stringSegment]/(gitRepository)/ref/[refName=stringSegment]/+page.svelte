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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitRef, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.refName || 'Git ref')} • Git ref • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git ref'} • Git ref • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitRefView
		selection={pageSelection}
	/>
	{/if}
</Page>
