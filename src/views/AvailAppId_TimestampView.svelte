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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AvailAppId_Timestamp>, 'prefetched'> = $props()

	const availAppIdTimestamp = $derived(selection({
		fields: {
			dataSubmissionCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AvailAppIdView from '$/views/AvailAppIdView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailAppId_Timestamp}
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
		<ResourceBoundary resource={availAppIdTimestamp}>
			{#snippet children(entity)}
				{@const dataSubmissionCount = entity.dataSubmissionCount}
				{#if dataSubmissionCount != null}
					<NumberValue
						value={dataSubmissionCount}
					/>
				{/if}
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
				<dt>app ID</dt>
				<dd>
					<AvailAppIdView
						selection={select(EntityType.AvailAppId, selection.entitySelector.$appId)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={availAppIdTimestamp}
			>
				{#snippet children(entity)}
					{@const dataSubmissionCount = entity.dataSubmissionCount}
					{#if dataSubmissionCount != null}
						<div>
							<dt>data submission count</dt>
							<dd>
								<NumberValue
									value={dataSubmissionCount}
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
							observedSubmissionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedSubmissionCount = entity.observedSubmissionCount}
					{#if observedSubmissionCount != null}
						<div>
							<dt>observed submission count</dt>
							<dd>
								<NumberValue
									value={observedSubmissionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
