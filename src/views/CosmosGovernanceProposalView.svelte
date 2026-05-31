<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const cosmosGovernanceProposal = useEntity(
		EntityType.CosmosGovernanceProposal,
		entityId,
		{
			title: {},
			status: {},
		},
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
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosGovernanceProposal}
			placeholderText={`Loading Cosmos governance proposal...`}
		>
			{#snippet children(cosmosGovernanceProposal)}
				<dl>
					{#if cosmosGovernanceProposal.title != null}
						<div>
							<dt>Title</dt>
							<dd>{cosmosGovernanceProposal.title}</dd>
						</div>
					{/if}

					{#if cosmosGovernanceProposal.status != null}
						<div>
							<dt>Status</dt>
							<dd>{cosmosGovernanceProposal.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
