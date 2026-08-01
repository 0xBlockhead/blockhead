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
	}: Omit<EntitySelectionViewProps<EntityType.TonShard_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonWorkchainView from '$/views/TonWorkchainView.svelte'
</script>


<EntityView
	entityType={EntityType.TonShard_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON shard timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>workchain</dt>
				<dd>
					<TonWorkchainView
						selection={select(EntityType.TonWorkchain, selection.entitySelector.$workchain)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>shard prefix</dt>
				<dd>
					{selection.entitySelector.shardPrefix}
				</dd>
			</div>

			<div>
				<dt>seqno</dt>
				<dd>
					{selection.entitySelector.seqno}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
								<Timestamp timestamp={timestampMs} />
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
								{startLt}
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
								{endLt}
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
								{minRefMcSeqno}
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
