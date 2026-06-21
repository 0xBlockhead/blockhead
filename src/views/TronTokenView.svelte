<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronToken>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const token = $derived(selection(
		({ fields: { standard: true, name: true, symbol: true, decimals: true, totalSupply: true, ...(open && ({ createdTimestampMs: true, holderCount: true })) } }),
	))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronToken}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.tokenId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary resource={token}>
			{#snippet children(token)}
				{token.symbol ?? token.name ?? selection.entitySelector.tokenId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={token}
			placeholderText="Loading TRON token..."
		>
			{#snippet children(token)}
				<dl data-column-item="center">
					{#if token.standard != null}
						<div>
							<dt>Standard</dt>
							<dd>{token.standard}</dd>
						</div>
					{/if}

					{#if token.name != null}
						<div>
							<dt>Name</dt>
							<dd>{token.name}</dd>
						</div>
					{/if}

					{#if token.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{token.symbol}</dd>
						</div>
					{/if}

					{#if token.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={token.decimals} /></dd>
						</div>
					{/if}

					{#if token.totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd><NumberValue value={token.totalSupply} /></dd>
						</div>
					{/if}

					{#if open && token.createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd><Timestamp timestamp={token.createdTimestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
