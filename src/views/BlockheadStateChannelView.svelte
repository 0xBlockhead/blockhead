<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadStateChannel>, 'prefetched'> = $props()

	const blockheadStateChannel = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			createdAt: true,
		},
	}))
	const viewDomId = $derived('blockhead-state-channel-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import BlockheadStateChannelTransfersView from '$/views/BlockheadStateChannelTransfersView.svelte'
	import BlockheadStateChannelStatesView from '$/views/BlockheadStateChannelStatesView.svelte'
	import BlockheadStateChannelDepositsView from '$/views/BlockheadStateChannelDepositsView.svelte'
	import BlockheadStateChannel_TimestampsView from '$/views/BlockheadStateChannel_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.id || 'blockhead state channel')}
	href={
		href === undefined ?
			resolve(
				'/~/channel/[channelId=stringSegment]',
				{
					channelId: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannel}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.createdAt} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
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
						resource={selection.$participant0}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
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
						resource={selection.$participant1}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
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
						resource={selection.$asset}
					>
						{#snippet children(evmCoinInstance)}
							{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$room}
			>
				{#snippet children(blockheadRoom)}
					{#if blockheadRoom != null}
						{@const blockheadRoomInitial = untrack(() => blockheadRoom)}
						<div>
							<dt>Room</dt>
							<dd>
								<BlockheadRoomView
									selection={select(EntityType.BlockheadRoom, (blockheadRoom ?? blockheadRoomInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadRoom ?? blockheadRoomInitial}
									layout={EntityLayout.Value}
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
						resource={blockheadStateChannel}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-state-channel-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'state-channel-transfers',
						label: 'Transfers',
					},
					{
						id: 'state-channel-states',
						label: 'States',
					},
					{
						id: 'state-channel-deposits',
						label: 'Deposits',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStateChannelTransfers({ id, label })}
				<BlockheadStateChannelTransfersView
					selection={selection.$$transfers}
					collapsible={false}
					title={label}
					emptyText='No transfers yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStateChannelStates({ id, label })}
				<BlockheadStateChannelStatesView
					selection={selection.$$states}
					collapsible={false}
					title={label}
					emptyText='No states yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStateChannelDeposits({ id, label })}
				<BlockheadStateChannelDepositsView
					selection={selection.$$deposits}
					collapsible={false}
					title={label}
					emptyText='No deposits yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-state-channel-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'state-channel-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStateChannelTimestamps({ id, label })}
				<BlockheadStateChannel_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
