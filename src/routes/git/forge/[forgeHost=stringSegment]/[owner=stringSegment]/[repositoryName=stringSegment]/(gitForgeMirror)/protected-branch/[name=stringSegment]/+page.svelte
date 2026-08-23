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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeProtectedBranchView from '$/views/GitForgeProtectedBranchView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitForgeProtectedBranch, {
				$forgeMirror: data.selector,
				name: params.name,
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.name || 'Git forge protected branch')} • Git forge protected branch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge protected branch'} • Git forge protected branch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitForgeProtectedBranch, {
				$forgeMirror: data.selector,
				name: params.name,
			})}

	<GitForgeProtectedBranchView
		selection={pageSelection}
	/>
	{/if}
</Page>
