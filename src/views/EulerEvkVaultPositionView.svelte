<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EulerEvkVaultPosition>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Euler_Rest,
		],
	}))
	const eulerEvkVaultPosition = $derived(viewSelection({
		fields: {
			assets: true,
			borrowed: true,
		},
	}))
	const titleFallback = 'Euler EVK vault position'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EulerEvkVaultView from '$/views/EulerEvkVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.EulerEvkVaultPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EulerEvkVaultView
			selection={select(EntityType.EulerEvkVault, selection.entitySelector.$vault)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eulerEvkVaultPosition}>
			{#snippet children(entity)}
				{[entity.assets, entity.borrowed].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Vault</dt>
				<dd>
					<EulerEvkVaultView
						selection={select(EntityType.EulerEvkVault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Vault type</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									vaultType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.vaultType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									assetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.assetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Shares</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									shares: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.shares}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Assets</dt>
				<dd>
					<ResourceBoundary
						resource={eulerEvkVaultPosition}
					>
						{#snippet children(entity)}
							{entity.assets}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Borrowed</dt>
				<dd>
					<ResourceBoundary
						resource={eulerEvkVaultPosition}
					>
						{#snippet children(entity)}
							{entity.borrowed}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Assets value</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									assetsValue: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetsValue}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Debt value</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									debtValue: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.debtValue}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Collateral</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isCollateral: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isCollateral ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Controller</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isController: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isController ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Balance forwarder enabled</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									balanceForwarderEnabled: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.balanceForwarderEnabled ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
