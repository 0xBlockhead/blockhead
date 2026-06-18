<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
		import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
		import { resolve } from '$app/paths'


	// State
	let {
		title = 'Gas',
		open = $bindable(true),
		selection,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()



	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						sources: [Source.Voltaire_JsonRpc],
						limit: 64,
					})}
				placeholderText="Loading gasFeeBlocks…"
			>
				{#snippet children(gasFeeBlocks)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_GasFee_Block}
				id={`${id}-items`}
				href={href}
				open={true}
				items={gasFeeBlocks.entities}
			>
				{#snippet Item({ item })}
					{@const row = item}
					{@const rowId = row.entitySelector}
					<EvmNetwork_GasFee_BlockView
						selector={rowId}
						href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber]', {
							caip2: `${rowId.$network.caip2.namespace}:${rowId.$network.caip2.reference}`,
								blockNumber: String(rowId.blockNumber),
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
