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
	import GitFetchObservationView from '$/views/GitFetchObservationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitFetchObservation, {
				$repository: data.selector,
				remoteName: params.remoteName,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.remoteName || 'Git fetch observation')} • Git fetch observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git fetch observation'} • Git fetch observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitFetchObservation, {
				$repository: data.selector,
				remoteName: params.remoteName,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<GitFetchObservationView
		selection={pageSelection}
	/>
	{/if}
</Page>
