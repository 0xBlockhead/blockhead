<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { stateChannelStatusByStatus } from '$/constants/StateChannel.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(assets)/(channels)/channel/[channelId]',
			{ channelId: selection.entitySelector.id },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StateChannel>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const stateChannel = $derived(selection(
		({ sources: [Source.Local_Internal], fields: { status: true, createdAt: true, updatedAt: true, turnNum: true, totalDeposited: true, $network: true, $participant0: true, $participant1: true, ...(open ? ({ balance0: true, balance1: true, $asset: true, $room: true }) : ({  })) } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	bind:open
	entitySelector={selection.entitySelector}
	href={href}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={stateChannel}
			placeholderText="Loading state channel…"
		>
			{#snippet children(stateChannel)}
				{#if stateChannel.$participant0?.[EntityMetaKey.Selector].address !== undefined || stateChannel.$participant1?.[EntityMetaKey.Selector].address !== undefined}
					<span data-row="inline align-center gap-2 wrap">
						{#if stateChannel.$participant0?.[EntityMetaKey.Selector].address !== undefined}
							{#if stateChannel.$network?.[EntityMetaKey.Selector] !== undefined}
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, {
										$network: stateChannel.$network[EntityMetaKey.Selector],
										$actor: stateChannel.$participant0[EntityMetaKey.Selector],
									})}
									layout={EntityLayout.Value}

								/>
							{:else}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, stateChannel.$participant0[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							{/if}
						{/if}
						{#if stateChannel.$participant0?.[EntityMetaKey.Selector].address !== undefined && stateChannel.$participant1?.[EntityMetaKey.Selector].address !== undefined}
							<span aria-hidden="true">↔</span>
						{/if}
						{#if stateChannel.$participant1?.[EntityMetaKey.Selector].address !== undefined}
							{#if stateChannel.$network?.[EntityMetaKey.Selector] !== undefined}
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, {
										$network: stateChannel.$network[EntityMetaKey.Selector],
										$actor: stateChannel.$participant1[EntityMetaKey.Selector],
									})}
									layout={EntityLayout.Value}

								/>
							{:else}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, stateChannel.$participant1[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							{/if}
						{/if}
					</span>
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
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

	{#snippet Content({})}
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
								{#if stateChannel.$network !== undefined}
									<EvmNetworkView
										selection={select(EntityType.EvmNetwork, stateChannel.$network[EntityMetaKey.Selector])}
										layout={EntityLayout.Title}

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
								{#if stateChannel.$asset?.[EntityMetaKey.Selector] !== undefined}
									<EvmCoinInstanceView
										selection={select(EntityType.EvmCoinInstance, stateChannel.$asset[EntityMetaKey.Selector])}
										layout={EntityLayout.Title}

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
								{#if stateChannel.$room?.[EntityMetaKey.Selector].id !== undefined}
									<BlockheadRoomView
										selection={select(EntityType.BlockheadRoom, stateChannel.$room[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

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
</EntityView>
