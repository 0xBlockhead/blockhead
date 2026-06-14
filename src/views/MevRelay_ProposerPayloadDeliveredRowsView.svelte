<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
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
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


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
			MEV-Boost relay <code>proposer_payload_delivered</code> deliveredPayloads: winning builder bids per slot (not swap bridges or Relay.link quotes).
		</p>
		<p>
			Use them to audit payload/value flow—not live consensus votes.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
						Source.MevRelay_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.MevRelay_Rest,
						],
						limit: 64,
					},
				} }),
			)}
			{@const deliveredPayloads = derive(
				parent,
				(parent) => {
					const deliveredPayloads: readonly Entity<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						deliveredPayloads
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
				resource={deliveredPayloads}
			>
				{#snippet Item({ item })}
					{@const row = item.value}
					{@const rowId = row[EntityMetaKey.Selector]}
					<MevRelay_ProposerPayloadDeliveredView
						selector={rowId}
							href={resolve('/(explore)/(networks)/network/[caip2Namespace=caip2Namespace]:[caip2Reference=caip2Reference]', {
								caip2Namespace: rowId.$network.caip2.namespace,
								caip2Reference: rowId.$network.caip2.reference,
							})}
							layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
