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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ScalingDeploymentClaim, data.selector, {
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
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.sourceProjectId ?? '') || 'scaling deployment claim' : [pageSelection.entitySelector.sourceProjectId, (pageSelection.entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')} • scaling deployment claim • Blockhead</title>
</svelte:head>


<Page>
	<ScalingDeploymentClaimView
		selection={pageSelection}
	/>
</Page>
