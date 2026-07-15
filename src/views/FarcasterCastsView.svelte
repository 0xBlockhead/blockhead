<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Farcaster casts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCasts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterCast>
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
			selection({
				fields: {
					text: true,
					hash: true,
					fid: true,
					timestamp: true,
					username: true,
					hashPrefix: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={farcasterCasts.totalCount}
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

				{#snippet Item({ item: farcasterCast })}
					{@const farcasterCastFields = { ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }}
					{@const selection = select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const farcasterCastHrefFields = { ...farcasterCast, ...farcasterCast[EntityMetaKey.Selector] }}
					<FarcasterCastView
						selection={selection}
						prefetched={farcasterCastFields}
						href={
							(farcasterCastHrefFields.fid !== undefined && farcasterCastHrefFields.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
								fid: String(farcasterCastHrefFields.fid ?? ''),
								hash: String(farcasterCastHrefFields.hash ?? ''),
							}) : farcasterCastHrefFields.username !== undefined && farcasterCastHrefFields.hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
								fname: String(farcasterCastHrefFields.username ?? ''),
								hash: String(farcasterCastHrefFields.hashPrefix ?? ''),
							}) : undefined)
						}
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
