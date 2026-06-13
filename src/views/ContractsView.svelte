<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Contracts',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmContract>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmContract}
	{title}
	bind:open
	{id}
	href={href}
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

	{#snippet body()}
		{#if open}
			{@const network = subscribe(EntityType.EvmNetwork,
				entityFieldReference.entityId,
				({ fields: { blockHeight: ({ sources: [Source.Voltaire_JsonRpc] }), $$contracts: ({ sources: [Source.Blockscout_Rest] }) } }),
			)}
			{@const contracts = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.EvmContract>[] => (
					(network.fields.$$contracts?.values ?? [])
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmContract}
					id={`${id}-items`}
					href={href}
					getKey={(contract) => stringify(contract[EntityMetaKey.Id])}
					getSortValue={(contract) => contract[EntityMetaKey.Id].address}
					placeholderText="Loading contracts…"
					resource={contracts}
					{title}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
					open={true}
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
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
