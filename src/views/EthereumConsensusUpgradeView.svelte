<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
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
			fields: {
				protocol: true,
				activationBlock: true,
				activationEpoch: true,
				activationTimestampMs: true,
			},
		},
	))
	const protocol = $derived(networkConsensusUpgrade.protocol)
	const activationBlock = $derived(networkConsensusUpgrade.activationBlock)
	const activationEpoch = $derived(networkConsensusUpgrade.activationEpoch)
	const activationTimestampMs = $derived(networkConsensusUpgrade.activationTimestampMs)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
		{selection.entitySelector.upgradeId}
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
				&& networkConsensusUpgrade.protocol !== undefined
			)}
				<div>
					<dt>Consensus fork</dt>
					<dd>
								{consensusProtocolByProtocol[networkConsensusUpgrade.protocol].label}
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
									<NumberValue value={networkConsensusUpgrade.activationBlock} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
								<NumberValue value={networkConsensusUpgrade.activationEpoch} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
								<Timestamp
									timestamp={networkConsensusUpgrade.activationTimestampMs}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.previousForkVersion !== undefined}
				<div>
					<dt>Previous fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.previousForkVersion}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.currentForkVersion !== undefined}
				<div>
					<dt>Current fork version</dt>
					<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.currentForkVersion}
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
