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
	import ScalingDeploymentClaim_TimestampView from '$/views/ScalingDeploymentClaim_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ScalingDeploymentClaim_Timestamp, {
				$claim: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					architectureKind: true,
					protocolLabel: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'scaling deployment claim timestamp' : [(pageSelection.entity.architectureKind ?? ''), (pageSelection.entity.protocolLabel ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'scaling deployment claim timestamp')} • scaling deployment claim timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'scaling deployment claim timestamp'} • scaling deployment claim timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ScalingDeploymentClaim_Timestamp, {
				$claim: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					architectureKind: true,
					protocolLabel: true,
				},
			})}

	<ScalingDeploymentClaim_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
