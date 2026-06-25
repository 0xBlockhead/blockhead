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
				'sourceReportedSelectorCount',
				'sourceReportedTopicCount',
				'sourceReportedErrorCount',
				'localCatalogSelectorCount',
				'localCatalogTopicCount',
			],
			[
				'localCatalogErrorCount',
				'reachable',
				'rateLimitRemaining',
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
					'sourceReportedSelectorCount',
					'sourceReportedTopicCount',
					'sourceReportedErrorCount',
					'localCatalogSelectorCount',
					'localCatalogTopicCount',
					'localCatalogErrorCount',
					'reachable',
					'rateLimitRemaining',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Constants_Internal',
					},
					{
						label: 'SourceBinding.Local_Internal',
					},
					{
						label: 'SourceBinding.Openchain_Rest',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalEvmAbiCatalog_Timestamp>
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
	entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
