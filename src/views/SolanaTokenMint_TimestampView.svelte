<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SolanaTokenMint_Timestamp>, 'prefetched'> = $props()

	const mint = $derived(selection.entitySelector.$mint)
	const solanaTokenMintTimestamp = $derived(selection({
		fields: {
			supply: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.slot)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]/(solanaTokenMint)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in mint.$network ?
							caip2StringFromValue(mint.$network.caip2)
						:
							mint.$network.slug
					),
					mintAddress: mint.mintAddress,
					slot: String(selection.entitySelector.slot),
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
		<NumberValue
			value={selection.entitySelector.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet children(entity)}
				{@const supply = entity.supply}
				{#if supply != null}
					<NumberValue
						value={supply}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Mint</dt>
				<dd>
					<SolanaTokenMintView
						selection={select(EntityType.SolanaTokenMint, selection.entitySelector.$mint)}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{decimals}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintAuthorityPubkey = entity.mintAuthorityPubkey}
					{#if mintAuthorityPubkey != null}
						<div>
							<dt>Mint authority public key</dt>
							<dd>
								{mintAuthorityPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freezeAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freezeAuthorityPubkey = entity.freezeAuthorityPubkey}
					{#if freezeAuthorityPubkey != null}
						<div>
							<dt>Freeze authority public key</dt>
							<dd>
								{freezeAuthorityPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isInitialized: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isInitialized = entity.isInitialized}
					{#if isInitialized != null}
						<div>
							<dt>Initialized</dt>
							<dd>
								{isInitialized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
