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
		'federationId',
		'name',
		'guardianCount',
	],
	content: {
		dl: [
			[
				'federationId',
				'name',
				'guardianCount',
				'guardianThreshold',
				'consensusVersion',
			],
			[
				{
					label: 'module count',
				},
				{
					label: 'latest health',
				},
				{
					label: 'latest meta summary',
				},
				'$$gateways',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Config',
				items: [
					'clientConfigJson',
					{
						label: 'guardian/module config summaries',
					},
				],
			},
			{
				label: 'Modules',
				items: [
					{
						label: 'mint',
					},
					{
						label: 'wallet',
					},
					{
						label: 'Lightning',
					},
					{
						label: 'meta module config facets',
					},
				],
			},
			{
				label: 'Gateways',
				items: [
					{
						label: 'Fedimint gateway rows',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped federation health/meta observations',
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
		{
			id: 'gateways',
			label: 'gateways',
			field: '$$gateways',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintFederation>
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
	entityType={EntityType.FedimintFederation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
