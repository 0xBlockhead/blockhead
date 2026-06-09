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
			entityId: EntityId<typeof schema, EntityType.NearContract>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nearContract = useEntity(entityCollectionsContext, EntityType.NearContract,
		entityId,
		({ fields: { codeHash: true, codeSizeBytes: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearContract}
	{entityId}
	title={entityId.accountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.accountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={nearContract}
			placeholderText={`Loading NEAR Contract...`}
		>
			{#snippet children(nearContract)}
				<dl>
					{#if nearContract.fields.codeHash != null}
						<div>
							<dt>Code Hash</dt>
							<dd>
								<TruncatedValue
									value={nearContract.fields.codeHash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if nearContract.fields.codeSizeBytes != null}
						<div>
							<dt>Code Size Bytes</dt>
							<dd><NumberValue value={nearContract.fields.codeSizeBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
