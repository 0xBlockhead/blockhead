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
	// State
	let {
		title = 'Finality',
		open = $bindable(true),
		entityFieldReference,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
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
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Beacon_Rest,
						],
						limit: 8,
					},
				} }),
			)}
			{@const beaconFinalityTimestamps = derive(
				parent,
				(parent) => {
					const beaconFinalityTimestamps: readonly Entity<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						beaconFinalityTimestamps
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumBeaconFinality_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={beaconFinalityTimestamps}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					<EthereumBeaconFinality_TimestampView
						selector={row[EntityMetaKey.Selector]}
						layout={EntityLayout.SummaryDetails}
						open={true}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
