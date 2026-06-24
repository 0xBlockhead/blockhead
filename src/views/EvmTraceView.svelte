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
			label: 'from/to accounts',
		},
		'value',
		'gas',
	],
	content: {
		dl: [
			[
				{
					label: 'from/to accounts',
				},
				'value',
				'gas',
				{
					label: 'gas used',
				},
				{
					label: 'input selector candidates',
				},
				{
					label: 'raw input/output',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent EVM transaction',
					},
				],
			},
			{
				label: 'Call',
				items: [
					'type',
					{
						label: 'from/to',
					},
					'value',
					'gas',
					{
						label: 'gas used',
					},
				],
			},
			{
				label: 'Input/output',
				items: [
					{
						label: 'raw input',
					},
					{
						label: 'raw output',
					},
					{
						label: 'selector candidates',
					},
				],
			},
			{
				label: 'Children',
				items: [
					{
						label: 'recursive child call tree from trace-address children',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'debug trace call tree',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTrace>
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
	entityType={EntityType.EvmTrace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
