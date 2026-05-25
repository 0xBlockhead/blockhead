<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/bundler/[address]',
			{
				networkId: String(entityId.$network.chainId),
				address: entityId.address,
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 bundler',
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337Bundler>
			href?: string
			layout?: EntityLayout
			open?: boolean
			title?: string
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bundler = useEntity(
		EntityType.Erc4337Bundler,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
			],
			userOperationsCount: {},
		},
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337Bundler}
	{entityId}
	href={href}
	{layout}
	bind:open
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
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
			{#snippet children(loadedBundler)}
				<dl data-column-item="center">
					{#if loadedBundler.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(bundler.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Operator</dt>
						<dd>
							<ActorView
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			A bundler is infrastructure that submits ERC-4337 user-operation bundles on-chain; Blockscout tracks the operator address separately from smart accounts and paymasters.
		</p>
	{/snippet}
</EntityView>

