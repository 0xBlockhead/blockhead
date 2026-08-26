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
	}: Omit<EntitySelectionViewProps<EntityType.NearAccount_Block>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const block = $derived(selection.entitySelector.$block)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearAccountBlock = $derived(viewSelection({
		fields: {
			amountYoctoNear: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount_Block}
	entitySelector={selection.entitySelector}
	title={title ?? 'near account block state'}
	href={
		href === undefined ?
			(
				'hash' in block ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/block-state/[blockHeight=nonNegativeBigInt]/[blockHash=stringSegment]',
						{
							network: (
								'caip2' in account.$network ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.accountId,
							blockHeight: String(block.height),
							blockHash: block.hash,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NearBlockView
			selection={select(EntityType.NearBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAccountBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amountYoctoNear}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearAccountBlock}>
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
				<dt>Account</dt>
				<dd>
					<NearAccountView
						selection={select(EntityType.NearAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<NearBlockView
						selection={select(EntityType.NearBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={nearAccountBlock}
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

			<div>
				<dt>Amount yocto near</dt>
				<dd>
					<ResourceBoundary
						resource={nearAccountBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amountYoctoNear}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lockedYoctoNear: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lockedYoctoNear = entity.lockedYoctoNear}
					{#if lockedYoctoNear != null}
						<div>
							<dt>Locked yocto near</dt>
							<dd>
								<NumberValue
									value={lockedYoctoNear}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Storage usage bytes</dt>
				<dd>
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
							<NumberValue
								value={entity.storageUsageBytes}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const codeHash = entity.codeHash}
					{#if codeHash != null}
						<div>
							<dt>Code hash</dt>
							<dd>
								<TruncatedValue value={codeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearBlocks_Rest,
						],
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
							<dt>Deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
