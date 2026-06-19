<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Contracts',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmContract>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{#key stringify(selection.entitySelector)}
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.Blockscout_Rest,
						],
					})}
					placeholderText="Loading contracts…"
				>
					{#snippet children(contracts)}
						<EntitiesList
							collapsible={false}
							showSummary={false}
							entityType={EntityType.EvmContract}
							id={`${id}-items`}
							href={href}
							getKey={(contract) => stringify(contract.entitySelector)}
							getSortValue={(contract) => contract.entitySelector.address}
							placeholderText="Loading contracts…"
							items={contracts.entities}
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
									selection={select(EntityType.EvmContract, contract.entitySelector)}
									layout={EntityLayout.Summary}
								/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
