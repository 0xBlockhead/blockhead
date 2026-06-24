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
			label: 'actor',
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
					label: 'actor',
				},
				{
					label: 'observation time',
				},
				'source',
				'height',
				{
					label: 'tipset key',
				},
				{
					label: 'actor code CID',
				},
				'nonce',
				{
					label: 'balance',
				},
				{
					label: 'state root CID',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Actor',
				items: [
					{
						label: 'parent Filecoin actor',
					},
				],
			},
			{
				label: 'Tipset',
				items: [
					{
						label: 'Filecoin tipset when resolved',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'StateGetActor/address payload',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinActor_Timestamp>
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
	entityType={EntityType.FilecoinActor_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
