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
			label: 'asset id',
		},
		{
			label: 'ticker/name',
		},
		'precision',
	],
	content: {
		dl: [
			[
				{
					label: 'asset id',
				},
				{
					label: 'ticker/name',
				},
				'precision',
				{
					label: 'entity domain',
				},
				{
					label: 'blinded issuance flag',
				},
				{
					label: 'latest issued/burned totals',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Supply snapshots',
				items: [
					{
						label: 'timestamped issued/burned total observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Elements network',
					},
				],
			},
			{
				label: 'Issuances',
				items: [
					{
						label: 'Elements issuance rows',
					},
				],
			},
			{
				label: 'Registry contract',
				items: [
					{
						label: 'contractJson/source metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsAsset>
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
	entityType={EntityType.ElementsAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
