<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ScalingDeploymentClaim> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ScalingDeploymentClaim}
	bind:open
	resource={
		selection({
			...{
				fields: {
					sourceProjectId: true,
					scalingDeploymentClaimId: true,
					source: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: scalingDeploymentClaim })}
		{@const scalingDeploymentClaimSelector = scalingDeploymentClaim[EntityMetaKey.Selector]}
		{@const network = scalingDeploymentClaimSelector.$network}
		<EntityView
			entityType={EntityType.ScalingDeploymentClaim}
			entitySelector={scalingDeploymentClaimSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/scaling/[claimSource=stringSegment]/[sourceProjectId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						claimSource: scalingDeploymentClaimSelector.source,
						sourceProjectId: scalingDeploymentClaimSelector.sourceProjectId,
					}
				)
			}
		>
			{#snippet Title()}
				{[scalingDeploymentClaimSelector.sourceProjectId, (scalingDeploymentClaim.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim'}
			{/snippet}

			{#snippet Value()}
				{[scalingDeploymentClaimSelector.sourceProjectId, (scalingDeploymentClaim.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[scalingDeploymentClaimSelector.source, scalingDeploymentClaim.$network.name || `${scalingDeploymentClaim.$network.caip2.namespace}:${scalingDeploymentClaim.$network.caip2.reference}` || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
