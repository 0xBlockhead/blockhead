<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.XrplAccount_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	}))
	const xrplAccountTimestamp = $derived(viewSelection({
		fields: {
			balanceDrops: true,
		},
	}))
	const titleFallback = $derived(String(prefetched.balanceDrops ?? '') || 'XRPL account timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplAccountTimestamp}>
			{#snippet children(entity)}
				{@const balanceDrops = entity.balanceDrops}
				{#if balanceDrops != null}
					<NumberValue
						value={balanceDrops}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(prefetched.balanceDrops ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.ledgerIndex}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<XrplAccountView
						selection={select(EntityType.XrplAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.ledgerIndex}
					/>
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
					viewSelection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={xrplAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceDrops = entity.balanceDrops}
					{#if balanceDrops != null}
						<div>
							<dt>balance drops</dt>
							<dd>
								{balanceDrops}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ownerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerCount = entity.ownerCount}
					{#if ownerCount != null}
						<div>
							<dt>owner count</dt>
							<dd>
								{ownerCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>sequence</dt>
							<dd>
								{sequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							flags: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const flags = entity.flags}
					{#if flags != null}
						<div>
							<dt>flags</dt>
							<dd>
								{flags}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
