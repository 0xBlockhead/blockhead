<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


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
		>
	> = $props()


	const shared = useEntity(
		EntityType.BlockheadSharedAddress,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			peerId: {},
			$account: {},
			$room: {},
			$network: {},
			targetPeerIds: {},
			sharedAt: {},
		},
	)


</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		{#if title !== undefined}
			<Heading>
				{#if href}
					<a
						data-link
						{href}
					>{title}</a>
				{:else}
					{title}
				{/if}
			</Heading>
		{:else}
			<ResourceBoundary resource={shared}>
				{#snippet children(live)}
					<Heading>
						{#if href}
							<a
								data-link
								{href}
							>{live.peerId ?? entityId.id}</a>
						{:else}
							{live.peerId ?? entityId.id}
						{/if}
					</Heading>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={shared}>
			{#snippet children(live)}
				<dl>
					<div>
						<dt>Contact ID</dt>
						<dd>{entityId.id}</dd>
					</div>

					{#if live.peerId !== undefined && live.peerId !== ''}
						<div>
							<dt>Peer ID</dt>
							<dd>{live.peerId}</dd>
						</div>
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
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadSharedAddress}
			{entityId}
		>
			<ResourceBoundary resource={shared}>
				{#snippet children(live)}
					<dl>
						{#if live.peerId !== undefined && live.peerId !== ''}
							<div>
								<dt>Peer ID</dt>
								<dd>{live.peerId}</dd>
							</div>
						{/if}
						{#if live.$account !== undefined && live.$network !== undefined}
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
						{#if live.$room !== undefined}
							<div>
								<dt>Room</dt>
								<dd>{live.$room.id}</dd>
							</div>
						{/if}
						{#if live.$network !== undefined}
							<div>
								<dt>Network chain ID</dt>
								<dd>{String(live.$network.chainId)}</dd>
							</div>
						{/if}
						{#if (live.targetPeerIds ?? []).length > 0}
							<div>
								<dt>Target peer IDs</dt>
								<dd>{(live.targetPeerIds ?? []).join(', ')}</dd>
							</div>
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
					</dl>

					{#if (
						(live.peerId === undefined || live.peerId === '')
						&& !(live.$account !== undefined && live.$network !== undefined)
						&& live.$room === undefined
						&& live.$network === undefined
						&& (live.targetPeerIds ?? []).length === 0
						&& live.sharedAt === undefined
					)}
						<p data-text="muted">
							No additional contact details are available yet.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
