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
		title = 'XRPL trustlines',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplTrustlines-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplTrustline>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTrustline}
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
				account: true,
				currency: true,
				issuer: true,
				$network: true,
			},
		})
	}
	getResourceItems={(xrplTrustlines) => [...new Map(xrplTrustlines.values.map((xrplTrustline) => [xrplTrustline[EntityMetaKey.SelectorKey], xrplTrustline])).values()]}
	getKey={(xrplTrustline) => xrplTrustline[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL trustlines yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplTrustline })}
		{@const xrplTrustlineFields = { ...xrplTrustline[EntityMetaKey.Selector], ...xrplTrustline }}
		{@const selection = select(EntityType.XrplTrustline, xrplTrustline[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplTrustlineHrefFields = { ...xrplTrustline, ...xrplTrustline[EntityMetaKey.Selector] }}
		<XrplTrustlineView
			selection={selection}
			prefetched={xrplTrustlineFields}
			href={
				(xrplTrustlineHrefFields.account !== undefined && xrplTrustlineHrefFields.currency !== undefined && xrplTrustlineHrefFields.issuer !== undefined && xrplTrustlineHrefFields.$network !== undefined && xrplTrustlineHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
					account: String(xrplTrustlineHrefFields.account ?? ''),
					currency: String(xrplTrustlineHrefFields.currency ?? ''),
					issuer: String(xrplTrustlineHrefFields.issuer ?? ''),
					network: String(caip2StringFromValue(xrplTrustlineHrefFields.$network.caip2) ?? ''),
				}) : xrplTrustlineHrefFields.account !== undefined && xrplTrustlineHrefFields.currency !== undefined && xrplTrustlineHrefFields.issuer !== undefined && xrplTrustlineHrefFields.$network !== undefined && xrplTrustlineHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
					account: String(xrplTrustlineHrefFields.account ?? ''),
					currency: String(xrplTrustlineHrefFields.currency ?? ''),
					issuer: String(xrplTrustlineHrefFields.issuer ?? ''),
					network: String(xrplTrustlineHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
