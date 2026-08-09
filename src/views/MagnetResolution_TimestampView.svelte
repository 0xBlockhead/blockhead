<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MagnetResolution_Timestamp>, 'prefetched'> = $props()

	const magnetResolutionTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.MagnetResolution_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/magnet/[magnetUri=stringSegment]/(magnetLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					magnetUri: selection.entitySelector.magnetUri,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={magnetResolutionTimestamp}>
			{#snippet children(entity)}
				{entity.status || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>magnet URI</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.magnetUri} />
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={magnetResolutionTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolvedInfoHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedInfoHash = entity.resolvedInfoHash}
					{#if resolvedInfoHash != null}
						<div>
							<dt>resolved info hash</dt>
							<dd>
								<TruncatedValue value={resolvedInfoHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolvedMetainfoHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedMetainfoHash = entity.resolvedMetainfoHash}
					{#if resolvedMetainfoHash != null}
						<div>
							<dt>resolved metainfo hash</dt>
							<dd>
								<TruncatedValue value={resolvedMetainfoHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							trackerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const trackerCount = entity.trackerCount}
					{#if trackerCount != null}
						<div>
							<dt>tracker count</dt>
							<dd>
								<NumberValue
									value={trackerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							webSeedCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const webSeedCount = entity.webSeedCount}
					{#if webSeedCount != null}
						<div>
							<dt>Web seed count</dt>
							<dd>
								<NumberValue
									value={webSeedCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
