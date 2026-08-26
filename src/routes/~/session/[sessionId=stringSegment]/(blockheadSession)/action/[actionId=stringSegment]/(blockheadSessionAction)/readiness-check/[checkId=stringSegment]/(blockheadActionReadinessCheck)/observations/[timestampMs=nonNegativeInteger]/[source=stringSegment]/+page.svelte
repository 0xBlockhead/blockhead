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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadActionReadinessCheck_Timestamp, {
		$readinessCheck: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadActionReadinessCheck_TimestampView from '$/views/BlockheadActionReadinessCheck_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action readiness check timestamp' : pageSelection.entity.status || 'blockhead action readiness check timestamp')} • blockhead action readiness check timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead action readiness check timestamp'} • blockhead action readiness check timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadActionReadinessCheck_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
