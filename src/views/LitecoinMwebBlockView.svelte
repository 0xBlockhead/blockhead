<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LitecoinMwebBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const litecoinMwebBlock = useEntity(
		EntityType.LitecoinMwebBlock,
		entityId,
		{
			hogExTransactionId: {},
			kernelRoot: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebBlock}
	{entityId}
	title={`MWEB Block #${entityId.$block.height.toString()}`}
	idDragPlainText={entityId.$block.height.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.$block.height.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>MWEB Block </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebBlock}
			placeholderText={`Loading Litecoin MWEB Block...`}
		>
			{#snippet children(litecoinMwebBlock)}
				<dl>
					{#if litecoinMwebBlock.hogExTransactionId != null}
						<div>
							<dt>Hog Ex Transaction ID</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebBlock.hogExTransactionId}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if litecoinMwebBlock.kernelRoot != null}
						<div>
							<dt>Kernel Root</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebBlock.kernelRoot}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
