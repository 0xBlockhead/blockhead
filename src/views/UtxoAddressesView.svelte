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
		title = 'UTXO addresses',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					address: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={utxoAddresses.totalCount}
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
					{@const utxoAddressFields = { ...utxoAddress[EntityMetaKey.Selector], ...utxoAddress }}
					{@const utxoAddressHrefFields = { ...utxoAddress, ...utxoAddress[EntityMetaKey.Selector] }}
					<UtxoAddressView
						selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={utxoAddressFields}
						href={
							(utxoAddressHrefFields.$network !== undefined && utxoAddressHrefFields.$network.caip2 !== undefined && utxoAddressHrefFields.$network.caip2.namespace !== undefined && utxoAddressHrefFields.$network !== undefined && utxoAddressHrefFields.$network.caip2 !== undefined && utxoAddressHrefFields.$network.caip2.reference !== undefined && utxoAddressHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/address/[address]', {
								networkSlug: String(networkByCaip2[String(String(utxoAddressHrefFields.$network.caip2.namespace) + ':' + String(utxoAddressHrefFields.$network.caip2.reference))].slug ?? ''),
								address: String(utxoAddressHrefFields.address ?? ''),
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
		entityType={EntityType.UtxoAddress}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
