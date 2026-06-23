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
				label: 'tracker',
			},
			{
				label: 'info hash',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'tracker',
					},
					{
						label: 'info hash',
					},
					'source',
					{
						label: 'timestamp',
					},
					'status',
					'complete',
					'downloaded',
					'incomplete',
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Tracker',
					items: [
						{
							label: 'parent tracker endpoint',
						},
					],
				},
				{
					label: 'Torrent',
					items: [
						{
							label: 'metainfo row when the info hash resolves locally',
						},
					],
				},
				{
					label: 'Response',
					items: [
						{
							label: 'raw scrape response/error when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentTrackerScrape_Timestamp>
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
	entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
