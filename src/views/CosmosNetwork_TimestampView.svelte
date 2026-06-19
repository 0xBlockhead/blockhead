<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const snapshot = $derived(selection(
		({ sources: [
				Source.CosmosSdk_Rest,
			], fields: { latestBlockHeight: true, latestBlockHash: true, latestBlockTimeMs: true, latestBlockTransactionCount: true, chainId: true, nodeNetwork: true, applicationName: true, applicationVersion: true, cosmosSdkVersion: true, isSyncing: true, validatorCount: true, bondedValidatorCount: true, bondedTokens: true, notBondedTokens: true, governanceProposalCount: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Cosmos network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.latestBlockHeight !== undefined}
					<NumberValue value={snapshot.fields.latestBlockHeight} />
				{:else if snapshot.fields.validatorCount !== undefined}
					<NumberValue value={snapshot.fields.validatorCount} />
					validators
				{:else}
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Cosmos network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={snapshot.fields.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.applicationVersion != null}
						<div>
							<dt>Application</dt>
							<dd>{snapshot.fields.applicationName ?? 'gaiad'} {snapshot.fields.applicationVersion}</dd>
						</div>
					{/if}

					{#if snapshot.fields.validatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.fields.validatorCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.fields.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if snapshot.fields.bondedTokens !== undefined}
						<div>
							<dt>Bonded stake</dt>
							<dd><NumberValue value={snapshot.fields.bondedTokens} /> uatom</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestBlockHash != null}
						<div>
							<dt>Latest hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.latestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestBlockTimeMs !== undefined}
						<div>
							<dt>Block time</dt>
							<dd><Timestamp timestamp={snapshot.fields.latestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestBlockTransactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.fields.latestBlockTransactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.nodeNetwork != null}
						<div>
							<dt>Node network</dt>
							<dd>{snapshot.fields.nodeNetwork}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.cosmosSdkVersion != null}
						<div>
							<dt>Cosmos SDK</dt>
							<dd>{snapshot.fields.cosmosSdkVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.bondedValidatorCount !== undefined}
						<div>
							<dt>Bonded sample</dt>
							<dd><NumberValue value={snapshot.fields.bondedValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.notBondedTokens !== undefined}
						<div>
							<dt>Unbonded stake</dt>
							<dd><NumberValue value={snapshot.fields.notBondedTokens} /> uatom</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.governanceProposalCount !== undefined}
						<div>
							<dt>Governance proposals</dt>
							<dd><NumberValue value={snapshot.fields.governanceProposalCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
