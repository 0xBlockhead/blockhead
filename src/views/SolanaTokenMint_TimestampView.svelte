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
	}: EntitySelectionViewProps<EntityType.SolanaTokenMint_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const solanaTokenMintTimestamp = $derived(selection({
		fields: {
			supply: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.slot ?? '') || 'solana token mint timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet children(entity)}
				{@const supply0 = entity.supply}
				{#if supply0 != null}
					<NumberValue
						value={supply0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs0 = entity.timestampMs}
				{#if timestampMs0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Mint</dt>
				<dd>
					<SolanaTokenMintView
						selection={select(EntityType.SolanaTokenMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								{String(decimals)}
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
