<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { executionProtocolByProtocol } from '$/constants/EvmNetwork.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumExecutionUpgrade>
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


	const networkExecutionUpgrade = $derived(selection({
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
	const protocol = $derived(networkExecutionUpgrade.protocol)
	const activationBlock = $derived(networkExecutionUpgrade.activationBlock)
	const activationEpoch = $derived(networkExecutionUpgrade.activationEpoch)
	const activationTimestampMs = $derived(networkExecutionUpgrade.activationTimestampMs)



	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumExecutionUpgrade}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	title={`Execution upgrade ${String(selection.entitySelector.upgradeId)}`}
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
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgrade)}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& networkExecutionUpgrade.protocol !== undefined
			)}
				<div>
					<dt>Execution fork</dt>
					<dd>
								{executionProtocolByProtocol[networkExecutionUpgrade.protocol].label}
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationBlock !== undefined}
				<div>
					<dt>Activation block</dt>
					<dd>
									<NumberValue value={networkExecutionUpgrade.activationBlock} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationEpoch !== undefined}
				<div>
					<dt>Activation epoch</dt>
					<dd>
								<NumberValue value={networkExecutionUpgrade.activationEpoch} />
					</dd>
				</div>
			{/if}
			{#if contentOpen && networkExecutionUpgrade.activationTimestampMs !== undefined}
				<div>
					<dt>Activation time</dt>
					<dd>
								<Timestamp
									timestamp={networkExecutionUpgrade.activationTimestampMs}
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
