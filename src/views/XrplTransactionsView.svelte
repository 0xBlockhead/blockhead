<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'XRPL transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplTransaction>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTransaction}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				hash: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xrplTransactions) => [...new Map(xrplTransactions.values.map((xrplTransaction) => [xrplTransaction[EntityMetaKey.SelectorKey], xrplTransaction])).values()]}
	getKey={(xrplTransaction) => xrplTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplTransaction })}
		{@const xrplTransactionFields = { ...xrplTransaction[EntityMetaKey.Selector], ...xrplTransaction }}
		<EntityView
			entityType={EntityType.XrplTransaction}
			entitySelector={xrplTransaction[EntityMetaKey.Selector]}
			href={
				(
					xrplTransaction[EntityMetaKey.Selector] != null && 'hash' in xrplTransaction[EntityMetaKey.Selector]
					&& xrplTransaction[EntityMetaKey.Selector].hash != null
					&& xrplTransaction[EntityMetaKey.Selector] != null && '$network' in xrplTransaction[EntityMetaKey.Selector] ?
						xrplTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in xrplTransaction[EntityMetaKey.Selector].$network
						&& xrplTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/transaction/[hash=stringSegment]', {
						hash: String(xrplTransaction[EntityMetaKey.Selector].hash ?? ''),
						network: String(caip2StringFromValue(xrplTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplTransaction[EntityMetaKey.Selector].$network != null && 'slug' in xrplTransaction[EntityMetaKey.Selector].$network
							&& xrplTransaction[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/transaction/[hash=stringSegment]', {
							hash: String(xrplTransaction[EntityMetaKey.Selector].hash ?? ''),
							network: String(xrplTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'XRPL transaction'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
