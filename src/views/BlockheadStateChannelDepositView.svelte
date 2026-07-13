<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelDeposit>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadStateChannelDeposit>>
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
	const blockheadStateChannelDeposit = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
		},
	}))
	const titleFallback = $derived('blockhead state channel deposit')
	const viewDomId = $derived('blockhead-state-channel-deposit-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadStateChannelDeposit_TimestampsView from '$/views/BlockheadStateChannelDeposit_TimestampsView.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelDeposit}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadStateChannelDeposit}>
			{#snippet Pending()}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
					href={
						(selection.entitySelector.$account.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$account.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
					href={
						(selection.entitySelector.$account.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$account.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelDeposit}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$network}
				>
					{#snippet children(network)}
						<NetworkView
							selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
							prefetched={network}
							href={
								(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
								}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
					resource={selection.$network}
				>
					{#snippet children(network)}
						<NetworkView
							selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
							prefetched={network}
							href={
								(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
								}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
		<ResourceBoundary resource={blockheadStateChannelDeposit}>
			{#snippet Pending()}
				<span data-text="muted">
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel)}
						href={
							(selection.entitySelector.$channel.id !== undefined ? resolve('/channel/[channelId=stringSegment]', {
								channelId: String(selection.entitySelector.$channel.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel)}
						href={
							(selection.entitySelector.$channel.id !== undefined ? resolve('/channel/[channelId=stringSegment]', {
								channelId: String(selection.entitySelector.$channel.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
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
				<dt>account</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{#if network != null && network[EntityMetaKey.Selector] != null}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadStateChannelDeposit_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No deposit observations.'
				id='BlockheadStateChannelDeposit_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
