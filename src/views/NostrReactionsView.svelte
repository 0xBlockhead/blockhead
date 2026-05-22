<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Reactions',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrReaction>
			href: string
			id: string
			limit?: number
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrReaction}
	{href}
	{id}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
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

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.NostrBand_Rest,
						Source.Primal_Rest,
					],
					[fieldName]: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
				},
			)}
			{@const reactions = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.NostrReaction>[] = (
						parent[fieldName] ?? []
					)
					return (
						rows
							.toSorted((a, b) => (
								`${String(-(b.createdAt ?? 0)).padStart(20, '0')}\0${b[EntityMetaKey.Id].eventId}`
									.localeCompare(
										`${String(-(a.createdAt ?? 0)).padStart(20, '0')}\0${a[EntityMetaKey.Id].eventId}`,
									)
							))
							.slice(0, limit)
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
				{href}
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
					item: row,
				})}
					{#if row}
						<NostrReactionView
							entityId={row.entityId}
							href={resolve('/nostr/reaction/[eventId]', {
								eventId: row.entityId.eventId,
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
