<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'


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
			entityId: EntityId<typeof schema, EntityType.ZcashShieldedAction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zcashShieldedAction = useEntity(entityCollectionsContext, EntityType.ZcashShieldedAction,
		entityId,
		({ fields: { actionKind: true, ...(open && ({ valueCommitment: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedAction}
	{entityId}
	title={`Shielded action #${entityId.actionIndex.toString()}`}
	idDragPlainText={entityId.actionIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.actionIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Shielded action </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zcashShieldedAction}
			placeholderText="Loading Zcash shielded action…"
		>
			{#snippet children(zcashShieldedAction)}
				<dl data-column-item="center">
					{#if zcashShieldedAction.fields.actionKind != null}
						<div>
							<dt>Kind</dt>
							<dd>{zcashShieldedAction.fields.actionKind}</dd>
						</div>
					{/if}

					{#if (
						open
						&& (
							zcashShieldedAction.fields.actionKind === ZcashShieldedActionKind.Spend
							|| zcashShieldedAction.fields.actionKind === ZcashShieldedActionKind.Action
						)
						&& zcashShieldedAction.fields.nullifier != null
					)}
						<div>
							<dt>Nullifier</dt>
							<dd>{zcashShieldedAction.fields.nullifier}</dd>
						</div>
					{/if}

					{#if (
						open
						&& (
							zcashShieldedAction.fields.actionKind === ZcashShieldedActionKind.Output
							|| zcashShieldedAction.fields.actionKind === ZcashShieldedActionKind.Action
						)
						&& zcashShieldedAction.fields.noteCommitment != null
					)}
						<div>
							<dt>Note Commitment</dt>
							<dd>
								<TruncatedValue
									value={zcashShieldedAction.fields.noteCommitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if open && zcashShieldedAction.fields.valueCommitment != null}
						<div>
							<dt>Value Commitment</dt>
							<dd>
								<TruncatedValue
									value={zcashShieldedAction.fields.valueCommitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
