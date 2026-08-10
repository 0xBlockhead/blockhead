<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.NearAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	}))
	const nearAccount = $derived(viewSelection({
		fields: {
			amountYoctoNear: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccessKeysView from '$/views/NearAccessKeysView.svelte'
	import NearTransactionsView from '$/views/NearTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.accountId || 'near account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					accountId: selection.entitySelector.accountId,
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
		<ResourceBoundary resource={nearAccount}>
			{#snippet children(entity)}
				{@const amountYoctoNear = entity.amountYoctoNear}
				{#if amountYoctoNear != null}
					<NumberValue
						value={amountYoctoNear}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={nearAccount}
			>
				{#snippet children(entity)}
					{@const amountYoctoNear = entity.amountYoctoNear}
					{#if amountYoctoNear != null}
						<div>
							<dt>Amount yocto near</dt>
							<dd>
								<NumberValue
									value={amountYoctoNear}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							storageUsageBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageUsageBytes = entity.storageUsageBytes}
					{#if storageUsageBytes != null}
						<div>
							<dt>Storage usage bytes</dt>
							<dd>
								<NumberValue
									value={storageUsageBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(nearContract)}
					{#if nearContract != null}
						{@const nearContractInitial = untrack(() => nearContract)}
						<div>
							<dt>Contract</dt>
							<dd>
								<NearContractView
									selection={select(EntityType.NearContract, (nearContract ?? nearContractInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const accessKeysResource = selection.$$accessKeys}
		<ResourceBoundary
			resource={accessKeysResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearAccessKeysView
						selection={accessKeysResource}
						countResource={accessKeysResource.count}
						title='Access keys'
						id='access-keys'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const transactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={transactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearTransactionsView
						selection={transactionsResource}
						countResource={transactionsResource.count}
						title='Transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
