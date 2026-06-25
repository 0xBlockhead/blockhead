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
			label: 'protocol',
		},
		{
			label: 'registry',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'protocol',
				},
				{
					label: 'registry',
				},
				'homeUrl',
				'docsUrl',
				'topology',
			],
			[
				{
					label: 'topic count',
				},
				{
					label: 'selector count',
				},
				{
					label: 'error count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Topics',
				items: [
					{
						label: 'EvmTopic rows',
					},
				],
			},
			{
				label: 'Selectors',
				items: [
					{
						label: 'EvmSelector rows',
					},
				],
			},
			{
				label: 'Errors',
				items: [
					{
						label: 'EvmError rows',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'local signature catalogs',
					},
					{
						label: 'OpenChain lookup context',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'evm-topics',
			label: 'evm topics',
			field: '$$evmTopics',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'evm-selectors',
			label: 'evm selectors',
			field: '$$evmSelectors',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'evm-errors',
			label: 'evm errors',
			field: '$$evmErrors',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmProtocol>
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
	entityType={EntityType.EvmProtocol}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
