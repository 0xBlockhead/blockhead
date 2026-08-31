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
	}: Omit<EntitySelectionViewProps<EntityType.HederaAllowance>, 'prefetched'> = $props()

	const owner = $derived(selection.entitySelector.$owner)
	const hederaAllowance = $derived(selection({
		fields: {
			serialNumber: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaAllowance_TimestampsView from '$/views/HederaAllowance_TimestampsView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAllowance}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.allowanceKind || 'hedera allowance')}
	href={
		href === undefined ?
			(
				'tokenId' in selection.entitySelector
				&& 'serialNumber' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/nft/[tokenId=stringSegment]/[serialNumber=nonNegativeBigInt]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
						{
							network: (
								'caip2' in owner.$network ?
									caip2StringFromValue(owner.$network.caip2)
								:
									owner.$network.slug
							),
							accountId: owner.accountId,
							tokenId: selection.entitySelector.tokenId,
							serialNumber: String(selection.entitySelector.serialNumber),
							spenderAccountId: selection.entitySelector.$spender.accountId,
							allowanceKind: selection.entitySelector.allowanceKind,
						}
					)
				:
					'tokenId' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/token/[tokenId=stringSegment]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
							{
								network: (
									'caip2' in owner.$network ?
										caip2StringFromValue(owner.$network.caip2)
									:
										owner.$network.slug
								),
								accountId: owner.accountId,
								tokenId: selection.entitySelector.tokenId,
								spenderAccountId: selection.entitySelector.$spender.accountId,
								allowanceKind: selection.entitySelector.allowanceKind,
							}
						)
					:
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
							{
								network: (
									'caip2' in owner.$network ?
										caip2StringFromValue(owner.$network.caip2)
									:
										owner.$network.slug
								),
								accountId: owner.accountId,
								spenderAccountId: selection.entitySelector.$spender.accountId,
								allowanceKind: selection.entitySelector.allowanceKind,
							}
						)
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<HederaAccountView
			selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaAllowance}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$token}
				>
					{#snippet children(hederaToken)}
						{#if hederaToken != null}
							<span data-text="muted">
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const serialNumber = entity.serialNumber}
				{#if serialNumber != null}
					<span data-text="muted">
						<NumberValue
							value={serialNumber}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>owner</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$owner)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>spender</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>allowance kind</dt>
				<dd>
					{selection.entitySelector.allowanceKind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null}
						<div>
							<dt>token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hederaAllowance}
			>
				{#snippet children(entity)}
					{@const serialNumber = entity.serialNumber}
					{#if serialNumber != null}
						<div>
							<dt>serial number</dt>
							<dd>
								<NumberValue
									value={serialNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nft}
			>
				{#snippet children(hederaNft)}
					{#if hederaNft != null}
						<div>
							<dt>NFT</dt>
							<dd>
								<HederaNftView
									selection={select(EntityType.HederaNft, hederaNft[EntityMetaKey.Selector])}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<HederaAllowance_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
