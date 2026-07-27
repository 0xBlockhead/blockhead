<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: EntitySelectionViewProps<EntityType.FarcasterCast> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
	}))
	const farcasterCast = $derived(viewSelection({
		fields: {
			text: true,
			timestamp: true,
			fid: true,
			hash: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.text ?? ''), String(pendingEntity.hash ?? '')].filter(Boolean).join(' ') || 'Farcaster cast')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterCastEmbedsView from '$/views/FarcasterCastEmbedsView.svelte'
	import FarcasterCast_TimestampsView from '$/views/FarcasterCast_TimestampsView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'fid' in selection.entitySelector
			&& 'hash' in selection.entitySelector ?
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
					{
						fid: String(selection.entitySelector.fid),
						hash: String(selection.entitySelector.hash),
					}
				)
			:
				'username' in selection.entitySelector
				&& 'hashPrefix' in selection.entitySelector ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
						{
							fname: String(selection.entitySelector.username),
							hash: String(selection.entitySelector.hashPrefix),
						}
					)
				:
					undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterCast}>
			{#snippet children(entity)}
				{[(entity.text ?? ''), String(entity.hash)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterCast}>
			{#snippet children(entity)}
				{[String(entity.fid), String(entity.hash)].filter(Boolean).join(' ') || [(entity.text ?? ''), String(entity.hash)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={farcasterCast}>
			{#snippet children(entity)}
				{@const timestamp0 = entity.timestamp}
				{#if timestamp0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestamp0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						<div>
							<dt>Author</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
									prefetched={farcasterUser}
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
				resource={farcasterCast}
			>
				{#snippet children(entity)}
					{@const timestamp = entity.timestamp}
					{#if timestamp != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$channel}
			>
				{#snippet children(farcasterChannel)}
					{#if farcasterChannel != null}
						<div>
							<dt>Channel</dt>
							<dd>
								<FarcasterChannelView
									selection={select(EntityType.FarcasterChannel, farcasterChannel[EntityMetaKey.Selector])}
									prefetched={farcasterChannel}
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
				resource={selection.$parentCast}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null}
						<div>
							<dt>Parent cast</dt>
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
							parentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentUrl = entity.parentUrl}
					{#if parentUrl != null}
						<div>
							<dt>Parent URL</dt>
							<dd>
								<a
									href={String(parentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(parentUrl)} />
								</a>
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
							rootParentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rootParentUrl = entity.rootParentUrl}
					{#if rootParentUrl != null}
						<div>
							<dt>Root parent URL</dt>
							<dd>
								<a
									href={String(rootParentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(rootParentUrl)} />
								</a>
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
							threadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const threadHash = entity.threadHash}
					{#if threadHash != null}
						<div>
							<dt>Thread hash</dt>
							<dd>
								<TruncatedValue value={String(threadHash)} />
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
							clientUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clientUrl = entity.clientUrl}
					{#if clientUrl != null}
						<div>
							<dt>Client URL</dt>
							<dd>
								<a
									href={String(clientUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(clientUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={farcasterCast}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p data-text="long-text">{text}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const farcasterCastFarcasterCastsViewDirectRepliesResource = selection.$$directReplies}
		<ResourceBoundary
			resource={farcasterCastFarcasterCastsViewDirectRepliesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FarcasterCastsView
						selection={farcasterCastFarcasterCastsViewDirectRepliesResource}
						countResource={farcasterCastFarcasterCastsViewDirectRepliesResource.count}
						title='Direct replies'
						id='direct-replies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const farcasterCastFarcasterCastEmbedsViewEmbedsResource = selection.$$embeds}
		<ResourceBoundary
			resource={farcasterCastFarcasterCastEmbedsViewEmbedsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FarcasterCastEmbedsView
						selection={farcasterCastFarcasterCastEmbedsViewEmbedsResource}
						countResource={farcasterCastFarcasterCastEmbedsViewEmbedsResource.count}
						title='Embeds'
						id='embeds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const farcasterCastFarcasterCastTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={farcasterCastFarcasterCastTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FarcasterCast_TimestampsView
						selection={farcasterCastFarcasterCastTimestampsViewTimestampsResource}
						countResource={farcasterCastFarcasterCastTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
