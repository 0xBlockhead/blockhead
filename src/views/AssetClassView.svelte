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
				label: 'asset instance',
			},
			{
				label: 'class key',
			},
			{
				label: 'class kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'asset instance',
					},
					{
						label: 'class key',
					},
					{
						label: 'class kind',
					},
					'label',
					'slot',
					'partition',
					'series',
					{
						label: 'maturity',
					},
					{
						label: 'value decimals',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Objects',
					items: [
						{
							label: 'asset objects under this class',
						},
					],
				},
				{
					label: 'Ledger supply',
					items: [
						{
							label: 'ledger-coordinate supply observations',
						},
					],
				},
				{
					label: 'Methodology supply',
					items: [
						{
							label: 'provider-clocked supply methodology observations',
						},
					],
				},
				{
					label: 'Rights',
					items: [
						{
							label: 'UsageRight_Timestamp or restriction rows when source-backed',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetClass>
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
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
