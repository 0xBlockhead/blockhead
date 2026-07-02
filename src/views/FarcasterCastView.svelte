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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCast>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterCast>>
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

	const farcasterCast = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			text: true,
			timestamp: true,
			threadHash: true,
			...(open && {
				$author: true,
				$parentCast: true,
				parentUrl: true,
				$channel: true,
				$$embeds: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast')
	const viewDomId = $derived('farcaster-cast-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
			fid: String(({ ...selection.entitySelector, ...prefetched }).fid),
			hash: String(({ ...selection.entitySelector, ...prefetched }).hash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.text) ?? ''), String((entity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).fid) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.fid) ?? ''), String((entity.hash) ?? '')].filter(Boolean).join(' ') || [String((entity.text) ?? ''), String((entity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestamp0 = prefetched.timestamp}
			{#if timestamp0 !== undefined && timestamp0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestamp0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{@const timestamp0 = prefetched.timestamp}
					{#if timestamp0 !== undefined && timestamp0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestamp0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestamp0 = entity.timestamp}
					{#if timestamp0 !== undefined && timestamp0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestamp0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FarcasterUser, false>('$author')}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						<div>
							<dt>Author</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser.entitySelector)}
									prefetched={farcasterUser}
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
				resource={selection[EntityProxyField]<EntityType.FarcasterChannel, false>('$channel')}
			>
				{#snippet children(farcasterChannel)}
					{#if farcasterChannel != null}
						<div>
							<dt>Channel</dt>
							<dd>
								<FarcasterChannelView
									selection={select(EntityType.FarcasterChannel, farcasterChannel.entitySelector)}
									prefetched={farcasterChannel}
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
				resource={selection[EntityProxyField]<EntityType.FarcasterCast, false>('$parentCast')}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null}
						<div>
							<dt>Parent cast</dt>
							<dd>
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
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{@const parentUrl = prefetched.parentUrl ?? selection.entitySelector.parentUrl}
					{#if parentUrl !== undefined && parentUrl !== null}
						<div>
							<dt>Parent URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(parentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(parentUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const parentUrl = entity.parentUrl ?? selection.entitySelector.parentUrl ?? prefetched.parentUrl}
					{#if parentUrl !== undefined && parentUrl !== null}
						<div>
							<dt>Parent URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(parentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(parentUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{@const threadHash = prefetched.threadHash ?? selection.entitySelector.threadHash}
					{#if threadHash !== undefined && threadHash !== null}
						<div>
							<dt>Thread hash</dt>
							<dd>
								<TruncatedValue value={String(threadHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const threadHash = entity.threadHash ?? selection.entitySelector.threadHash ?? prefetched.threadHash}
					{#if threadHash !== undefined && threadHash !== null}
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
			<ResourceBoundary resource={farcasterCast}>
				{#snippet Pending()}
					{@const clientUrl = prefetched.clientUrl ?? selection.entitySelector.clientUrl}
					{#if clientUrl !== undefined && clientUrl !== null}
						<div>
							<dt>Client URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(clientUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(clientUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const clientUrl = entity.clientUrl ?? selection.entitySelector.clientUrl ?? prefetched.clientUrl}
					{#if clientUrl !== undefined && clientUrl !== null}
						<div>
							<dt>Client URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(clientUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(clientUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={farcasterCast}>
			{#snippet children(entity)}
				{@const text = entity.text ?? selection.entitySelector.text ?? prefetched.text}
				{#if text === undefined || text === null || text === ''}
					<p data-text="muted">No text available.</p>
				{:else}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
