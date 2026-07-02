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
		title = 'UTXO addresses',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading UTXO addresses...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoAddresses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoAddress>
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
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
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
					address: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoAddress}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(utxoAddresses)}
			{@const uniqueUtxoAddresses = [...new Map(utxoAddresses.values.map((utxoAddress) => [utxoAddress[EntityMetaKey.SelectorKey], utxoAddress])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoAddress}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoAddresses.values.length === uniqueUtxoAddresses.length && utxoAddresses.totalCount != null && utxoAddresses.totalCount >= uniqueUtxoAddresses.length ? utxoAddresses.totalCount : uniqueUtxoAddresses.length}
				getKey={(utxoAddress) => utxoAddress[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoAddresses}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO addresses yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoAddress }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoAddress> })}
					<UtxoAddressView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
								networkSlug: String(({ ...utxoAddress.entitySelector, ...utxoAddress }).$network.slug),
								address: String(({ ...utxoAddress.entitySelector, ...utxoAddress }).address),
							})
						}
						selection={select(EntityType.UtxoAddress, utxoAddress.entitySelector)}
						prefetched={utxoAddress}
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
		entityType={EntityType.UtxoAddress}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
