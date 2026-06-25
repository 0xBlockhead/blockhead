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
		'$nodeState',
		'timestampMs',
		'version',
	],
	content: {
		dl: [
			[
				'$nodeState',
				'timestampMs',
				'source',
				{
					label: 'version/revision',
				},
				'repoPath',
				{
					label: 'listen/announce address counts',
				},
				'peerCount',
			],
			[
				'totalBlocks',
				'quotaMaxBytes',
				'quotaUsedBytes',
				'quotaReservedBytes',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent Codex storage node state',
					},
				],
			},
			{
				label: 'Storage space',
				items: [
					{
						label: '/space quota fields',
					},
				],
			},
			{
				label: 'Debug info',
				items: [
					{
						label: '/debug/info peer table',
					},
					{
						label: 'addresses',
					},
					{
						label: 'repo',
					},
				],
			},
			{
				label: 'Version',
				items: [
					{
						label: 'storage version/revision',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'connected REST node payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStorageNodeState_Timestamp>
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
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
