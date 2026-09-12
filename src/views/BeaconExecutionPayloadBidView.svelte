<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BeaconExecutionPayloadBid> = $props()

	const beaconBlock = $derived(selection.entitySelector.$beaconBlock)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconExecutionPayloadBid = $derived(viewSelection({
		fields: {
			builderIndex: true,
			valueGwei: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconExecutionPayloadBid}
	entitySelector={selection.entitySelector}
	title={title ?? 'Builder ' + String(prefetched.builderIndex ?? '')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-bid',
				{
					network: (
						'caip2' in beaconBlock.$network ?
							caip2StringFromValue(beaconBlock.$network.caip2)
						:
							beaconBlock.$network.slug
					),
					root: beaconBlock.root,
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
		<ResourceBoundary resource={beaconExecutionPayloadBid}>
			{#snippet children(entity)}
				<span>Builder </span>
				<NumberValue
					value={entity.builderIndex}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconExecutionPayloadBid}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.valueGwei}
				/>

				<span> Gwei</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BeaconBlockView
				selection={select(EntityType.BeaconBlock, selection.entitySelector.$beaconBlock)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Beacon block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$beaconBlock)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Builder index</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadBid}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.builderIndex}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Committed execution block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									executionBlockHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.executionBlockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent execution block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									parentExecutionBlockHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.parentExecutionBlockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Fee recipient</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									feeRecipient: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.feeRecipient} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas limit</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									gasLimit: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.gasLimit}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Bid value</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadBid}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.valueGwei}
							/>

							<span> Gwei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution payment</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									executionPaymentGwei: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.executionPaymentGwei}
							/>

							<span> Gwei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Prev RANDAO</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									prevRandao: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.prevRandao} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution requests root</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									executionRequestsRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.executionRequestsRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signature} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Blob KZG commitments</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.blobKzgCommitments}
					>
						{#snippet children(blobKzgCommitments)}
							{blobKzgCommitments.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
