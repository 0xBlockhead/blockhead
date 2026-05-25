<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Epochs',
		open = $bindable(true),
		collapsible = true,
				...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconEpoch>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconEpoch}
	{title}
	bind:open	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon epochs group consecutive consensus slots into fixed spans (32 slots per epoch on Ethereum mainnet—check the deployment you are on).
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = useEntity(
				EntityType.Network,
				entityFieldReference.entityId,
				{
					blockHeight: { $: [Source.Voltaire_JsonRpc] },
					$$beaconEpochs: { $: [Source.Beacon_Rest] },
				},
			)}
			{@const epochs = derive(
				network,
				(network): Entity<typeof schema, EntityType.BeaconEpoch>[] => (
					(network.$$beaconEpochs ?? []).slice(0, 16)
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<ResourceBoundary
					resource={epochs}
					placeholderText="Loading epochs…"
				>
					{#snippet children(epochs)}
						<OrderedList
							items={epochs}
							getKey={(epoch) => (
								epoch[EntityMetaKey.Id].epoch
							)}
							getSortKey={(epoch) => (
								-Number(epoch[EntityMetaKey.Id].epoch)
							)}
							placeholderRanges={[]}
							orientation={ListOrientation.Column}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No epochs yet.
								</p>
							{/snippet}

							{#snippet Item({ item: epoch })}
								<BeaconEpochView
									entityId={epoch[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/snippet}
						</OrderedList>
					{/snippet}
				</ResourceBoundary>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
