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
		'$upgrade',
		'timestampMs',
		'status',
	],
	content: {
		dl: [
			[
				'$upgrade',
				'timestampMs',
				'source',
				'status',
				'activationHeight',
				'activationTimestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Upgrade',
				items: [
					{
						label: 'parent network-upgrade row',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'catalog rollout state',
					},
					{
						label: 'activation coordinate evidence when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.NetworkUpgrade_Timestamp>
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
	entityType={EntityType.NetworkUpgrade_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
