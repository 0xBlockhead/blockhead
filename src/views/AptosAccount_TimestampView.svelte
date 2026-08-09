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
	}: Omit<EntitySelectionViewProps<EntityType.AptosAccount_Timestamp>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const aptosAccountTimestamp = $derived(selection({
		fields: {
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.ledgerVersion)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/aptos-ledger/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network.$network ?
							caip2StringFromValue(account.$network.$network.caip2)
						:
							account.$network.$network.slug
					),
					accountId: account.address,
					ledgerVersion: String(selection.entitySelector.ledgerVersion),
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
			value={selection.entitySelector.ledgerVersion}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosAccountTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<Timestamp timestamp={timestampMs} />
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
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger version</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.ledgerVersion}
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
				resource={aptosAccountTimestamp}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue
									value={blockHeight}
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
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>epoch</dt>
							<dd>
								<NumberValue
									value={epoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>sequence number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sequenceNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.sequenceNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>authentication key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									authenticationKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.authenticationKey}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
