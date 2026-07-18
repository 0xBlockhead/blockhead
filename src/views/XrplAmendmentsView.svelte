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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplAmendment>
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
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
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
		{@const selection = select(EntityType.XrplAmendment, xrplAmendment[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplAmendmentHrefFields = { ...xrplAmendment, ...xrplAmendment[EntityMetaKey.Selector] }}
		<XrplAmendmentView
			selection={selection}
			prefetched={xrplAmendmentFields}
			href={
				(xrplAmendmentHrefFields.amendmentId !== undefined && xrplAmendmentHrefFields.$network !== undefined && xrplAmendmentHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amendment/[amendmentId=stringSegment]', {
					amendmentId: String(xrplAmendmentHrefFields.amendmentId ?? ''),
					network: String(caip2StringFromValue(xrplAmendmentHrefFields.$network.caip2) ?? ''),
				}) : xrplAmendmentHrefFields.amendmentId !== undefined && xrplAmendmentHrefFields.$network !== undefined && xrplAmendmentHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amendment/[amendmentId=stringSegment]', {
					amendmentId: String(xrplAmendmentHrefFields.amendmentId ?? ''),
					network: String(xrplAmendmentHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
