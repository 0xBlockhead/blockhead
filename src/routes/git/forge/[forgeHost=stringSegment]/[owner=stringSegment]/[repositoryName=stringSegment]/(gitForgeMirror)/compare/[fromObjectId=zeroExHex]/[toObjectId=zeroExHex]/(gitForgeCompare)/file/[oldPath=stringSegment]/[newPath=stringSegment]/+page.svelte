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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeCompareFileChange, {
		$compare: data.selector,
		oldPath: decodeURIComponent(params.oldPath),
		newPath: decodeURIComponent(params.newPath),
	}, {
		sources: [
			Source.Gitlab_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeCompareFileChangeView from '$/views/GitForgeCompareFileChangeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.newPath || 'Git forge compare file change')} • Git forge compare file change • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge compare file change'} • Git forge compare file change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeCompareFileChangeView
		selection={pageSelection}
	/>
	{/if}
</Page>
