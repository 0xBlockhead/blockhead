<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.TronToken>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const token = useEntity(entityCollectionsContext, EntityType.TronToken,
		entityId,
		({ fields: { standard: true, name: true, symbol: true, decimals: true, totalSupply: true, ...(open && ({ createdTimestampMs: true, holderCount: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronToken}
	{entityId}
	title={entityId.tokenId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary resource={token}>
			{#snippet children(token)}
				{token.fields.symbol ?? token.fields.name ?? entityId.tokenId}
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
					{#if token.fields.standard != null}
						<div>
							<dt>Standard</dt>
							<dd>{token.fields.standard}</dd>
						</div>
					{/if}

					{#if token.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{token.fields.name}</dd>
						</div>
					{/if}

					{#if token.fields.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{token.fields.symbol}</dd>
						</div>
					{/if}

					{#if token.fields.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={token.fields.decimals} /></dd>
						</div>
					{/if}

					{#if token.fields.totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd><NumberValue value={token.fields.totalSupply} /></dd>
						</div>
					{/if}

					{#if open && token.fields.createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd><Timestamp timestamp={token.fields.createdTimestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
