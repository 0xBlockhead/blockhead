<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenMint_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaTokenMint_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const solanaTokenMintTimestamp = $derived(selection({
		fields: {
			supply: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.slot ?? prefetched.slot) ?? '')].filter(Boolean).join(' ') || 'solana token mint timestamp')
	const viewDomId = $derived('solana-token-mint-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet Pending()}
				{@const slot0 = selection.entitySelector.slot ?? prefetched.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const slot0 = resolvedEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet Pending()}
				{@const supply0 = prefetched.supply}
				{#if supply0 !== undefined && supply0 !== null}
					<NumberValue value={Number(supply0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const supply0 = resolvedEntity.supply}
				{#if supply0 !== undefined && supply0 !== null}
					<NumberValue value={Number(supply0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenMintTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
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
						selection={select(EntityType.SolanaTokenMint, selection.entitySelector.$mint, {})}
						href={
							(selection.entitySelector.$mint.$network !== undefined && selection.entitySelector.$mint.$network.caip2 !== undefined && selection.entitySelector.$mint.$network.caip2.namespace !== undefined && selection.entitySelector.$mint.$network !== undefined && selection.entitySelector.$mint.$network.caip2 !== undefined && selection.entitySelector.$mint.$network.caip2.reference !== undefined && selection.entitySelector.$mint.mintAddress !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$mint.$network.caip2.namespace) + ':' + String(selection.entitySelector.$mint.$network.caip2.reference))].slug ?? ''),
								mintAddress: String(selection.entitySelector.$mint.mintAddress ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decimals = prefetched.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							mintAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mintAuthorityPubkey = prefetched.mintAuthorityPubkey}
					{#if mintAuthorityPubkey !== undefined && mintAuthorityPubkey !== null}
						<div>
							<dt>Mint authority public key</dt>
							<dd>
								{String((mintAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintAuthorityPubkey = resolvedEntity.mintAuthorityPubkey}
					{#if mintAuthorityPubkey !== undefined && mintAuthorityPubkey !== null}
						<div>
							<dt>Mint authority public key</dt>
							<dd>
								{String((mintAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							freezeAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freezeAuthorityPubkey = prefetched.freezeAuthorityPubkey}
					{#if freezeAuthorityPubkey !== undefined && freezeAuthorityPubkey !== null}
						<div>
							<dt>Freeze authority public key</dt>
							<dd>
								{String((freezeAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freezeAuthorityPubkey = resolvedEntity.freezeAuthorityPubkey}
					{#if freezeAuthorityPubkey !== undefined && freezeAuthorityPubkey !== null}
						<div>
							<dt>Freeze authority public key</dt>
							<dd>
								{String((freezeAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							isInitialized: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isInitialized = prefetched.isInitialized}
					{#if isInitialized !== undefined && isInitialized !== null}
						<div>
							<dt>Initialized</dt>
							<dd>
								{isInitialized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isInitialized = resolvedEntity.isInitialized}
					{#if isInitialized !== undefined && isInitialized !== null}
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
