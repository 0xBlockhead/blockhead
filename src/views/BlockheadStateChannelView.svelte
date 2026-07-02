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
			...(open && {
				$$timestamps: true,
				$$transfers: true,
				$$states: true,
				$$deposits: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel')
	const viewDomId = $derived('blockhead-state-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/channel/[channelId]', {
			channelId: String(({ ...selection.entitySelector, ...prefetched }).id),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadStateChannel}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadStateChannel}>
				{#snippet Pending()}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
							<EvmNetworkView
								selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
								prefetched={evmNetwork}
								href={
									(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
										caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
									}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
										networkSlug: String(evmNetwork.entitySelector.slug),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
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
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
								prefetched={evmAccount}
								href={
									resolve('/(explore)/account/[address=evmAddress]', {
										address: String(evmAccount.entitySelector.address),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
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
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
								prefetched={evmAccount}
								href={
									resolve('/(explore)/account/[address=evmAddress]', {
										address: String(evmAccount.entitySelector.address),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
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
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
								prefetched={evmCoinInstance}
								href={
									resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
										chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
										coinInstanceSlug: String(
											(
												evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
													'native'
												:
													evmCoinInstance.entitySelector.$contract.address
											)
										),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
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
					{#if blockheadRoom != null}
						<div>
							<dt>Room</dt>
							<dd>
								<BlockheadRoomView
									selection={select(EntityType.BlockheadRoom, blockheadRoom.entitySelector)}
									prefetched={blockheadRoom}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
