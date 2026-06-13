<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.NostrBand_Rest,
						Source.Primal_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
				} }),
			)}
			{@const reactions = derive(
				parent,
				(parent) => {
					const nostrReactions: readonly Entity<typeof schema, EntityType.NostrReaction>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						nostrReactions
							.map((reaction) => ({
								entityId: reaction[EntityMetaKey.Id],
								sortKey: (
									`${String(-(reaction.createdAt ?? 0)).padStart(20, '0')}\0${reaction[EntityMetaKey.Id].eventId}`
								),
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrReaction}
				id={`${id}-items`}
				{title}
				resource={reactions}
				placeholderText="Loading reactions…"
				getKey={(row) => row.entityId.eventId}
				getSortValue={(row) => row.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No reactions yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: reaction,
				})}
					<NostrReactionView
						entityId={reaction.entityId}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
