<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		children: _children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.StateChannel>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const channelKey = $derived(
		stringify(entityId),
	)

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
			...(open ?
				{
					balance0: {},
					balance1: {},
					$network: {},
					$participant0: {},
					$participant1: {},
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
	import Tooltip from '$/components/Tooltip.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import { resolve } from '$app/paths'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import NetworkView from '$/views/NetworkView.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	bind:open
	{entityId}
	{href}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={stateChannel}
			placeholderText="Loading state channel…"
		>
			{#snippet children(stateChannel)}
				{(
					stateChannel.status
					?? (stateChannel.turnNum !== undefined ? `Turn ${String(stateChannel.turnNum)}` : undefined)
					?? (stateChannel.totalDeposited !== undefined ? String(stateChannel.totalDeposited) : undefined)
					?? `State channel ${entityId.id}`
				)}
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

	{#snippet Content({ title: _title, href: _href })}
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
								{stateChannel.status}
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
									{String(stateChannel.totalDeposited)}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.balance0 !== undefined}
									{String(stateChannel.balance0)}
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
							{#snippet children(stateChannel)}
								{#if stateChannel.balance1 !== undefined}
									{String(stateChannel.balance1)}
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
									<NetworkView
										entityId={stateChannel.$network[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]',
											{ networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId) },
										)}
										layout={EntityLayout.Summary}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Participant 0</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(stateChannel)}
								{#if stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined}
									{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<ActorNetworkView
											entityId={{
												$network: stateChannel.$network[EntityMetaKey.Id],
												$actor: stateChannel.$participant0[EntityMetaKey.Id],
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
												{
													networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId),
													address: stateChannel.$participant0[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Summary}
											open={false}
											showTypeAnnotation={false}
										/>
									{:else}
										<ActorView
											entityId={stateChannel.$participant0[EntityMetaKey.Id]}
											href={resolve('/account/[address]', {
												address: stateChannel.$participant0[EntityMetaKey.Id].address,
											})}
											layout={EntityLayout.Summary}
											open={false}
											showTypeAnnotation={false}
										/>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Participant 1</dt>
					<dd>
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(stateChannel)}
								{#if stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
									{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<ActorNetworkView
											entityId={{
												$network: stateChannel.$network[EntityMetaKey.Id],
												$actor: stateChannel.$participant1[EntityMetaKey.Id],
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
												{
													networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId),
													address: stateChannel.$participant1[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Summary}
											open={false}
											showTypeAnnotation={false}
										/>
									{:else}
										<ActorView
											entityId={stateChannel.$participant1[EntityMetaKey.Id]}
											href={resolve('/account/[address]', {
												address: stateChannel.$participant1[EntityMetaKey.Id].address,
											})}
											layout={EntityLayout.Summary}
											open={false}
											showTypeAnnotation={false}
										/>
									{/if}
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
									<CoinInstanceView
										entityId={stateChannel.$asset[EntityMetaKey.Id]}
										{href}
										layout={EntityLayout.Summary}
										open={false}
										showTypeAnnotation={false}
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
										href={resolve(
											'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
											{ roomId: stateChannel.$room[EntityMetaKey.Id].id },
										)}
										layout={EntityLayout.Summary}
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

	{#snippet Details({
		open: _open,
	})}
		{#if _children}
			{@render _children()}
		{:else}
			<EntityDetails
				entityType={EntityType.StateChannel}
				{entityId}
			/>

			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
				data-carousel-basis="40ch"
			>
				<CollapsibleTabs
					id={`${channelKey}:carousel-relationships`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								Relationships
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers(_context)}
						<ResourceBoundary
							resource={stateChannel}
							placeholderText=""
						>
							{#snippet children(stateChannel)}
								{#if open}
									{#if (
										stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined
										|| stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined
									)}
										<a
											data-scroll-marker-label="Participants"
											href={`#${channelKey}:participants`}
										>Participants</a>
									{/if}

									{#if stateChannel.$asset?.[EntityMetaKey.Id] !== undefined}
										<a
											data-scroll-marker-label="Asset"
											href={`#${channelKey}:asset`}
										>Asset</a>
									{/if}

									{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<a
											data-scroll-marker-label="Network"
											href={`#${channelKey}:network`}
										>Network</a>
									{/if}

									{#if stateChannel.$room?.[EntityMetaKey.Id].id !== undefined}
										<a
											data-scroll-marker-label="Room"
											href={`#${channelKey}:room`}
										>Room</a>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet body(_ctx)}
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(stateChannel)}
								{#if open}
									{#if (
										stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined
										|| stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined
									)}
										<section
											data-scroll-marker-label="Participants"
											id={`${channelKey}:participants`}
										>
											<div data-column="gap-2">
												{#if stateChannel.$participant0?.[EntityMetaKey.Id].address !== undefined}
													{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
														<ActorNetworkView
															entityId={{
																$network: stateChannel.$network[EntityMetaKey.Id],
																$actor: stateChannel.$participant0[EntityMetaKey.Id],
															}}
															href={resolve(
																'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
																{
																	networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId),
																	address: stateChannel.$participant0[EntityMetaKey.Id].address,
																},
															)}
															layout={EntityLayout.Summary}
															showTypeAnnotation={false}
														/>
													{:else}
														<ActorView
															entityId={stateChannel.$participant0[EntityMetaKey.Id]}
															href={resolve('/account/[address]', {
																address: stateChannel.$participant0[EntityMetaKey.Id].address,
															})}
															layout={EntityLayout.Summary}
															showTypeAnnotation={false}
														/>
													{/if}
												{/if}

												{#if stateChannel.$participant1?.[EntityMetaKey.Id].address !== undefined}
													{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
														<ActorNetworkView
															entityId={{
																$network: stateChannel.$network[EntityMetaKey.Id],
																$actor: stateChannel.$participant1[EntityMetaKey.Id],
															}}
															href={resolve(
																'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
																{
																	networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId),
																	address: stateChannel.$participant1[EntityMetaKey.Id].address,
																},
															)}
															layout={EntityLayout.Summary}
															showTypeAnnotation={false}
														/>
													{:else}
														<ActorView
															entityId={stateChannel.$participant1[EntityMetaKey.Id]}
															href={resolve('/account/[address]', {
																address: stateChannel.$participant1[EntityMetaKey.Id].address,
															})}
															layout={EntityLayout.Summary}
															showTypeAnnotation={false}
														/>
													{/if}
												{/if}
											</div>
										</section>
									{/if}

									{#if stateChannel.$asset?.[EntityMetaKey.Id] !== undefined}
										<section
											data-scroll-marker-label="Asset"
											id={`${channelKey}:asset`}
										>
											<CoinInstanceView
												entityId={stateChannel.$asset[EntityMetaKey.Id]}
												{href}
												layout={EntityLayout.Summary}
												showTypeAnnotation={false}
											/>
										</section>
									{/if}

									{#if stateChannel.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<section
											data-scroll-marker-label="Network"
											id={`${channelKey}:network`}
										>
											<NetworkView
												entityId={stateChannel.$network[EntityMetaKey.Id]}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]',
													{ networkId: String(stateChannel.$network[EntityMetaKey.Id].chainId) },
												)}
												layout={EntityLayout.Summary}
												showTypeAnnotation={false}
											/>
										</section>
									{/if}

									{#if stateChannel.$room?.[EntityMetaKey.Id].id !== undefined}
										<section
											data-scroll-marker-label="Room"
											id={`${channelKey}:room`}
										>
											<BlockheadRoomView
												entityId={stateChannel.$room[EntityMetaKey.Id]}
												href={resolve(
													'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
													{ roomId: stateChannel.$room[EntityMetaKey.Id].id },
												)}
												layout={EntityLayout.Summary}
												showTypeAnnotation={false}
											/>
										</section>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>

