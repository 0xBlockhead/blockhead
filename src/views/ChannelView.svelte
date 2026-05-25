<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stateChannelStatusByStatus } from '$/constants/StateChannel.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/channel/[channelId]', {
			channelId: entityId.id,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannel>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const stateChannel = useEntity(
		EntityType.StateChannel,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.StateChannel]?.map((resolver) => resolver.source)
				?? [Source.Local_Internal]
			),
			status: {},
			createdAt: {},
			updatedAt: {},
			turnNum: {},
			totalDeposited: {},
			$network: {},
			$participant0: {},
			$participant1: {},
			...(open ?
				{
					balance0: {},
					balance1: {},
					$asset: {},
					$room: {},
				}
				:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Address from '$/views/Address.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import StateChannelDepositsView from '$/views/StateChannelDepositsView.svelte'
	import StateChannelStatesView from '$/views/StateChannelStatesView.svelte'
	import StateChannelTransfersView from '$/views/StateChannelTransfersView.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	bind:open
	{entityId}
	href={href}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={stateChannel}
			placeholderText="Loading state channel…"
		>
			{#snippet children(loadedStateChannel)}
				{#if loadedStateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined || loadedStateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
					<span data-row="inline align-center gap-2 wrap">
						{#if loadedStateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined}
							<Address
								actorId={loadedStateChannel.$participant0[EntityMetaKey.Id]}
								network={loadedStateChannel.$network?.[EntityMetaKey.Id]}
								isLinked={false}
							/>
						{/if}
						{#if loadedStateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined && loadedStateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
							<span aria-hidden="true">↔</span>
						{/if}
						{#if loadedStateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
							<Address
								actorId={loadedStateChannel.$participant1[EntityMetaKey.Id]}
								network={loadedStateChannel.$network?.[EntityMetaKey.Id]}
								isLinked={false}
							/>
						{/if}
					</span>
				{:else}
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			State channels settle balances privately off-chain until a closing transaction posts on-chain defaults.
		</p>
		<p>
			They serve a different workflow than mempool gossip or realtime collaboration rooms tracked elsewhere in the app.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={stateChannel}
						placeholderText="Loading state channel…"
					>
						{#snippet children(loadedStateChannel)}
							{#if loadedStateChannel.status !== undefined}
								{stateChannelStatusByStatus[loadedStateChannel.status].label}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if !open}
				<div>
					<dt>Last activity</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.updatedAt !== undefined}
									<Timestamp
										timestamp={loadedStateChannel.updatedAt}
									/>
								{:else}
									{#if loadedStateChannel.createdAt !== undefined}
										<Timestamp
											timestamp={loadedStateChannel.createdAt}
										/>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Total deposited</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.totalDeposited !== undefined}
									<NumberValue value={loadedStateChannel.totalDeposited} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Balance (participant 0)</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.balance0 !== undefined}
									<NumberValue value={loadedStateChannel.balance0} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Balance (participant 1)</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.balance1 !== undefined}
									<NumberValue value={loadedStateChannel.balance1} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Turn</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.turnNum !== undefined}
									{String(stateChannel.turnNum)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Network</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
									<NetworkView
										entityId={loadedStateChannel.$network[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Asset</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.$asset?.[EntityMetaKey.Id] !== undefined}
									{@const assetId = loadedStateChannel.$asset[EntityMetaKey.Id]}
									<CoinInstanceView
										entityId={assetId}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Room</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.$room?.[EntityMetaKey.Id].id !== undefined}
									<BlockheadRoomView
										entityId={loadedStateChannel.$room[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Opened</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.createdAt !== undefined}
									<Timestamp
										timestamp={loadedStateChannel.createdAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Last updated</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(loadedStateChannel)}
								{#if loadedStateChannel.updatedAt !== undefined}
									<Timestamp
										timestamp={loadedStateChannel.updatedAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}

	{/snippet}
</EntityView>

