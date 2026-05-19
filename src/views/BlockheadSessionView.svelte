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
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(s)}
				{s.name ?? entityId.id}
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
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(s)}
				<dl data-column-item="center">
					<div>
						<dt>Simulator session id</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>

					<div>
						<dt>Session kind</dt>
						<dd>
							Persisted sandbox notebook.
						</dd>
					</div>

					<div>
						<dt>Status</dt>
						<dd>{s.status}</dd>
					</div>

					{#if !open}
						{#if s.updatedAt !== undefined}
							<div>
								<dt>Last activity</dt>
								<dd>
									<Timestamp
										timestamp={s.updatedAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{:else}
							{#if s.createdAt !== undefined}
								<div>
									<dt>Last activity</dt>
									<dd>
										<Timestamp
											timestamp={s.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}

					{#if open}
						{#if s.createdAt !== undefined}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp
										timestamp={s.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if s.updatedAt !== undefined}
							<div>
								<dt>Updated</dt>
								<dd>
									<Timestamp
										timestamp={s.updatedAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if s.simulationCount !== undefined}
							<div>
								<dt>Simulation count</dt>
								<dd>{String(s.simulationCount)}</dd>
							</div>
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
				entityType={EntityType.BlockheadSession}
				{entityId}
			/>

		{/if}
	{/snippet}
</EntityView>
