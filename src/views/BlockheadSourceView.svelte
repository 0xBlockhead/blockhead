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
			label: 'source id',
		},
		'label',
		'provider',
	],
	content: {
		dl: [
			[
				{
					label: 'source id',
				},
				'label',
				'provider',
				{
					label: 'source enum',
				},
				'endpointUrl',
			],
			[
				'transportKind',
				'authKind',
				{
					label: 'CORS/proxy mode',
				},
				'environmentScope',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Health',
				items: [
					{
						label: 'BlockheadSource_Timestamp list',
					},
				],
			},
			{
				label: 'Transport',
				items: [
					'endpointUrl',
					'authKind',
					{
						label: 'CORS/proxy policy',
					},
					{
						label: 'local env scope',
					},
				],
			},
			{
				label: 'Source catalog',
				items: [
					{
						label: 'Source/SourceProvider enum ids',
					},
					{
						label: 'resolver coverage notes',
					},
				],
			},
			{
				label: 'Usage',
				items: [
					{
						label: 'routes or resolver families that selected this local source config',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSource>
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
	entityType={EntityType.BlockheadSource}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
