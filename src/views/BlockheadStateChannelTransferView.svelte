<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadStateChannelTransfer>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadStateChannelTransfer>>
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
	const blockheadStateChannelTransfer = $derived(selection({
		sources: selection.sources,
		fields: {
			timestamp: true,
			status: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.amount) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel transfer')
	const viewDomId = $derived('blockhead-state-channel-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelTransfer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadStateChannelTransfer}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.amount) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadStateChannelTransfer}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.amount) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const timestamp0 = pendingEntity.timestamp}
			{#if timestamp0 !== undefined && timestamp0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestamp0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadStateChannelTransfer}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel</dt>
				<dd>
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel, {})}
						href={
							(selection.entitySelector.$channel.id !== undefined ? resolve('/channel/[channelId=stringSegment]', {
								channelId: String(selection.entitySelector.$channel.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>turn num</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									turnNum: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const turnNum = resolvedEntity.turnNum}
							{#if turnNum !== undefined && turnNum !== null}
								{String((turnNum) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$from, {})}
						href={
							(selection.entitySelector.$from.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$from.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>to</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$to, {})}
						href={
							(selection.entitySelector.$to.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$to.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									amount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								{String((amount) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestamp: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestamp = resolvedEntity.timestamp}
							{#if timestamp !== undefined && timestamp !== null}
								<Timestamp timestamp={Number(timestamp)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
