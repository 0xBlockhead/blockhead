<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const farcasterCastEmbed = $derived(selection({
		fields: {
			$icon: true,
			title: true,
			url: true,
			$embeddedCast: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.title) ?? ''), String((prefetched.url) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast embed')
	const viewDomId = $derived('farcaster-cast-embed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCastEmbed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$cast !== undefined && pendingEntity.$cast.fid !== undefined && pendingEntity.$cast !== undefined && pendingEntity.$cast.hash !== undefined && pendingEntity.indexInCast !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/embed/[indexInCast=nonNegativeInteger]', {
			fid: String(pendingEntity.$cast.fid ?? ''),
			hash: String(pendingEntity.$cast.hash ?? ''),
			indexInCast: String(pendingEntity.indexInCast ?? ''),
		}) : undefined)
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
		<ResourceBoundary resource={farcasterCastEmbed}>
			{#snippet Pending()}
				{@const title0 = prefetched.title}
				{#if title0 !== undefined && title0 !== null}
					{String((title0) ?? '')}
				{/if}
				{@const url1 = prefetched.url}
				{#if url1 !== undefined && url1 !== null}
					<TruncatedValue value={String((url1) ?? '')} />
				{/if}

				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
				>
					{#snippet children(farcasterCast)}
						{#if farcasterCast != null && farcasterCast[EntityMetaKey.Selector] != null}
							<FarcasterCastView
								selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
								prefetched={farcasterCast}
								href={
									(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid !== undefined && ({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
										fid: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid ?? ''),
										hash: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const title0 = resolvedEntity.title}
				{#if title0 !== undefined && title0 !== null}
					{String((title0) ?? '')}
				{/if}
				{@const url1 = resolvedEntity.url}
				{#if url1 !== undefined && url1 !== null}
					<TruncatedValue value={String((url1) ?? '')} />
				{/if}

				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
				>
					{#snippet children(farcasterCast)}
						{#if farcasterCast != null && farcasterCast[EntityMetaKey.Selector] != null}
							<FarcasterCastView
								selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
								prefetched={farcasterCast}
								href={
									(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid !== undefined && ({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
										fid: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid ?? ''),
										hash: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterCastEmbed}>
			{#snippet Pending()}
				{@const indexInCast0 = selection.entitySelector.indexInCast ?? prefetched.indexInCast}
				{#if indexInCast0 !== undefined && indexInCast0 !== null}
					<NumberValue value={Number(indexInCast0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const indexInCast0 = resolvedEntity.indexInCast}
				{#if indexInCast0 !== undefined && indexInCast0 !== null}
					<NumberValue value={Number(indexInCast0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Cast</dt>
				<dd>
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href={
							(selection.entitySelector.$cast.fid !== undefined && selection.entitySelector.$cast.hash !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
								fid: String(selection.entitySelector.$cast.fid ?? ''),
								hash: String(selection.entitySelector.$cast.hash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Index in cast</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInCast: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInCast = selection.entitySelector.indexInCast ?? prefetched.indexInCast}
							{#if indexInCast !== undefined && indexInCast !== null}
								<NumberValue value={Number(indexInCast)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInCast = resolvedEntity.indexInCast}
							{#if indexInCast !== undefined && indexInCast !== null}
								<NumberValue value={Number(indexInCast)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							url: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const url = prefetched.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url = resolvedEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$embeddedCast')}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null && farcasterCast[EntityMetaKey.Selector] != null}
						<div>
							<dt>Embedded cast</dt>
							<dd>
								<FarcasterCastView
									selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
									prefetched={farcasterCast}
									href={
										(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid !== undefined && ({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
											fid: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).fid ?? ''),
											hash: String(({ ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }).hash ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							quotedPreviewText: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quotedPreviewText = prefetched.quotedPreviewText}
					{#if quotedPreviewText !== undefined && quotedPreviewText !== null}
						<div>
							<dt>Quoted preview text</dt>
							<dd>
								<TruncatedValue value={String((quotedPreviewText) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quotedPreviewText = resolvedEntity.quotedPreviewText}
					{#if quotedPreviewText !== undefined && quotedPreviewText !== null}
						<div>
							<dt>Quoted preview text</dt>
							<dd>
								<TruncatedValue value={String((quotedPreviewText) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
