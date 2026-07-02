<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCastEmbed>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterCastEmbed>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const farcasterCastEmbed = $derived(selection({
		fields: {
			$icon: true,
			title: true,
			url: true,
			$embeddedCast: true,
			quotedPreviewText: true,
			description: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).url) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast embed')
	const viewDomId = $derived('farcaster-cast-embed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCastEmbed}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/embed/[indexInCast=nonNegativeInteger]', {
			fid: String(({ ...selection.entitySelector, ...prefetched }).$cast.fid),
			hash: String(({ ...selection.entitySelector, ...prefetched }).$cast.hash),
			indexInCast: String(({ ...selection.entitySelector, ...prefetched }).indexInCast),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={farcasterCastEmbed}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const title0 = ({ ...selection.entitySelector, ...prefetched }).title}
			{#if title0 !== undefined && title0 !== null}
				{String((title0) ?? '')}
			{/if}
			{@const url1 = ({ ...selection.entitySelector, ...prefetched }).url}
			{#if url1 !== undefined && url1 !== null}
				<TruncatedValue value={String(url1)} />
			{/if}

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null}
						<FarcasterCastView
							selection={select(EntityType.FarcasterCast, farcasterCast.entitySelector)}
							prefetched={farcasterCast}
							href={
									resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
										fid: String(farcasterCast.entitySelector.fid),
										hash: String(farcasterCast.entitySelector.hash),
									})
								}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={farcasterCastEmbed}>
				{#snippet Pending()}
					{@const title0 = ({ ...selection.entitySelector, ...prefetched }).title}
					{#if title0 !== undefined && title0 !== null}
						{String((title0) ?? '')}
					{/if}
					{@const url1 = ({ ...selection.entitySelector, ...prefetched }).url}
					{#if url1 !== undefined && url1 !== null}
						<TruncatedValue value={String(url1)} />
					{/if}

					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
					>
						{#snippet children(farcasterCast)}
							{#if farcasterCast != null}
								<FarcasterCastView
									selection={select(EntityType.FarcasterCast, farcasterCast.entitySelector)}
									prefetched={farcasterCast}
									href={
										resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
											fid: String(farcasterCast.entitySelector.fid),
											hash: String(farcasterCast.entitySelector.hash),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					{@const title0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).title}
					{#if title0 !== undefined && title0 !== null}
						{String((title0) ?? '')}
					{/if}
					{@const url1 = ({ ...selection.entitySelector, ...prefetched, ...entity }).url}
					{#if url1 !== undefined && url1 !== null}
						<TruncatedValue value={String(url1)} />
					{/if}

					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
					>
						{#snippet children(farcasterCast)}
							{#if farcasterCast != null}
								<FarcasterCastView
									selection={select(EntityType.FarcasterCast, farcasterCast.entitySelector)}
									prefetched={farcasterCast}
									href={
										resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
											fid: String(farcasterCast.entitySelector.fid),
											hash: String(farcasterCast.entitySelector.hash),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const indexInCast0 = ({ ...selection.entitySelector, ...prefetched }).indexInCast}
			{#if indexInCast0 !== undefined && indexInCast0 !== null}
				<NumberValue value={Number(indexInCast0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterCastEmbed}>
				{#snippet Pending()}
					{@const indexInCast0 = ({ ...selection.entitySelector, ...prefetched }).indexInCast}
					{#if indexInCast0 !== undefined && indexInCast0 !== null}
						<NumberValue value={Number(indexInCast0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const indexInCast0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).indexInCast}
					{#if indexInCast0 !== undefined && indexInCast0 !== null}
						<NumberValue value={Number(indexInCast0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Cast</dt>
				<dd>
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href={
							resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
								fid: String(selection.entitySelector.$cast.fid),
								hash: String(selection.entitySelector.$cast.hash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterCastEmbed}>
				{#snippet Pending()}
					{@const quotedPreviewText = prefetched.quotedPreviewText ?? selection.entitySelector.quotedPreviewText}
					{#if quotedPreviewText !== undefined && quotedPreviewText !== null}
						<div>
							<dt>Quoted preview text</dt>
							<dd>
								<TruncatedValue value={String(quotedPreviewText)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const quotedPreviewText = entity.quotedPreviewText ?? selection.entitySelector.quotedPreviewText ?? prefetched.quotedPreviewText}
					{#if quotedPreviewText !== undefined && quotedPreviewText !== null}
						<div>
							<dt>Quoted preview text</dt>
							<dd>
								<TruncatedValue value={String(quotedPreviewText)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={farcasterCastEmbed}>
			{#snippet children(entity)}
				{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
				{#if description === undefined || description === null || description === ''}
					<p data-text="muted">No description available.</p>
				{:else}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
