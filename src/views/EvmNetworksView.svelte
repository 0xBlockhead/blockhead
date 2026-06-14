<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		EntityMetaKey,
		type EntityFieldDefinition,
	} from '$/schema/$schema.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'

	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// State
	let {
		title = 'EVM networks',
		open = $bindable(true),
		entityFieldReference,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork>
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetwork}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution networks are identified by EIP-155 chain id; public registries publish RPC URLs, explorers, and native currency symbols.
		</p>
		<p>
			Testnets, rollups, and app-chains reuse the same abstraction—only consensus parameters and fork schedules differ.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				({ fields: {
					[entityFieldReference.fieldName]: {
						sources: (
							entityDefinitionByType[entityFieldReference.entityType].fields
								.find((field: EntityFieldDefinition) => field.name === entityFieldReference.fieldName)
								?.defaultSources
							?? []
						),
						limit: 4096,
					},
				} }),
			)}
			{@const networks = derive(
				parent,
				(parent) => {
					const chainIds = new SvelteSet<number>()
					const evmNetworks: readonly Entity<typeof schema, EntityType.EvmNetwork>[] = parent.fields[entityFieldReference.fieldName]?.values ?? []
					return (
						evmNetworks
							.flatMap((value) => {
								const chainId = Number(value[EntityMetaKey.Selector].caip2.reference)
								if (chainIds.has(chainId)) return []
								chainIds.add(chainId)
								return [{ value }]
							})
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetwork}
				id={`${id}-items`}
				href={href}
				getKey={(line) => stringifyId(line.value[EntityMetaKey.Selector])}
				getSortValue={(line) => (
					Number(line.value[EntityMetaKey.Selector].caip2.reference) === 1 ?
						0
					:
						Number.MAX_SAFE_INTEGER + Number(line.value[EntityMetaKey.Selector].caip2.reference)
				)}
				placeholderKeys={new SvelteSet<string | number>()}
				placeholderText="Loading EVM networks…"
				resource={networks}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No networks match this evmNetworks yet.
					</p>
				{/snippet}

				{#snippet Item({ item: line })}
					<EvmNetworkView
						selector={line.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
