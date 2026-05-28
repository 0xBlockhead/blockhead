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
	import { executionProtocolByProtocol } from '$/constants/EvmNetwork.ts'
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
			entityId: EntityId<typeof schema, EntityType.EthereumExecutionUpgrade>
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

	const networkExecutionUpgrade = useEntity(
		EntityType.EthereumExecutionUpgrade,
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
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumExecutionUpgrade}
	{entityId}
	href={href}
	bind:open
	title={`Execution upgrade ${String(entityId.upgradeId)}`}
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
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgrade)}
				{networkExecutionUpgrade.name ?? entityId.upgradeId}
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
				&& networkExecutionUpgrade.protocol !== undefined
			)}
				<div>
					<dt>Execution fork</dt>
					<dd>
						<ResourceBoundary
							resource={networkExecutionUpgrade}
							placeholderText="Loading execution upgrade…"
						>
							{#snippet children(networkExecutionUpgrade)}
								{executionProtocolByProtocol[networkExecutionUpgrade.protocol].label}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
						<ResourceBoundary
							resource={networkExecutionUpgrade}
							placeholderText="Loading execution upgrade…"
						>
							{#snippet children(networkExecutionUpgrade)}
								<EvmBlockView
									entityId={{
										$network: entityId.$network,
										blockNumber: networkExecutionUpgrade.activationBlock,
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
						<ResourceBoundary
							resource={networkExecutionUpgrade}
							placeholderText="Loading execution upgrade…"
						>
							{#snippet children(networkExecutionUpgrade)}
								<NumberValue value={networkExecutionUpgrade.activationEpoch} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
						<ResourceBoundary
							resource={networkExecutionUpgrade}
							placeholderText="Loading execution upgrade…"
						>
							{#snippet children(networkExecutionUpgrade)}
								<Timestamp
									timestamp={networkExecutionUpgrade.activationTimestampMs}
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
				entityType: EntityType.EthereumExecutionUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
