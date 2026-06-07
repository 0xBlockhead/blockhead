<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadWalletAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const walletAccount = $derived(useEntity(
		EntityType.BlockheadWalletAccount,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			$network: {},
			address: {},
			label: {},
			capabilities: {},
		},
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletAccount}
	bind:open
	{entityId}
	title={`${entityId.caip10.namespace}:${entityId.caip10.reference}:${entityId.caip10.accountAddress}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue value={entityId.caip10.accountAddress} />
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={walletAccount}
			placeholderText={entityId.caip10.accountAddress}
		>
			{#snippet children(walletAccount)}
				{walletAccount.label ?? walletAccount.address}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Wallet accounts use structured CAIP-10 parts so the same connection model can represent EVM, Solana, Cosmos, Polkadot, Bitcoin, and other signer accounts.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={walletAccount}
			placeholderText="Loading wallet account…"
		>
			{#snippet children(walletAccount)}
				<dl data-column-item="center">
					<div>
						<dt>Namespace</dt>
						<dd>{entityId.caip10.namespace}</dd>
					</div>

					<div>
						<dt>Reference</dt>
						<dd>{entityId.caip10.reference}</dd>
					</div>

					<div>
						<dt>Address</dt>
						<dd>
							<TruncatedValue value={walletAccount.address} />
						</dd>
					</div>

					{#if walletAccount.label != null}
						<div>
							<dt>Label</dt>
							<dd>{walletAccount.label}</dd>
						</div>
					{/if}

					{#if walletAccount.$network != null}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									entityId={walletAccount.$network[EntityMetaKey.Id]}
									open={false}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Capabilities</dt>
							<dd>{walletAccount.capabilities.join(', ')}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
