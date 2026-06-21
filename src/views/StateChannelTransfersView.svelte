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
		title = 'Transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StateChannelTransfer>
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
	import StateChannelTransferView from '$/views/StateChannelTransferView.svelte'
</script>


<EntitiesList
	entityType={EntityType.StateChannelTransfer}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Directed off-chain movements between the two channel participants, ordered by turn.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No transfers on this channel yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading channel transfers…">
				{#snippet children(transfers)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.StateChannelTransfer}
				getKey={(transfer) => stringify(transfer.entitySelector)}
				getSortValue={(transfer) => stringify(transfer.entitySelector)}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'channel-transfers'}:items`}
				items={transfers.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No transfers on this channel yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<StateChannelTransferView
						selection={select(EntityType.StateChannelTransfer, item.entitySelector)}
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
