<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/~/multiplayer/contacts'),
		title,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadSharedAddress>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const sharedAddress = useEntity(
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


	const contactKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	bind:open
	{entityId}
	href={href}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>{entityId.id}</span>
	{/snippet}

	{#snippet Title()}
		{#if title !== undefined}
			<span>{title}</span>
		{:else}
			<ResourceBoundary
				resource={sharedAddress}
				placeholderText="Loading…"
			>
				{#snippet children(sharedAddress)}
					<span>
						{sharedAddress.peerId ?? entityId.id}
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Heading()}
		<span>{entityId.id}</span>
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
				resource={sharedAddress}
				placeholderText="Loading contact…"
			>
				{#snippet children(sharedAddress)}
					<dl data-column-item="center">
						<div>
							<dt>Shown as</dt>
							<dd data-text="mono">
								{@render Title()}
							</dd>
						</div>

						{#if (
							sharedAddress.peerId !== undefined
							&& sharedAddress.peerId !== ''
						)}
							<div>
								<dt>Peer ID</dt>
								<dd>{sharedAddress.peerId}</dd>
							</div>
						{/if}

						{#if sharedAddress.sharedAt !== undefined}
							<div>
								<dt>Shared at</dt>
								<dd>
									<Timestamp
										timestamp={sharedAddress.sharedAt}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							open
							&& sharedAddress.$account !== undefined
							&& sharedAddress.$network !== undefined
						)}
							<div>
								<dt>Account</dt>
								<dd>
									<ActorNetworkView
										entityId={{
											$network: sharedAddress.$network[EntityMetaKey.Id],
											$actor: sharedAddress.$account[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
						{#if (
							open
							&& sharedAddress.$room !== undefined
						)}
							<div>
								<dt>Room</dt>
								<dd>{sharedAddress.$room.id}</dd>
							</div>
						{/if}
						{#if (
							open
							&& sharedAddress.$network !== undefined
						)}
							<div>
								<dt>Execution chain ID</dt>
								<dd>{String(sharedAddress.$network.chainId)}</dd>
							</div>
						{/if}
						{#if (
							open
							&& (sharedAddress.targetPeerIds ?? []).length
						)}
							<div>
								<dt>Target peer IDs</dt>
								<dd>{(sharedAddress.targetPeerIds ?? []).join(', ')}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				id={`${contactKey}:carousel-more`}
				sectionIdPrefix={contactKey}
				sections={[
					{ id: 'contact-overview', label: 'Fields' },
				]}
				data-card
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Session links
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionContactOverview({ id, label })}
					<ResourceBoundary
						resource={sharedAddress}
						placeholderText="Loading contact…"
					>
						{#snippet children(sharedAddress)}
							{#if (
								(sharedAddress.peerId === undefined || sharedAddress.peerId === '')
								&& !(sharedAddress.$account !== undefined && sharedAddress.$network !== undefined)
								&& sharedAddress.$room === undefined
								&& sharedAddress.$network === undefined
								&& !(sharedAddress.targetPeerIds ?? []).length
								&& sharedAddress.sharedAt === undefined
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
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
