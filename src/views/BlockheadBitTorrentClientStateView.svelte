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
				label: 'client id',
			},
			{
				label: 'client name',
			},
			{
				label: 'peer id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'client id',
					},
					{
						label: 'client name',
					},
					{
						label: 'peer id',
					},
					{
						label: 'DHT node id',
					},
					{
						label: 'latest client version',
					},
					{
						label: 'latest listen address count',
					},
					{
						label: 'latest transfer rates',
					},
					{
						label: 'latest active torrent count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'State observations',
					items: [
						{
							label: 'timestamped connected-client observations',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'local transfer snapshots',
						},
					],
				},
				{
					label: 'Network identity',
					items: [
						{
							label: 'peer id',
						},
						{
							label: 'DHT node id',
						},
					],
				},
				{
					label: 'Torrent catalog',
					items: [
						{
							label: 'metainfo rows exposed by the client',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBitTorrentClientState>
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
	entityType={EntityType.BlockheadBitTorrentClientState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
