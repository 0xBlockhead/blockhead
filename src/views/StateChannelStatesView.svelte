<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
		title = 'States',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StateChannelState>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import StateChannelStateView from '$/views/StateChannelStateView.svelte'
</script>


<EntitiesList
	entityType={EntityType.StateChannelState}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed channel snapshots for this bilateral ledger, newest version first in the catalog.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No signed states on this channel yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading channel states…">
				{#snippet children(states)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.StateChannelState}
						getKey={(item) => stringify(item.entitySelector)}
						getSortValue={(item) => stringify(item.entitySelector)}
						{title}
						href={EntitiesListProps.href ?? ''}
						id={`${EntitiesListProps.id ?? 'channel-states'}:items`}
						items={states.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No signed states on this channel yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<StateChannelStateView
								selection={select(EntityType.StateChannelState, item.entitySelector)}
								layout={EntityLayout.Summary}

								collapsible={false}
						showParentChannel={false}
								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
