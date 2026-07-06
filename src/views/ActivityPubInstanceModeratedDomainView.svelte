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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubInstanceModeratedDomain>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubInstanceModeratedDomain>>
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
	const activityPubInstanceModeratedDomain = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			severity: true,
			comment: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.domain ?? prefetched.domain) ?? ''), String((prefetched.severity) ?? ''), String((prefetched.comment) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain')
	const viewDomId = $derived('activity-pub-instance-moderated-domain-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
			{#snippet Pending()}
				{[String((selection.entitySelector.domain ?? prefetched.domain) ?? ''), String((prefetched.severity) ?? ''), String((prefetched.comment) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub instance moderated domain'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.domain) ?? ''), String((resolvedEntity.severity) ?? ''), String((resolvedEntity.comment) ?? ''), String((resolvedEntity.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.domain ?? prefetched.domain) ?? ''), String((prefetched.severity) ?? ''), String((prefetched.comment) ?? ''), String((selection.entitySelector.instanceOrigin ?? prefetched.instanceOrigin) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub instance moderated domain'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.domain) ?? ''), String((resolvedEntity.severity) ?? ''), String((resolvedEntity.comment) ?? ''), String((resolvedEntity.instanceOrigin) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A domain that a declared ActivityPub instance reports in its public moderation-domain list.
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
				<dt>Domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									domain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const domain = selection.entitySelector.domain ?? prefetched.domain}
							{#if domain !== undefined && domain !== null}
								{String((domain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const domain = resolvedEntity.domain}
							{#if domain !== undefined && domain !== null}
								{String((domain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							severity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const severity = prefetched.severity}
					{#if severity !== undefined && severity !== null}
						<div>
							<dt>Severity</dt>
							<dd>
								{String((severity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const severity = resolvedEntity.severity}
					{#if severity !== undefined && severity !== null}
						<div>
							<dt>Severity</dt>
							<dd>
								{String((severity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							comment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const comment = prefetched.comment}
					{#if comment !== undefined && comment !== null}
						<div>
							<dt>Comment</dt>
							<dd>
								{String((comment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const comment = resolvedEntity.comment}
					{#if comment !== undefined && comment !== null}
						<div>
							<dt>Comment</dt>
							<dd>
								{String((comment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
