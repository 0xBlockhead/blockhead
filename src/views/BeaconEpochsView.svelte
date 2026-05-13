<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Epochs',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconEpoch>
			title?: string
			open?: boolean
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

	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		{
			blockHeight: { $: [Source.Voltaire_JsonRpc] },
			$$beaconEpochs: { $: [Source.Beacon_Rest] },
		},
	)

	const epochs = derive(
		network,
		(merged): Entity<typeof schema, EntityType.BeaconEpoch>[] => (
			(merged.$$beaconEpochs ?? [])
				.toSorted((a, b) => (
					Number(b[EntityMetaKey.Id].epoch - a[EntityMetaKey.Id].epoch)
				))
				.slice(0, 16)
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BeaconEpoch}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<ResourceBoundary
				resource={epochs}
				placeholderText="Loading epochs…"
			>
				{#snippet children(loaded)}
					<OrderedList
						items={loaded}
						getKey={(epoch) => (
							epoch[EntityMetaKey.Id].epoch
						)}
						placeholderRanges={[]}
						orientation={ListOrientation.Column}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No recent epochs for this network yet.
							</p>
						{/snippet}

						{#snippet Item({ item: epoch, isPlaceholder })}
							{#if isPlaceholder === false}
								<BeaconEpochView
									entityId={epoch[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
										{
											networkId: String(
												epoch[EntityMetaKey.Id].$network.chainId,
											),
											epochNumber: String(
												epoch[EntityMetaKey.Id].epoch,
											),
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/if}
						{/snippet}
					</OrderedList>
				{/snippet}
			</ResourceBoundary>
		{/key}
	{/snippet}
</EntitiesList>
