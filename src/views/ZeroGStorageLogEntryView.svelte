<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGStorageLogEntry>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zeroGStorageLogEntry = subscribe(EntityType.ZeroGStorageLogEntry,
		entityId,
		({ fields: { sequenceNumber: true, commitment: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageLogEntry}
	{entityId}
	title={entityId.logEntryId}
	idDragPlainText={entityId.logEntryId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.logEntryId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Log entry </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGStorageLogEntry}
			placeholderText={`Loading 0G storage log entry...`}
		>
			{#snippet children(zeroGStorageLogEntry)}
				<dl>
					{#if zeroGStorageLogEntry.fields.sequenceNumber != null}
						<div>
							<dt>Sequence Number</dt>
							<dd><NumberValue value={zeroGStorageLogEntry.fields.sequenceNumber} /></dd>
						</div>
					{/if}

					{#if zeroGStorageLogEntry.fields.commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue
									value={zeroGStorageLogEntry.fields.commitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
