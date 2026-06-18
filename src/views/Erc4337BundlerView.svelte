<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		selector,
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]', {
				caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
				address: selector.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 bundler',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Erc4337Bundler>
			selection?: EntityProxyResource<typeof schema, EntityType.Erc4337Bundler>
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

	

	
	const userOperationsCount = $derived(
		(selection ?? select(
			EntityType.Erc4337Bundler,
			selector,
			{
			sources: [
				Source.Blockscout_Rest,
			],
		}
		)).userOperationsCount)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337Bundler}
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
			A bundler is infrastructure that submits ERC-4337 user-operation bundles on-chain; Blockscout tracks the operator address separately from smart accounts and paymasters.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				placeholderText="Loading bundler user operation count…"
				resource={userOperationsCount}
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
			<div>
				<dt>Operator</dt>
				<dd>
					<EvmAccountView
						selector={{
							address: selector.address,
						}}
						href={resolve('/account/[address]', {
							address: selector.address,
						})}
						layout={EntityLayout.Title}

						title="Bundler operator"
						open={false}
						/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
