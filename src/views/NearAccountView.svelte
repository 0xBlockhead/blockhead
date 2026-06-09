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
			entityId: EntityId<typeof schema, EntityType.NearAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nearAccount = useEntity(entityCollectionsContext, EntityType.NearAccount,
		entityId,
		({ fields: { amountYoctoNear: true, storageUsageBytes: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount}
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
			resource={nearAccount}
			placeholderText={`Loading NEAR Account...`}
		>
			{#snippet children(nearAccount)}
				<dl>
					{#if nearAccount.fields.amountYoctoNear != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={nearAccount.fields.amountYoctoNear} /> yoctoNEAR</dd>
						</div>
					{/if}

					{#if nearAccount.fields.storageUsageBytes != null}
						<div>
							<dt>Storage Usage Bytes</dt>
							<dd><NumberValue value={nearAccount.fields.storageUsageBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
