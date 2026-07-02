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
		title = 'Farcaster casts',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Farcaster casts...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCasts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterCast>
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
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
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
					text: true,
					hash: true,
					fid: true,
					timestamp: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterCast}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(farcasterCasts)}
			{@const uniqueFarcasterCasts = [...new Map(farcasterCasts.values.map((farcasterCast) => [farcasterCast[EntityMetaKey.SelectorKey], farcasterCast])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterCast}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterCasts.values.length === uniqueFarcasterCasts.length && farcasterCasts.totalCount != null && farcasterCasts.totalCount >= uniqueFarcasterCasts.length ? farcasterCasts.totalCount : uniqueFarcasterCasts.length}
				getKey={(farcasterCast) => farcasterCast[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterCasts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster casts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterCast }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterCast> })}
					<FarcasterCastView
						href={
							resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
								fid: String(({ ...farcasterCast.entitySelector, ...farcasterCast }).fid),
								hash: String(({ ...farcasterCast.entitySelector, ...farcasterCast }).hash),
							})
						}
						selection={select(EntityType.FarcasterCast, farcasterCast.entitySelector)}
						prefetched={farcasterCast}
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
		entityType={EntityType.FarcasterCast}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
