<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ActivityPubInstance> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived(String(pendingEntity.instanceOrigin ?? '') || 'ActivityPub instance')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubInstance_TimestampsView from '$/views/ActivityPubInstance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
			{
				instanceOrigin: encodeURIComponent(String(selection.entitySelector.instanceOrigin)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<a
			href={String(pendingEntity.instanceOrigin)}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={String(pendingEntity.instanceOrigin)} />
		</a>
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
					<a
						href={String(pendingEntity.instanceOrigin)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.instanceOrigin)} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const activityPubInstanceActivityPubInstanceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={activityPubInstanceActivityPubInstanceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstance_TimestampsView
						selection={activityPubInstanceActivityPubInstanceTimestampsViewTimestampsResource}
						countResource={activityPubInstanceActivityPubInstanceTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
