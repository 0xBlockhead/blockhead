<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/erc-4337/bundler/[address]', {
				...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
				address: entityId.address,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 bundler',
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337Bundler>
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

	const bundler = useEntity(entityCollectionsContext, EntityType.Erc4337Bundler,
		entityId,
		({ sources: [
				Source.Blockscout_Rest,
			], fields: { userOperationsCount: true } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337Bundler}
	{entityId}
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
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
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
		<ResourceBoundary
			placeholderText="Loading bundler…"
			resource={bundler}
		>
			{#snippet children(bundler)}
				<dl data-column-item="center">
					{#if bundler.fields.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(bundler.fields.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Operator</dt>
						<dd>
							<EvmAccountView
								entityId={{
									address: entityId.address,
								}}
								href={resolve('/account/[address]', {
									address: entityId.address,
								})}
								layout={EntityLayout.Title}
								open={false}
								title="Bundler operator"
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
