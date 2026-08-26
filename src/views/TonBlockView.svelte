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
	}: Omit<EntitySelectionViewProps<EntityType.TonBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TonBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON block'}
	href={
		href === undefined ?
			(
				'workchain' in selection.entitySelector
				&& 'shardPrefix' in selection.entitySelector
				&& 'seqno' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/[workchain=integer]/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							workchain: String(selection.entitySelector.workchain),
							shardPrefix: selection.entitySelector.shardPrefix,
							seqno: String(selection.entitySelector.seqno),
						}
					)
				:
					'rootHash' in selection.entitySelector
					&& 'fileHash' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/hash/[rootHash=stringSegment]/[fileHash=stringSegment]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								rootHash: selection.entitySelector.rootHash,
								fileHash: selection.entitySelector.fileHash,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
