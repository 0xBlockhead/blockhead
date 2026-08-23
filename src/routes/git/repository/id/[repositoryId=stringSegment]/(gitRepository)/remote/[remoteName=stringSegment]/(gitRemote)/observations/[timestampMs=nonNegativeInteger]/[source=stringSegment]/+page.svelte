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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitFetchObservation, {
		$repository: data.selector,
		remoteName: params.remoteName,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitFetchObservationView from '$/views/GitFetchObservationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.remoteName || 'Git fetch observation')} • Git fetch observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git fetch observation'} • Git fetch observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitFetchObservationView
		selection={pageSelection}
	/>
	{/if}
</Page>
