<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
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
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrReaction>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary resource={selection({
					sources: selection.entityType === EntityType.NostrNote ?
						[Source.Constants_Internal]
					:
						[Source.NostrBand_Rest, Source.Primal_Rest],
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
						getKey={(reaction) => stringify(reaction[EntityMetaKey.Selector])}
						getSortValue={(reaction) => reaction[EntityMetaKey.Selector].eventId}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No reactions yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(nostr)/nostr/reaction/[eventId]', {
									eventId: item[EntityMetaKey.Selector].eventId,
								})}
							>
								<TruncatedValue
									value={item[EntityMetaKey.Selector].eventId}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
