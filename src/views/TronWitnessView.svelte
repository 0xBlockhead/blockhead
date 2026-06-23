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
				label: 'network',
			},
			'address',
			{
				label: 'latest URL/vote/production summary',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'address',
					{
						label: 'latest URL/vote/production summary',
					},
					{
						label: 'active state',
					},
					{
						label: 'latest observation time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Witness observations',
					items: [
						{
							label: 'witness vote/production observations',
						},
					],
				},
				{
					label: 'Produced blocks',
					items: [
						{
							label: 'produced blocks when source supports witness filtering',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent TRON network',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronWitness>
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
	entityType={EntityType.TronWitness}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
