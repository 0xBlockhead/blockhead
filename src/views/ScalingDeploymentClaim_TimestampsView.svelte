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
	}: EntityListViewProps<EntityType.ScalingDeploymentClaim_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ScalingDeploymentClaim_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				architectureKind: true,
				protocolLabel: true,
				timestampMs: true,
				stack: true,
				proofSystemKind: true,
				$claim: true,
			},
		})
	}
>
	{#snippet Item({ item: scalingDeploymentClaimTimestamp })}
		{@const scalingDeploymentClaimTimestampSelector = scalingDeploymentClaimTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ScalingDeploymentClaim_Timestamp}
			entitySelector={scalingDeploymentClaimTimestampSelector}
		>
			{#snippet Title()}
				{[(scalingDeploymentClaimTimestamp.architectureKind ?? ''), (scalingDeploymentClaimTimestamp.protocolLabel ?? ''), String(scalingDeploymentClaimTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'scaling deployment claim timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(scalingDeploymentClaimTimestamp.architectureKind ?? ''), (scalingDeploymentClaimTimestamp.stack ?? ''), (scalingDeploymentClaimTimestamp.proofSystemKind ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[scalingDeploymentClaimTimestampSelector.$claim.sourceProjectId, (scalingDeploymentClaimTimestamp.$claim.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
