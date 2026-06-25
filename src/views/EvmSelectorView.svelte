<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	actions: [
		{
			id: 'copy-selector',
			label: 'Copy selector',
			kind: 'copy',
			field: 'hex',
		},
	],
	transforms: [
		{
			id: 'selector-encodings',
			label: 'Selector encodings',
			field: 'hex',
			kind: 'selectorEncoding',
			slot: 'SelectorEncodings',
		},
	],
	closed: [
		{
			label: 'selector hex',
		},
		{
			label: 'latest candidate signature',
		},
		{
			label: 'candidate count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'selector hex',
				},
				{
					label: 'latest candidate signature',
				},
				{
					label: 'latest source',
				},
				{
					label: 'candidate count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Catalog observations',
				items: [
					{
						label: 'timestamped candidate-signature lookups',
					},
				],
			},
			{
				label: 'Decode context',
				items: [
					{
						label: 'verified contract ABI required before authoritative decode',
					},
				],
			},
			{
				label: 'Related rows',
				items: [
					{
						label: 'EvmContract ABI',
					},
					{
						label: 'EvmTransaction input decode',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmSelector>
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
	entityType={EntityType.EvmSelector}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
