<script lang="ts">
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

	type EvmContractsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.EvmNetwork,
		'$$contracts'
	>


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,

		title = 'Contracts',

		open = $bindable(true),

		collapsible = true,

		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EvmContractsResource
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading contracts…"
			>
				{#snippet children(contracts)}
					<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmContract}
					id={`${id}-items`}
					href={EntitiesListProps.href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Selector])}
					getSortValue={(row) => row[EntityMetaKey.Selector].address}
					placeholderText="Loading verified contracts…"
					items={contracts.values}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No verified contracts yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<a
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${item[EntityMetaKey.Selector].$network.caip2.namespace}:${item[EntityMetaKey.Selector].$network.caip2.reference}`,
								address: item[EntityMetaKey.Selector].address,
							})}
						>
							<TruncatedValue
								value={item[EntityMetaKey.Selector].address}
								format={TruncatedValueFormat.Visual}
							/>
						</a>
					{/snippet}
				</EntitiesList>
			</div>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
