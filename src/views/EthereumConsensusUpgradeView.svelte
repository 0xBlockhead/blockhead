<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2: ,
				upgradeSlug: selector.upgradeId,
			}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EthereumConsensusUpgrade>
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

	const networkConsensusUpgrade = $derived(proxy(
		EntityType.EthereumConsensusUpgrade,
		selector,
		{
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
	entitySelector={selector}
	href={href}
	bind:open
	title={`Consensus upgrade ${selector.upgradeId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={name}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(name)}
				{name ?? selector.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={name}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(name)}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& protocol !== undefined
			)}
				<div>
					<dt>Consensus fork</dt>
					<dd>
								{consensusProtocolByProtocol[protocol].label}
					</dd>
				</div>
			{/if}
			{#if contentOpen && activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
									<EvmBlockView
										selector={{
											$network: selector.$network,
											blockNumber: BigInt(activationBlock),
										}}
										layout={EntityLayout.Value}

										open={false}
										/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
								<NumberValue value={activationEpoch} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
								<Timestamp
									timestamp={activationTimestampMs}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && previousForkVersion !== undefined}
				<div>
					<dt>Previous fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={previousForkVersion}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && currentForkVersion !== undefined}
				<div>
					<dt>Current fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={currentForkVersion}
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
			entityFieldReference={{
				entityType: EntityType.EthereumConsensusUpgrade,
				selector,
				fieldName: '$$proposals',
			}}
			id={`${stringify(selector)}:proposals`}

			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
