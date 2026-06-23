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
				label: 'right',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'right',
					},
					{
						label: 'observation time',
					},
					'source',
					'status',
					{
						label: 'estimated time',
					},
					{
						label: 'realized block',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Right',
					items: [
						{
							label: 'parent Tezos baking right',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'Tezos block when realized',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'rights payload',
						},
						{
							label: 'head/freshness context',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBakingRight_Timestamp>
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
	entityType={EntityType.TezosBakingRight_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
