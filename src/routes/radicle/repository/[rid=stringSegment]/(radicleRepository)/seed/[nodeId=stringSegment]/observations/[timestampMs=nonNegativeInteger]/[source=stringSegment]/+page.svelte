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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadRadicleSeedObservation_Timestamp, {
		$repository: data.selector,
		nodeId: params.nodeId,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleSeedObservation_TimestampView from '$/views/BlockheadRadicleSeedObservation_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead radicle seed observation timestamp')} • blockhead radicle seed observation timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle seed observation timestamp'} • blockhead radicle seed observation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadRadicleSeedObservation_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
