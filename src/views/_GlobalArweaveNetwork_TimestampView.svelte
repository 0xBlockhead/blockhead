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
		'$hub',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$hub',
				'timestampMs',
				'source',
			],
			[
				'configuredAccessEndpointCount',
				'reachableAccessEndpointCount',
				'sourceReportedLatestHeight',
				'sourceWindowBlockCount',
				'sourceWindowTransactionCount',
				'localCatalogExampleCount',
				'reachable',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Hub',
				items: [
					'$hub',
				],
			},
			{
				label: 'Observation fields',
				items: [
					'configuredAccessEndpointCount',
					'reachableAccessEndpointCount',
					'sourceReportedLatestHeight',
					'sourceWindowBlockCount',
					'sourceWindowTransactionCount',
					'localCatalogExampleCount',
					'reachable',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Arweave_Graphql',
					},
					{
						label: 'SourceBinding.Arweave_Rest',
					},
					{
						label: 'SourceBinding.Constants_Internal',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalArweaveNetwork_Timestamp>
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
	entityType={EntityType._GlobalArweaveNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
