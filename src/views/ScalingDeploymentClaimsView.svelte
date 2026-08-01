<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				sourceProjectId: true,
				scalingDeploymentClaimId: true,
				source: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: scalingDeploymentClaim })}
		{@const scalingDeploymentClaimSelector = scalingDeploymentClaim[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ScalingDeploymentClaim}
			entitySelector={scalingDeploymentClaimSelector}
		>
			{#snippet Title()}
				{[scalingDeploymentClaimSelector.sourceProjectId, (scalingDeploymentClaim.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim'}
			{/snippet}

			{#snippet Value()}
				{[scalingDeploymentClaimSelector.sourceProjectId, (scalingDeploymentClaim.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[scalingDeploymentClaimSelector.source, scalingDeploymentClaim.$network.name || (scalingDeploymentClaimSelector.$network.caip2 == null ? '' : `${scalingDeploymentClaimSelector.$network.caip2.namespace}:${scalingDeploymentClaimSelector.$network.caip2.reference}`) || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
