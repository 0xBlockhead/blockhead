<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadSessionStatusByStatus } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/~/(sessions)/session/[sessionId]',
			{ sessionId: selector.id },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadSession>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const session = $derived(
		subscribe(EntityType.BlockheadSession,
			selector,
			({ sources: [
					Source.Local_Internal,
				], fields: { name: true, status: true, createdAt: true, updatedAt: true, lockedAt: true, ...(open ? ({ simulationCount: true, $$actions: ({ sources: [
								Source.Local_Internal,
							] }) }) : ({  })) } }),
		),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadSessionActionsView from '$/views/BlockheadSessionActionsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(session)}
				{session.fields.name ?? selector.id}
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

	{#snippet Content({})}
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
								{blockheadSessionStatusByStatus[session.fields.status]?.label ?? String(session.fields.status)}
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
								{#if session.fields.updatedAt !== undefined}
									<Timestamp
										timestamp={session.fields.updatedAt}
									/>
								{:else}
									{#if session.fields.createdAt !== undefined}
										<Timestamp
											timestamp={session.fields.createdAt}
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
								{#if session.fields.createdAt !== undefined}
									<Timestamp
										timestamp={session.fields.createdAt}
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
								{#if session.fields.updatedAt !== undefined}
									<Timestamp
										timestamp={session.fields.updatedAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Locked</dt>
					<dd>
						<ResourceBoundary
							resource={session}
							placeholderText="Loading session…"
						>
							{#snippet children(session)}
								{#if session.fields.lockedAt !== undefined}
									<Timestamp
										timestamp={session.fields.lockedAt}
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
								{#if session.fields.simulationCount !== undefined}
									{String(session.fields.simulationCount)}
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
		<BlockheadSessionActionsView
			href={href}
			entityFieldReference={{
				entityType: EntityType.BlockheadSession,
				selector,
				fieldName: '$$actions',
			}}
			id={`${selector.id}:actions`}
			open={_open}
		/>
	{/snippet}
</EntityView>
