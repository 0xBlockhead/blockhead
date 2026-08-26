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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeProtectedBranch, {
		$forgeMirror: data.selector,
		name: params.name,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeProtectedBranchView from '$/views/GitForgeProtectedBranchView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.name || 'Git forge protected branch')} • Git forge protected branch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge protected branch'} • Git forge protected branch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeProtectedBranchView
		selection={pageSelection}
	/>
	{/if}
</Page>
