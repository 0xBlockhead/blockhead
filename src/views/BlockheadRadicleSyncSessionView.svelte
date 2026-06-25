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
		'sessionId',
		'$localNode',
		'remoteNodeId',
	],
	content: {
		dl: [
			[
				'sessionId',
				'$localNode',
				'remoteNodeId',
				{
					label: 'repository/RID',
				},
				{
					label: 'started/completed timestamps',
				},
			],
			[
				'requestedRefs',
				'receivedObjects',
				'status',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Local node',
				items: [
					{
						label: 'parent Radicle node state',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'Radicle repository when RID resolves',
					},
				],
			},
			{
				label: 'Fetch artifacts',
				items: [
					{
						label: 'Git fetch observation or packfile rows when captured',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'git-remote-rad/node fetch diagnostics',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleSyncSession>
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
	entityType={EntityType.BlockheadRadicleSyncSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
