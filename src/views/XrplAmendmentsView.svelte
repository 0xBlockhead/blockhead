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
		title = 'XRPL amendments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplAmendments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplAmendment>
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
	entityType={EntityType.XrplAmendment}
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
				amendmentId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xrplAmendments) => [...new Map(xrplAmendments.values.map((xrplAmendment) => [xrplAmendment[EntityMetaKey.SelectorKey], xrplAmendment])).values()]}
	getKey={(xrplAmendment) => xrplAmendment[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL amendments yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplAmendment })}
		{@const xrplAmendmentFields = { ...xrplAmendment[EntityMetaKey.Selector], ...xrplAmendment }}
		<EntityView
			entityType={EntityType.XrplAmendment}
			entitySelector={xrplAmendment[EntityMetaKey.Selector]}
			href={
				(
					xrplAmendment[EntityMetaKey.Selector] != null && 'amendmentId' in xrplAmendment[EntityMetaKey.Selector]
					&& xrplAmendment[EntityMetaKey.Selector].amendmentId != null
					&& xrplAmendment[EntityMetaKey.Selector] != null && '$network' in xrplAmendment[EntityMetaKey.Selector] ?
						xrplAmendment[EntityMetaKey.Selector].$network != null && 'caip2' in xrplAmendment[EntityMetaKey.Selector].$network
						&& xrplAmendment[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/amendment/[amendmentId=stringSegment]', {
						amendmentId: String(xrplAmendment[EntityMetaKey.Selector].amendmentId ?? ''),
						network: String(caip2StringFromValue(xrplAmendment[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplAmendment[EntityMetaKey.Selector].$network != null && 'slug' in xrplAmendment[EntityMetaKey.Selector].$network
							&& xrplAmendment[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/amendment/[amendmentId=stringSegment]', {
							amendmentId: String(xrplAmendment[EntityMetaKey.Selector].amendmentId ?? ''),
							network: String(xrplAmendment[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{'XRPL amendment'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
