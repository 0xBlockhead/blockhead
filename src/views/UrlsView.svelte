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
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		fieldSources,
		title = 'URLs',
		emptyText = 'No URLs in this list yet.',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Url>
			fieldSources: readonly Source[]
			title?: string
			emptyText?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'id'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Url}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Each row is a normal HTTPS (or similar) link, usually enriched from page metadata when available.
			</p>
			<p>
				This is separate from Swarm <code>bzz</code> addresses, on-chain topics, pool contracts, or chat threads.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: fieldSources,
			},
		},
	)}
			{@const urls = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.Url>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			const byUrl = new Map<string, Entity<typeof schema, EntityType.Url>>()
			for (const row of rows) {
				const key = row[EntityMetaKey.Id].url
				if (byUrl.has(key)) continue
				byUrl.set(key, row)
			}
			return (
				[...byUrl.values()]
					.map((value) => ({ value }))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Url}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(envelope) => envelope.value[EntityMetaKey.Id].url}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].url}
				resource={urls}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
							<p data-text="muted">
								{emptyText}
							</p>
						{/snippet}

				{#snippet Item({ item: envelope })}
							<UrlView
								entityId={envelope.value[EntityMetaKey.Id]}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
