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
		title = 'Gas estimates',
		open = $bindable(true),
		entityFieldReference,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a timestamped explorer-oracle gas snapshot with suggested slow, average, and fast tiers in gwei.
		</p>
		<p>
			Rows may come from Blockscout stats or Etherscan <code>gasoracle</code>.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
						Source.Blockscout_Rest,
						Source.Etherscan_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Blockscout_Rest,
							Source.Etherscan_Rest,
						],
						limit: 64,
					},
				} }),
			)}
			{@const gasEstimateTimestamps = derive(
				parent,
				(parent) => {
					const gasEstimateTimestamps: readonly Entity<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						gasEstimateTimestamps
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={gasEstimateTimestamps}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					{@const rowId = row[EntityMetaKey.Id]}
					<EvmNetwork_GasEstimate_TimestampView
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
