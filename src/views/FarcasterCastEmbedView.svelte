<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.FarcasterCastEmbed> = $props()

	const cast = $derived(selection.entitySelector.$cast)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Snapchain_Rest,
		],
	}))
	const farcasterCastEmbed = $derived(viewSelection({
		fields: {
			title: true,
			url: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCastEmbed}
	entitySelector={selection.entitySelector}
	title={title ?? ([(prefetched.title ?? ''), (prefetched.url ?? '')].filter(Boolean).join(' ') || 'Farcaster cast embed')}
	href={
		href === undefined ?
			(
				'fid' in cast
				&& 'hash' in cast ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]',
						{
							fid: String(cast.fid),
							hash: cast.hash,
							indexInCast: String(selection.entitySelector.indexInCast),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={farcasterCastEmbed}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
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
			{#snippet children(entity)}
				{@const title = entity.title}
				{#if title != null}
					{title}
				{/if}
				{@const url = entity.url}
				{#if url != null}
					<TruncatedValue value={url} />
				{/if}

				<ResourceBoundary
					resource={selection.$embeddedCast}
				>
					{#snippet children(farcasterCast)}
						{#if farcasterCast != null}
							<FarcasterCastView
								selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
								prefetched={farcasterCast}
								href={null}
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
		<NumberValue
			value={selection.entitySelector.indexInCast}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Cast</dt>
				<dd>
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Index in cast</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInCast}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterCastEmbed}
			>
				{#snippet children(entity)}
					{@const url = entity.url}
					{#if url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={url}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={url} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$embeddedCast}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null}
						<div>
							<dt>Embedded cast</dt>
							<dd>
								<FarcasterCastView
									selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
									prefetched={farcasterCast}
									layout={EntityLayout.Value}
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
					viewSelection({
						fields: {
							quotedPreviewText: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quotedPreviewText = entity.quotedPreviewText}
					{#if quotedPreviewText != null}
						<div>
							<dt>Quoted preview text</dt>
							<dd>
								<TruncatedValue value={quotedPreviewText} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
