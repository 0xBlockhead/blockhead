<script lang="ts">
import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Reactions',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrReaction>
			id: string
			limit?: number
			open?: boolean
			title?: string
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrReaction}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-7 reaction events attach emoji or “+” content to a target kind-1 note via an <code>e</code>-tag.
		</p>
		<p>
			Reaction event ids are 64-character lowercase hex hashes; lists resolve on a note’s <code>$$reactions</code> field through NostrBand and Primal indexers.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No reactions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [
						Source.NostrBand_Rest,
						Source.Primal_Rest,
					],
					}
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.NostrBand_Rest,
						Source.Primal_Rest,
					],
					limit,
					fields: {
						createdAt: true,
					},
				})} placeholderText="Loading reactions…">
				{#snippet children(reactions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrReaction}
						id={`${id}-items`}
						{title}
						open={true}
						items={reactions.entities}
						getKey={(reaction) => reaction.entitySelector.eventId}
						getSortValue={(reaction) => `${String(-(reaction.current?.createdAt ?? 0)).padStart(20, '0')}\0${reaction.entitySelector.eventId}`}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No reactions yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<NostrReactionView
							selector={item.entitySelector}
							layout={EntityLayout.SummaryDetails}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
