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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitTreePathResolutionView from '$/views/GitTreePathResolutionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitTreePathResolution, {
					$repository: data.selector,
					commitObjectId: params.commitObjectId,
					path: params.path,
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.path || 'Git tree path resolution')} • Git tree path resolution • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git tree path resolution'} • Git tree path resolution • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitTreePathResolution, {
					$repository: data.selector,
					commitObjectId: params.commitObjectId,
					path: params.path,
				}))}

		<GitTreePathResolutionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
