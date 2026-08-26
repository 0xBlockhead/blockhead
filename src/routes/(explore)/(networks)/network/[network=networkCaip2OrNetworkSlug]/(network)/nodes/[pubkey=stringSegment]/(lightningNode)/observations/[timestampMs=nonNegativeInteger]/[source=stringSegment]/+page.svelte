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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LightningNode_Timestamp, {
		$node: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			alias: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNode_TimestampView from '$/views/LightningNode_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'Lightning public node observation' : [(pageSelection.entity.alias ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'Lightning public node observation')} • Lightning public node observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning public node observation'} • Lightning public node observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LightningNode_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
