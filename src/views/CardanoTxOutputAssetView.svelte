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
			label: 'output',
		},
		{
			label: 'asset policy/name/fingerprint',
		},
		'quantity',
	],
	content: {
		dl: [
			[
				{
					label: 'output',
				},
				{
					label: 'asset policy/name/fingerprint',
				},
				'quantity',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Output',
				items: [
					{
						label: 'parent Cardano transaction output',
					},
				],
			},
			{
				label: 'Asset',
				items: [
					{
						label: 'linked Cardano native asset',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'Cardano transaction through the parent output',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTxOutputAsset>
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
	entityType={EntityType.CardanoTxOutputAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
