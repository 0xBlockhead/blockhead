<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stateChannelStatusByStatus } from '$/constants/StateChannel.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
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
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
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
			{#snippet children(stateChannel)}
				{#if stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined || stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
					<span data-row="inline align-center gap-2 wrap">
						{#if stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined}
							{#if stateChannel.$network?.[EntityMetaKey.Id] !== undefined}
								<EvmNetworkAccountView
									entityId={{
										$network: stateChannel.$network[EntityMetaKey.Id],
										$actor: stateChannel.$participant0[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<EvmAccountView
									entityId={stateChannel.$participant0[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							{/if}
						{/if}
						{#if stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined && stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
							<span aria-hidden="true">↔</span>
						{/if}
						{#if stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
							{#if stateChannel.$network?.[EntityMetaKey.Id] !== undefined}
								<EvmNetworkAccountView
									entityId={{
										$network: stateChannel.$network[EntityMetaKey.Id],
										$actor: stateChannel.$participant1[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<EvmAccountView
									entityId={stateChannel.$participant1[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							{/if}
						{/if}
					</span>
				{:else}
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
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
						{#snippet children(stateChannel)}
							{#if stateChannel.status !== undefined}
								{stateChannelStatusByStatus[stateChannel.status].label}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.updatedAt !== undefined}
									<Timestamp
										timestamp={stateChannel.updatedAt}
									/>
								{:else}
									{#if stateChannel.createdAt !== undefined}
										<Timestamp
											timestamp={stateChannel.createdAt}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.totalDeposited !== undefined}
									<NumberValue value={stateChannel.totalDeposited} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Participant 0 balance</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(stateChannel)}
								{#if stateChannel.balance0 !== undefined}
									<NumberValue value={stateChannel.balance0} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Participant 1 balance</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(stateChannel)}
								{#if stateChannel.balance1 !== undefined}
									<NumberValue value={stateChannel.balance1} />
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
							{#snippet children(stateChannel)}
								{#if stateChannel.turnNum !== undefined}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
									<EvmNetworkView
										entityId={stateChannel.$network[EntityMetaKey.Id]}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.$asset?.[EntityMetaKey.Id] !== undefined}
									{@const assetId = stateChannel.$asset[EntityMetaKey.Id]}
									<EvmCoinInstanceView
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
							{#snippet children(stateChannel)}
								{#if stateChannel.$room?.[EntityMetaKey.Id].id !== undefined}
									<BlockheadRoomView
										entityId={stateChannel.$room[EntityMetaKey.Id]}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.createdAt !== undefined}
									<Timestamp
										timestamp={stateChannel.createdAt}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.updatedAt !== undefined}
									<Timestamp
										timestamp={stateChannel.updatedAt}
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
