<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'MEV-Boost deliveries',
		open = $bindable(true),
		collapsible = true,
		selection,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.MevRelay_Rest,
						],
						limit: 64,
					})}
				placeholderText="Loading MEV-Boost deliveries…"
			>
				{#snippet children(deliveredPayloads)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MevRelay_ProposerPayloadDelivered}
				{title}
				open={true}
				items={deliveredPayloads.entities}
			>
				{#snippet Item({ item })}
					{@const rowId = item.entitySelector}
					<MevRelay_ProposerPayloadDeliveredView
						selection={select(EntityType.MevRelay_ProposerPayloadDelivered, rowId)}
							href={resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${rowId.$network.caip2.namespace}:${rowId.$network.caip2.reference}`,
							})}
							layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
