<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Farcaster cast embeds',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Farcaster cast embeds...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCastEmbeds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterCastEmbed>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterCastEmbedView from '$/views/FarcasterCastEmbedView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$icon: true,
					title: true,
					url: true,
					$embeddedCast: true,
					indexInCast: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterCastEmbed}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(farcasterCastEmbeds)}
			{@const uniqueFarcasterCastEmbeds = [...new Map(farcasterCastEmbeds.values.map((farcasterCastEmbed) => [farcasterCastEmbed[EntityMetaKey.SelectorKey], farcasterCastEmbed])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterCastEmbed}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterCastEmbeds.values.length === uniqueFarcasterCastEmbeds.length && farcasterCastEmbeds.totalCount != null && farcasterCastEmbeds.totalCount >= uniqueFarcasterCastEmbeds.length ? farcasterCastEmbeds.totalCount : uniqueFarcasterCastEmbeds.length}
				getKey={(farcasterCastEmbed) => farcasterCastEmbed[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterCastEmbeds}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster cast embeds yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterCastEmbed }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterCastEmbed> })}
					<FarcasterCastEmbedView
						href={
							resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/embed/[indexInCast=nonNegativeInteger]', {
								fid: String(({ ...farcasterCastEmbed.entitySelector, ...farcasterCastEmbed }).$cast.fid),
								hash: String(({ ...farcasterCastEmbed.entitySelector, ...farcasterCastEmbed }).$cast.hash),
								indexInCast: String(({ ...farcasterCastEmbed.entitySelector, ...farcasterCastEmbed }).indexInCast),
							})
						}
						selection={select(EntityType.FarcasterCastEmbed, farcasterCastEmbed.entitySelector)}
						prefetched={farcasterCastEmbed}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.FarcasterCastEmbed}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
