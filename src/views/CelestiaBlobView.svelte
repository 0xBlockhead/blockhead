<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.CelestiaBlob>, 'prefetched'> = $props()

	const namespace = $derived(selection.entitySelector.$namespace)


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]',
				{
					network: (
						'caip2' in namespace.$network.$network ?
							caip2StringFromValue(namespace.$network.$network.caip2)
						:
							namespace.$network.$network.slug
					),
					namespaceId: namespace.namespaceId,
					height: String(selection.entitySelector.height),
					commitment: selection.entitySelector.commitment,
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
						{@const celestiaBlockInitial = untrack(() => celestiaBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<CelestiaBlockView
									selection={select(EntityType.CelestiaBlock, (celestiaBlock ?? celestiaBlockInitial)[EntityMetaKey.Selector])}
									prefetched={celestiaBlock ?? celestiaBlockInitial}
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
