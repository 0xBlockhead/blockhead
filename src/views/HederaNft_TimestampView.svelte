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
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaNft_Timestamp>, 'prefetched'> = $props()

	const nft = $derived(selection.entitySelector.$nft)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNft_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]/(hederaNft)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in nft.$token.$network ?
							caip2StringFromValue(nft.$token.$network.caip2)
						:
							nft.$token.$network.slug
					),
					tokenId: nft.$token.tokenId,
					serialNumber: String(nft.serialNumber),
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
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>NFT</dt>
				<dd>
					<HederaNftView
						selection={select(EntityType.HederaNft, selection.entitySelector.$nft)}
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

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						{@const hederaAccountInitial = untrack(() => hederaAccount)}
						<div>
							<dt>owner</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, (hederaAccount ?? hederaAccountInitial)[EntityMetaKey.Selector])}
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
							ownerAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerAccountId = entity.ownerAccountId}
					{#if ownerAccountId != null}
						<div>
							<dt>owner account ID</dt>
							<dd>
								<TruncatedValue value={ownerAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spenderAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spenderAccountId = entity.spenderAccountId}
					{#if spenderAccountId != null}
						<div>
							<dt>spender account ID</dt>
							<dd>
								<TruncatedValue value={spenderAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							modifiedTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const modifiedTimestamp = entity.modifiedTimestamp}
					{#if modifiedTimestamp != null}
						<div>
							<dt>modified timestamp</dt>
							<dd>
								{modifiedTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
