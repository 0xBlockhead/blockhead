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
		children,
		entityId,
		href,
		open = $bindable(true),
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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import { resolve } from '$app/paths'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import NetworkView from '$/views/NetworkView.svelte'
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
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={stateChannel}
			placeholderText="Loading state channel…"
		>
			{#snippet children(live)}
				{(
					live.status
					?? (live.turnNum !== undefined ? `Turn ${String(live.turnNum)}` : undefined)
					?? (live.totalDeposited !== undefined ? String(live.totalDeposited) : undefined)
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
		<div data-column="gap-1">

			<dl data-column-item="center">
			<div>
				<dt>State channel id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<ResourceBoundary
				resource={stateChannel}
				placeholderText="Loading state channel…"
			>
				{#snippet children(live)}
					{#if live.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{live.status}</dd>
						</div>
					{/if}

					{#if !open && live.updatedAt !== undefined}
						<div>
							<dt>Last activity</dt>
							<dd>
								<Timestamp
									timestamp={live.updatedAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}

					{#if !open && live.updatedAt === undefined && live.createdAt !== undefined}
						<div>
							<dt>Last activity</dt>
							<dd>
								<Timestamp
									timestamp={live.createdAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.totalDeposited !== undefined}
						<div>
							<dt>Total deposited</dt>
							<dd>{String(live.totalDeposited)}</dd>
						</div>
					{/if}

					{#if open && live.balance0 !== undefined}
						<div>
							<dt>Balance (participant 0)</dt>
							<dd>{String(live.balance0)}</dd>
						</div>
					{/if}

					{#if open && live.balance1 !== undefined}
						<div>
							<dt>Balance (participant 1)</dt>
							<dd>{String(live.balance1)}</dd>
						</div>
					{/if}

					{#if open && live.turnNum !== undefined}
						<div>
							<dt>Turn</dt>
							<dd>{String(live.turnNum)}</dd>
						</div>
					{/if}

					{#if open && live.$network?.[EntityMetaKey.Id].chainId !== undefined}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									entityId={live.$network[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]',
										{ networkId: String(live.$network[EntityMetaKey.Id].chainId) },
									)}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.$participant0?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>Participant 0</dt>
							<dd>
								<ActorView
									entityId={live.$participant0[EntityMetaKey.Id]}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: live.$participant0[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.$participant1?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>Participant 1</dt>
							<dd>
								<ActorView
									entityId={live.$participant1[EntityMetaKey.Id]}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: live.$participant1[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.$asset?.[EntityMetaKey.Id] !== undefined}
						<div>
							<dt>Asset</dt>
							<dd>
								<CoinInstanceView
									entityId={live.$asset[EntityMetaKey.Id]}
									{href}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.$room?.[EntityMetaKey.Id].id !== undefined}
						<div>
							<dt>Room</dt>
							<dd>
								<BlockheadRoomView
									entityId={live.$room[EntityMetaKey.Id]}
									href={resolve(
										'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
										{ roomId: live.$room[EntityMetaKey.Id].id },
									)}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.createdAt !== undefined}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp
									timestamp={live.createdAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}

					{#if open && live.updatedAt !== undefined}
						<div>
							<dt>Last updated</dt>
							<dd>
								<Timestamp
									timestamp={live.updatedAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.StateChannel}
				{entityId}
			/>

			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
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

					{#snippet Markers()}
						<ResourceBoundary
							resource={stateChannel}
							placeholderText=""
						>
							{#snippet children(live)}
								{#if open}
									{#if (
										live.$participant0?.[EntityMetaKey.Id].address !== undefined
										|| live.$participant1?.[EntityMetaKey.Id].address !== undefined
									)}
										<a
											data-scroll-marker-label="Participants"
											href={`#${channelKey}:participants`}
										>Participants</a>
									{/if}

									{#if live.$asset?.[EntityMetaKey.Id] !== undefined}
										<a
											data-scroll-marker-label="Asset"
											href={`#${channelKey}:asset`}
										>Asset</a>
									{/if}

									{#if live.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<a
											data-scroll-marker-label="Network"
											href={`#${channelKey}:network`}
										>Network</a>
									{/if}

									{#if live.$room?.[EntityMetaKey.Id].id !== undefined}
										<a
											data-scroll-marker-label="Room"
											href={`#${channelKey}:room`}
										>Room</a>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet children(_ctx)}
						<ResourceBoundary
							resource={stateChannel}
							placeholderText="Loading state channel…"
						>
							{#snippet children(live)}
								{#if open}
									{#if (
										live.$participant0?.[EntityMetaKey.Id].address !== undefined
										|| live.$participant1?.[EntityMetaKey.Id].address !== undefined
									)}
										<section
											data-scroll-marker-label="Participants"
											id={`${channelKey}:participants`}
										>
											<div data-column="gap-2">
												{#if live.$participant0?.[EntityMetaKey.Id].address !== undefined}
													<ActorView
														entityId={live.$participant0[EntityMetaKey.Id]}
														href={resolve('/~/(accounts)/accounts/account/[accountId]', {
															accountId: live.$participant0[EntityMetaKey.Id].address,
														})}
														layout={EntityLayout.Summary}
														open={false}
														showTypeAnnotation={false}
													/>
												{/if}

												{#if live.$participant1?.[EntityMetaKey.Id].address !== undefined}
													<ActorView
														entityId={live.$participant1[EntityMetaKey.Id]}
														href={resolve('/~/(accounts)/accounts/account/[accountId]', {
															accountId: live.$participant1[EntityMetaKey.Id].address,
														})}
														layout={EntityLayout.Summary}
														open={false}
														showTypeAnnotation={false}
													/>
												{/if}
											</div>
										</section>
									{/if}

									{#if live.$asset?.[EntityMetaKey.Id] !== undefined}
										<section
											data-scroll-marker-label="Asset"
											id={`${channelKey}:asset`}
										>
											<CoinInstanceView
												entityId={live.$asset[EntityMetaKey.Id]}
												{href}
												layout={EntityLayout.Summary}
												open={false}
												showTypeAnnotation={false}
											/>
										</section>
									{/if}

									{#if live.$network?.[EntityMetaKey.Id].chainId !== undefined}
										<section
											data-scroll-marker-label="Network"
											id={`${channelKey}:network`}
										>
											<NetworkView
												entityId={live.$network[EntityMetaKey.Id]}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]',
													{ networkId: String(live.$network[EntityMetaKey.Id].chainId) },
												)}
												layout={EntityLayout.Summary}
												open={false}
												showTypeAnnotation={false}
											/>
										</section>
									{/if}

									{#if live.$room?.[EntityMetaKey.Id].id !== undefined}
										<section
											data-scroll-marker-label="Room"
											id={`${channelKey}:room`}
										>
											<BlockheadRoomView
												entityId={live.$room[EntityMetaKey.Id]}
												href={resolve(
													'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
													{ roomId: live.$room[EntityMetaKey.Id].id },
												)}
												layout={EntityLayout.Summary}
												open={false}
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


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
