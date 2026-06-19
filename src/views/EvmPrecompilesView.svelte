<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type EvmPrecompilesResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.EvmNetwork,
		'$$precompiles'
	>

	// State
	let {
		selection,

		title = 'Precompiles',

		open = $bindable(true),

		collapsible = true,

		id,


		...EntitiesListProps
	}: WithRest<
		{
			selection: EvmPrecompilesResource
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

	

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading precompiles…"
			>
				{#snippet children(precompiles)}
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
					items={precompiles.values}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No catalog precompiles for this chain.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmContractView
							selection={select(EntityType.EvmContract, item[EntityMetaKey.Selector])}
							layout={EntityLayout.Summary}

						/>
					{/snippet}
				</EntitiesList>
			</div>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
