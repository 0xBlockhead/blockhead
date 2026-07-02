<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AtprotoActor_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const atprotoActorTimestamp = $derived(selection({
		fields: {
			followersCount: true,
			followsCount: true,
			postsCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation')
	const viewDomId = $derived('atproto-actor-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
			did: String(({ ...selection.entitySelector, ...prefetched }).$actor.did),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={atprotoActorTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={atprotoActorTimestamp}>
				{#snippet Pending()}
					{@const followersCount = prefetched.followersCount ?? selection.entitySelector.followersCount}
					{#if followersCount !== undefined && followersCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followersCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const followersCount = entity.followersCount ?? selection.entitySelector.followersCount ?? prefetched.followersCount}
					{#if followersCount !== undefined && followersCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followersCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={atprotoActorTimestamp}>
				{#snippet Pending()}
					{@const followsCount = prefetched.followsCount ?? selection.entitySelector.followsCount}
					{#if followsCount !== undefined && followsCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const followsCount = entity.followsCount ?? selection.entitySelector.followsCount ?? prefetched.followsCount}
					{#if followsCount !== undefined && followsCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={atprotoActorTimestamp}>
				{#snippet Pending()}
					{@const postsCount = prefetched.postsCount ?? selection.entitySelector.postsCount}
					{#if postsCount !== undefined && postsCount !== null}
						<div>
							<dt>Posts</dt>
							<dd>
								<NumberValue value={Number(postsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const postsCount = entity.postsCount ?? selection.entitySelector.postsCount ?? prefetched.postsCount}
					{#if postsCount !== undefined && postsCount !== null}
						<div>
							<dt>Posts</dt>
							<dd>
								<NumberValue value={Number(postsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
