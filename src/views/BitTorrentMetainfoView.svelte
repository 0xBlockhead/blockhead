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
			'infoHash',
			'hashVersion',
		],
		content: {
			dl: [
				[
					'infoHash',
					'hashVersion',
					'infoHashV1',
					'infoHashV2',
					'metainfoHash',
					'bencodedInfoHash',
					'name',
					'pieceLength',
					'totalLength',
					'private',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'files',
					when: 'open',
					items: [
						'$$files',
					],
				},
				{
					label: 'file tree entries',
					when: 'open',
					items: [
						'$$fileTreeEntries',
					],
				},
				{
					label: 'pieces',
					when: 'open',
					items: [
						'$$pieces',
					],
				},
				{
					label: 'trackers',
					when: 'open',
					items: [
						'$$trackers',
					],
				},
				{
					label: 'magnets',
					when: 'open',
					items: [
						'$$magnets',
					],
				},
				{
					label: 'swarm timestamps',
					when: 'open',
					items: [
						'$$swarmTimestamps',
					],
				},
				{
					label: 'client transfers',
					when: 'open',
					items: [
						'$$clientTransfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentMetainfo>
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
	entityType={EntityType.BitTorrentMetainfo}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
