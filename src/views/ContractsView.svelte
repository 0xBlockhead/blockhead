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
	import ContractView from '$/views/ContractView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Contracts',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmContract>
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
			$$contracts: { $: [Source.Blockscout_Rest] },
		},
	)

	const contracts = derive(
		network,
		(merged): Entity<typeof schema, EntityType.EvmContract>[] => (
			(merged.$$contracts ?? [])
				.toSorted((a, b) => (
					stringify(b[EntityMetaKey.Id]).localeCompare(stringify(a[EntityMetaKey.Id]))
				))
				.slice(0, 16)
		),
	)
</script>


<EntitiesList
	entityType={EntityType.EvmContract}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<ResourceBoundary
				placeholderText="Loading contracts…"
				resource={contracts}
			>
				{#snippet children(loaded)}
					<OrderedList
						items={loaded}
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
								No verified contracts for this network yet. Try again shortly.
							</p>
						{/snippet}

						{#snippet Item({ item: row })}
							{#if row}
								<ContractView
									entityId={row[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
										{
											networkId: String(
												row[EntityMetaKey.Id].$network.chainId,
											),
											address: row[EntityMetaKey.Id].address,
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
