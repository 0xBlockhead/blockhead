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
					'sourceWindowFeedCount',
					'sourceWindowItemCount',
					'localCatalogFeedCount',
					'localCatalogItemCount',
					'reachable',
					'fetchWindowKind',
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
						'sourceWindowFeedCount',
						'sourceWindowItemCount',
						'localCatalogFeedCount',
						'localCatalogItemCount',
						'reachable',
						'fetchWindowKind',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'SourceBinding.Constants_Internal',
						},
						{
							label: 'SourceBinding.Rss_Rest',
						},
						{
							label: 'SourceBinding.Rss2Json_Rest',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalRssNetwork_Timestamp>
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
	entityType={EntityType._GlobalRssNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
