<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/erc-4337/paymaster/[address]', {
				...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
				address: selector.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 paymaster',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Erc4337Paymaster>
			href?: string
			layout?: EntityLayout
			open?: boolean
			title?: string
			collapsible?: boolean
		},
		Pick<
				ComponentProps<typeof EntityView>,
				| 'showTypeAnnotation'
			>
	> = $props()

	const paymaster = subscribe(EntityType.Erc4337Paymaster,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
			], fields: { userOperationsCount: true, $contract: true } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337Paymaster}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{title}
		{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={selector.address}
		/>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={selector.address}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A paymaster is an ERC-4337 contract that sponsors or refunds gas for user operations; it is not a smart-account wallet or a bundler operator.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading paymaster…"
			resource={paymaster}
		>
			{#snippet children(paymaster)}
				<dl data-column-item="center">
					{#if paymaster.fields.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(paymaster.fields.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Paymaster contract</dt>
						<dd>
							<EvmContractView
								selector={paymaster.fields.$contract[EntityMetaKey.Selector]}
								layout={EntityLayout.Value}
								open={true}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
