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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplTrustline>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.XrplTrustline}
			entitySelector={xrplTrustline[EntityMetaKey.Selector]}
			href={
				(
					xrplTrustline[EntityMetaKey.Selector] != null && 'account' in xrplTrustline[EntityMetaKey.Selector]
					&& xrplTrustline[EntityMetaKey.Selector].account != null
					&& xrplTrustline[EntityMetaKey.Selector] != null && 'currency' in xrplTrustline[EntityMetaKey.Selector]
					&& xrplTrustline[EntityMetaKey.Selector].currency != null
					&& xrplTrustline[EntityMetaKey.Selector] != null && 'issuer' in xrplTrustline[EntityMetaKey.Selector]
					&& xrplTrustline[EntityMetaKey.Selector].issuer != null
					&& xrplTrustline[EntityMetaKey.Selector] != null && '$network' in xrplTrustline[EntityMetaKey.Selector] ?
						xrplTrustline[EntityMetaKey.Selector].$network != null && 'caip2' in xrplTrustline[EntityMetaKey.Selector].$network
						&& xrplTrustline[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
						account: String(xrplTrustline[EntityMetaKey.Selector].account ?? ''),
						currency: String(xrplTrustline[EntityMetaKey.Selector].currency ?? ''),
						issuer: String(xrplTrustline[EntityMetaKey.Selector].issuer ?? ''),
						network: String(caip2StringFromValue(xrplTrustline[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplTrustline[EntityMetaKey.Selector].$network != null && 'slug' in xrplTrustline[EntityMetaKey.Selector].$network
							&& xrplTrustline[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
							account: String(xrplTrustline[EntityMetaKey.Selector].account ?? ''),
							currency: String(xrplTrustline[EntityMetaKey.Selector].currency ?? ''),
							issuer: String(xrplTrustline[EntityMetaKey.Selector].issuer ?? ''),
							network: String(xrplTrustline[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{'XRPL trustline'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
