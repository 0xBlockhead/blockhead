<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
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

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


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
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
						Source.Voltaire_JsonRpc,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Voltaire_JsonRpc,
						],
						limit: 64,
					},
				} }),
			)}
			{@const gasFeeBlocks = derive(
				parent,
				(parent) => {
					const gasFeeBlocks: readonly Entity<typeof schema, EntityType.EvmNetwork_GasFee_Block>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
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
				resource={gasFeeBlocks}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					{@const rowId = row[EntityMetaKey.Id]}
					<EvmNetwork_GasFee_BlockView
						entityId={rowId}
						href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]', {
							caip2Namespace: rowId.$network.caip2.namespace,
							caip2Reference: rowId.$network.caip2.reference,
								blockNumber: String(rowId.blockNumber),
						})}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
