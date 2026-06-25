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
		'$contract',
		'timestampMs',
		{
			label: 'verification status',
		},
	],
	content: {
		dl: [
			[
				'$contract',
				'timestampMs',
				'source',
				'compiler',
				{
					label: 'verification status',
				},
				{
					label: 'proxy state',
				},
				'$implementation',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent contract identity',
					},
				],
			},
			{
				label: 'Implementation',
				items: [
					{
						label: 'implementation contract when proxy target resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'TronScan contract verification/proxy payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronContract_Timestamp>
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
	entityType={EntityType.TronContract_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
