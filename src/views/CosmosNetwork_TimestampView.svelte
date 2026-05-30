<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.CosmosNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.CosmosNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.CosmosSdk_Rest,
			],
			latestBlockHeight: {},
			latestBlockHash: {},
			latestBlockTimeMs: {},
			latestBlockTransactionCount: {},
			chainId: {},
			nodeNetwork: {},
			applicationName: {},
			applicationVersion: {},
			cosmosSdkVersion: {},
			isSyncing: {},
			validatorCount: {},
			bondedValidatorCount: {},
			bondedTokens: {},
			notBondedTokens: {},
			governanceProposalCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Cosmos network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.latestBlockHeight !== undefined}
					<NumberValue value={snapshot.latestBlockHeight} />
				{:else if snapshot.validatorCount !== undefined}
					<NumberValue value={snapshot.validatorCount} />
					validators
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Cosmos network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={snapshot.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.applicationVersion != null}
						<div>
							<dt>Application</dt>
							<dd>{snapshot.applicationName ?? 'gaiad'} {snapshot.applicationVersion}</dd>
						</div>
					{/if}

					{#if snapshot.validatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.validatorCount} /></dd>
						</div>
					{/if}

					{#if snapshot.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if snapshot.bondedTokens !== undefined}
						<div>
							<dt>Bonded stake</dt>
							<dd><NumberValue value={snapshot.bondedTokens} /> uatom</dd>
						</div>
					{/if}

					{#if open && snapshot.latestBlockHash != null}
						<div>
							<dt>Latest hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.latestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.latestBlockTimeMs !== undefined}
						<div>
							<dt>Block time</dt>
							<dd><Timestamp timestamp={snapshot.latestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.latestBlockTransactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.latestBlockTransactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.nodeNetwork != null}
						<div>
							<dt>Node network</dt>
							<dd>{snapshot.nodeNetwork}</dd>
						</div>
					{/if}

					{#if open && snapshot.cosmosSdkVersion != null}
						<div>
							<dt>Cosmos SDK</dt>
							<dd>{snapshot.cosmosSdkVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.bondedValidatorCount !== undefined}
						<div>
							<dt>Bonded sample</dt>
							<dd><NumberValue value={snapshot.bondedValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.notBondedTokens !== undefined}
						<div>
							<dt>Unbonded stake</dt>
							<dd><NumberValue value={snapshot.notBondedTokens} /> uatom</dd>
						</div>
					{/if}

					{#if open && snapshot.governanceProposalCount !== undefined}
						<div>
							<dt>Governance proposals</dt>
							<dd><NumberValue value={snapshot.governanceProposalCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
