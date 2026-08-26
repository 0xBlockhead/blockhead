<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RssItem_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'RSS item observation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<RssItemView
			selection={select(EntityType.RssItem, selection.entitySelector.$item)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Item</dt>
				<dd>
					<RssItemView
						selection={select(EntityType.RssItem, selection.entitySelector.$item)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Observed</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									observed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.observed ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed reachable</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									reachable: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.reachable ? 'Yes' : 'No'}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
