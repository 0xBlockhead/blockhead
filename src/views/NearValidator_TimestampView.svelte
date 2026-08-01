<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.NearValidator_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearValidatorTimestamp = $derived(viewSelection({
		fields: {
			validatorSetRole: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.epochId || 'near validator timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearValidatorView from '$/views/NearValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.NearValidator_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={nearValidatorTimestamp}>
			{#snippet children(entity)}
				{(entity.validatorSetRole ?? '') || selection.entitySelector.epochId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearValidatorTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Validator</dt>
				<dd>
					<NearValidatorView
						selection={select(EntityType.NearValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Epoch ID</dt>
				<dd>
					{selection.entitySelector.epochId}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={nearValidatorTimestamp}
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
					viewSelection({
						fields: {
							epochHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochHeight = entity.epochHeight}
					{#if epochHeight != null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue
									value={epochHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							epochStartHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochStartHeight = entity.epochStartHeight}
					{#if epochStartHeight != null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue
									value={epochStartHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const validatorSetRole = entity.validatorSetRole}
					{#if validatorSetRole != null}
						<div>
							<dt>Validator set role</dt>
							<dd>
								{validatorSetRole}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={publicKey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stakeYoctoNear: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeYoctoNear = entity.stakeYoctoNear}
					{#if stakeYoctoNear != null}
						<div>
							<dt>Stake yocto near</dt>
							<dd>
								<NumberValue
									value={stakeYoctoNear}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isSlashed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isSlashed = entity.isSlashed}
					{#if isSlashed != null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{isSlashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expectedBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expectedBlocks = entity.expectedBlocks}
					{#if expectedBlocks != null}
						<div>
							<dt>Expected blocks</dt>
							<dd>
								<NumberValue
									value={expectedBlocks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							producedBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const producedBlocks = entity.producedBlocks}
					{#if producedBlocks != null}
						<div>
							<dt>Produced blocks</dt>
							<dd>
								<NumberValue
									value={producedBlocks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expectedChunks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expectedChunks = entity.expectedChunks}
					{#if expectedChunks != null}
						<div>
							<dt>Expected chunks</dt>
							<dd>
								<NumberValue
									value={expectedChunks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							producedChunks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const producedChunks = entity.producedChunks}
					{#if producedChunks != null}
						<div>
							<dt>Produced chunks</dt>
							<dd>
								<NumberValue
									value={producedChunks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Shards</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									shards: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.shards.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
