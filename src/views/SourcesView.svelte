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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Saved sources',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSource
			>
			title?: string
			open?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.BlockheadSource}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Saved HTTP or GraphQL base URLs (and related config) used to reach indexers, RPC nodes, or market APIs.
		</p>
		<p>
			They are data-plane endpoints for on-chain and market queries—separate from wallet keys, generic web bookmarks, or object gateways.
		</p>
		<p>
			Storing a named base URL is for repeatable resolver or client configuration—distinct from one-off bookmarks or signing material.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No saved endpoints yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const sources = derive(
				parent,
				(parent) => {
					const blockheadSources: Entity<typeof schema, EntityType.BlockheadSource>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						blockheadSources.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadSource}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				id={`${id}-items`}
				open={true}
				resource={sources}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No saved endpoints yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const srcId = item.value[EntityMetaKey.Id]}
					<BlockheadSourceView
						layout={EntityLayout.Summary}
						open={false}
						sourceId={srcId.id}
						title="Source"
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
