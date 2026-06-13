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
			entityId: EntityId<typeof schema, EntityType.PolkadotExtrinsic>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotExtrinsic = subscribe(EntityType.PolkadotExtrinsic,
		entityId,
		({ fields: { hash: true, callName: true, success: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotExtrinsic}
	{entityId}
	title={`Extrinsic #${entityId.extrinsicIndex.toString()}`}
	idDragPlainText={entityId.extrinsicIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.extrinsicIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Extrinsic </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotExtrinsic}
			placeholderText={`Loading Polkadot Extrinsic...`}
		>
			{#snippet children(polkadotExtrinsic)}
				<dl>
					{#if polkadotExtrinsic.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={polkadotExtrinsic.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if polkadotExtrinsic.fields.callName != null}
						<div>
							<dt>Call Name</dt>
							<dd>{polkadotExtrinsic.fields.callName}</dd>
						</div>
					{/if}

					{#if polkadotExtrinsic.fields.success != null}
						<div>
							<dt>Success</dt>
							<dd>{polkadotExtrinsic.fields.success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
