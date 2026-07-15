<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'MEV relay proposer payloads delivered',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_ProposerPayloadDelivereds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MevRelay_ProposerPayloadDelivered>
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

	const collectionSelection = $derived(selection)


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
					slot: true,
					value: true,
					$builder: true,
					relayHost: true,
					blockHash: true,
					$network: true,
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

				{#snippet Item({ item: mevRelayProposerPayloadDelivered })}
					{@const mevRelayProposerPayloadDeliveredFields = { ...mevRelayProposerPayloadDelivered[EntityMetaKey.Selector], ...mevRelayProposerPayloadDelivered }}
					{@const selection = select(EntityType.MevRelay_ProposerPayloadDelivered, mevRelayProposerPayloadDelivered[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const mevRelayProposerPayloadDeliveredHrefFields = { ...mevRelayProposerPayloadDelivered, ...mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] }}
					<MevRelay_ProposerPayloadDeliveredView
						selection={selection}
						prefetched={mevRelayProposerPayloadDeliveredFields}
						href={
							(mevRelayProposerPayloadDeliveredHrefFields.relayHost !== undefined && mevRelayProposerPayloadDeliveredHrefFields.slot !== undefined && mevRelayProposerPayloadDeliveredHrefFields.blockHash !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', {
								relayHost: String(mevRelayProposerPayloadDeliveredHrefFields.relayHost ?? ''),
								slot: String(mevRelayProposerPayloadDeliveredHrefFields.slot ?? ''),
								blockHash: String(mevRelayProposerPayloadDeliveredHrefFields.blockHash ?? ''),
								network: String(caip2StringFromValue(mevRelayProposerPayloadDeliveredHrefFields.$network.caip2) ?? ''),
							}) : mevRelayProposerPayloadDeliveredHrefFields.relayHost !== undefined && mevRelayProposerPayloadDeliveredHrefFields.slot !== undefined && mevRelayProposerPayloadDeliveredHrefFields.blockHash !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network !== undefined && mevRelayProposerPayloadDeliveredHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', {
								relayHost: String(mevRelayProposerPayloadDeliveredHrefFields.relayHost ?? ''),
								slot: String(mevRelayProposerPayloadDeliveredHrefFields.slot ?? ''),
								blockHash: String(mevRelayProposerPayloadDeliveredHrefFields.blockHash ?? ''),
								network: String(mevRelayProposerPayloadDeliveredHrefFields.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
