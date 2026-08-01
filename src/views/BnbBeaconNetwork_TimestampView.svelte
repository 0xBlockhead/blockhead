<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BnbBeaconNetwork_Timestamp> = $props()

	const bnbBeaconNetworkTimestamp = $derived(selection({
		fields: {
			latestArchivedHeight: true,
			archiveCoverageStatus: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconNetworkTimestamp}>
			{#snippet children(entity)}
				{[String(entity.latestArchivedHeight ?? ''), (entity.archiveCoverageStatus ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
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
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
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
				resource={bnbBeaconNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const archiveCoverageStatus = entity.archiveCoverageStatus}
					{#if archiveCoverageStatus != null}
						<div>
							<dt>archive coverage status</dt>
							<dd>
								{archiveCoverageStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bnbBeaconNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const latestArchivedHeight = entity.latestArchivedHeight}
					{#if latestArchivedHeight != null}
						<div>
							<dt>latest archived height</dt>
							<dd>
								<NumberValue
									value={latestArchivedHeight}
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
							latestArchivedBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestArchivedBlockTimeMs = entity.latestArchivedBlockTimeMs}
					{#if latestArchivedBlockTimeMs != null}
						<div>
							<dt>latest archived block time ms</dt>
							<dd>
								<Timestamp timestamp={latestArchivedBlockTimeMs} />
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
							validatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorCount = entity.validatorCount}
					{#if validatorCount != null}
						<div>
							<dt>validator count</dt>
							<dd>
								<NumberValue
									value={validatorCount}
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
							tokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenCount = entity.tokenCount}
					{#if tokenCount != null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue
									value={tokenCount}
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
							migrationRecordCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const migrationRecordCount = entity.migrationRecordCount}
					{#if migrationRecordCount != null}
						<div>
							<dt>migration record count</dt>
							<dd>
								<NumberValue
									value={migrationRecordCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
