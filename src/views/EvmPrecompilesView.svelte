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

		title = 'Precompiles',

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
			Catalog precompiles active at the chain head according to the execution upgrade schedule.
		</p>
		<p>
			Native protocol contracts at fixed addresses—no deployer, creation transaction, or explorer verification.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = subscribe(EntityType.EvmNetwork,
				entityFieldReference.selector,
				({ fields: { blockHeight: ({ sources: [
							Source.Voltaire_JsonRpc,
						] }), [entityFieldReference.fieldName]: ({ sources: [
							Source.Constants_Internal,
						], limit: 64 }) } }),
			)}
			{@const precompiles = derive(
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
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Selector])}
					getSortValue={(row) => row[EntityMetaKey.Selector].address}
					placeholderText="Loading precompiles…"
					resource={precompiles}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No catalog precompiles for this chain.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmContractView
							selector={item[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
