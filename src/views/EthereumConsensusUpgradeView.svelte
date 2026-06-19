<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				upgradeSlug: selection.entitySelector.upgradeId,
			}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EthereumConsensusUpgrade>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const networkConsensusUpgrade = $derived(selection({
			sources: [
				Source.Constants_Internal,
			],
		},
	))
	const name = $derived(networkConsensusUpgrade.name)
	const protocol = $derived(networkConsensusUpgrade.protocol)
	const activationBlock = $derived(networkConsensusUpgrade.activationBlock)
	const activationEpoch = $derived(networkConsensusUpgrade.activationEpoch)
	const activationTimestampMs = $derived(networkConsensusUpgrade.activationTimestampMs)
	const previousForkVersion = $derived(networkConsensusUpgrade.previousForkVersion)
	const currentForkVersion = $derived(networkConsensusUpgrade.currentForkVersion)



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumConsensusUpgrade}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	title={`Consensus upgrade ${selection.entitySelector.upgradeId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={name}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(name)}
				{name ?? selection.entitySelector.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgrade)}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& networkConsensusUpgrade.fields.protocol !== undefined
			)}
				<div>
					<dt>Consensus fork</dt>
					<dd>
								{consensusProtocolByProtocol[networkConsensusUpgrade.fields.protocol].label}
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.fields.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
									<EvmBlockView
										selection={select(EntityType.EvmBlock, {
											$network: selection.entitySelector.$network,
											blockNumber: BigInt(networkConsensusUpgrade.fields.activationBlock),
										})}
										layout={EntityLayout.Value}

										open={false}
										/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.fields.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
								<NumberValue value={networkConsensusUpgrade.fields.activationEpoch} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.fields.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
								<Timestamp
									timestamp={networkConsensusUpgrade.fields.activationTimestampMs}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.fields.previousForkVersion !== undefined}
				<div>
					<dt>Previous fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.fields.previousForkVersion}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.fields.currentForkVersion !== undefined}
				<div>
					<dt>Current fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.fields.currentForkVersion}
								/>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
		<ProposalsView
			href={resolve('/proposals')}
			selection={selection.$$proposals}
			id={`${stringify(selection.entitySelector)}:proposals`}

			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
