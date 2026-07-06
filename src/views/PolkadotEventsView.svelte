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
		placeholderText,
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
			selection({
				fields: {
					eventName: true,
					indexInBlock: true,
					$pallet: true,
					$block: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={polkadotEvents.totalCount}
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
					{@const polkadotEventFields = { ...polkadotEvent[EntityMetaKey.Selector], ...polkadotEvent }}
					{@const polkadotEventHrefFields = { ...polkadotEvent, ...polkadotEvent[EntityMetaKey.Selector] }}
					<PolkadotEventView
						selection={select(EntityType.PolkadotEvent, polkadotEvent[EntityMetaKey.Selector])}
						prefetched={polkadotEventFields}
						href={
							(polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.$network !== undefined && polkadotEventHrefFields.$block.$network.caip2 !== undefined && polkadotEventHrefFields.$block.$network.caip2.namespace !== undefined && polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.$network !== undefined && polkadotEventHrefFields.$block.$network.caip2 !== undefined && polkadotEventHrefFields.$block.$network.caip2.reference !== undefined && polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.blockNumber !== undefined && polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.hash !== undefined && polkadotEventHrefFields.indexInBlock !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(String(polkadotEventHrefFields.$block.$network.caip2.namespace) + ':' + String(polkadotEventHrefFields.$block.$network.caip2.reference))].slug ?? ''),
								blockNumber: String(polkadotEventHrefFields.$block.blockNumber ?? ''),
								hash: String(polkadotEventHrefFields.$block.hash ?? ''),
								eventIndex: String(polkadotEventHrefFields.indexInBlock ?? ''),
							}) : undefined)
						}
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
