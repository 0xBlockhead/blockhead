<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubInstance>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ActivityPubInstance>>
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
	const activityPubInstance = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance')
	const viewDomId = $derived('activity-pub-instance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubInstance_TimestampsView from '$/views/ActivityPubInstance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
			instanceOrigin: encodeURIComponent(String(pendingEntity.instanceOrigin ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const instanceOrigin0 = pendingEntity.instanceOrigin}
					{#if instanceOrigin0 !== undefined && instanceOrigin0 !== null}
						<svelte:element
							this={'a'}
							href={String(instanceOrigin0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(instanceOrigin0)} />
						</svelte:element>
					{/if}
		{:else}
			<ResourceBoundary resource={activityPubInstance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instanceOrigin0 = resolvedEntity.instanceOrigin}
					{#if instanceOrigin0 !== undefined && instanceOrigin0 !== null}
						<svelte:element
							this={'a'}
							href={String(instanceOrigin0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(instanceOrigin0)} />
						</svelte:element>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.
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
								sources: selection.sources,
								fields: {
									instanceOrigin: true,
								},
							})
						}
					>
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ActivityPubInstance_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Mastodon_Rest,
							],
							count: true,
						})
					}
				title='Observations'
				emptyText='No ActivityPub instance observations yet.'
				id='ActivityPubInstance_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
