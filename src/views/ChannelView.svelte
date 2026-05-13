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
			entityId: EntityId<typeof schema, EntityType.StateChannel>
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

	const channel = useEntity(
		EntityType.StateChannel,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			totalDeposited: {},
			balance0: {},
			balance1: {},
			turnNum: {},
			status: {},
			createdAt: {},
			updatedAt: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(c)}
				<HeadingComponent>
					{(
						c.status
						?? (c.turnNum !== undefined ? `Turn ${String(c.turnNum)}` : undefined)
						?? (c.totalDeposited !== undefined ? String(c.totalDeposited) : undefined)
						?? `Channel ${entityId.id}`
					)}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Channel id</dt>
				<dd>{entityId.id}</dd>
			</div>

			<ResourceBoundary
				resource={channel}
				placeholderText="Loading channel…"
			>
				{#snippet children(c)}
					{#if c.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{c.status}</dd>
						</div>
					{/if}
					{#if c.updatedAt !== undefined}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp
									timestamp={c.updatedAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{:else}
						{#if c.createdAt !== undefined}
							<div>
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={c.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if c.totalDeposited !== undefined}
							<div>
								<dt>Total deposited</dt>
								<dd>{String(c.totalDeposited)}</dd>
							</div>
						{/if}
						{#if c.balance0 !== undefined}
							<div>
								<dt>Balance 0</dt>
								<dd>{String(c.balance0)}</dd>
							</div>
						{/if}
						{#if c.balance1 !== undefined}
							<div>
								<dt>Balance 1</dt>
								<dd>{String(c.balance1)}</dd>
							</div>
						{/if}
						{#if c.turnNum !== undefined}
							<div>
								<dt>Turn</dt>
								<dd>{String(c.turnNum)}</dd>
							</div>
						{/if}
						{#if c.status !== undefined}
							<div>
								<dt>Status</dt>
								<dd>{c.status}</dd>
							</div>
						{/if}
						{#if c.createdAt !== undefined}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={c.createdAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
						{#if c.updatedAt !== undefined}
							<div>
								<dt>Updated at</dt>
								<dd>
									<Timestamp
										timestamp={c.updatedAt}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.StateChannel}
				{entityId}
			/>
			<ResourceBoundary
				resource={channel}
				placeholderText="Loading channel…"
			>
				{#snippet children(c)}
					{#if open}
						{#if c.totalDeposited === undefined}
							{#if c.balance0 === undefined}
								{#if c.balance1 === undefined}
									{#if c.turnNum === undefined}
										{#if c.status === undefined}
											{#if c.createdAt === undefined}
												{#if c.updatedAt === undefined}
													<p data-text="muted">
														No channel details are available yet.
													</p>
												{/if}
											{/if}
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
