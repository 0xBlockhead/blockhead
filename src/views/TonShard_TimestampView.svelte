<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.TonShard_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'TON shard timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonWorkchainView from '$/views/TonWorkchainView.svelte'
</script>


<EntityView
	entityType={EntityType.TonShard_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON shard timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>workchain</dt>
				<dd>
					<TonWorkchainView
						selection={select(EntityType.TonWorkchain, selection.entitySelector.$workchain)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>shard prefix</dt>
				<dd>
					{pendingEntity.shardPrefix}
				</dd>
			</div>

			<div>
				<dt>seqno</dt>
				<dd>
					{String(pendingEntity.seqno)}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
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
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startLt = entity.startLt}
					{#if startLt != null}
						<div>
							<dt>start lt</dt>
							<dd>
								{String(startLt)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endLt = entity.endLt}
					{#if endLt != null}
						<div>
							<dt>end lt</dt>
							<dd>
								{String(endLt)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minRefMcSeqno: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minRefMcSeqno = entity.minRefMcSeqno}
					{#if minRefMcSeqno != null}
						<div>
							<dt>min ref mc seqno</dt>
							<dd>
								{String(minRefMcSeqno)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rootHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rootHash = entity.rootHash}
					{#if rootHash != null}
						<div>
							<dt>root hash</dt>
							<dd>
								<TruncatedValue value={rootHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fileHash = entity.fileHash}
					{#if fileHash != null}
						<div>
							<dt>file hash</dt>
							<dd>
								<TruncatedValue value={fileHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
