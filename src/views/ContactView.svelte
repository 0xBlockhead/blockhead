<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadSharedAddress>
			title?: string
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
			| 'TypeAnnotationTooltip'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const contactKey = $derived(
		stringify(entityId),
	)

	const shared = useEntity(
		EntityType.BlockheadSharedAddress,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			peerId: {},
			sharedAt: {},
			...(open ?
				{
					$account: {},
					$room: {},
					$network: {},
					targetPeerIds: {},
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
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	bind:open
	{entityId}
	{href}
	{...entityViewRest}
>
	{#snippet Id()}
		{#if title !== undefined}
			<span>{title}</span>
		{:else}
			<ResourceBoundary
				resource={shared}
				placeholderText="Loading…"
			>
				{#snippet children(live)}
					<span>
						{live.peerId ?? entityId.id}
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Heading()}
		<span data-text="font-monospace">{entityId.id}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					<strong>Contact routing</strong> ties a shared execution address to multiplayer sessions: rooms, optional chain-scoped accounts, and negotiated peer ids.
				</p>
				<p>
					Use it to see who should sign next when several people share the same address book entry.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
			<ResourceBoundary
				resource={shared}
				placeholderText="Loading contact…"
			>
				{#snippet children(live)}
					<dl data-column-item="center">
						<div>
							<dt>Shown as</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>

						{#if live.peerId !== undefined}
							{#if live.peerId !== ''}
								<div>
									<dt>Peer ID</dt>
									<dd>{live.peerId}</dd>
								</div>
							{/if}
						{/if}

						{#if live.sharedAt !== undefined}
							<div>
								<dt>Shared at</dt>
								<dd>
									<Timestamp
										timestamp={live.sharedAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if live.$account !== undefined}
								{#if live.$network !== undefined}
									<div>
										<dt>Account</dt>
										<dd>
											<ActorNetworkView
												entityId={{
													$network: live.$network[EntityMetaKey.Id],
													$actor: live.$account[EntityMetaKey.Id],
												}}
												href={resolve('/~/(accounts)/accounts/account/[accountId]', {
													accountId: live.$account[EntityMetaKey.Id].address,
												})}
												layout={EntityLayout.Id}
												open={false}
												showTypeAnnotation={false}
											/>
										</dd>
									</div>
								{/if}
							{/if}

							{#if live.$room !== undefined}
								<div>
									<dt>Room</dt>
									<dd>{live.$room.id}</dd>
								</div>
							{/if}

							{#if live.$network !== undefined}
								<div>
									<dt>Execution chain ID</dt>
									<dd>{String(live.$network.chainId)}</dd>
								</div>
							{/if}

							{#if (live.targetPeerIds ?? []).length}
								<div>
									<dt>Target peer IDs</dt>
									<dd>{(live.targetPeerIds ?? []).join(', ')}</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadSharedAddress}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${contactKey}:carousel-more`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Session links
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Fields"
						href={`#${contactKey}:contact-overview`}
					>Fields</a>
					{#if children}
						<a
							data-scroll-marker-label="Page"
							href={`#${contactKey}:contact-extra`}
						>Page</a>
					{/if}
				{/snippet}

				{#snippet children(_childrenContext)}
					<section
						id={`${contactKey}:contact-overview`}
					>
						<ResourceBoundary
							resource={shared}
							placeholderText="Loading contact…"
						>
							{#snippet children(live)}
								{#if (
									(live.peerId === undefined || live.peerId === '')
									&& !(live.$account !== undefined && live.$network !== undefined)
									&& live.$room === undefined
									&& live.$network === undefined
									&& !(live.targetPeerIds ?? []).length
									&& live.sharedAt === undefined
								)}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No session details yet.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Peer id, shared time, linked account, room, chain, and target peers appear when this contact row is populated from a session.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Contact fields"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					{#if children}
						<section
							id={`${contactKey}:contact-extra`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
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
