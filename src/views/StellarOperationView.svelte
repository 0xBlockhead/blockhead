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
			label: 'operation index/type',
		},
		'sourceAccount',
		'resultCode',
	],
	content: {
		dl: [
			[
				{
					label: 'operation index/type',
				},
				'sourceAccount',
				'resultCode',
				'$transaction',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Stellar transaction',
					},
				],
			},
			{
				label: 'Operation body',
				items: [
					{
						label: 'operation body by type',
					},
				],
			},
			{
				label: 'Result',
				items: [
					'resultCode',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon/RPC/indexer operation payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarOperation>
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
	entityType={EntityType.StellarOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
