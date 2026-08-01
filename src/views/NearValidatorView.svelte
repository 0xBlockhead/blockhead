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
	}: EntitySelectionViewProps<EntityType.NearValidator> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearValidator = $derived(viewSelection({
		fields: {
			stakeYoctoNear: true,
			isSlashed: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.NearValidator}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.accountId || 'near validator')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={nearValidator}>
			{#snippet children(entity)}
				{@const stakeYoctoNear = entity.stakeYoctoNear}
				{#if stakeYoctoNear != null}
					<NumberValue
						value={stakeYoctoNear}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearValidator}>
			{#snippet children(entity)}
				{@const isSlashed = entity.isSlashed}
				{#if isSlashed != null}
					<span data-text="muted">
						{isSlashed ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>

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
				resource={nearValidator}
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
				resource={nearValidator}
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
		</dl>
	{/snippet}
</EntityView>
