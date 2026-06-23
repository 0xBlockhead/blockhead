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
				label: 'ISO code',
			},
			'name',
			'symbol',
		],
		content: {
			dl: [
				[
					{
						label: 'ISO code',
					},
					'name',
					'symbol',
					{
						label: 'minor unit exponent',
					},
					{
						label: 'catalog sort weight',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Markets as base',
					items: [
						{
							label: 'Market list',
						},
					],
				},
				{
					label: 'Markets as quote',
					items: [
						{
							label: 'Market list',
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
			selection: EntityProxyResource<typeof schema, EntityType.Currency>
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
	entityType={EntityType.Currency}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
