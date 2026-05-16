<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoomPeer>
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
			| 'Heading'
		>
	> = $props()


	const peer = useEntity(
		EntityType.BlockheadRoomPeer,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			$room: {},
			peerId: {},
			displayName: {},
			isConnected: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary resource={peer}>
			{#snippet children(p)}
				{titleProp ?? p.displayName ?? p.peerId ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={peer}>
			{#snippet children(p)}
				<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					<div>
						<dt>Contact ID</dt>
						<dd>{entityId.id}</dd>
					</div>

					<div>
						<dt>Connected</dt>
						<dd>{p.isConnected ? 'Yes' : 'No'}</dd>
					</div>

					{#if p.displayName !== undefined}
						{#if p.displayName !== ''}
							<div>
								<dt>Name</dt>
								<dd>{p.displayName}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if p.peerId !== undefined}
							{#if p.peerId !== ''}
								<div>
									<dt>Peer ID</dt>
									<dd>{p.peerId}</dd>
								</div>
							{/if}
						{/if}
						{#if p.$room.id !== ''}
							<div>
								<dt>Room</dt>
								<dd>{p.$room.id}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoomPeer}
				{entityId}
			/>
			<ResourceBoundary resource={peer}>
				{#snippet children(p)}
					{#if p.$room.id === ''}
						{#if p.peerId === undefined}
							{#if p.displayName === undefined}
								<p data-text="muted">
									No additional peer details are available yet.
								</p>
							{/if}
							{#if p.displayName !== undefined}
								{#if p.displayName === ''}
									<p data-text="muted">
										No additional peer details are available yet.
									</p>
								{/if}
							{/if}
						{/if}
						{#if p.peerId !== undefined}
							{#if p.peerId === ''}
								{#if p.displayName === undefined}
									<p data-text="muted">
										No additional peer details are available yet.
									</p>
								{/if}
								{#if p.displayName !== undefined}
									{#if p.displayName === ''}
										<p data-text="muted">
											No additional peer details are available yet.
										</p>
									{/if}
								{/if}
							{/if}
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
