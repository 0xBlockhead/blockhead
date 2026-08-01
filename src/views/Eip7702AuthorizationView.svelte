<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Eip7702Authorization>, 'prefetched'> = $props()

	const eip7702Authorization = $derived(selection({
		fields: {
			delegationAddress: true,
			authority: true,
		},
	}))


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
	title={title ?? String(selection.entitySelector.authorizationIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={eip7702Authorization}>
			{#snippet children(entity)}
				{entity.delegationAddress || String(selection.entitySelector.authorizationIndex)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip7702Authorization}>
			{#snippet children(entity)}
				{@const authority = entity.authority}
				{#if authority != null}
					<span data-text="muted">
						{authority}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>authorization index</dt>
				<dd>
					{selection.entitySelector.authorizationIndex}
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
							{entity.chainId}
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
							<TruncatedValue value={entity.delegationAddress} />
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
								{authority}
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
							{entity.nonce}
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
							{entity.yParity}
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
							{entity.r}
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
							{entity.s}
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
								<Timestamp timestamp={verifiedAtMs} />
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
									layout={EntityLayout.Value}
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
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
