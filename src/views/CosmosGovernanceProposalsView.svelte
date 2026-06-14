<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Governance proposals',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.CosmosGovernanceProposal>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosGovernanceProposal}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos governance proposals are SDK governance cosmosGovernanceProposals, separate from ADR design documents.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.CosmosSdk_Rest,
						],
						limit: 32,
					},
				} }),
			)}
			{@const proposals = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.CosmosGovernanceProposal>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CosmosGovernanceProposal}
				id={`${id}-items`}
				href={href}
				getKey={(proposal) => stringify(proposal[EntityMetaKey.Selector])}
				getSortValue={(proposal) => -Number(proposal[EntityMetaKey.Selector].proposalId)}
				open={true}
				resource={proposals}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No governance proposals listed yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<CosmosGovernanceProposalView selector={context!.item[EntityMetaKey.Selector]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
