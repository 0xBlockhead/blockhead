<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ScalingDeploymentClaim, data.selector, {
					sources: [data.selector.source],
					fields: {
						scalingDeploymentClaimId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.sourceProjectId ?? '') || 'scaling deployment claim' : [pageSelection.entitySelector.sourceProjectId, (pageSelection.entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')} • scaling deployment claim • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'scaling deployment claim'} • scaling deployment claim • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ScalingDeploymentClaim, data.selector, {
					sources: [data.selector.source],
					fields: {
						scalingDeploymentClaimId: true,
					},
				}))}

		<ScalingDeploymentClaimView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
