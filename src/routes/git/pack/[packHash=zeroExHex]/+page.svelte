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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitPackfile, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitPackfileView from '$/views/GitPackfileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.packHash || 'Git packfile')} • Git packfile • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git packfile'} • Git packfile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitPackfileView
		selection={pageSelection}
	/>
	{/if}
</Page>
