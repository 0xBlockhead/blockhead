<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'MEV-Boost deliveries',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.MevRelay_ProposerPayloadDelivered
			>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			MEV-Boost relay <code>proposer_payload_delivered</code> rows: winning builder bids per slot (not swap bridges or Relay.link quotes).
		</p>
		<p>
			Use them to audit payload/value flow—not live consensus votes.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.MevRelay_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.MevRelay_Rest,
						],
						$limit: 64,
					},
				},
			)}
			{@const rows = derive(
				parent,
				(parent) => {
					const list: Entity<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						list
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MevRelay_ProposerPayloadDelivered}
				{title}
				open={true}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					<MevRelay_ProposerPayloadDeliveredView
						entityId={row[EntityMetaKey.Id]}
						href={resolve(
							'/(explore)/network/[caip2Namespace]:[caip2Reference]',
							{ ...caip2RouteParamsFromNetworkId(row[EntityMetaKey.Id].$network) },
						)}
						id={stringify(row[EntityMetaKey.Id])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
