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
		title = 'XRPL ledgers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplLedgers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplLedger>
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
	entityType={EntityType.XrplLedger}
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
				ledgerIndex: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xrplLedgers) => [...new Map(xrplLedgers.values.map((xrplLedger) => [xrplLedger[EntityMetaKey.SelectorKey], xrplLedger])).values()]}
	getKey={(xrplLedger) => xrplLedger[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL ledgers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplLedger })}
		{@const xrplLedgerFields = { ...xrplLedger[EntityMetaKey.Selector], ...xrplLedger }}
		<EntityView
			entityType={EntityType.XrplLedger}
			entitySelector={xrplLedger[EntityMetaKey.Selector]}
			href={
				(
					xrplLedger[EntityMetaKey.Selector] != null && 'ledgerIndex' in xrplLedger[EntityMetaKey.Selector]
					&& xrplLedger[EntityMetaKey.Selector].ledgerIndex != null
					&& xrplLedger[EntityMetaKey.Selector] != null && '$network' in xrplLedger[EntityMetaKey.Selector] ?
						xrplLedger[EntityMetaKey.Selector].$network != null && 'caip2' in xrplLedger[EntityMetaKey.Selector].$network
						&& xrplLedger[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
						ledgerIndex: String(xrplLedger[EntityMetaKey.Selector].ledgerIndex ?? ''),
						network: String(caip2StringFromValue(xrplLedger[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplLedger[EntityMetaKey.Selector].$network != null && 'slug' in xrplLedger[EntityMetaKey.Selector].$network
							&& xrplLedger[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
							ledgerIndex: String(xrplLedger[EntityMetaKey.Selector].ledgerIndex ?? ''),
							network: String(xrplLedger[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{'XRPL ledger'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
