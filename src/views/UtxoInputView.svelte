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
				label: 'transaction',
			},
			{
				label: 'input index',
			},
			{
				label: 'spent output',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'input index',
					},
					{
						label: 'spent output',
					},
					{
						label: 'coinbase/scriptSig summary',
					},
					'sequence',
					{
						label: 'witness count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Spent output',
					items: [
						{
							label: 'spent output when present',
						},
					],
				},
				{
					label: 'Script',
					items: [
						{
							label: 'coinbase script',
						},
						{
							label: 'scriptSig asm',
						},
						{
							label: 'witness stack',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent transaction',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoInput>
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
	entityType={EntityType.UtxoInput}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
