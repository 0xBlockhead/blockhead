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
		title = 'Mempool',
		open = $bindable(true),
		entityFieldReference,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>
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
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row captures how many transactions were waiting in the mempool at one instant—pending versus queued.
		</p>
		<p>
			Samples appear when the execution client exposes txpool inspection for this chain.
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
			{@const txpoolTimestamps = derive(
				parent,
				(parent) => {
					const txpoolTimestamps: readonly Entity<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						txpoolTimestamps
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_Txpool_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={txpoolTimestamps}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					{@const rowId = row[EntityMetaKey.Id]}
					<EvmNetwork_Txpool_TimestampView
						entityId={rowId}
						href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]', {
							caip2Namespace: rowId.$network.caip2.namespace,
							caip2Reference: rowId.$network.caip2.reference,
						})}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
