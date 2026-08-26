<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeCompare, data.selector, {
		sources: [
			Source.Gitlab_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeCompareView from '$/views/GitForgeCompareView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ([pageSelection.entitySelector.fromObjectId, pageSelection.entitySelector.toObjectId].filter(Boolean).join(' ') || 'Git forge compare')} • Git forge compare • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge compare'} • Git forge compare • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeCompareView
		selection={pageSelection}
	/>
	{/if}
</Page>
