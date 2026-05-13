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
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		{
			blockHeight: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$contracts: {
				$: [
					Source.Blockscout_Rest,
				],
			},
		},
	)

	const contracts = derive(
		network,
		(loaded): Entity<typeof schema, EntityType.EvmContract>[] => {
			const rows = (
				loaded.$$contracts
				?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						stringify(b[EntityMetaKey.Id])
							> stringify(a[EntityMetaKey.Id]) ?
							1
						:
							stringify(b[EntityMetaKey.Id])
								< stringify(a[EntityMetaKey.Id]) ?
								-1
							:
								0
					))
					.slice(0, 16)
			)
		},
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
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmContract}
				id={`${entitiesListProps.id}-items`}
				href={entitiesListProps.href}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => (
					BigInt(
						row[EntityMetaKey.Id].address,
					)
				)}
				placeholderText="Loading contracts…"
				resource={contracts}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No verified contracts for this network yet. Try again shortly.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<ContractView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
								{
									networkId: String(
										props.item[EntityMetaKey.Id].$network.chainId,
									),
									address: props.item[EntityMetaKey.Id].address,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
