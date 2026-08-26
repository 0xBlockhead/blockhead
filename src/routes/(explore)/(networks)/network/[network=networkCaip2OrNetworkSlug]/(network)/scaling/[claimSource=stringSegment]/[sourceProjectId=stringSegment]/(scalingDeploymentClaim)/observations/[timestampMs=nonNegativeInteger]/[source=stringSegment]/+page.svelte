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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ScalingDeploymentClaim_Timestamp, {
		$claim: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			architectureKind: true,
			protocolLabel: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ScalingDeploymentClaim_TimestampView from '$/views/ScalingDeploymentClaim_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'scaling deployment claim timestamp' : [(pageSelection.entity.architectureKind ?? ''), (pageSelection.entity.protocolLabel ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'scaling deployment claim timestamp')} • scaling deployment claim timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'scaling deployment claim timestamp'} • scaling deployment claim timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ScalingDeploymentClaim_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
