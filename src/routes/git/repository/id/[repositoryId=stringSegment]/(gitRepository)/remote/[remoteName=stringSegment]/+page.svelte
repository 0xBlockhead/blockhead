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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitRemote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRemoteView from '$/views/GitRemoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.remoteName || 'Git remote')} • Git remote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git remote'} • Git remote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitRemoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
