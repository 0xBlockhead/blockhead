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
		title = 'MEV builders',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevBuilders-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MevBuilder>
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
	entityType={EntityType.MevBuilder}
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
				builderPubkey: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mevBuilders) => [...new Map(mevBuilders.values.map((mevBuilder) => [mevBuilder[EntityMetaKey.SelectorKey], mevBuilder])).values()]}
	getKey={(mevBuilder) => mevBuilder[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MEV builders yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mevBuilder })}
		{@const mevBuilderFields = { ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }}
		<EntityView
			entityType={EntityType.MevBuilder}
			entitySelector={mevBuilder[EntityMetaKey.Selector]}
			href={
				(
					mevBuilder[EntityMetaKey.Selector] != null && 'builderPubkey' in mevBuilder[EntityMetaKey.Selector]
					&& mevBuilder[EntityMetaKey.Selector].builderPubkey != null
					&& mevBuilder[EntityMetaKey.Selector] != null && '$network' in mevBuilder[EntityMetaKey.Selector] ?
						mevBuilder[EntityMetaKey.Selector].$network != null && 'caip2' in mevBuilder[EntityMetaKey.Selector].$network
						&& mevBuilder[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
						builderPubkey: String(mevBuilder[EntityMetaKey.Selector].builderPubkey ?? ''),
						network: String(caip2StringFromValue(mevBuilder[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							mevBuilder[EntityMetaKey.Selector].$network != null && 'slug' in mevBuilder[EntityMetaKey.Selector].$network
							&& mevBuilder[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
							builderPubkey: String(mevBuilder[EntityMetaKey.Selector].builderPubkey ?? ''),
							network: String(mevBuilder[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((mevBuilderFields.builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder'}
			{/snippet}

			{#snippet Value()}
				{[String((mevBuilderFields.builderPubkey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((mevBuilderFields.$network.name) ?? '')].filter(Boolean).join(' ') || [mevBuilderFields.$network.caip2 == null ? '' : String(`${(mevBuilderFields.$network.caip2).namespace}:${(mevBuilderFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
