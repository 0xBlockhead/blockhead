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
			entityId: EntityId<typeof schema, EntityType.CosmosGovernanceProposal>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const cosmosGovernanceProposal = useEntity(entityCollectionsContext, 
		EntityType.CosmosGovernanceProposal,
		entityId,
		({ fields: { title: true, status: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal}
	{entityId}
	title={entityId.proposalId}
	idDragPlainText={entityId.proposalId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.proposalId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Proposal </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosGovernanceProposal}
			placeholderText={`Loading Cosmos governance proposal...`}
		>
			{#snippet children(cosmosGovernanceProposal)}
				<dl>
					{#if cosmosGovernanceProposal.fields.title != null}
						<div>
							<dt>Title</dt>
							<dd>{cosmosGovernanceProposal.fields.title}</dd>
						</div>
					{/if}

					{#if cosmosGovernanceProposal.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{cosmosGovernanceProposal.fields.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
