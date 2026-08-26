<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitObject, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.objectId || 'Git object')} • Git object • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git object'} • Git object • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitObjectView
		selection={pageSelection}
	/>
	{/if}
</Page>
