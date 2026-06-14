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
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/erc-4337/account-factory/[address]', {
				...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
				address: selector.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 account factory',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Erc4337AccountFactory>
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

	const accountFactory = subscribe(EntityType.Erc4337AccountFactory,
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
	entityType={EntityType.Erc4337AccountFactory}
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
			An account factory deploys ERC-4337 smart-account implementations; it is indexed separately from individual smart accounts and paymasters.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading account factory…"
			resource={accountFactory}
		>
			{#snippet children(accountFactory)}
				<dl data-column-item="center">
					{#if accountFactory.fields.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(accountFactory.fields.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Factory contract</dt>
						<dd>
							<EvmContractView
								selector={accountFactory.fields.$contract[EntityMetaKey.Selector]}
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
