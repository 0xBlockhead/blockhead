<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type NetworkTransportEndpoint = {
		url: string
		transportType: string
		providerName?: string
	}

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


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		parentEntityType,
		parentEntityId,
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
			parentEntityId: EntityId<typeof schema, NetworkTransportEndpointEntityType>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(parentEntityType,
				parentEntityId,
				{
					sources: [...fieldSources],
					fields: Object.fromEntries(
						endpointFieldNames.map((fieldName) => [
							fieldName,
							true as const,
						]),
					),
				},
			)}
			{@const endpoints = derive(
				parent,
				(parent): NetworkTransportEndpoint[] => (
					endpointFieldNames.flatMap((fieldName) => {
						const tses = parent.fields[fieldName]
						return (
							tses?.values as NetworkTransportEndpoint[] | undefined
						) ?? []
					})
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={listEntityType}
				id={`${id}-items`}
				href={href}
				getKey={(endpoint) => endpoint.url}
				open={true}
				resource={endpoints}
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
		{/if}
	{/snippet}
</EntitiesList>
