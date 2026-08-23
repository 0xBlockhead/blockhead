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
	import GitRemoteView from '$/views/GitRemoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRemote, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.remoteName || 'Git remote')} • Git remote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git remote'} • Git remote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRemote, data.selector)}

	<GitRemoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
