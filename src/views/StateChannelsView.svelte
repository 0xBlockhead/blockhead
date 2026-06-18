<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'State channels',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id: string
			open?: boolean
			collapsible?: boolean
			title?: string
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
	import Tooltip from '$/components/Tooltip.svelte'
	import StateChannelView from '$/views/StateChannelView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={selection.fieldName}
	data-entity-field-parent={stringify(selection.entitySelector)}
	data-entity-field-type={selection.entityType}
	entityType={EntityType.StateChannel}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			State channels are off-chain bilateral ledgers between two participants with on-chain settlement—not chat apps, AMM pools, or receipt logs.
		</p>
		<p>
			Rows come from the local catalog until a live channel indexer is wired.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No state channels in this datastore yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Participants update a joint ledger off-chain and settle or challenge on-chain if cooperation stops.
					</p>
					<p>
						Not chat apps, AMM pools, or receipt logs.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About state channels"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading state channels…">
				{#snippet children(stateChannels)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={selection.fieldName}
				data-entity-field-parent={stringify(selection.entitySelector)}
				data-entity-field-type={selection.entityType}
				entityType={EntityType.StateChannel}
				getKey={(stateChannel) => stringify(stateChannel.entitySelector)}
				getSortValue={(stateChannel) => stateChannel.entitySelector.id}
				open={true}
				items={stateChannels.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<div data-row="wrap align-center gap-2">
						<p data-text="muted">
							No state channels in this datastore yet.
						</p>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Participants update a joint ledger off-chain and settle or challenge on-chain if cooperation stops.
								</p>
								<p>
									Not chat apps, AMM pools, or receipt logs.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="About state channels"
							>ⓘ</abbr>
						</Tooltip>
					</div>
				{/snippet}

				{#snippet Item({ item })}
					<StateChannelView
						selector={item.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
