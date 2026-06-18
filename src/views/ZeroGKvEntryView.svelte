<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ZeroGKvEntry>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGKvEntry}
	entitySelector={selector}
	title={selector.key}
	idDragPlainText={selector.key}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.key}
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
			resource={select(EntityType.ZeroGKvEntry, selector, ({ fields: { $logEntry: true, $owner: true, valueHash: true } }))}
			placeholderText={`Loading 0G KV entry...`}
		>
			{#snippet children(zeroGKvEntry)}
				<dl>
					{#if zeroGKvEntry.fields.$owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selector={zeroGKvEntry.fields.$owner[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

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
									selector={zeroGKvEntry.fields.$logEntry[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
