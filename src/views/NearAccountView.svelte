<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NearAccount>
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount}
	entitySelector={selector}
	title={selector.accountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.accountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.NearAccount,
					selector,
					({ fields: { amountYoctoNear: true, storageUsageBytes: true } }),
				)}
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
