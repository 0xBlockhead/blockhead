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
			entityId: EntityId<typeof schema, EntityType.NearAccessKey>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nearAccessKey = useEntity(entityCollectionsContext, EntityType.NearAccessKey,
		entityId,
		({ fields: { nonce: true, permission: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccessKey}
	{entityId}
	title={entityId.publicKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.publicKey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={nearAccessKey}
			placeholderText={`Loading NEAR Access Key...`}
		>
			{#snippet children(nearAccessKey)}
				<dl>
					{#if nearAccessKey.fields.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={nearAccessKey.fields.nonce} /></dd>
						</div>
					{/if}

					{#if nearAccessKey.fields.permission != null}
						<div>
							<dt>Permission</dt>
							<dd>{nearAccessKey.fields.permission}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
