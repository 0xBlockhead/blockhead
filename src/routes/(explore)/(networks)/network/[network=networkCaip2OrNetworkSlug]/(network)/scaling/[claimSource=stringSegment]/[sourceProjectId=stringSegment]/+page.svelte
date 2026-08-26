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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ScalingDeploymentClaim, data.selector, {
		sources: [data.selector.source],
		fields: {
			scalingDeploymentClaimId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.sourceProjectId ?? '') || 'scaling deployment claim' : [pageSelection.entitySelector.sourceProjectId, (pageSelection.entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')} • scaling deployment claim • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'scaling deployment claim'} • scaling deployment claim • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ScalingDeploymentClaimView
		selection={pageSelection}
	/>
	{/if}
</Page>
