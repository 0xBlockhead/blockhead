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
			label: 'operation hash',
		},
		{
			label: 'block',
		},
		'branch',
	],
	content: {
		dl: [
			[
				{
					label: 'operation hash',
				},
				{
					label: 'block',
				},
				'branch',
				{
					label: 'signature presence',
				},
				{
					label: 'validation pass',
				},
				{
					label: 'operation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operation contents',
				items: [
					{
						label: 'operations ordered by content index',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'parent Tezos block',
					},
				],
			},
			{
				label: 'Raw payload',
				items: [
					{
						label: 'signed group JSON/Micheline when available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosOperationGroup>
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
	entityType={EntityType.TezosOperationGroup}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
