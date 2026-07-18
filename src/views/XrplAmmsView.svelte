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
		title = 'XRPL AMMs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplAmms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplAmm>
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
	import XrplAmmView from '$/views/XrplAmmView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmm}
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
				ammAccount: true,
				$network: true,
			},
		})
	}
	getResourceItems={(xrplAmms) => [...new Map(xrplAmms.values.map((xrplAmm) => [xrplAmm[EntityMetaKey.SelectorKey], xrplAmm])).values()]}
	getKey={(xrplAmm) => xrplAmm[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL AMMs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplAmm })}
		{@const xrplAmmFields = { ...xrplAmm[EntityMetaKey.Selector], ...xrplAmm }}
		{@const selection = select(EntityType.XrplAmm, xrplAmm[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplAmmHrefFields = { ...xrplAmm, ...xrplAmm[EntityMetaKey.Selector] }}
		<XrplAmmView
			selection={selection}
			prefetched={xrplAmmFields}
			href={
				(xrplAmmHrefFields.ammAccount !== undefined && xrplAmmHrefFields.$network !== undefined && xrplAmmHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
					ammAccount: String(xrplAmmHrefFields.ammAccount ?? ''),
					network: String(caip2StringFromValue(xrplAmmHrefFields.$network.caip2) ?? ''),
				}) : xrplAmmHrefFields.ammAccount !== undefined && xrplAmmHrefFields.$network !== undefined && xrplAmmHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
					ammAccount: String(xrplAmmHrefFields.ammAccount ?? ''),
					network: String(xrplAmmHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
