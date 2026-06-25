<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'storage entry',
		},
		'blockNumber',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'storage entry',
				},
				'blockNumber',
				'source',
				'value',
				'blockHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Storage entry',
				items: [
					{
						label: 'parent Starknet storage entry',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'parent Starknet contract',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'Starknet block when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'starknet_getStorageAt response',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StarknetStorageEntry_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.StarknetStorageEntry_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
