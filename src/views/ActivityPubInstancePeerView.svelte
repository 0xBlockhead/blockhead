<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubInstancePeer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubInstancePeer>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const activityPubInstancePeer = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.peerDomain ?? prefetched.peerDomain) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance peer')
	const viewDomId = $derived('activity-pub-instance-peer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstancePeer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubInstancePeer}>
			{#snippet Pending()}
				{[String((selection.entitySelector.peerDomain ?? prefetched.peerDomain) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub instance peer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.peerDomain) ?? ''), String((resolvedEntity.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubInstancePeer}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.peerDomain ?? prefetched.peerDomain) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub instance peer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.peerDomain) ?? ''), String((resolvedEntity.instanceOrigin) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A domain that a configured ActivityPub instance reports as a known connected domain.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instance origin</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									instanceOrigin: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const instanceOrigin = selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin}
							{#if instanceOrigin !== undefined && instanceOrigin !== null}
								<svelte:element
									this={'a'}
									href={String(instanceOrigin)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(instanceOrigin)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const instanceOrigin = resolvedEntity.instanceOrigin}
							{#if instanceOrigin !== undefined && instanceOrigin !== null}
								<svelte:element
									this={'a'}
									href={String(instanceOrigin)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(instanceOrigin)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Peer domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									peerDomain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const peerDomain = selection.entitySelector.peerDomain ?? prefetched.peerDomain}
							{#if peerDomain !== undefined && peerDomain !== null}
								{String((peerDomain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const peerDomain = resolvedEntity.peerDomain}
							{#if peerDomain !== undefined && peerDomain !== null}
								{String((peerDomain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
