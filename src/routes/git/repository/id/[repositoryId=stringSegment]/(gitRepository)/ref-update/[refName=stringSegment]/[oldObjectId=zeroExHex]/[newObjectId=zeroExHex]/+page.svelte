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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitRefUpdate, {
		$repository: data.selector,
		refName: params.refName,
		oldObjectId: params.oldObjectId,
		newObjectId: params.newObjectId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefUpdateView from '$/views/GitRefUpdateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.refName || 'Git ref update')} • Git ref update • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git ref update'} • Git ref update • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitRefUpdateView
		selection={pageSelection}
	/>
	{/if}
</Page>
