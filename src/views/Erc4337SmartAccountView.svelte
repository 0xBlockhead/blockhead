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
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/erc-4337/smart-account/[address]', {
				...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
				address: selector.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 smart account',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Erc4337SmartAccount>
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

	const smartAccount = subscribe(EntityType.Erc4337SmartAccount,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
			], fields: { userOperationsCount: true, $contract: true, $factory: true } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337SmartAccount}
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
			An ERC-4337 smart account is a contract wallet that signs user operations; it is not a generic linked actor or an explorer “verified contract” catalog row by itself.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading smart account…"
			resource={smartAccount}
		>
			{#snippet children(smartAccount)}
				<dl data-column-item="center">
					{#if smartAccount.fields.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(smartAccount.fields.userOperationsCount)}</dd>
						</div>
					{/if}

					{#if smartAccount.fields.$factory != null}
						<div>
							<dt>Factory</dt>
							<dd>
								<Erc4337AccountFactoryView
									selector={smartAccount.fields.$factory[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if smartAccount.fields.$contract != null}
						<div>
							<dt>Account contract</dt>
							<dd>
								<EvmContractView
									selector={smartAccount.fields.$contract[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
