<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		title = 'Token transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmTokenTransfer
			>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: (
							entityFieldReference.entityType === EntityType.EvmNetwork ?
								[
									Source.Blockscout_Rest,
								]
							:
								[
									Source.Blockscout_Rest,
									Source.Etherscan_Rest,
								]
						),
					},
				} }),
			)}
			{@const transfers = derive(
				parent,
				(parent) => (
					[...(parent.fields[entityFieldReference.fieldName]?.values ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTokenTransfer}
				getKey={(line) => stringify(line.value[EntityMetaKey.Selector])}
				getSortValue={(line) => (
					line.value[EntityMetaKey.Selector].logIndex
					+ (line.value[EntityMetaKey.Selector].transferIndex / 1000)
			)}
				placeholderText="Loading token transfers…"
				resource={transfers}
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
					{@const transferId = line[EntityMetaKey.Selector]}
					<EvmTokenTransferView
						selector={transferId}
						layout={EntityLayout.SummaryDetails}
						open={false}
						showParentTransaction={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
