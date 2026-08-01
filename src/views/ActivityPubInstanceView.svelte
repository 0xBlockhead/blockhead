<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubInstance_TimestampsView from '$/views/ActivityPubInstance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstance}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.instanceOrigin || 'ActivityPub instance')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
				{
					instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<a
			href={selection.entitySelector.instanceOrigin}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={selection.entitySelector.instanceOrigin} />
		</a>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instance origin</dt>
				<dd>
					<a
						href={selection.entitySelector.instanceOrigin}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.instanceOrigin} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstance_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
