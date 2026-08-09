<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.UsageRight_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetObjectView from '$/views/AssetObjectView.svelte'
	import NftTokenView from '$/views/NftTokenView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.UsageRight_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/usage-right/[subjectKey=stringSegment]/[rightKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					subjectKey: selection.entitySelector.subjectKey,
					rightKey: selection.entitySelector.rightKey,
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
				<dt>subject key</dt>
				<dd>
					{selection.entitySelector.subjectKey}
				</dd>
			</div>

			<div>
				<dt>right key</dt>
				<dd>
					{selection.entitySelector.rightKey}
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
				<dt>source kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sourceKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sourceKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>right kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rightKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rightKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$object}
			>
				{#snippet children(assetObject)}
					{#if assetObject != null}
						<div>
							<dt>object</dt>
							<dd>
								<AssetObjectView
									selection={select(EntityType.AssetObject, assetObject[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(nftToken)}
					{#if nftToken != null}
						<div>
							<dt>token</dt>
							<dd>
								<NftTokenView
									selection={select(EntityType.NftToken, nftToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$user}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>user</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
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
							expiresAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiresAt = entity.expiresAt}
					{#if expiresAt != null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={expiresAt} />
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
							ledgerCoordinateKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateKind = entity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind != null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{ledgerCoordinateKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateValue = entity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue != null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{ledgerCoordinateValue}
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
		</dl>
	{/snippet}
</EntityView>
