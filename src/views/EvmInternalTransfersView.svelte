<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Internal transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmInternalTransfer
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
</script>


<EntitiesList
	entityType={EntityType.EvmInternalTransfer}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
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

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[fieldName]: {
						$: [Source.Blockscout_Rest],
					},
				},
			)}
			{@const transfers = derive(
				parent,
				(parent) => (
					[...(parent[fieldName] ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmInternalTransfer}
				getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
				getSortValue={(line) => line.value[EntityMetaKey.Id].internalIndex}
				placeholderText="Loading internal transfers…"
				resource={transfers}
				{title}
				href={entitiesListRest.href ?? ''}
				id={`${entitiesListRest.id ?? 'internal-transfers'}:items`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No internal native transfers on this transaction.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const line = props.item.value}
						{@const transferId = line[EntityMetaKey.Id]}
						<EvmInternalTransferView
							entityId={transferId}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
									networkId: String(transferId.$network.chainId),
									transactionId: transferId.txHash,
								},
							)}
							layout={EntityLayout.SummaryDetails}
							open={false}
							showParentTransaction={false}
							showTypeAnnotation={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
