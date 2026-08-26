<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadCashuProof_Timestamp>, 'prefetched'> = $props()

	const proof = $derived(selection.entitySelector.$proof)
	const blockheadCashuProofTimestamp = $derived(selection({
		fields: {
			state: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCashuProofView from '$/views/BlockheadCashuProofView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuProof_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]/(blockheadCashuProof)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					walletId: proof.walletId,
					mintUrl: encodeURIComponent(proof.mintUrl),
					keysetId: proof.keysetId,
					secretHash: proof.secretHash,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuProofTimestamp}>
			{#snippet children(entity)}
				{entity.state || String(selection.entitySelector.timestampMs)}
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
				<dt>proof</dt>
				<dd>
					<BlockheadCashuProofView
						selection={select(EntityType.BlockheadCashuProof, selection.entitySelector.$proof)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadCashuProofTimestamp}
					>
						{#snippet children(entity)}
							{entity.state}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							y: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const y = entity.y}
					{#if y != null}
						<div>
							<dt>y</dt>
							<dd>
								{y}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							witness: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const witness = entity.witness}
					{#if witness != null}
						<div>
							<dt>witness</dt>
							<dd>
								{witness}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subscriptionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subscriptionId = entity.subscriptionId}
					{#if subscriptionId != null}
						<div>
							<dt>subscription ID</dt>
							<dd>
								{subscriptionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quoteId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteId = entity.quoteId}
					{#if quoteId != null}
						<div>
							<dt>quote ID</dt>
							<dd>
								{quoteId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const method = entity.method}
					{#if method != null}
						<div>
							<dt>method</dt>
							<dd>
								{method}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
