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




	// State
	let {
		selection,
		countResource,
		title = 'Farcaster cast embeds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCastEmbeds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterCastEmbed>
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
	entityType={EntityType.FarcasterCastEmbed}
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
				$icon: true,
				title: true,
				url: true,
				$embeddedCast: true,
				indexInCast: true,
				$cast: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterCastEmbeds) => [...new Map(farcasterCastEmbeds.values.map((farcasterCastEmbed) => [farcasterCastEmbed[EntityMetaKey.SelectorKey], farcasterCastEmbed])).values()]}
	getKey={(farcasterCastEmbed) => farcasterCastEmbed[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster cast embeds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterCastEmbed })}
		{@const farcasterCastEmbedFields = { ...farcasterCastEmbed[EntityMetaKey.Selector], ...farcasterCastEmbed }}
		<EntityView
			entityType={EntityType.FarcasterCastEmbed}
			entitySelector={farcasterCastEmbed[EntityMetaKey.Selector]}
			href={
				(
					farcasterCastEmbed[EntityMetaKey.Selector] != null && 'indexInCast' in farcasterCastEmbed[EntityMetaKey.Selector]
					&& farcasterCastEmbed[EntityMetaKey.Selector].indexInCast != null
					&& farcasterCastEmbed[EntityMetaKey.Selector] != null && '$cast' in farcasterCastEmbed[EntityMetaKey.Selector]
					&& farcasterCastEmbed[EntityMetaKey.Selector].$cast != null && 'fid' in farcasterCastEmbed[EntityMetaKey.Selector].$cast
					&& farcasterCastEmbed[EntityMetaKey.Selector].$cast.fid != null
					&& farcasterCastEmbed[EntityMetaKey.Selector].$cast != null && 'hash' in farcasterCastEmbed[EntityMetaKey.Selector].$cast
					&& farcasterCastEmbed[EntityMetaKey.Selector].$cast.hash != null ?
						resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/embed/[indexInCast=nonNegativeInteger]', {
					indexInCast: String(farcasterCastEmbed[EntityMetaKey.Selector].indexInCast ?? ''),
					fid: String(farcasterCastEmbed[EntityMetaKey.Selector].$cast.fid ?? ''),
					hash: String(farcasterCastEmbed[EntityMetaKey.Selector].$cast.hash ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((farcasterCastEmbedFields.title) ?? ''), String((farcasterCastEmbedFields.url) ?? ''), [String((farcasterCastEmbedFields.$embeddedCast.text) ?? ''), String((farcasterCastEmbedFields.$embeddedCast.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast'].filter(Boolean).join(' ') || 'Farcaster cast embed'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterCastEmbedFields.indexInCast) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
