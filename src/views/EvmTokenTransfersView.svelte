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
		title = 'Token transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTokenTransfer>
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
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTokenTransfer}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ERC-20, ERC-721, and ERC-1155 movements indexed from receipt logs on this transaction.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No token transfers on this transaction.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: selection.entityType === EntityType.EvmNetwork ? [Source.Blockscout_Rest] : [Source.Blockscout_Rest, Source.Etherscan_Rest],
					})}
				placeholderText="Loading transfers…"
			>
				{#snippet children(transfers)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTokenTransfer}
				getKey={(line) => stringify(line.entitySelector)}
				getSortValue={(line) => (
					line.entitySelector.logIndex
					+ (line.entitySelector.transferIndex / 1000)
			)}
				placeholderText="Loading token transfers…"
				items={transfers.entities}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'token-transfers'}:items`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No token transfers on this transaction.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const transferId = line.entitySelector}
					<EvmTokenTransferView
						selection={select(EntityType.EvmTokenTransfer, transferId)}
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
