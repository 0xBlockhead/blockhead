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
	}: Omit<EntitySelectionViewProps<EntityType.AvailDataSubmission>, 'prefetched'> = $props()

	const availDataSubmission = $derived(selection({
		fields: {
			blockNumber: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
	import AvailAppIdView from '$/views/AvailAppIdView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailDataSubmission}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.submissionKey || 'avail data submission')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/submission/[source=stringSegment]/[submissionKey=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					source: selection.entitySelector.source,
					submissionKey: selection.entitySelector.submissionKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={availDataSubmission}>
			{#snippet children(entity)}
				{@const blockNumber = entity.blockNumber}
				{#if blockNumber != null}
					<NumberValue
						value={blockNumber}
					/>
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
				<dt>network</dt>
				<dd>
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>submission key</dt>
				<dd>
					{selection.entitySelector.submissionKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(availBlock)}
					{#if availBlock != null}
						{@const availBlockInitial = untrack(() => availBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<AvailBlockView
									selection={select(EntityType.AvailBlock, (availBlock ?? availBlockInitial)[EntityMetaKey.Selector])}
									prefetched={availBlock ?? availBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$appId}
			>
				{#snippet children(availAppId)}
					{#if availAppId != null}
						{@const availAppIdInitial = untrack(() => availAppId)}
						<div>
							<dt>app ID</dt>
							<dd>
								<AvailAppIdView
									selection={select(EntityType.AvailAppId, (availAppId ?? availAppIdInitial)[EntityMetaKey.Selector])}
									prefetched={availAppId ?? availAppIdInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={availDataSubmission}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
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
							extrinsicIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const extrinsicIndex = entity.extrinsicIndex}
					{#if extrinsicIndex != null}
						<div>
							<dt>extrinsic index</dt>
							<dd>
								<NumberValue
									value={extrinsicIndex}
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
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							appId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const appId = entity.appId}
					{#if appId != null}
						<div>
							<dt>app ID</dt>
							<dd>
								<NumberValue
									value={appId}
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
							commitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commitment = entity.commitment}
					{#if commitment != null}
						<div>
							<dt>commitment</dt>
							<dd>
								{commitment}
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
							proofAvailable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofAvailable = entity.proofAvailable}
					{#if proofAvailable != null}
						<div>
							<dt>proof available</dt>
							<dd>
								{proofAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payload: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payload = entity.payload}
					{#if payload != null}
						<div>
							<dt>payload</dt>
							<dd>
								{payload}
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
	{/snippet}
</EntityView>
