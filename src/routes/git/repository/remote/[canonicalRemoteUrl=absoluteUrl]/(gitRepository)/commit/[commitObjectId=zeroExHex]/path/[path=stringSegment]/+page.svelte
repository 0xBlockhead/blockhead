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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitTreePathResolution, {
		$repository: data.selector,
		commitObjectId: params.commitObjectId,
		path: params.path,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitTreePathResolutionView from '$/views/GitTreePathResolutionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.path || 'Git tree path resolution')} • Git tree path resolution • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git tree path resolution'} • Git tree path resolution • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitTreePathResolutionView
		selection={pageSelection}
	/>
	{/if}
</Page>
