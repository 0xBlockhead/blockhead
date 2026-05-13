<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


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
			simulationCount: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(s)}
				<HeadingComponent>
					{s.name ?? entityId.id}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={session}
			placeholderText="Loading session…"
		>
			{#snippet children(s)}
				<dl>
					<div>
						<dt>Session id</dt>
						<dd>
							<TruncatedValue
								value={entityId.id}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
					<div>
						<dt>Status</dt>
						<dd>{s.status}</dd>
					</div>
					{#if s.updatedAt !== undefined}
						<div>
							<dt>Timestamp</dt>
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
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={s.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if s.name !== undefined}
							{#if s.name !== ''}
								<div>
									<dt>Name</dt>
									<dd>{s.name}</dd>
								</div>
							{/if}
						{/if}
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
			<ResourceBoundary
				resource={session}
				placeholderText="Loading session…"
			>
				{#snippet children(s)}
					{#if open}
						{#if s.createdAt === undefined}
							{#if s.updatedAt === undefined}
								{#if s.simulationCount === undefined}
									{#if s.name === undefined}
										<p data-text="muted">
											No additional session details are available yet.
										</p>
									{:else}
										{#if s.name === ''}
											<p data-text="muted">
												No additional session details are available yet.
											</p>
										{/if}
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
