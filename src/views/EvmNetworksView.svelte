<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		EntityMetaKey,
	} from '$/schema/$schema.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'

	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'


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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					limit: 4096,
				})}
				placeholderText="Loading EVM networks…"
			>
				{#snippet children(networks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmNetwork}
						id={`${id}-items`}
						href={href}
						getKey={(network) => stringifyId(network[EntityMetaKey.Selector])}
						getSortValue={(network) => (
							Number(network[EntityMetaKey.Selector].caip2.reference) === 1 ?
								0
							:
								Number.MAX_SAFE_INTEGER + Number(network[EntityMetaKey.Selector].caip2.reference)
						)}
						placeholderKeys={new SvelteSet<string | number>()}
						placeholderText="Loading EVM networks…"
						items={networks.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No networks match this evmNetworks yet.
							</p>
						{/snippet}

						{#snippet Item({ item: network })}
							<EvmNetworkView
								selector={network[EntityMetaKey.Selector]}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
