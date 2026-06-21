<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Saved sources',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadSource>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
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
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading sources…">
				{#snippet children(sources)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadSource}
						id={`${id}-items`}
						{title}
						open={true}
						items={sources.entities}
						getKey={(source) => stringify(source.entitySelector)}
						getSortValue={(source) => stringify(source.entitySelector)}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No saved endpoints yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadSourceView
							layout={EntityLayout.Summary}

							sourceId={item.entitySelector.id}
							title="Source"
						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
