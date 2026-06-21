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
		title = 'Resolver sources',
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


<div data-column="gap-2">
	<EntitiesList
		entityType={EntityType.BlockheadSource}
	{id}
		{title}
		bind:open
	{collapsible}
		{...EntitiesListProps}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				Persistent records of data-source transports: base URLs and metadata used for repeated API access (RPC, REST, GraphQL).
			</p>
			<p>
				Browser wallets use EIP-1193 injection instead—address and chain selection there is session state, not an HTTP transport blockheadSource.
			</p>
		{/snippet}

		{#snippet body({ open: _bodyOpen })}
			{#if open}
				<ResourceBoundary resource={selection({
						sources: [Source.Local_Internal],
					})} placeholderText="Loading resolver sources…">
					{#snippet children(sources)}
						<EntitiesList
							collapsible={false}
							showSummary={false}
							data-entity-field-name={selection.fieldName}
							data-entity-field-parent={stringify(selection.entitySelector)}
							data-entity-field-type={selection.entityType}
							entityType={EntityType.BlockheadSource}
							getKey={(source) => stringify(source.entitySelector)}
							getSortValue={(source) => stringify(source.entitySelector)}
							open={true}
							items={sources.entities}
							{title}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">No resolver sources yet.</p>
							{/snippet}

							{#snippet Item({ item })}
								<BlockheadSourceView
						layout={EntityLayout.Summary}

						sourceId={item.entitySelector.id}
						title="Resolver source"
					/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
