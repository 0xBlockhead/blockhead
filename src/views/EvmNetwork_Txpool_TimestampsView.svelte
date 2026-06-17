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

	import { proxy } from '$/routes/+layout.svelte'


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Voltaire_JsonRpc],
						limit: 64,
					})}
				placeholderText="Loading txpoolTimestamps…"
			>
				{#snippet children(txpoolTimestamps)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork_Txpool_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				items={txpoolTimestamps.entities}
			>
				{#snippet Item({ item })}
					{@const row = item}
					{@const rowId = row.entitySelector}
					<EvmNetwork_Txpool_TimestampView
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
