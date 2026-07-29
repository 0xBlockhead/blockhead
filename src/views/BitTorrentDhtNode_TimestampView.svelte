<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitTorrentDhtNode_Timestamp> = $props()

	const bitTorrentDhtNodeTimestamp = $derived(selection({
		fields: {
			reachable: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.nodeId || 'bit torrent DHT node timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentDhtNode_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.nodeId || 'bit torrent DHT node timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentDhtNodeTimestamp}>
			{#snippet children(entity)}
				{String(entity.reachable ?? '') || selection.entitySelector.nodeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
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

			<ResourceBoundary
				resource={bitTorrentDhtNodeTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
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
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							port: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const port = entity.port}
					{#if port != null}
						<div>
							<dt>port</dt>
							<dd>
								<NumberValue
									value={port}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>observed info hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									observedInfoHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.observedInfoHashes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
