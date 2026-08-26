<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AptosTableItem_Timestamp>, 'prefetched'> = $props()

	const tableItem = $derived(selection.entitySelector.$tableItem)
	const aptosTableItemTimestamp = $derived(selection({
		fields: {
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTableItem_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.ledgerVersion)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(aptos)/table-item/[tableHandle=stringSegment]/[keyHash=stringSegment]/(aptosTableItem)/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in tableItem.$network.$network ?
							caip2StringFromValue(tableItem.$network.$network.caip2)
						:
							tableItem.$network.$network.slug
					),
					tableHandle: tableItem.tableHandle,
					keyHash: tableItem.keyHash,
					ledgerVersion: String(selection.entitySelector.ledgerVersion),
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
		<NumberValue
			value={selection.entitySelector.ledgerVersion}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTableItemTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<Timestamp timestamp={timestampMs} />
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
				<dt>table item</dt>
				<dd>
					<AptosTableItemView
						selection={select(EntityType.AptosTableItem, selection.entitySelector.$tableItem)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger version</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.ledgerVersion}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={aptosTableItemTimestamp}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueHash = entity.valueHash}
					{#if valueHash != null}
						<div>
							<dt>value hash</dt>
							<dd>
								<TruncatedValue value={valueHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pruned: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pruned = entity.pruned}
					{#if pruned != null}
						<div>
							<dt>pruned</dt>
							<dd>
								{pruned ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
