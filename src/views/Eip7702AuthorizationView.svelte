<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.Eip7702Authorization> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const eip7702Authorization = $derived(selection({
		fields: {
			delegationAddress: true,
			authority: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.authorizationIndex ?? '') || 'eip7702 authorization')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip7702Authorization}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.authorizationIndex ?? '') || 'eip7702 authorization'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip7702Authorization}>
			{#snippet children(entity)}
				{String(entity.delegationAddress) || String(pendingEntity.authorizationIndex) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip7702Authorization}>
			{#snippet children(entity)}
				{@const authority0 = entity.authority}
				{#if authority0 != null}
					<span data-text="muted">
						{String(authority0)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>authorization index</dt>
				<dd>
					{String(pendingEntity.authorizationIndex)}
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									chainId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{String(entity.chainId)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>delegation address</dt>
				<dd>
					<ResourceBoundary
						resource={eip7702Authorization}
					>
						{#snippet children(entity)}
							<TruncatedValue value={String(entity.delegationAddress)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={eip7702Authorization}
			>
				{#snippet children(entity)}
					{@const authority = entity.authority}
					{#if authority != null}
						<div>
							<dt>authority</dt>
							<dd>
								{String(authority)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>nonce</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nonce: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{String(entity.nonce)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>y parity</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									yParity: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{String(entity.yParity)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>r</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									r: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{String(entity.r)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>s</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									s: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{String(entity.s)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationStatus = entity.verificationStatus}
					{#if verificationStatus != null}
						<div>
							<dt>verification status</dt>
							<dd>
								{verificationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAtMs = entity.verifiedAtMs}
					{#if verifiedAtMs != null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$authorityAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>authority account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$delegationContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>delegation contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
