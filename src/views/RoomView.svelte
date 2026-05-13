<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { default as EntityViewComponent } from '$/components/EntityView.svelte'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'


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
			ComponentProps<typeof EntityViewComponent>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Heading'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'

	const room = useEntity(
		EntityType.BlockheadRoom,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			createdAt: {},
			createdBy: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(r)}
				<HeadingComponent>
					{r.name ?? entityId.id}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(r)}
				<dl>
					<div>
						<dt>Room id</dt>
						<dd>{entityId.id}</dd>
					</div>
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
					{#if open}
						{#if r.name !== undefined}
							{#if r.name !== ''}
								<div>
									<dt>Name</dt>
									<dd>{r.name}</dd>
								</div>
							{/if}
						{/if}
						{#if r.createdBy !== undefined}
							{#if r.createdBy !== ''}
								<div>
									<dt>Created by</dt>
									<dd>{r.createdBy}</dd>
								</div>
							{/if}
						{/if}
						{#if r.createdAt !== undefined}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={r.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
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
				entityType={EntityType.BlockheadRoom}
				{entityId}
			/>
			<ResourceBoundary
				resource={room}
				placeholderText="Loading room…"
			>
				{#snippet children(r)}
					{#if open}
						{#if (
							(r.name === undefined || r.name === '')
							&& (r.createdBy === undefined || r.createdBy === '')
							&& r.createdAt === undefined
						)}
							<p data-text="muted">
								No room details are available yet.
							</p>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
