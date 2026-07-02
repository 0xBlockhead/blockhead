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
		placeholderText = 'Loading MEV relay proposer payloads delivered...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_ProposerPayloadDeliveredRows-list',
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
			selection.sources == null ? selection({
				fields: {
					slot: true,
					value: true,
					$builder: true,
				},
			}) : selection
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
			/>
		{/snippet}

		{#snippet children(mevRelayProposerPayloadDeliveredRows)}
			{@const uniqueMevRelayProposerPayloadDeliveredRows = [...new Map(mevRelayProposerPayloadDeliveredRows.values.map((mevRelayProposerPayloadDelivered) => [mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey], mevRelayProposerPayloadDelivered])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay_ProposerPayloadDelivered}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevRelayProposerPayloadDeliveredRows.values.length === uniqueMevRelayProposerPayloadDeliveredRows.length && mevRelayProposerPayloadDeliveredRows.totalCount != null && mevRelayProposerPayloadDeliveredRows.totalCount >= uniqueMevRelayProposerPayloadDeliveredRows.length ? mevRelayProposerPayloadDeliveredRows.totalCount : uniqueMevRelayProposerPayloadDeliveredRows.length}
				getKey={(mevRelayProposerPayloadDelivered) => mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey]}
				items={uniqueMevRelayProposerPayloadDeliveredRows}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV relay proposer payloads delivered yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevRelayProposerPayloadDelivered }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered> })}
					<MevRelay_ProposerPayloadDeliveredView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]', {
								caip2: `${String(({ ...mevRelayProposerPayloadDelivered.entitySelector, ...mevRelayProposerPayloadDelivered }).$network.caip2.namespace)}:${String(({ ...mevRelayProposerPayloadDelivered.entitySelector, ...mevRelayProposerPayloadDelivered }).$network.caip2.reference)}`,
								relayHost: String(({ ...mevRelayProposerPayloadDelivered.entitySelector, ...mevRelayProposerPayloadDelivered }).relayHost),
								slot: String(({ ...mevRelayProposerPayloadDelivered.entitySelector, ...mevRelayProposerPayloadDelivered }).slot),
								blockHash: String(({ ...mevRelayProposerPayloadDelivered.entitySelector, ...mevRelayProposerPayloadDelivered }).blockHash),
							})
						}
						selection={select(EntityType.MevRelay_ProposerPayloadDelivered, mevRelayProposerPayloadDelivered.entitySelector)}
						prefetched={mevRelayProposerPayloadDelivered}
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
