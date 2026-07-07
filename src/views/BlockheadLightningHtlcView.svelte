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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningHtlc>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningHtlc>>
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
	const blockheadLightningHtlc = $derived(selection({
		sources: [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
		fields: {
			$channel: true,
			direction: true,
		},
	}))
	const titleFallback = $derived([(String((selection.entitySelector.htlcIndex ?? prefetched.htlcIndex) ?? '') ? 'HTLC ' + String((selection.entitySelector.htlcIndex ?? prefetched.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || 'blockhead Lightning htlc')
	const viewDomId = $derived('blockhead-lightning-htlc-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningHtlc}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet Pending()}
				{[(String((selection.entitySelector.htlcIndex ?? prefetched.htlcIndex) ?? '') ? 'HTLC ' + String((selection.entitySelector.htlcIndex ?? prefetched.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || title || 'blockhead Lightning htlc'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.htlcIndex) ?? '') ? 'HTLC ' + String((resolvedEntity.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.LightningChannel, false>('$channel')}
				>
					{#snippet children(lightningChannel)}
						<LightningChannelView
							selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
							prefetched={lightningChannel}
							href={
								(lightningChannel[EntityMetaKey.Selector].$network !== undefined && lightningChannel[EntityMetaKey.Selector].$network.slug !== undefined && lightningChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
									networkSlug: String(lightningChannel[EntityMetaKey.Selector].$network.slug ?? ''),
									channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.LightningChannel, false>('$channel')}
				>
					{#snippet children(lightningChannel)}
						<LightningChannelView
							selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
							prefetched={lightningChannel}
							href={
								(lightningChannel[EntityMetaKey.Selector].$network !== undefined && lightningChannel[EntityMetaKey.Selector].$network.slug !== undefined && lightningChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
									networkSlug: String(lightningChannel[EntityMetaKey.Selector].$network.slug ?? ''),
									channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet Pending()}
				{@const direction0 = prefetched.direction}
				{#if direction0 !== undefined && direction0 !== null}
					<span data-text="muted">
						{String((direction0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const direction0 = resolvedEntity.direction}
				{#if direction0 !== undefined && direction0 !== null}
					<span data-text="muted">
						{String((direction0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel state</dt>
				<dd>
					<BlockheadLightningChannelStateView
						selection={select(EntityType.BlockheadLightningChannelState, selection.entitySelector.$channelState, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LightningChannel, false>('$channel')}
					>
						{#snippet children(lightningChannel)}
							{#if lightningChannel[EntityMetaKey.Selector] != null}
								<LightningChannelView
									selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
									prefetched={lightningChannel}
									href={
										(lightningChannel[EntityMetaKey.Selector].$network !== undefined && lightningChannel[EntityMetaKey.Selector].$network.slug !== undefined && lightningChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
											networkSlug: String(lightningChannel[EntityMetaKey.Selector].$network.slug ?? ''),
											channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>htlc index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									htlcIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const htlcIndex = selection.entitySelector.htlcIndex ?? prefetched.htlcIndex}
							{#if htlcIndex !== undefined && htlcIndex !== null}
								<NumberValue value={Number(htlcIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const htlcIndex = resolvedEntity.htlcIndex}
							{#if htlcIndex !== undefined && htlcIndex !== null}
								<NumberValue value={Number(htlcIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							direction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const direction = prefetched.direction}
					{#if direction !== undefined && direction !== null}
						<div>
							<dt>direction</dt>
							<dd>
								{String((direction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const direction = resolvedEntity.direction}
					{#if direction !== undefined && direction !== null}
						<div>
							<dt>direction</dt>
							<dd>
								{String((direction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountMsat: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountMsat = prefetched.amountMsat}
					{#if amountMsat !== undefined && amountMsat !== null}
						<div>
							<dt>amount msat</dt>
							<dd>
								<NumberValue value={Number(amountMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountMsat = resolvedEntity.amountMsat}
					{#if amountMsat !== undefined && amountMsat !== null}
						<div>
							<dt>amount msat</dt>
							<dd>
								<NumberValue value={Number(amountMsat)} />
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
							expiryHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiryHeight = prefetched.expiryHeight}
					{#if expiryHeight !== undefined && expiryHeight !== null}
						<div>
							<dt>expiry height</dt>
							<dd>
								<NumberValue value={Number(expiryHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiryHeight = resolvedEntity.expiryHeight}
					{#if expiryHeight !== undefined && expiryHeight !== null}
						<div>
							<dt>expiry height</dt>
							<dd>
								<NumberValue value={Number(expiryHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hashLock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hashLock = prefetched.hashLock}
					{#if hashLock !== undefined && hashLock !== null}
						<div>
							<dt>hash lock</dt>
							<dd>
								<TruncatedValue value={String((hashLock) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hashLock = resolvedEntity.hashLock}
					{#if hashLock !== undefined && hashLock !== null}
						<div>
							<dt>hash lock</dt>
							<dd>
								<TruncatedValue value={String((hashLock) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const state = prefetched.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>state</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const state = resolvedEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>state</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
