<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronContract>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronContract}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { name: true, verifyStatus: true, isProxy: true, ...(open && ({ compiler: true })) } }),
				)}
			placeholderText="Loading TRON contract..."
		>
			{#snippet children(contract)}
				<dl data-column-item="center">
					{#if contract.name != null}
						<div>
							<dt>Name</dt>
							<dd>{contract.name}</dd>
						</div>
					{/if}

					{#if contract.verifyStatus != null}
						<div>
							<dt>Verification</dt>
							<dd>{contract.verifyStatus}</dd>
						</div>
					{/if}

					{#if contract.isProxy != null}
						<div>
							<dt>Proxy</dt>
							<dd>{contract.isProxy ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && contract.compiler != null}
						<div>
							<dt>Compiler</dt>
							<dd>{contract.compiler}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
