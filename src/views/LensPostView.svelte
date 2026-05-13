<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
			entityId: EntityId<typeof schema, EntityType.LensPost>
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
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const lensPost = useEntity(
		EntityType.LensPost,
		entityId,
		{
			$: [Source.Lens_Graphql],
			text: {},
			timestamp: {},
			$author: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.LensPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			placeholderText="Loading post…"
			resource={lensPost}
		>
			{#snippet children(u)}
				<HeadingComponent>
					<TruncatedValue
						value={(
							u.text !== undefined && u.text.trim().length > 0 ?
								u.text.trim()
							:
								entityId.id
						)}
						format={TruncatedValueFormat.Visual}
						startLength={42}
						endLength={14}
					/>
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading post…"
			resource={lensPost}
		>
			{#snippet children(u)}
				<div data-column>
					{#if u.text !== undefined}
						<p>
							<TruncatedValue
								value={u.text}
								format={TruncatedValueFormat.Visual}
								startLength={64}
								endLength={24}
							/>
						</p>
					{/if}
					<dl>
						{#if u.$author}
							<div>
								<dt>Author</dt>
								<dd>
									<a
										data-link
										href={resolve('/(social)/lens/account/[address]', {
											address: u.$author[EntityMetaKey.Id].address,
										})}
									>
										<TruncatedValue
											value={u.$author[EntityMetaKey.Id].address}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>
						{/if}
						{#if u.timestamp !== undefined}
							<div>
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={u.timestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					</dl>
					<div data-text="mono muted">
						{entityId.id}
					</div>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.LensPost}
			{entityId}
		>
			<ResourceBoundary
				placeholderText="Loading post…"
				resource={lensPost}
			>
				{#snippet children(u)}
					<dl>
						{#if u.$author}
							<div>
								<dt>Author</dt>
								<dd>
									<a
										data-link
										href={resolve('/(social)/lens/account/[address]', {
											address: u.$author[EntityMetaKey.Id].address,
										})}
									>
										<TruncatedValue
											value={u.$author[EntityMetaKey.Id].address}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>
						{/if}
						{#if u.timestamp !== undefined}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={u.timestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
						<div>
							<dt>Post id</dt>
							<dd data-text="mono">
								{entityId.id}
							</dd>
						</div>
					</dl>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
