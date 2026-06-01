<script lang="ts">
	// Types/constants
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityId,
		emptyText = 'No consensus endpoints listed for this network yet.',
		title = 'Endpoints',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetwork>
			emptyText?: string
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.Url}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon REST bases registered for this execution network’s consensus layer pairing.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					consensusEndpoints: {},
				},
			)}
			{@const endpoints = derive(
				network,
				(network) => (
					network.consensusEndpoints
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Url}
				id={`${id}-items`}
				href={href}
				getKey={(endpoint) => endpoint.restBaseUrl}
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
							<dt>REST base</dt>
							<dd><code>{endpoint.restBaseUrl}</code></dd>
						</div>

						<div>
							<dt>Protocol</dt>
							<dd>{consensusProtocolByProtocol[endpoint.consensusProtocol].label}</dd>
						</div>
					</dl>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
