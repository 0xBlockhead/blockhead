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
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeMirror, data.selector))}
			<title>{data?.title ?? ([pageSelection.entitySelector.owner, pageSelection.entitySelector.repositoryName].filter(Boolean).join(' ') || 'Git forge mirror')} • Git forge mirror • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git forge mirror'} • Git forge mirror • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeMirror, data.selector))}

		<GitForgeMirrorView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
