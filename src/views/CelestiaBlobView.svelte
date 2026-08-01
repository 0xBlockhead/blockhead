<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.CelestiaBlob> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaBlob}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.commitment || 'celestia blob')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.commitment} />
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.height}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<CelestiaNamespaceView
				selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.height}
					/>
				</dd>
			</div>

			<div>
				<dt>commitment</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.commitment} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataHash = entity.dataHash}
					{#if dataHash != null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={dataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shareVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shareVersion = entity.shareVersion}
					{#if shareVersion != null}
						<div>
							<dt>share version</dt>
							<dd>
								<NumberValue
									value={shareVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							index: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const index = entity.index}
					{#if index != null}
						<div>
							<dt>index</dt>
							<dd>
								<NumberValue
									value={index}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue
									value={sizeBytes}
								/>
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
							signer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signer = entity.signer}
					{#if signer != null}
						<div>
							<dt>signer</dt>
							<dd>
								{signer}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							txHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const txHash = entity.txHash}
					{#if txHash != null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={txHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(celestiaBlock)}
					{#if celestiaBlock != null}
						<div>
							<dt>block</dt>
							<dd>
								<CelestiaBlockView
									selection={select(EntityType.CelestiaBlock, celestiaBlock[EntityMetaKey.Selector])}
									prefetched={celestiaBlock}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shareProofAvailable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shareProofAvailable = entity.shareProofAvailable}
					{#if shareProofAvailable != null}
						<div>
							<dt>share proof available</dt>
							<dd>
								{shareProofAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadRequested: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadRequested = entity.payloadRequested}
					{#if payloadRequested != null}
						<div>
							<dt>payload requested</dt>
							<dd>
								{payloadRequested ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						blobData: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const blobData = entity.blobData}
				{#if blobData != null && blobData !== ''}
					<code>{blobData}</code>
				{:else}
					<p data-text="muted">No blob data available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
