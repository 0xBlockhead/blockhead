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
			label: 'command index/kind',
		},
		{
			label: 'package/module/function',
		},
		'typeArguments',
	],
	content: {
		dl: [
			[
				{
					label: 'command index/kind',
				},
				{
					label: 'package/module/function',
				},
				'typeArguments',
				'arguments',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'SuiTransaction',
					},
				],
			},
			{
				label: 'Command',
				items: [
					'commandIndex',
					'commandKind',
				],
			},
			{
				label: 'Move call',
				items: [
					'packageId',
					'moduleName',
					'functionName',
					'typeArguments',
				],
			},
			{
				label: 'Arguments',
				items: [
					{
						label: 'arguments JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sui programmable transaction block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiProgrammableTransactionCommand>
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
	entityType={EntityType.SuiProgrammableTransactionCommand}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
