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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadStateChannel>>
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
	const blockheadStateChannel = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			$participant0: true,
			$participant1: true,
			$asset: true,
			$room: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel')
	const viewDomId = $derived('blockhead-state-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadStateChannel_TimestampsView from '$/views/BlockheadStateChannel_TimestampsView.svelte'
	import BlockheadStateChannelTransfersView from '$/views/BlockheadStateChannelTransfersView.svelte'
	import BlockheadStateChannelStatesView from '$/views/BlockheadStateChannelStatesView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannel}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.id !== undefined ? resolve('/channel/[channelId]', {
			channelId: String(pendingEntity.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadStateChannel}>
			{#snippet Pending()}
				{@const id0 = selection.entitySelector.id ?? prefetched.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const id0 = resolvedEntity.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannel}>
			{#snippet Pending()}
				{@const createdAt0 = prefetched.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$network')}
					>
						{#snippet children(evmNetwork)}
							{#if evmNetwork[EntityMetaKey.Selector] != null}
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Participant 0</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$participant0')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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

		<dl data-column-item="center">
			<div>
				<dt>Participant 1</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$participant1')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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

		<dl data-column-item="center">
			<div>
				<dt>Asset</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$asset')}
					>
						{#snippet children(evmCoinInstance)}
							{#if evmCoinInstance[EntityMetaKey.Selector] != null}
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadRoom, false>('$room')}
			>
				{#snippet children(blockheadRoom)}
					{#if blockheadRoom != null && blockheadRoom[EntityMetaKey.Selector] != null}
						<div>
							<dt>Room</dt>
							<dd>
								<BlockheadRoomView
									selection={select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector])}
									prefetched={blockheadRoom}
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
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadStateChannel_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadStateChannel_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No observations yet.'
				id='BlockheadStateChannel_TimestampsView-$$timestamps'
			/>

			<BlockheadStateChannelTransfersView
				selection={selection[EntityProxyField]<EntityType.BlockheadStateChannelTransfer>('$$transfers')}
				title='Transfers'
				emptyText='No transfers yet.'
				id='BlockheadStateChannelTransfersView-$$transfers'
			/>

			<BlockheadStateChannelStatesView
				selection={selection[EntityProxyField]<EntityType.BlockheadStateChannelState>('$$states')}
				title='States'
				emptyText='No states yet.'
				id='BlockheadStateChannelStatesView-$$states'
			/>
		{/if}
	{/snippet}
</EntityView>
