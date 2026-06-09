<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { executionProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2Namespace: 'eip155',
			caip2Reference: entityId.$network.caip2.reference,
				upgradeSlug: entityId.upgradeId,
			}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EthereumExecutionUpgrade>
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

	const networkExecutionUpgrade = useEntity(entityCollectionsContext, 
		EntityType.EthereumExecutionUpgrade,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, slug: true, ...(open && ({ protocol: true, activationBlock: true, activationEpoch: true, activationTimestampMs: true })) } }),
	)


	// Components
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
		<ResourceBoundary
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgrade)}
				{networkExecutionUpgrade.fields.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgrade)}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& networkExecutionUpgrade.fields.protocol !== undefined
			)}
				<div>
					<dt>Execution fork</dt>
					<dd>
								{executionProtocolByProtocol[networkExecutionUpgrade.fields.protocol].label}
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.fields.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
									<EvmBlockView
										entityId={{
											$network: entityId.$network,
											blockNumber: BigInt(networkExecutionUpgrade.fields.activationBlock),
										}}
										layout={EntityLayout.Value}
										open={false}
								/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.fields.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
								<NumberValue value={networkExecutionUpgrade.fields.activationEpoch} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.fields.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
								<Timestamp
									timestamp={networkExecutionUpgrade.fields.activationTimestampMs}
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
