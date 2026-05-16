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
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			placeholderText="Loading post…"
			resource={lensPost}
		>
			{#snippet children(resolvedLensPost)}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					startLength={42}
					endLength={14}
					value={(
						resolvedLensPost.text
							? resolvedLensPost.text
						:
							entityId.id
					)}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading post…"
			resource={lensPost}
		>
			{#snippet children(resolvedLensPost)}
				<div data-column>
					{#if resolvedLensPost.text}
						<p>
							<TruncatedValue
								value={resolvedLensPost.text}
								format={TruncatedValueFormat.Visual}
								startLength={64}
								endLength={24}
							/>
						</p>
					{/if}
					<dl>
						{#if resolvedLensPost.$author}
							<div>
								<dt>Author</dt>
								<dd>
									<a
										data-link
										href={resolve('/(social)/lens/account/[address]', {
											address: resolvedLensPost.$author[EntityMetaKey.Id].address,
										})}
									>
										<TruncatedValue
											value={resolvedLensPost.$author[EntityMetaKey.Id].address}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>
						{/if}
						{#if resolvedLensPost.timestamp != null}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={resolvedLensPost.timestamp}
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
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.LensPost}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
