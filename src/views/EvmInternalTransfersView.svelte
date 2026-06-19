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
		title = 'Internal transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmInternalTransfer>
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
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmInternalTransfer}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Native currency sent by internal <code>CALL</code> frames during execution, distinct from the signed envelope <code>value</code>.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No internal native transfers on this transaction.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Blockscout_Rest, Source.Voltaire_JsonRpc],
					})}
				placeholderText="Loading transfers…"
			>
				{#snippet children(transfers)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmInternalTransfer}
				getKey={(line) => stringify(line.entitySelector)}
				getSortValue={(line) => line.entitySelector.internalIndex}
				placeholderText="Loading internal transfers…"
				items={transfers.entities}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'internal-transfers'}:items`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No internal native transfers on this transaction.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const transferId = item.entitySelector}
					<EvmInternalTransferView
						selection={select(EntityType.EvmInternalTransfer, transferId)}
						layout={EntityLayout.SummaryDetails}

						showParentTransaction={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
