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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplAmm>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.XrplAmm}
			entitySelector={xrplAmm[EntityMetaKey.Selector]}
			href={
				(
					xrplAmm[EntityMetaKey.Selector] != null && 'ammAccount' in xrplAmm[EntityMetaKey.Selector]
					&& xrplAmm[EntityMetaKey.Selector].ammAccount != null
					&& xrplAmm[EntityMetaKey.Selector] != null && '$network' in xrplAmm[EntityMetaKey.Selector] ?
						xrplAmm[EntityMetaKey.Selector].$network != null && 'caip2' in xrplAmm[EntityMetaKey.Selector].$network
						&& xrplAmm[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
						ammAccount: String(xrplAmm[EntityMetaKey.Selector].ammAccount ?? ''),
						network: String(caip2StringFromValue(xrplAmm[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplAmm[EntityMetaKey.Selector].$network != null && 'slug' in xrplAmm[EntityMetaKey.Selector].$network
							&& xrplAmm[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
							ammAccount: String(xrplAmm[EntityMetaKey.Selector].ammAccount ?? ''),
							network: String(xrplAmm[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{'XRPL AMM'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
