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
				label: 'input kind',
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
						label: 'input kind',
					},
					{
						label: 'spent transaction hash/output index',
					},
					{
						label: 'spent output link',
					},
					{
						label: 'redeemer index',
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
							label: 'referenced Cardano transaction output',
						},
					],
				},
				{
					label: 'Redeemer',
					items: [
						{
							label: 'linked script witness when available',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent Cardano transaction',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTxInput>
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
	entityType={EntityType.CardanoTxInput}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
