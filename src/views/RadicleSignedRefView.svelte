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
		'$repository',
		'nodeId',
		'refName',
	],
	content: {
		dl: [
			[
				'$repository',
				'nodeId',
				'refName',
				'targetObjectId',
				'$gitRef',
				{
					label: 'Git ref observation',
				},
				{
					label: 'latest signed-ref verification',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proof',
				items: [
					'signature',
					{
						label: 'delegate authorization details',
					},
				],
			},
			{
				label: 'Target',
				items: [
					{
						label: 'Git object or commit target',
					},
				],
			},
			{
				label: 'Git ref',
				items: [
					{
						label: 'Git ref and ref observation',
					},
				],
			},
			{
				label: 'Verification history',
				items: [
					{
						label: 'timestamped signed-ref verification observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RadicleSignedRef>
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
	entityType={EntityType.RadicleSignedRef}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
