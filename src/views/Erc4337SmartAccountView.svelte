<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/smart-account/[address=evmAddress]', {
				caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				address: selection.entitySelector.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 smart account',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337SmartAccount>
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


	const smartAccount = $derived(
		selection({
			sources: [
				Source.Blockscout_Rest,
			],
		}
		)
	)


	const contract = $derived(smartAccount.$contract)

	const factory = $derived(smartAccount.$factory)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337SmartAccount}
	entitySelector={selection.entitySelector}
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
			value={selection.entitySelector.address}
		/>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={selection.entitySelector.address}
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
		<dl data-column-item="center">
			<ResourceBoundary
				placeholderText="Loading smart account user operation count…"
				resource={smartAccount.userOperationsCount}
			>
				{#snippet children(userOperationsCount)}
					{#if userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(userOperationsCount)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				placeholderText="Loading smart account factory…"
				resource={factory}
			>
				{#snippet children(factory)}
					{#if factory?.entitySelector !== undefined}
						<div>
							<dt>Factory</dt>
							<dd>
								<Erc4337AccountFactoryView
									selection={select(EntityType.Erc4337AccountFactory, factory.entitySelector)}
									layout={EntityLayout.Title}

									showTypeAnnotation={false}
									open={false}
									/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				placeholderText="Loading smart account contract…"
				resource={contract}
			>
				{#snippet children(contract)}
					{#if contract?.entitySelector !== undefined}
						<div>
							<dt>Account contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, contract.entitySelector)}
									layout={EntityLayout.Value}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
