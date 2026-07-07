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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'MEV relay proposer payloads delivered',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_ProposerPayloadDelivereds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
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
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
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
					$network: true,
					relayHost: true,
					slot: true,
					blockHash: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay_ProposerPayloadDelivered}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(mevRelayProposerPayloadDelivereds)}
			{@const uniqueMevRelayProposerPayloadDelivereds = [...new Map(mevRelayProposerPayloadDelivereds.values.map((mevRelayProposerPayloadDelivered) => [mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey], mevRelayProposerPayloadDelivered])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay_ProposerPayloadDelivered}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevRelayProposerPayloadDelivereds.totalCount}
				getKey={(mevRelayProposerPayloadDelivered) => mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey]}
				items={uniqueMevRelayProposerPayloadDelivereds}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV relay proposer payloads delivered yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevRelayProposerPayloadDelivered }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered> })}
					{@const mevRelayProposerPayloadDeliveredFields = { ...mevRelayProposerPayloadDelivered[EntityMetaKey.Selector], ...mevRelayProposerPayloadDelivered }}
					{@const mevRelayProposerPayloadDeliveredHrefFields = { ...mevRelayProposerPayloadDelivered, ...mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] }}
					<MevRelay_ProposerPayloadDeliveredView
						selection={select(EntityType.MevRelay_ProposerPayloadDelivered, mevRelayProposerPayloadDelivered[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={mevRelayProposerPayloadDeliveredFields}
						href={
							(mevRelayProposerPayloadDeliveredHrefFields.$network !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.caip2 !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.caip2.namespace !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.caip2 !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.caip2.reference !== undefined && mevRelayProposerPayloadDeliveredHrefFields.relayHost !== undefined && mevRelayProposerPayloadDeliveredHrefFields.slot !== undefined && mevRelayProposerPayloadDeliveredHrefFields.blockHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]', {
								caip2: `${String(mevRelayProposerPayloadDeliveredHrefFields.$network.caip2.namespace ?? '')}:${String(mevRelayProposerPayloadDeliveredHrefFields.$network.caip2.reference ?? '')}`,
								relayHost: String(mevRelayProposerPayloadDeliveredHrefFields.relayHost ?? ''),
								slot: String(mevRelayProposerPayloadDeliveredHrefFields.slot ?? ''),
								blockHash: String(mevRelayProposerPayloadDeliveredHrefFields.blockHash ?? ''),
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
		entityType={EntityType.MevRelay_ProposerPayloadDelivered}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
