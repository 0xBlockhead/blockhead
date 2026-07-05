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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const farcasterCast = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			text: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.text) ?? ''), String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast')
	const viewDomId = $derived('farcaster-cast-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.fid !== undefined && pendingEntity.hash !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
			fid: String(pendingEntity.fid ?? ''),
			hash: String(pendingEntity.hash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterCast}>
			{#snippet Pending()}
				{[String((prefetched.text) ?? ''), String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.text) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterCast}>
			{#snippet Pending()}
				{[String((prefetched.fid) ?? ''), String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || [String((prefetched.text) ?? ''), String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster cast'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.fid) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.text) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestamp0 = resolvedEntity.timestamp}
				{#if timestamp0 !== undefined && timestamp0 !== null}
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
				resource={selection[EntityProxyField]<EntityType.FarcasterUser, false>('$author')}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
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
				resource={
					selection({
						fields: {
							timestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestamp = prefetched.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp = resolvedEntity.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
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
				resource={selection[EntityProxyField]<EntityType.FarcasterChannel, false>('$channel')}
			>
				{#snippet children(farcasterChannel)}
					{#if farcasterChannel != null && farcasterChannel[EntityMetaKey.Selector] != null}
						<div>
							<dt>Channel</dt>
							<dd>
								<FarcasterChannelView
									selection={select(EntityType.FarcasterChannel, farcasterChannel[EntityMetaKey.Selector])}
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
					{#if farcasterCast != null && farcasterCast[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent cast</dt>
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
							parentUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parentUrl = prefetched.parentUrl}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentUrl = resolvedEntity.parentUrl}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							threadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const threadHash = prefetched.threadHash}
					{#if threadHash !== undefined && threadHash !== null}
						<div>
							<dt>Thread hash</dt>
							<dd>
								<TruncatedValue value={String((threadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threadHash = resolvedEntity.threadHash}
					{#if threadHash !== undefined && threadHash !== null}
						<div>
							<dt>Thread hash</dt>
							<dd>
								<TruncatedValue value={String((threadHash) ?? '')} />
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
							clientUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientUrl = prefetched.clientUrl}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientUrl = resolvedEntity.clientUrl}
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

		<ResourceBoundary
			resource={
				selection({
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text = resolvedEntity.text}
				{#if text !== undefined && text !== null && text !== ''}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
