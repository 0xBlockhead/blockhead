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


	// Props
	let {
		entityFieldReference,
		title = 'Contracts',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmContract>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
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
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmContract}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Verified explorer contracts only—bytecode and ABI metadata the explorer indexed for this network.
		</p>
		<p>
			Precompiles and unverified addresses are listed separately.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = useEntity(
				EntityType.Network,
				entityFieldReference.entityId,
				{
					blockHeight: { $: [Source.Voltaire_JsonRpc] },
					$$contracts: { $: [Source.Blockscout_Rest] },
				},
			)}
			{@const contracts = derive(
				network,
				(network): Entity<typeof schema, EntityType.EvmContract>[] => (
					(network.$$contracts ?? []).slice(0, 16)
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<ResourceBoundary
					placeholderText="Loading contracts…"
					resource={contracts}
				>
					{#snippet children(contracts)}
						<OrderedList
							items={contracts}
							getKey={(row) => stringify(row[EntityMetaKey.Id])}
							getSortKey={(row) => (
								BigInt(
									row[EntityMetaKey.Id].address,
								)
							)}
							placeholderRanges={[]}
							orientation={ListOrientation.Column}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No verified contracts yet.
								</p>
							{/snippet}

							{#snippet Item({ item: contract })}
								<EvmContractView
									entityId={contract[EntityMetaKey.Id]}
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
