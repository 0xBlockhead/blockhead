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
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// State
	let {
		entityFieldReference,

		title = 'Contracts',

		open = $bindable(true),

		collapsible = true,

		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmContract>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
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

	{id}
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
			{@const network = useEntity(entityCollectionsContext, EntityType.EvmNetwork,
				entityFieldReference.entityId,
				({ fields: { blockHeight: ({ sources: [
							Source.Voltaire_JsonRpc,
						] }), [entityFieldReference.fieldName]: ({ sources: [
							Source.Blockscout_Rest,
						], limit: 16 }) } }),
			)}
			{@const contracts = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.EvmContract>[] => (
					(network.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmContract}
					id={`${id}-items`}
					href={EntitiesListProps.href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => row[EntityMetaKey.Id].address}
					placeholderText="Loading verified contracts…"
					resource={contracts}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No verified contracts yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmContractView
							entityId={item[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
