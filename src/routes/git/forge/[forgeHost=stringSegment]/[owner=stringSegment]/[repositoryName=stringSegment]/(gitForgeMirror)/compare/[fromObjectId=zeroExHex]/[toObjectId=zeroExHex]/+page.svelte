<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeCompareView from '$/views/GitForgeCompareView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitForgeCompare, data.selector, {
				sources: [
					Source.Gitlab_Rest,
				],
			})}
		<title>{data?.title ?? ([pageSelection.entitySelector.fromObjectId, pageSelection.entitySelector.toObjectId].filter(Boolean).join(' ') || 'Git forge compare')} • Git forge compare • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge compare'} • Git forge compare • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitForgeCompare, data.selector, {
				sources: [
					Source.Gitlab_Rest,
				],
			})}

	<GitForgeCompareView
		selection={pageSelection}
	/>
	{/if}
</Page>
