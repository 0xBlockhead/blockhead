<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


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
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
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

	const room = useEntity(
		EntityType.BlockheadRoom,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			...(open ?
				{
					createdAt: {},
					createdBy: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(r)}
				{r.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Realtime room records identify a shared session: display name, host metadata, and stable room id for presence sync.
				</p>
				<p>
					Membership and permissions are carried on companion peer rows; rooms themselves are not XMPP MUC transcripts or IPFS DAGs.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(r)}
				<dl>
					<div>
						<dt>Room session id</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>

					<div>
						<dt>Room kind</dt>
						<dd>
							Realtime collaboration workspace.
						</dd>
					</div>

					{#if open}
						{#if r.createdAt !== undefined}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp
										timestamp={r.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if r.createdBy !== undefined}
							{#if r.createdBy !== ''}
								<div>
									<dt>Opened by</dt>
									<dd>{r.createdBy}</dd>
								</div>
							{/if}
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoom}
				{entityId}
			/>

		{/if}
	{/snippet}
</EntityView>

