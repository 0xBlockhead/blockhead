<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosTokenBalance_Timestamp>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const token = $derived(selection.entitySelector.$token)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import TezosTokenView from '$/views/TezosTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosTokenBalance_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]/level/[level=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network.$network ?
							caip2StringFromValue(account.$network.$network.caip2)
						:
							account.$network.$network.slug
					),
					address: account.address,
					contractAddress: token.contractAddress,
					tokenId: String(token.tokenId),
					level: String(selection.entitySelector.level),
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
				<dt>account</dt>
				<dd>
					<TezosAccountView
						selection={select(EntityType.TezosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>token</dt>
				<dd>
					<TezosTokenView
						selection={select(EntityType.TezosToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					{selection.entitySelector.level}
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
							timestampMs: true,
						},
					})
				}
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
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{tokenId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							firstLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const firstLevel = entity.firstLevel}
					{#if firstLevel != null}
						<div>
							<dt>first level</dt>
							<dd>
								{firstLevel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastLevel = entity.lastLevel}
					{#if lastLevel != null}
						<div>
							<dt>last level</dt>
							<dd>
								{lastLevel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transferCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transferCount = entity.transferCount}
					{#if transferCount != null}
						<div>
							<dt>transfer count</dt>
							<dd>
								{transferCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
