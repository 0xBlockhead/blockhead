<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type {
		EntityFieldSingleResolvedValue,
		EntitySelector,
	} from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type NetworkTransportEndpointFieldName =
		| 'restEndpoints'
		| 'rpcEndpoints'
		| 'storageEndpoints'

	type NetworkTransportEndpointEntityType =
		| EntityType.CosmosNetwork
		| EntityType.FilecoinNetwork
		| EntityType.HyperliquidNetwork
		| EntityType.MoneroNetwork
		| EntityType.NearNetwork
		| EntityType.PolkadotNetwork
		| EntityType.SolanaNetwork
		| EntityType.TronNetwork
		| EntityType.ZeroGNetwork

	type NetworkTransportEndpoint = EntityFieldSingleResolvedValue<
		typeof schema,
		NetworkTransportEndpointEntityType,
		NetworkTransportEndpointFieldName
	>


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		parentEntityType,
		parentEntitySelector,
		endpointFieldNames,
		fieldSources,
		listEntityType,
		emptyText = 'No endpoints listed for this network yet.',
		title = 'Endpoints',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			parentEntityType: NetworkTransportEndpointEntityType
			parentEntitySelector: EntitySelector<typeof schema, NetworkTransportEndpointEntityType>
			endpointFieldNames: readonly NetworkTransportEndpointFieldName[]
			fieldSources: readonly Source[]
			listEntityType: EntityType
			emptyText?: string
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntitiesList
	entityType={listEntityType}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Catalog RPC or REST transport endpoints for this network (URL, transport, optional provider).
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = proxy(parentEntityType,
				parentEntitySelector,
				{
					sources: [...fieldSources],
					fields: Object.fromEntries(
						endpointFieldNames.map((fieldName) => [
							fieldName,
							true,
						]),
					),
				},
			)}
			<ResourceBoundary resource={parent} placeholderText="Loading endpoints…">
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={listEntityType}
						id={`${id}-items`}
						href={href}
						getKey={(endpoint) => endpoint.url}
						open={true}
						items={endpointFieldNames.flatMap((fieldName) => (
							parent.fields[fieldName]?.values ?? []
						))}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">{emptyText}</p>
						{/snippet}

						{#snippet Item({ item: endpoint })}
							<dl data-column-item="center">
								<div>
									<dt>URL</dt>
									<dd><code>{endpoint.url}</code></dd>
								</div>

								<div>
									<dt>Transport</dt>
									<dd>{endpoint.transportType}</dd>
								</div>

								{#if endpoint.providerName}
									<div>
										<dt>Provider</dt>
										<dd>{endpoint.providerName}</dd>
									</div>
								{/if}
							</dl>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
