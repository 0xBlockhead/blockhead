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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleIssue, {
		$repository: data.selector,
		issueId: params.issueId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleIssueView from '$/views/RadicleIssueView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle issue'} • radicle issue • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle issue'} • radicle issue • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleIssueView
		selection={pageSelection}
	/>
	{/if}
</Page>
