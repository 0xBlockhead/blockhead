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
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadSession>
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


	const session = useEntity(
		EntityType.BlockheadSession,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			status: {},
			createdAt: {},
			updatedAt: {},
			...(open ?
				{
					simulationCount: {},
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
	entityType={EntityType.BlockheadSession}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(session)}
				{session.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Simulation sessions bundle named checkpoints, iteration counters, and timestamps for replaying scripted EVM calls or HTTP fixtures.
		</p>
		<p>
			Replay captures are engineering artifacts—validate implied roots and receipts against live nodes instead of treating them as canonical chain history.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">

			<div>
				<dt>Session kind</dt>
				<dd>
					Persisted sandbox notebook.
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={session}
						placeholderText="Loading session…"
					>
						{#snippet children(session)}
							{session.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if !open}
				<div>
					<dt>Last activity</dt>
					<dd>
						<ResourceBoundary
							resource={session}
							placeholderText="Loading session…"
						>
							{#snippet children(session)}
								{#if session.updatedAt !== undefined}
									<Timestamp
										timestamp={session.updatedAt}
										format={TimestampFormat.Both}
									/>
								{:else}
									{#if session.createdAt !== undefined}
										<Timestamp
											timestamp={session.createdAt}
											format={TimestampFormat.Both}
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
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={session}
							placeholderText="Loading session…"
						>
							{#snippet children(session)}
								{#if session.createdAt !== undefined}
									<Timestamp
										timestamp={session.createdAt}
										format={TimestampFormat.Both}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Updated</dt>
					<dd>
						<ResourceBoundary
							resource={session}
							placeholderText="Loading session…"
						>
							{#snippet children(session)}
								{#if session.updatedAt !== undefined}
									<Timestamp
										timestamp={session.updatedAt}
										format={TimestampFormat.Both}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Simulation count</dt>
					<dd>
						<ResourceBoundary
							resource={session}
							placeholderText="Loading session…"
						>
							{#snippet children(session)}
								{#if session.simulationCount !== undefined}
									{String(session.simulationCount)}
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
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadSession}
				{entityId}
			/>

		{/if}
	{/snippet}
</EntityView>
