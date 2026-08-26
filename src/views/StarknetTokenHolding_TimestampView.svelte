<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetTokenHolding_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Starkscan,
		],
	}))
	const starknetTokenHoldingTimestamp = $derived(viewSelection({
		fields: {
			indexedBalanceRaw: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StarknetTokenHoldingView from '$/views/StarknetTokenHoldingView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetTokenHolding_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'starknet token holding timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<StarknetTokenHoldingView
			selection={select(EntityType.StarknetTokenHolding, selection.entitySelector.$holding)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetTokenHoldingTimestamp}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.indexedBalanceRaw}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>holding</dt>
				<dd>
					<StarknetTokenHoldingView
						selection={select(EntityType.StarknetTokenHolding, selection.entitySelector.$holding)}
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

			<div>
				<dt>indexed balance raw</dt>
				<dd>
					<ResourceBoundary
						resource={starknetTokenHoldingTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.indexedBalanceRaw}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>decimals</dt>
							<dd>
								<NumberValue
									value={decimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
