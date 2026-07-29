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
	}: EntitySelectionViewProps<EntityType.TonBlock> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TonBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON block'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON block
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>workchain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									workchain: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.workchain}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>shard prefix</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									shardPrefix: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.shardPrefix}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>seqno</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									seqno: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.seqno}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>root hash</dt>
				<dd>
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
							<TruncatedValue value={entity.rootHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>file hash</dt>
				<dd>
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
							<TruncatedValue value={entity.fileHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							genUtimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const genUtimeMs = entity.genUtimeMs}
					{#if genUtimeMs != null}
						<div>
							<dt>gen utime ms</dt>
							<dd>
								{genUtimeMs}
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
		</dl>
	{/snippet}
</EntityView>
