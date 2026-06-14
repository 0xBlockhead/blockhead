<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { executionProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2Namespace: 'eip155',
			caip2Reference: selector.$network.caip2.reference,
				upgradeSlug: selector.upgradeId,
			}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EthereumExecutionUpgrade>
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

	const networkExecutionUpgrade = subscribe(EntityType.EthereumExecutionUpgrade,
		selector,
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
	entitySelector={selector}
	href={href}
	bind:open
	title={`Execution upgrade ${String(selector.upgradeId)}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgrade)}
				{networkExecutionUpgrade.fields.name ?? selector.upgradeId}
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
										selector={{
											$network: selector.$network,
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
				selector,
				fieldName: '$$proposals',
			}}
			id={`${stringify(selector)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
