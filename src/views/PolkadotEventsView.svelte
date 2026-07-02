<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Events',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Polkadot events...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotEvent>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					eventName: true,
					indexInBlock: true,
					$pallet: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotEvent}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(polkadotEvents)}
			{@const uniquePolkadotEvents = [...new Map(polkadotEvents.values.map((polkadotEvent) => [polkadotEvent[EntityMetaKey.SelectorKey], polkadotEvent])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotEvent}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotEvents.values.length === uniquePolkadotEvents.length && polkadotEvents.totalCount != null && polkadotEvents.totalCount >= uniquePolkadotEvents.length ? polkadotEvents.totalCount : uniquePolkadotEvents.length}
				getKey={(polkadotEvent) => polkadotEvent[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotEvents}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot events yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotEvent }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotEvent> })}
					<PolkadotEventView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...polkadotEvent.entitySelector, ...polkadotEvent }).$block.$network.caip2)].slug),
								blockNumber: String(({ ...polkadotEvent.entitySelector, ...polkadotEvent }).$block.blockNumber),
								hash: String(({ ...polkadotEvent.entitySelector, ...polkadotEvent }).$block.hash),
								eventIndex: String(({ ...polkadotEvent.entitySelector, ...polkadotEvent }).indexInBlock),
							})
						}
						selection={select(EntityType.PolkadotEvent, polkadotEvent.entitySelector)}
						prefetched={polkadotEvent}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.PolkadotEvent}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
