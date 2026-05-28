<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
				upgradeSlug: entityId.upgradeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EthereumConsensusUpgrade>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkConsensusUpgrade = useEntity(
		EntityType.EthereumConsensusUpgrade,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			...(open && {
				protocol: {},
				activationBlock: {},
				activationEpoch: {},
				activationTimestampMs: {},
				previousForkVersion: {
					$: [
						Source.Beacon_Rest,
					],
				},
				currentForkVersion: {
					$: [
						Source.Beacon_Rest,
					],
				},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{entityId}
	href={href}
	bind:open
	title={`Consensus upgrade ${entityId.upgradeId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgrade)}
				{networkConsensusUpgrade.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& networkConsensusUpgrade.protocol !== undefined
			)}
				<div>
					<dt>Consensus fork</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								{consensusProtocolByProtocol[networkConsensusUpgrade.protocol].label}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								<EvmBlockView
									entityId={{
										$network: entityId.$network,
										blockNumber: networkConsensusUpgrade.activationBlock,
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								<NumberValue value={networkConsensusUpgrade.activationEpoch} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								<Timestamp
									timestamp={networkConsensusUpgrade.activationTimestampMs}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.previousForkVersion !== undefined}
				<div>
					<dt>Previous fork version</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.previousForkVersion}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkConsensusUpgrade.currentForkVersion !== undefined}
				<div>
					<dt>Current fork version</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(networkConsensusUpgrade)}
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={networkConsensusUpgrade.currentForkVersion}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<ProposalsView
			href={resolve('/proposals')}
			entityFieldReference={{
				entityType: EntityType.EthereumConsensusUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
