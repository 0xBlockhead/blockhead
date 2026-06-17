<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
		import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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

	import { proxy } from '$/routes/+layout.svelte'


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Blockscout_Rest, Source.Etherscan_Rest],
						limit: 64,
					})}
				placeholderText="Loading gasEstimateTimestamps…"
			>
				{#snippet children(gasEstimateTimestamps)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				items={gasEstimateTimestamps.entities}
			>
				{#snippet Item({ item })}
					{@const row = item}
					{@const rowId = row.entitySelector}
					<EvmNetwork_GasEstimate_TimestampView
						selector={rowId}
						href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: ,
						})}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
