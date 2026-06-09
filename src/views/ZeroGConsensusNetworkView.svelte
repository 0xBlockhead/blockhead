<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGConsensusNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zeroGConsensusNetwork = useEntity(entityCollectionsContext, EntityType.ZeroGConsensusNetwork,
		entityId,
		({ fields: { sharedStakingStatusSource: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGConsensusNetwork}
	{entityId}
	title={entityId.consensusNetworkId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.consensusNetworkId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGConsensusNetwork}
			placeholderText={`Loading 0G consensus network...`}
		>
			{#snippet children(zeroGConsensusNetwork)}
				<dl>
					{#if zeroGConsensusNetwork.fields.sharedStakingStatusSource != null}
						<div>
							<dt>Shared staking status source</dt>
							<dd>{zeroGConsensusNetwork.fields.sharedStakingStatusSource}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
