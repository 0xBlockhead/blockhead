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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAtprotoNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalAtprotoNetwork_Timestamp>>
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

	const globalAtprotoNetworkTimestamp = $derived(selection({
		fields: {
			sourceWindowActorCount: true,
			sourceWindowPostCount: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol hub observation')
	const viewDomId = $derived('-global-atproto-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(atproto)/atproto/observations/[timestampMs=nonNegativeInteger]/[source]', {
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
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
			<ResourceBoundary resource={globalAtprotoNetworkTimestamp}>
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

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={globalAtprotoNetworkTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={globalAtprotoNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowActorCount = prefetched.sourceWindowActorCount ?? selection.entitySelector.sourceWindowActorCount}
					{#if sourceWindowActorCount !== undefined && sourceWindowActorCount !== null}
						<div>
							<dt>Source-window accounts</dt>
							<dd>
								<NumberValue value={Number(sourceWindowActorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowActorCount = entity.sourceWindowActorCount ?? selection.entitySelector.sourceWindowActorCount ?? prefetched.sourceWindowActorCount}
					{#if sourceWindowActorCount !== undefined && sourceWindowActorCount !== null}
						<div>
							<dt>Source-window accounts</dt>
							<dd>
								<NumberValue value={Number(sourceWindowActorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalAtprotoNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowPostCount = prefetched.sourceWindowPostCount ?? selection.entitySelector.sourceWindowPostCount}
					{#if sourceWindowPostCount !== undefined && sourceWindowPostCount !== null}
						<div>
							<dt>Source-window posts</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowPostCount = entity.sourceWindowPostCount ?? selection.entitySelector.sourceWindowPostCount ?? prefetched.sourceWindowPostCount}
					{#if sourceWindowPostCount !== undefined && sourceWindowPostCount !== null}
						<div>
							<dt>Source-window posts</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalAtprotoNetworkTimestamp}>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
