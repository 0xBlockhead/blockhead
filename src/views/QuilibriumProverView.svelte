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
		'proverPeerId',
	],
	content: {
		dl: [
			[
				'proverPeerId',
			],
			[
				'$network',
				'proverPeerId',
				'publicKey',
				'version',
				{
					label: 'last seen time',
				},
				{
					label: 'produced frame count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Frames',
				items: [
					{
						label: 'frames attributed to this prover',
					},
				],
			},
			{
				label: 'Connected nodes',
				items: [
					{
						label: 'BlockheadQuilibriumNodeState rows that observed the prover',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node peer/prover inventory payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'frames',
			label: 'frames',
			field: '$$frames',
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumProver>
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
	entityType={EntityType.QuilibriumProver}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
