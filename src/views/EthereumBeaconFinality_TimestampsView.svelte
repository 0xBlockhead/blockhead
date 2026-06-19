<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		title = 'Finality',
		open = $bindable(true),
		selection,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
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
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a head-state snapshot of justified and finalized beacon checkpoints (epoch and root pairs) from the consensus REST API.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Beacon_Rest,
						],
						limit: 8,
					})}
				placeholderText="Loading finality…"
			>
				{#snippet children(beaconFinalityTimestamps)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumBeaconFinality_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				items={beaconFinalityTimestamps.entities}
			>
				{#snippet Item({ item })}
					<EthereumBeaconFinality_TimestampView
						selection={select(EntityType.EthereumBeaconFinality_Timestamp, item.entitySelector)}
						layout={EntityLayout.SummaryDetails}
						open={true}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
