<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Gas',
		open = $bindable(true),
		entityFieldReference,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork_GasFee_Block>
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetwork_GasFee_Block}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Recent blocks from <code>eth_feeHistory</code>: base fee, fullness ratio, and priority fee at the 50th percentile per height.
		</p>
		<p>
			The head block row also includes suggested gas price and max priority fee from the RPC at resolve time.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.Voltaire_JsonRpc,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Voltaire_JsonRpc,
						],
						$limit: 64,
					},
				},
			)}
			{@const gasFeeBlocks = derive(
				parent,
				(parent) => {
					const gasFeeBlocks: Entity<typeof schema, EntityType.EvmNetwork_GasFee_Block>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						gasFeeBlocks
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_GasFee_Block}
				id={`${id}-items`}
				href={href}
				open={true}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					{@const rowId = gasFeeBlock[EntityMetaKey.Id]}
					<EvmNetwork_GasFee_BlockView
						entityId={rowId}
						href={resolve(
							'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]',
							{
								...caip2RouteParamsFromNetworkId(rowId.$network),
								blockNumber: String(rowId.blockNumber),
							},
						)}
						id={stringify(rowId)}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
