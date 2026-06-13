<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGKvEntry>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const zeroGKvEntry = subscribe(EntityType.ZeroGKvEntry, entityId, ({ fields: { $logEntry: true, $owner: true, valueHash: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGKvEntry}
	{entityId}
	title={entityId.key}
	idDragPlainText={entityId.key}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.key}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>KV entry </span>
			{#if Value}
				{@render Value()}
			{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGKvEntry}
			placeholderText={`Loading 0G KV entry...`}
		>
			{#snippet children(zeroGKvEntry)}
				<dl>
					{#if zeroGKvEntry.fields.$owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									entityId={zeroGKvEntry.fields.$owner[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if zeroGKvEntry.fields.valueHash != null}
						<div>
							<dt>Value Hash</dt>
							<dd>
								<TruncatedValue
									value={zeroGKvEntry.fields.valueHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if zeroGKvEntry.fields.$logEntry != null}
						<div>
							<dt>Log entry</dt>
							<dd>
								<ZeroGStorageLogEntryView
									entityId={zeroGKvEntry.fields.$logEntry[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
